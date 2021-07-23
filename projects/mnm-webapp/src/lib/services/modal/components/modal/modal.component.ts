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
                    if (type === 'show')
                        await this.showComponentInModal(
                            componentType,
                            options,
                            callback
                        );
                    else if (type === 'dismiss')
                        this.dismissComponentFromModal(component, callback);
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
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            ModalContainerComponent
        );
        const ref = this.container.createComponent(factory);
        const containerComponent = ref.instance;

        containerComponent.disableAutoDismiss = options.disableAutoDismiss;
        containerComponent.title = options.title;

        this.activeContainers.push({
            component: containerComponent,
            onDismiss: options.onDismiss,
        });

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
