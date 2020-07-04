import { Component, NgZone, OnDestroy, Renderer2, Input } from '@angular/core';
import {NotificationService} from './notification.service';
import {NotificationType} from './notification-type';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
import {miscFunctions} from '../../misc/misc-functions';
import {Alert} from './alert';
import {Modal} from './modal';

@Component({
  selector: 'mnm-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),

        query(':enter', stagger('200ms', [
          animate('200ms ease-in', keyframes([
            style({opacity: 0.0, offset: 0.0}),
            style({opacity: 0.7, offset: 0.7}),
            style({opacity: 1.0, offset: 1.0})
          ]))
        ]), {optional: true}),

        query(':leave', stagger('200ms', [
          animate('200ms ease-in', keyframes([
            style({opacity: 1.0, offset: 0.0}),
            style({opacity: 0.5, offset: 0.3}),
            style({opacity: 0.0, offset: 1.0})
          ]))
        ]), {optional: true})

      ])
    ]),
    trigger('modalAnimation', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('100ms', [
          animate('100ms ease-in', keyframes([
            style({opacity: 0.0, offset: 0.0}),
            style({opacity: 1.0, offset: 1.0})
          ]))
        ]), {optional: true}),

        query(':leave', stagger('100ms', [
          animate('100ms ease-in', keyframes([
            style({opacity: 1.0, offset: 0.0}),
            style({opacity: 0.0, offset: 1.0})
          ]))
        ]), {optional: true})
      ])
    ])
  ]
})
export class NotificationComponent implements OnDestroy {
  @Input('modalPrimaryButtonClasses') public modalPrimaryButtonClasses = ''
  @Input('modalSecondaryButtonClasses') public modalSecondaryButtonClasses = ''

  /**
   * For the alert
   */
    // @ViewChild('alert') alert;
    // alertMessage = '';
  alerts: Alert[] = [];


  /**
   * For the modal
   */
    // @ViewChild('modal') modal;
    // modalTitle = '';
    // modalMessage = '';
    // modalButtons = [];
    // modalCallback = null;
    // promptPlaceholder = '';
    // type = '';
    // promptText = '';
  modals: Modal[] = [];

  private readonly _callback: (event: KeyboardEvent) => void;

  constructor(notificationService: NotificationService, private renderer: Renderer2, private ngZone: NgZone) {
    let alertClassName: string;
    notificationService.alerts$.subscribe(x => {
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
      // this.alertMessage = x.message;
      // renderer.setElementClass(this.alert.nativeElement, 'is-active', true);
      // setTimeout(() => {
      //   this.dismissAlert();
      // }, 5000);
      const alert = {
        id: miscFunctions.uuid(),
        text: x.message,
        className: alertClassName
      };
      this.alerts.push(alert);
      this.setAlertTimer(alert);
    });

    notificationService.modals$.subscribe(x => {
      // this.modalButtons = [];
      // this.modalTitle = x.title;
      // this.modalMessage = x.message;
      // this.modalCallback = x.callback;
      // this.promptPlaceholder = x.placeholder;

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
          // this.type = 'modal';
          // this.modalButtons = x.buttons;
          break;
        case NotificationType.Prompt:
          // this.type = 'prompt';
          // this.promptPlaceholder = x.placeholder;
          // this.promptText = x.defaultText;
          // this.modalButtons.push(x.positive);
          // this.modalButtons.push(x.negative);
          modal.type = 'prompt';
          modal.promptPlaceholder = x.placeholder;
          modal.promptText = x.defaultText;
          modal.buttons = [x.positive, x.negative];
          break;
        case NotificationType.List:
          // this.type = 'list';
          // this.modalButtons = x.buttons;
          modal.type = 'list';
          modal.buttons = x.buttons;
          break;
      }

      // this.ngZone.runOutsideAngular(() => {
      //   this.renderer.setElementClass(this.modal.nativeElement, 'is-active', true);
      // });
      this.modals.push(modal);
    });

    this._callback = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        this.modals.pop();
      }
    };
    document.addEventListener('keyup', this._callback);
  }

  ngOnDestroy() {
    document.removeEventListener('keyup', this._callback);
  }

  dismissAlert(alertId: string) {
    // this.ngZone.runOutsideAngular(() => {
    //   this.renderer.setElementClass(this.alert.nativeElement, 'is-success', false);
    //   this.renderer.setElementClass(this.alert.nativeElement, 'is-info', false);
    //   this.renderer.setElementClass(this.alert.nativeElement, 'is-warning', false);
    //   this.renderer.setElementClass(this.alert.nativeElement, 'is-danger', false);
    //   this.renderer.setElementClass(this.alert.nativeElement, 'is-active', false);
    // });
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  setAlertTimer(alert: Alert) {
    // alert.timerId = setTimeout(() => this.dismissAlert(alert.id), 3000);
  }

  removeAlertTimer(alert: Alert) {
    clearTimeout(alert.timerId);
  }


  submitModal(modal: Modal, which) {
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
    this.modals = this.modals.filter(m => m.id !== modal.id);
  }
}
