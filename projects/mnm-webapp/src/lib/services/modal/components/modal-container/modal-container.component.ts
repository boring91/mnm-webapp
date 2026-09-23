import {
    Component,
    AfterViewInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Output,
    EventEmitter,
    inject,
    DestroyRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../modal.service';
import { ModalOptions } from '../../models/modal-options';
import { MNM_CONFIG } from '../../../../config/mnm.config';
import { MNMConfig, MnmAnimation } from '../../../../config/mnm-config';
import { defaultMnmConfig } from '../../../../config/mnm.config.default';
import { ModalBroadcasterMessage } from '../../models/modal-broadcaster-message';
import { BroadcasterService } from '../../../broadcaster/broadcaster.service';

@Component({
    selector: 'mnm-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ModalContainerComponent implements AfterViewInit {
    @Output() public modalDismiss = new EventEmitter<(c: any) => void>();

    public options: ModalOptions;

    // The place where the component will be loaded.
    @ViewChild('modalContentContainer', { read: ViewContainerRef })
    private modalContentContainer: ViewContainerRef;

    @ViewChild('overlay')
    private overlay: ElementRef<HTMLDivElement>;

    @ViewChild('dialog')
    private dialog: ElementRef<HTMLDivElement>;

    public loadedComponent: any;

    private componentLoadingPromiseResolve: (component: any) => void;
    private pendingComponentType: Type<any>;
    private isLeaving = false;

    private readonly animations = {
        ...defaultMnmConfig.modal.animations,
        ...inject<MNMConfig>(MNM_CONFIG)?.modal?.animations,
    };
    private modalService = inject(ModalService);
    private broadcasterService = inject(BroadcasterService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.broadcasterService
            .on<ModalBroadcasterMessage>('mnm_modal')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ type, component, callback }) => {
                if (type !== 'dismiss' || this.loadedComponent !== component)
                    return;

                this.animateForDismissal(callback);
            });
    }

    public ngAfterViewInit(): void {
        this.tryLoad();

        this.play(this.overlay, this.animations.overlayEnterAnimation);
        this.play(this.dialog, this.animations.dialogEnterAnimation);
    }

    public async dismiss(): Promise<void> {
        await this.modalService.dismiss(this.loadedComponent);
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
        if (!this.pendingComponentType || !this.modalContentContainer) {
            return;
        }

        this.modalContentContainer.clear();

        const ref = this.modalContentContainer.createComponent(
            this.pendingComponentType,
            { environmentInjector: this.options?.moduleRef?.injector }
        );

        this.loadedComponent = ref.instance;
        this.componentLoadingPromiseResolve(this.loadedComponent);

        // Run before init before detecting changes
        // (detecting changes would invoke the ngOnChange
        // on the component. Any @Input needed by the component
        // inside the ngOnInit should be initialized inside
        // the beforeInit() function option).
        if (this.options?.beforeInit) {
            this.options.beforeInit(this.loadedComponent);
        }

        ref.changeDetectorRef.detectChanges();

        this.pendingComponentType = null;
    }

    private play(
        element: ElementRef<HTMLElement>,
        { keyframes, options }: MnmAnimation
    ): Animation {
        return element.nativeElement.animate(keyframes, {
            fill: 'both',
            ...options,
        });
    }

    private animateForDismissal(callback: (c: any) => void): void {
        // Prevent double dismissing.
        if (!this.loadedComponent || this.isLeaving) {
            return;
        }
        this.isLeaving = true;

        // Wait for both leave animations before removing the dialog.
        Promise.all([
            this.play(this.overlay, this.animations.overlayLeaveAnimation)
                .finished,
            this.play(this.dialog, this.animations.dialogLeaveAnimation)
                .finished,
        ]).then(() => this.modalDismiss.emit(callback));
    }
}
