import {Injectable} from '@angular/core';
import {UploadEvent} from './upload-event';
import {UploadEventType} from './upload-event-type';
import {Observable, Observer, Subject, throwError} from 'rxjs';
import {catchError, finalize, first, share, switchMap} from 'rxjs/operators';
import {LoadingService} from '../../components/loading/loading.service';
import {OauthService} from '../oauth.service';
import {NotificationService} from '../../components/notification/notification.service';

@Injectable()
export class UploadService {

  progress: number;
  progress$: Observable<number>;
  progressObserver: Subject<number>;

  constructor(private loadingService: LoadingService,
              private oauthService: OauthService,
              private notificationService: NotificationService) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer;
    }).pipe(share());
  }

  uploadAuth(url: string, params: any, headers: any = {}): Observable<UploadEvent> {
    return this.oauthService.auth$.pipe(first()).pipe(switchMap(x => {
      if (x.isValid) {
        headers['Authorization'] = 'Bearer ' + x.value;
        return this.upload(url, params, headers);
      } else {
        return this.oauthService.refreshAccessToken().pipe(switchMap(y => {
          headers['Authorization'] = 'Bearer ' + y.value;
          return this.upload(url, params, headers);
        }));
      }
    }));
  }

  upload(url: string, params: any, headers: any = {}): Observable<UploadEvent> {
    return Observable.create((observer: Observer<UploadEvent>) => {

      const formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          let value = params[key];
          if (!value) {
            value = '';
          }
          formData.append(key, value);
        }
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next({
              type: UploadEventType.Done,
              data: JSON.parse(xhr.response)
            });
            observer.complete();
          } else {
            const uploadEvent = {
              type: UploadEventType.Error,
              data: JSON.parse(xhr.response)
            };
            observer.next(uploadEvent);
            observer.error(uploadEvent);
          }
          this.loadingService.hideLoading();
        }
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round(event.loaded / event.total * 100);
        observer.next({
          type: UploadEventType.Progress,
          data: this.progress
        });
      };


      xhr.open('POST', url, true);

      // setting headers
      if (headers) {
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }
      }


      /**
       * Add custom headers here:
       * xhr.setRequestHeader('Accept-Language', appLocale['locale']);
       */

      this.loadingService.showLoading();
      xhr.send(formData);
      return () => {
        xhr.abort();
      };
    }).pipe(
      catchError((res: UploadEvent) => {
        console.log(res);
        try {
          const result = res.data;
          if (result['messages']) {
            this.notificationService.notifyError(result['messages'][0]);
          } else if (result['error_description']) {
            this.notificationService.notifyError(result['error_description']);
          } else {
            this.notificationService.notifyError('Unknown error has occurred');
          }
        } catch (e) {
          this.notificationService.notifyError('Unknown error has occurred');
        }
        return throwError(res);
      }),
      finalize(() => {
        this.loadingService.hideLoading();
      }));
  }
}
