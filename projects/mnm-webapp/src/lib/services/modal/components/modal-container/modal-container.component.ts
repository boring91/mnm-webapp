import {
    Component,
    AfterViewInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Renderer2,
    OnDestroy,
    Output,
    EventEmitter,
    inject,
    DestroyRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../modal.service';
import { ModalOptions } from '../../models/modal-options';
import { AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { MNM_CONFIG } from '../../../../config/mnm.config';
import { MNMConfig } from '../../../../config/mnm-config';
import { defaultMnmConfig } from '../../../../config/mnm.config.default';
import { ModalBroadcasterMessage } from '../../models/modal-broadcaster-message';
import { BroadcasterService } from '../../../broadcaster/broadcaster.service';

interface ElementPlayers {
    enter: AnimationPlayer;
    leave: AnimationPlayer;
}

@Component({
    selector: 'mnm-modal',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent implements AfterViewInit, OnDestroy {
    @Output() public modalDismiss = new EventEmitter<(c: any) => void>();

    public options: ModalOptions;

    // The place where the component will be loaded.
    @ViewChild('modalContentContainer', { read: ViewContainerRef })
    private modalContentContainer: ViewContainerRef;

    // The container div.
    @ViewChild('overlay')
    private overlay: ElementRef<HTMLDivElement>;

    // The container div.
    @ViewChild('dialog')
    private dialog: ElementRef<HTMLDivElement>;

    public loadedComponent: any;

    private componentLoadingPromiseResolve: (component: any) => void;
    private pendingComponentType: Type<any>;

    private animationPlayers: {
        overlay: ElementPlayers;
        dialog: ElementPlayers;
    } = {
        overlay: { enter: null, leave: null },
        dialog: { enter: null, leave: null },
    };

    private readonly mnmConfig = inject<MNMConfig>(MNM_CONFIG);
    private modalService = inject(ModalService);
    private renderer = inject(Renderer2);
    private animationBuilder = inject(AnimationBuilder);
    private broadcasterService = inject(BroadcasterService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.broadcasterService
            .on<ModalBroadcasterMessage>('mnm_modal')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async ({ type, component, callback }) => {
                if (type !== 'dismiss' || this.loadedComponent !== component)
                    return;

                this.animateForDismissal(callback);
            });
    }

    public ngAfterViewInit(): void {
        this.createElementPlayers();

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

        this.animationPlayers.overlay.enter.play();
        this.animationPlayers.dialog.enter.play();
    }

    public ngOnDestroy(): void {
        this.animationPlayers.overlay.enter?.destroy();
        this.animationPlayers.overlay.leave?.destroy();
        this.animationPlayers.dialog.enter?.destroy();
        this.animationPlayers.dialog.leave?.destroy();
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

        // Clear the container contents.
        this.modalContentContainer.clear();

        // Load the component into the container using the modern approach.
        const ref = this.modalContentContainer.createComponent(
            this.pendingComponentType,
            {
                environmentInjector: this.options.moduleRef?.injector
            }
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

    private createElementPlayers() {
        this.animationPlayers.overlay.enter = this.createPlayer(
            this.overlay,
            this.mnmConfig.modal?.animations?.overlayEnterAnimation ??
                defaultMnmConfig.modal.animations.overlayEnterAnimation
        );
        this.animationPlayers.overlay.leave = this.createPlayer(
            this.overlay,
            this.mnmConfig.modal?.animations?.overlayLeaveAnimation ??
                defaultMnmConfig.modal.animations.overlayLeaveAnimation
        );
        this.animationPlayers.dialog.enter = this.createPlayer(
            this.dialog,
            this.mnmConfig.modal?.animations?.dialogEnterAnimation ??
                defaultMnmConfig.modal.animations.dialogEnterAnimation
        );
        this.animationPlayers.dialog.leave = this.createPlayer(
            this.dialog,
            this.mnmConfig.modal?.animations?.dialogLeaveAnimation ??
                defaultMnmConfig.modal.animations.dialogLeaveAnimation
        );
    }

    private createPlayer(
        elementRef: ElementRef,
        animationSteps: any[]
    ): AnimationPlayer {
        const animation = this.animationBuilder.build(animationSteps);
        return animation.create(elementRef.nativeElement);
    }

    private animateForDismissal(callback: (c: any) => void): void {
        if (
            !this.loadedComponent ||
            // Prevent double dismissing.
            this.animationPlayers.overlay.leave.hasStarted() ||
            this.animationPlayers.dialog.leave.hasStarted()
        ) {
            return;
        }

        // Start the leave animation, and wait for the
        // longest player to finish before dismissing the dialog.
        const { overlay, dialog } = this.animationPlayers;
        const longestPlayer =
            overlay.leave.totalTime > dialog.leave.totalTime
                ? overlay.leave
                : dialog.leave;
        longestPlayer.onDone(() => {
            this.modalDismiss.emit(callback);
        });

        overlay.leave.play();
        dialog.leave.play();
    }
}
