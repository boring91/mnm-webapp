import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardComponent, LoadingService, NotificationService } from '../../../projects/mnm-webapp/src/public_api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class NotificationComponent implements OnInit, AfterViewInit {

  @ViewChild('wizard') wizard: WizardComponent;

  title = 'mnm-webapp-app';

  private counter = 0;

  constructor(private _notificationService: NotificationService,
    private _loadingService: LoadingService) {
  }

  ngOnInit() {
    // this.giveMeModal();
    // this._loadingService.showBlockingLoading();

    // setTimeout(() => {
    //   this._loadingService.showBlockingLoading();
    //   setTimeout(() => this._loadingService.hideBlockingLoading(), 2000);
    // }, 2000);
    // this.giveMeModal();
    this.initiateDanger();
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.wizard.show();
    //   setTimeout(() => this._loadingService.hideBlockingLoading(), 2000);
    // }, 2000);
    // this._loadingService.showBlockingLoading();
  }

  initiateDanger() {
    this._notificationService.notifyError('Hello there: ' + this.counter++);
  }

  initiateWarning() {
    this._notificationService.notifyWarn('Hello there: ' + this.counter++);
  }

  initiateInfo() {
    this._notificationService.notifyInfo('Hello there: ' + this.counter++);
  }

  initiateSuccess() {
    this._notificationService.notifySuccess('Hello there: ' + this.counter++);
  }

  giveMeModal() {
    this._notificationService.modal('hello', 'this is the message', () => {
    }, 'Yes', 'No');
  }

  giveMePrompt() {
    this._notificationService.prompt('hello', 'promp here', 'okay', 'cancel', () => {
    });
  }

  giveMeList() {
    this._notificationService.selectList('hello', () => {
    }, 'list item 1', 'list item 2', 'list item 3');
  }
}
