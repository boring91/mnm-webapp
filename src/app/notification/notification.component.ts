import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WizardComponent, LoadingService, NotificationService} from '../../../projects/mnm-webapp/src/public_api';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit, AfterViewInit {

  @ViewChild('wizard', {static: true}) wizard: WizardComponent;

  title = 'mnm-webapp-app';

  private counter = 0;

  constructor(private _notificationService: NotificationService,
              private _loadingService: LoadingService) {
  }

  ngOnInit() {
    // this.giveMeModal();
    // this._loadingService.showLoading();

    // setTimeout(() => {
    //   this._loadingService.showBlockingLoading();
    //   setTimeout(() => this._loadingService.hideBlockingLoading(), 2000);
    // }, 2000);

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.wizard.show();
      setTimeout(() => this._loadingService.hideBlockingLoading(), 2000);
    }, 2000);
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
    this._notificationService.modal('hello', 'this is the message', number => {
      console.log(number);
    }, 'Yes', 'No');
  }

  giveMePrompt() {
    this._notificationService.prompt('hello', 'promp here', 'okay', 'cancel', string => {
      console.log(string);
    });
  }

  giveMeList() {
    this._notificationService.selectList('hello', number => {
      console.log(number);
    }, 'list item 1', 'list item 2', 'list item 3');
  }
}
