import { Injectable } from "@angular/core";
import { BroadcastMessage } from "./broadcast-message";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

@Injectable()
export class BroadcasterService {
  private subject = new Subject<BroadcastMessage>();

  public broadcast<T = any>(key: string, data?: T) {
    this.subject.next({
      key: key,
      data: data,
    });
  }

  public on<T = any>(key: string): Observable<T> {
    return this.subject
      .asObservable()
      .pipe(filter((x) => x.key === key))
      .pipe(map((x) => <T>x.data));
  }
}
