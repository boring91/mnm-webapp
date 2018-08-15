import {Component, OnDestroy} from '@angular/core';
import {LoadingService} from './loading.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'mnm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnDestroy {

  isLoadingShown = false;
  isBlockingLoadingShown = false;

  private blockingLoadingStack = 0;
  private loadingStack = 0;

  private subscription: Subscription;
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
