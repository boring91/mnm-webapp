import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from './loading.service';
import {
    animate,
    keyframes,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'mnm-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('spinner', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(
                    ':enter',
                    stagger('500ms', [
                        animate(
                            '500ms ease-in-out',
                            keyframes([
                                style({ opacity: 0.0, offset: 0.0 }),
                                style({ opacity: 1.0, offset: 1.0 }),
                            ])
                        ),
                    ]),
                    { optional: true }
                ),

                query(
                    ':leave',
                    stagger('500ms', [
                        animate(
                            '500ms ease-in-out',
                            keyframes([
                                style({ opacity: 1.0, offset: 0.0 }),
                                style({ opacity: 0.0, offset: 1.0 }),
                            ])
                        ),
                    ]),
                    { optional: true }
                ),
            ]),
        ]),
        trigger('indeterminteLoader', [
            transition(':enter', [
                style({ opacity: 0.0 }),
                animate('150ms', style({ opacity: 1.0 })),
            ]),
            transition(':leave', [animate('150ms', style({ opacity: 0.0 }))]),
        ]),
    ],
})
export class LoadingComponent {
    isLoadingShown = false;
    isBlockingLoadingShown = false;

    private blockingLoadingStack = 0;
    private loadingStack = 0;
    private loadingService = inject(LoadingService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.loadingService.observable$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(show => {
            this.loadingStack = this.loadingStack + (show ? 1 : -1);
            this.isLoadingShown = this.loadingStack > 0;
        });

        this.loadingService.observableBlocking$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(show => {
            this.blockingLoadingStack =
                this.blockingLoadingStack + (show ? 1 : -1);
            this.isBlockingLoadingShown = this.blockingLoadingStack > 0;
        });
    }
}
