import { NotificationHandler } from './notification-handler';
import { Subject, Observable } from 'rxjs';
import { NotificationType } from './notification-type';

export class DefaultNotificationHandler implements NotificationHandler {
    private alerter = new Subject<any>();
    alerts$: Observable<any> = this.alerter.asObservable();

    notifySuccess(message: string) {
        this.alerter.next({ message: message, type: NotificationType.Success });
    }
    
    notifyInfo(message: string) {
        this.alerter.next({ message: message, type: NotificationType.Info });
    }
    
    notifyWarn(message: string) {
        this.alerter.next({ message: message, type: NotificationType.Warn });
    }
    
    notifyError(message: string) {
        this.alerter.next({ message: message, type: NotificationType.Error });
    }
}