import {Injectable} from '@angular/core';
import {BroadcastMessage} from './broadcast-message';
import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class BroadcasterService {

  subject = new Subject<BroadcastMessage>();

  constructor() {
  }

  broadcast(key: string, data?: any) {
    this.subject.next({
      key: key,
      data: data
    });
  }

  on<T>(key: string): Observable<T> {
    return this.subject.asObservable().pipe(
      filter(x => x.key === key))
      .pipe(map(x => <T>x.data));
  }
}
