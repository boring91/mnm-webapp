import {
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BroadcasterService } from '../../../broadcaster/broadcaster.service';
import { ModalBroadcasterMessage } from '../../models/modal-broadcaster-message';
import { ModalContainerComponent } from '../modal-container/modal-container.component';
import { ModalOptions } from '../../models/modal-options';

@Component({
    selector: 'mnm-modal',
    template: `<div #container></div>`,
})
export class ModalComponent implements OnDestroy {
    @ViewChild('container', { read: ViewContainerRef })
    private container: ViewContainerRef;

    private unsubscribeAll = new Subject();

    private activeContainers: {
        component: ModalContainerComponent;
        onDismiss?: () => void;
    }[] = [];

    public constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        broadcasterService: BroadcasterService
    ) {
        broadcasterService
            .on<ModalBroadcasterMessage>('mnm_modal')
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(
                async ({
                    type,
                    componentType,
                    component,
                    callback,
                    options,
                }) => {
                    if (type !== 'show') return;
                    await this.showComponentInModal(
                        componentType,
                        options,
                        callback
                    );
                }
            );
    }

    public ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    private async showComponentInModal(
        componentType: Type<any>,
        options: ModalOptions,
        callback: (component: any) => void
    ): Promise<any> {
        // Create a component for the container of the contents.
        // of the modal (the content is a custom component)
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            ModalContainerComponent
        );
        const ref = this.container.createComponent(factory);
        const containerComponent = ref.instance;

        // Pass the options to the container component.
        containerComponent.options = options;

        // Monitor for dismissal events.
        containerComponent.modalDismiss
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(dismissalCallback => {
                this.dismissComponentFromModal(
                    containerComponent.loadedComponent,
                    dismissalCallback
                );
            });

        // Register the container as one of the
        // shown dialogs.
        this.activeContainers.push({
            component: containerComponent,
            onDismiss: options.onDismiss,
        });

        // Try and load the content of the modal (custom component).
        const loadedContentComponent = await containerComponent.load(
            componentType
        );

        callback(loadedContentComponent);
    }

    private dismissComponentFromModal(
        component: any,
        callback: (component: any) => void
    ): void {
        // Find the modal container.
        const index = this.activeContainers.findIndex(
            x => x.component.loadedComponent === component
        );

        // Remove from the active containers list.
        const { onDismiss } = this.activeContainers.splice(index, 1)[0];

        // Remove from the view container ref.
        this.container.remove(index);

        callback(component);

        if (onDismiss) {
            onDismiss();
        }
    }
}
