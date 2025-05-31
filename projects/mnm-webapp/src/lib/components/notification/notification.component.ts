import {
    Component,
    OnDestroy,
    Input,
    DestroyRef,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './notification.service';
import { NotificationType } from './notification-type';
import {
    animate,
    keyframes,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { miscFunctions } from '../../misc/misc-functions';
import { Alert } from './alert';
import { Modal } from './modal';
import { DefaultNotificationHandler } from './default.notification-handler';
import {
    NotificationHandler,
    MNM_NOTIFICATION_HANDLER,
} from './notification-handler';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'mnm-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    standalone: true,
    imports: [FormsModule],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),

                query(
                    ':enter',
                    stagger('200ms', [
                        animate(
                            '200ms ease-in',
                            keyframes([
                                style({ opacity: 0.0, offset: 0.0 }),
                                style({ opacity: 0.7, offset: 0.7 }),
                                style({ opacity: 1.0, offset: 1.0 }),
                            ])
                        ),
                    ]),
                    { optional: true }
                ),

                query(
                    ':leave',
                    stagger('200ms', [
                        animate(
                            '200ms ease-in',
                            keyframes([
                                style({ opacity: 1.0, offset: 0.0 }),
                                style({ opacity: 0.5, offset: 0.3 }),
                                style({ opacity: 0.0, offset: 1.0 }),
                            ])
                        ),
                    ]),
                    { optional: true }
                ),
            ]),
        ]),
        trigger('modalAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(
                    ':enter',
                    stagger('100ms', [
                        animate(
                            '100ms ease-in',
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
                    stagger('100ms', [
                        animate(
                            '100ms ease-in',
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
    ],
})
export class NotificationComponent implements OnDestroy {
    @Input('modalPrimaryButtonClasses') public modalPrimaryButtonClasses = '';
    @Input('modalSecondaryButtonClasses') public modalSecondaryButtonClasses =
        '';

    /**
     * For the alert
     */
    // Using signals for reactive state management
    alerts = signal<Alert[]>([]);

    /**
     * For the modal
     */
    modals = signal<Modal[]>([]);

    private readonly _callback: (event: KeyboardEvent) => void;
    private document: Document = inject(DOCUMENT);
    private destroyRef = inject(DestroyRef);
    private notificationService = inject(NotificationService);
    private notificationHandler = inject<NotificationHandler>(MNM_NOTIFICATION_HANDLER);

    constructor() {
        let alertClassName: string;
        if ((this.notificationHandler as any).alerts$) {
            (
                this.notificationHandler as DefaultNotificationHandler
            ).alerts$.pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe(x => {
                switch (x.type) {
                    case NotificationType.Success:
                        alertClassName = 'is-success';
                        break;
                    case NotificationType.Info:
                        alertClassName = 'is-info';
                        break;
                    case NotificationType.Warn:
                        alertClassName = 'is-warning';
                        break;
                    case NotificationType.Error:
                        alertClassName = 'is-danger';
                        break;
                }
                const alert = {
                    id: miscFunctions.uuid(),
                    text: x.message,
                    className: alertClassName,
                };
                this.alerts.update(alerts => [...alerts, alert]);
                this.setAlertTimer(alert);
            });
        }

        this.notificationService.modals$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(x => {
            const modal: Modal = {
                id: miscFunctions.uuid(),
                title: x.title,
                message: x.message,
                callback: x.callback,
            };

            switch (x.type) {
                case NotificationType.Modal:
                    modal.type = 'modal';
                    modal.buttons = x.buttons;
                    break;
                case NotificationType.Prompt:
                    modal.type = 'prompt';
                    modal.promptPlaceholder = x.placeholder;
                    modal.promptText = x.defaultText;
                    modal.buttons = [x.positive, x.negative];
                    break;
                case NotificationType.List:
                    modal.type = 'list';
                    modal.buttons = x.buttons;
                    break;
            }

            this.modals.update(modals => [...modals, modal]);
        });

        this._callback = (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.modals.update(modals => {
                    const newModals = [...modals];
                    newModals.pop();
                    return newModals;
                });
            }
        };
        this.document.addEventListener('keyup', this._callback);

        this.destroyRef.onDestroy(() => {
            this.document.removeEventListener('keyup', this._callback);
        });
    }

    ngOnDestroy() {
        // Cleanup is handled by destroyRef.onDestroy
    }

    dismissAlert(alertId: string) {
        // Using signal update method for immutable updates
        this.alerts.update(alerts => alerts.filter(a => a.id !== alertId));
    }

    setAlertTimer(alert: Alert) {
        alert.timerId = setTimeout(() => this.dismissAlert(alert.id), 3000);
    }

    removeAlertTimer(alert: Alert) {
        clearTimeout(alert.timerId);
    }

    submitModal(modal: Modal, which: number) {
        modal.callback(which);
        this.dismissModal(modal);
    }

    submitPromptIfEnter(modal: Modal, event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.submitPrompt(modal);
        }
    }

    submitPrompt(modal: Modal) {
        modal.callback(modal.promptText);
        this.dismissModal(modal);
    }

    dismissModal(modal: Modal) {
        this.modals.update(modals => modals.filter(m => m.id !== modal.id));
    }
}
