import { Injectable, Inject } from '@angular/core';
import { NotificationType } from './notification-type';
import { Observable, Subject } from 'rxjs';
import { NotificationHandler, MNM_NOTIFICATION_HANDLER } from './notification-handler';


@Injectable()
export class NotificationService implements NotificationHandler {

    // private alerter = new Subject<any>();
    // alerts$: Observable<any> = this.alerter.asObservable();

    private modalSubject = new Subject<{
        title: string,
        callback: (() => void) | ((number) => void),
        type: NotificationType,
        message?: string,
        buttons?: string[],
        defaultText?: string,
        placeholder?: string,
        negative?: string,
        positive?: string,
    }>();
    modals$: Observable<any> = this.modalSubject.asObservable();

    constructor(@Inject(MNM_NOTIFICATION_HANDLER) private notificationHandler: NotificationHandler) {
    }

    notifySuccess(message: string) {
        this.notificationHandler.notifySuccess(message);
        // this.alerter.next({ message: message, type: NotificationType.Success });
    }

    notifyInfo(message: string) {
        this.notificationHandler.notifyInfo(message);
        // this.alerter.next({ message: message, type: NotificationType.Info });
    }

    notifyWarn(message: string) {
        this.notificationHandler.notifyWarn(message);
        // this.alerter.next({ message: message, type: NotificationType.Warn });
    }

    notifyError(message: string) {
        this.notificationHandler.notifyError(message);
        // this.alerter.next({ message: message, type: NotificationType.Error });
    }


    modal(title: string, message, callback: (which: number) => void, ...buttons: string[]) {
        this.modalSubject.next({
            title: title,
            message: message,
            buttons: buttons,
            callback: callback,
            type: NotificationType.Modal
        });
    }

    prompt(title: string, message, positive: string, negative: string, callback: (string) => void, defaultText: string = '',
        placeholder: string = '') {
        this.modalSubject.next({
            title: title,
            message: message,
            defaultText: defaultText,
            placeholder: placeholder,
            negative: negative,
            positive: positive,
            callback: callback,
            type: NotificationType.Prompt
        });
    }

    selectList(title: string, callback: (which: number) => void, ...buttons: string[]) {
        this.modalSubject.next({
            title: title,
            buttons: buttons,
            callback: callback,
            type: NotificationType.List
        });
    }
}
