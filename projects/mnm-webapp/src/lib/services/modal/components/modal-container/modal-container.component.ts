import {
    Component,
    AfterViewInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ElementRef,
    Renderer2,
} from '@angular/core';
import { ModalService } from '../../modal.service';
import { ModalOptions } from '../../models/modal-options';
import { animations } from './animation';

@Component({
    selector: 'mnm-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    animations: animations,
})
export class ModalContainerComponent implements AfterViewInit {
    public options: ModalOptions;

    // The place where the component will be loaded.
    @ViewChild('modalContentContainer', { read: ViewContainerRef })
    private modalContentContainer: ViewContainerRef;

    // The container div.
    @ViewChild('dialog')
    private dialog: ElementRef<HTMLDivElement>;

    public loadedComponent: any;

    private componentLoadingPromiseResolve: (component: any) => void;
    private pendingComponentType: Type<any>;

    public constructor(
        private modalService: ModalService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private renderer: Renderer2
    ) {}

    public ngAfterViewInit(): void {
        // Set the size of the modal.
        this.renderer.setStyle(
            this.dialog.nativeElement,
            'width',
            this.options.size?.width ?? '700px'
        );
        this.renderer.setStyle(
            this.dialog.nativeElement,
            'height',
            this.options.size?.height ?? 'auto'
        );

        this.tryLoad();
    }

    public dismiss(): void {
        if (!this.loadedComponent) return;
        this.modalService.dismiss(this.loadedComponent);
    }

    public load(component: Type<any>): Promise<any> {
        // Check if there is a pending loading going,
        // resolve to null in that case.
        if (this.componentLoadingPromiseResolve) {
            this.componentLoadingPromiseResolve(null);
        }

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

        const ref = this.modalContentContainer.createComponent(
            factory,
            undefined,
            undefined,
            undefined,
            this.options.moduleRef
        );

        // Set the loaded component and resolve
        // the promise.
        this.loadedComponent = ref.instance;
        this.componentLoadingPromiseResolve(this.loadedComponent);

        // Run before init before detecting changes
        // (detecting changes would invoke the ngOnChange
        // on the component. Any @Input needed by the component
        // inside the ngOnInit should be initialized inside
        // the beforeInit() function option).
        if (this.options.beforeInit) {
            this.options.beforeInit(this.loadedComponent);
        }

        ref.changeDetectorRef.detectChanges();

        // Nullify the pending component.
        this.pendingComponentType = null;
    }
}
