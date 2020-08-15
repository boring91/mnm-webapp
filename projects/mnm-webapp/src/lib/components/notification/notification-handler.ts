import { InjectionToken } from '@angular/core';

export const MNM_NOTIFICATION_HANDLER = new InjectionToken<NotificationHandler>('');

export interface NotificationHandler {
    notifySuccess(message: string): void;
    notifyInfo(message: string): void;
    notifyWarn(message: string): void;
    notifyError(message: string): void;
}