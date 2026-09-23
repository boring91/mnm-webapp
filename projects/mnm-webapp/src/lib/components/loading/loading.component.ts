import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from './loading.service';

@Component({
    selector: 'mnm-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LoadingComponent {
    // Signals so the view refreshes even under an OnPush ancestor.
    isLoadingShown = signal(false);
    isBlockingLoadingShown = signal(false);

    private blockingLoadingStack = 0;
    private loadingStack = 0;
    private loadingService = inject(LoadingService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.loadingService.observable$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(show => {
            this.loadingStack = this.loadingStack + (show ? 1 : -1);
            this.isLoadingShown.set(this.loadingStack > 0);
        });

        this.loadingService.observableBlocking$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(show => {
            this.blockingLoadingStack =
                this.blockingLoadingStack + (show ? 1 : -1);
            this.isBlockingLoadingShown.set(this.blockingLoadingStack > 0);
        });
    }
}
