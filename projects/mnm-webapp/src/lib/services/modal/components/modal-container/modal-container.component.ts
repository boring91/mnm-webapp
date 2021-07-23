import {
    Component,
    AfterViewInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    Input,
} from '@angular/core';
import { ModalService } from '../../modal.service';
import { animations } from './animation';

@Component({
    selector: 'mnm-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    animations: animations,
})
export class ModalContainerComponent implements AfterViewInit {
    @Input() public title: string = '';
    @Input() public disableAutoDismiss: boolean = false;

    // The place where the component will be loaded.
    @ViewChild('modalContentContainer', { read: ViewContainerRef })
    private modalContentContainer: ViewContainerRef;

    public loadedComponent: any;

    private componentLoadingPromiseResolve: (component: any) => void;
    private pendingComponentType: Type<any>;

    public constructor(
        private modalService: ModalService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    public ngAfterViewInit(): void {
        this.tryLoad();
    }

    public dismiss(): void {
        if (!this.loadedComponent) return;
        this.modalService.dismiss(this.loadedComponent);
    }

    public load(component: Type<any>): Promise<any> {
        // Check if there is a pending loading going,
        // resolve to null in that case.
        if (this.componentLoadingPromiseResolve)
            this.componentLoadingPromiseResolve(null);

        // Create a new promise for the new load.
        const promise = new Promise(
            resolve => (this.componentLoadingPromiseResolve = resolve)
        );
        this.pendingComponentType = component;
        this.tryLoad();

        return promise;
    }

    private tryLoad(): void {
        // Ensure that the component has been passed &
        // the container is initialized.
        if (!this.pendingComponentType || !this.modalContentContainer) return;

        // Clear the container contents.
        this.modalContentContainer.clear();

        // Load the component into the container.
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            this.pendingComponentType
        );
        const ref = this.modalContentContainer.createComponent(factory);
        ref.changeDetectorRef.detectChanges();

        // Set the loaded component and resolve
        // the promise.
        this.loadedComponent = ref.instance;
        this.componentLoadingPromiseResolve(this.loadedComponent);
    }
}
