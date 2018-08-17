import {Component, OnDestroy} from '@angular/core';
import {LoadingService} from './loading.service';
import {Subscription} from 'rxjs';
import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'mnm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('spinner', [
      transition('* => *', [
        query(':enter', style({opacity: 0}), {optional: true}),
        query(':enter', stagger('500ms', [
          animate('500ms ease-in-out', keyframes([
            style({opacity: 0.0, offset: 0.0}),
            style({opacity: 1.0, offset: 1.0})
          ]))
        ]), {optional: true}),

        query(':leave', stagger('500ms', [
          animate('500ms ease-in-out', keyframes([
            style({opacity: 1.0, offset: 0.0}),
            style({opacity: 0.0, offset: 1.0})
          ]))
        ]), {optional: true})
      ])
    ])
  ]
})
export class LoadingComponent implements OnDestroy {

  isLoadingShown = false;
  isBlockingLoadingShown = false;

  private blockingLoadingStack = 0;
  private loadingStack = 0;

  private readonly subscription: Subscription;
  private subscriptionBlocking: Subscription;

  constructor(loadingService: LoadingService) {
    this.subscription = loadingService.observable$.subscribe(show => {
      this.loadingStack = this.loadingStack + (show ? 1 : -1);
      this.isLoadingShown = this.loadingStack > 0;
    });

    this.subscription = loadingService.observableBlocking$.subscribe(show => {
      this.blockingLoadingStack = this.blockingLoadingStack + (show ? 1 : -1);
      this.isBlockingLoadingShown = this.blockingLoadingStack > 0;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionBlocking) {
      this.subscriptionBlocking.unsubscribe();
    }
  }

}
