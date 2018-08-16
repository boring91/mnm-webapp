import {Component, OnInit} from '@angular/core';
import {NotificationService} from 'mnm-webapp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mnm-webapp-app';

  private counter = 0;

  constructor(private _notificationService: NotificationService) {
  }

  ngOnInit() {
    this.giveMeModal();
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
