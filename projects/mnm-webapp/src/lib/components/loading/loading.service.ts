import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoadingService {
    private subject = new Subject<boolean>();
    private subjectBlocking = new Subject<boolean>();

    observable$: Observable<boolean> = this.subject.asObservable();
    observableBlocking$: Observable<boolean> =
        this.subjectBlocking.asObservable();

    constructor() {}

    showLoading() {
        this.subject.next(true);
    }

    hideLoading() {
        this.subject.next(false);
    }

    showBlockingLoading() {
        this.subjectBlocking.next(true);
    }

    hideBlockingLoading() {
        this.subjectBlocking.next(false);
    }
}
