import {Component, NgZone, OnDestroy, Renderer, ViewChild} from '@angular/core';
import {NotificationService} from './notification.service';
import {NotificationType} from './notification-type';

@Component({
  selector: 'mnm-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnDestroy {

  /**
   * For the alert
   */
  @ViewChild('alert') alert;
  alertMessage = '';

  /**
   * For the modal
   */
  @ViewChild('modal') modal;
  modalTitle = '';
  modalMessage = '';
  modalButtons = [];
  modalCallback = null;
  promptPlaceholder = '';
  type = '';
  promptText = '';

  private _callback: (event: KeyboardEvent) => void;

  constructor(notificationService: NotificationService, private renderer: Renderer, private ngZone: NgZone) {
    notificationService.alerts$.subscribe(x => {
      this.dismissAlert();
      switch (x.type) {
        case NotificationType.Success:
          this.renderer.setElementClass(this.alert.nativeElement, 'is-success', true);
          break;
        case NotificationType.Info:
          this.renderer.setElementClass(this.alert.nativeElement, 'is-info', true);
          break;
        case NotificationType.Warn:
          this.renderer.setElementClass(this.alert.nativeElement, 'is-warning', true);
          break;
        case NotificationType.Error:
          this.renderer.setElementClass(this.alert.nativeElement, 'is-danger', true);
          break;
      }
      this.alertMessage = x.message;
      renderer.setElementClass(this.alert.nativeElement, 'active', true);
      setTimeout(() => {
        this.dismissAlert();
      }, 5000);
    });

    notificationService.modals$.subscribe(x => {
      this.modalButtons = [];
      this.modalTitle = x.title;
      this.modalMessage = x.message;
      this.modalCallback = x.callback;
      this.promptPlaceholder = x.placeholder;

      switch (x.type) {
        case NotificationType.Modal:
          this.type = 'modal';
          this.modalButtons = x.buttons;
          break;
        case NotificationType.Prompt:
          this.type = 'prompt';
          this.promptPlaceholder = x.placeholder;
          this.promptText = x.defaultText;
          this.modalButtons.push(x.positive);
          this.modalButtons.push(x.negative);
          break;
        case NotificationType.List:
          this.type = 'list';
          this.modalButtons = x.buttons;
          break;
      }

      this.ngZone.runOutsideAngular(() => {
        this.renderer.setElementClass(this.modal.nativeElement, 'is-active', true);
      });
    });

    this._callback = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        this.dismissModal();
      }
    };
    document.addEventListener('keyup', this._callback);
  }

  ngOnDestroy() {
    document.removeEventListener('keyup', this._callback);
  }

  dismissAlert() {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setElementClass(this.alert.nativeElement, 'is-success', false);
      this.renderer.setElementClass(this.alert.nativeElement, 'is-info', false);
      this.renderer.setElementClass(this.alert.nativeElement, 'is-warning', false);
      this.renderer.setElementClass(this.alert.nativeElement, 'is-danger', false);
      this.renderer.setElementClass(this.alert.nativeElement, 'active', false);
    });
  }

  submitModal(which) {
    this.modalCallback(which);
    this.dismissModal();
  }

  submitPromptIfEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.submitPrompt();
    }
  }

  submitPrompt() {
    this.modalCallback(this.promptText);
    this.promptText = '';
    this.dismissModal();
  }

  dismissModal() {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setElementClass(this.modal.nativeElement, 'is-active', false);
    });
  }
}
