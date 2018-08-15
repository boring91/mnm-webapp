import {Injectable} from '@angular/core';
import {NotificationType} from './notification-type';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class NotificationService {


    private alerter = new Subject<any>();
    alerts$: Observable<any> = this.alerter.asObservable();

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

    constructor() {
        console.log('Notification service has been constructed');
    }

    notifySuccess(message: string) {
        this.alerter.next({message: message, type: NotificationType.Success});
    }

    notifyInfo(message: string) {
        this.alerter.next({message: message, type: NotificationType.Info});
    }

    notifyWarn(message: string) {
        this.alerter.next({message: message, type: NotificationType.Warn});
    }

    notifyError(message: string) {
        this.alerter.next({message: message, type: NotificationType.Error});
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
