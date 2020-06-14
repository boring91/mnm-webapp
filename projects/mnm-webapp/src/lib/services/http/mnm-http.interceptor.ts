import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { MNMConfig } from '../../mnm-config';
import { MNM_CONFIG } from '../../mnm.config';
import { defaultMnmConfig } from '../../mnm.config.default';
import { Observable, Subject, throwError as observableThrowError } from 'rxjs';
import { finalize, first, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { OauthService } from '../oauth.service';
import { LoadingService } from '../../components/loading/loading.service';
import { NotificationService } from '../../components/notification/notification.service';
import { Result } from '../../models/result';
import { NavigationStart, Router } from '@angular/router';
import { mnmHttpInterceptorParams } from './mnm-http-interceptor-params';


@Injectable()
export class MNMHttpInterceptor implements HttpInterceptor {

  // public static STEALTH = 'interceptor_stealth';
  // public static FORCE_INSECURE = 'interceptor_force_insecure';
  // public static SUSTAIN_ON_NAV = 'interceptor_sustain_on_navigation';

  private _oauthService: OauthService;

  private _cancelRequestSubject$ = new Subject();
  private _sustainRequestSubject$ = new Subject();

  private _cancelRequestObservable = this._cancelRequestSubject$.asObservable();
  private _sustainRequestObservable = this._sustainRequestSubject$.asObservable();

  constructor(@Inject(MNM_CONFIG) private readonly _mnmConfig: MNMConfig,
    private _loadingService: LoadingService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _inj: Injector) {
    this._mnmConfig = { ...defaultMnmConfig, ...this._mnmConfig };
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this._cancelRequestSubject$.next();
      }
    });


    const isStealth = req.params.get(mnmHttpInterceptorParams.stealth) === 'true';
    const isForceInsecure = req.params.get(mnmHttpInterceptorParams.forceInsecure) === 'true';
    const isSustainOnNav = req.params.get(mnmHttpInterceptorParams.sustainOnNavigation) === 'true';
    const areNotificationsHidden = req.params.get(mnmHttpInterceptorParams.hideNotifications) === 'true';

    // remove the stealth and forceInsecure parameters
    req = req.clone({
      params: req.params
        .delete(mnmHttpInterceptorParams.stealth)
        .delete(mnmHttpInterceptorParams.forceInsecure)
        .delete(mnmHttpInterceptorParams.sustainOnNavigation)
    });

    if (!isStealth) {
      this._loadingService.showLoading();
    }

    // prepare the handlers:
    const successHandler = (res: HttpResponse<Result<any>>) => {
    };

    const errorHandler = (res: HttpErrorResponse) => {
      if (isStealth || areNotificationsHidden) {
        return;
      }
      if (res.error && res.error.messages && !areNotificationsHidden) {
        this._notificationService.notifyError(res.error['messages'][0]);
      } else if (!areNotificationsHidden) {
        this._notificationService.notifyError(res.message);
      }
    };

    const cleanUpHandler = () => {
      if (!isStealth) {
        this._loadingService.hideLoading();
      }
    };

    // set the content type of the request to form urlencoded
    if (!req.headers.has('content-type')) {
      req = req.clone({
        headers: req.headers.set('content-type', this._mnmConfig.http.contentType)
      });
    }


    if (!this._oauthService) {
      this._oauthService = this._inj.get(OauthService);
    }

    // get the information of the user
    return this._oauthService.userInfo$.pipe(
      takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
      first(),
      switchMap(userInfo => {

        // if the user is logged in, authorize the request
        if (userInfo.isLoggedIn && !isForceInsecure) {

          // get the access token
          return this._oauthService.auth$.pipe(
            takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
            first(),
            switchMap(accessToken => {

              // if the access token is no longer valid, request a new one
              if (!accessToken.isValid) {
                return this._oauthService.refreshAccessToken().pipe(
                  takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
                  switchMap(newAccessToken => {
                    req = req.clone({
                      headers: req.headers.set('Authorization', 'Bearer ' + newAccessToken.value)
                    });
                    return this.createObservable(next, req, isSustainOnNav, successHandler, errorHandler, cleanUpHandler);

                    // return next.handle(req)
                    //   .pipe(
                    //     takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
                    //     tap(successHandler, errorHandler),
                    //     finalize(cleanUpHandler));
                  })
                );

                // else, authorize the request using the existing access token.
              } else {
                req = req.clone({
                  headers: req.headers.set('Authorization', 'Bearer ' + accessToken.value)
                });
                return this.createObservable(next, req, isSustainOnNav, successHandler, errorHandler, cleanUpHandler);

                // return next.handle(req).pipe(
                //   takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
                //   tap(successHandler, errorHandler),
                //   finalize(cleanUpHandler));
              }
            })
          );
        }
        return this.createObservable(next, req, isSustainOnNav, successHandler, errorHandler, cleanUpHandler);

        // return next.handle(req).pipe(
        //   takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
        //   tap(successHandler, errorHandler),
        //   finalize(cleanUpHandler));
      })
    );
  }

  private createObservable(
    next: HttpHandler,
    req: HttpRequest<any>,
    isSustainOnNav: boolean,
    successHandler: (res: HttpResponse<Result<any>>) => void,
    errorHandler: (res: HttpErrorResponse) => void,
    cleanUpHandler: () => void): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      takeUntil(isSustainOnNav ? this._sustainRequestObservable : this._cancelRequestObservable),
      tap(successHandler, errorHandler),
      finalize(cleanUpHandler));
  }
}
