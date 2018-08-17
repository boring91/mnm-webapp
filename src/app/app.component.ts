import {Component, OnInit} from '@angular/core';
import {LoadingService, NotificationService} from 'mnm-webapp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mnm-webapp-app';

  private counter = 0;

  constructor(private _notificationService: NotificationService,
              private _loadingService: LoadingService) {
  }

  ngOnInit() {
    // this.giveMeModal();
    // this._loadingService.showLoading();

    setTimeout(() => {
      this._loadingService.showBlockingLoading();
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
