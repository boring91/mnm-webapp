import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Inject, Injectable, Injector} from '@angular/core';
import {MNMConfig} from '../../mnm-config';
import {MNM_CONFIG} from '../../mnm.config';
import {defaultMnmConfig} from '../../mnm.config.default';
import {Observable} from 'rxjs';
import {tap, finalize, first, switchMap} from 'rxjs/operators';
import {OauthService} from '../oauth.service';
import {LoadingService} from '../../components/loading/loading.service';
import {NotificationService} from '../../components/notification/notification.service';
import {Result} from '../../models/result';


@Injectable()
export class MNMHttpInterceptor implements HttpInterceptor {

  public static STEALTH = 'interceptor_stealth';
  public static FORCE_INSECURE = 'interceptor_force_insecure';

  private _oauthService: OauthService;

  constructor(@Inject(MNM_CONFIG) private readonly _mnmConfig: MNMConfig,
              private _loadingService: LoadingService,
              private _notificationService: NotificationService,
              private _inj: Injector) {
    this._mnmConfig = {...defaultMnmConfig, ...this._mnmConfig};
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isStealth = req.params.get(MNMHttpInterceptor.STEALTH) === 'true';
    const isForceInsecure = req.params.get(MNMHttpInterceptor.FORCE_INSECURE) === 'true';

    // remove the stealth and force_insecure parameters
    req = req.clone({
      params: req.params
        .delete(MNMHttpInterceptor.STEALTH)
        .delete(MNMHttpInterceptor.FORCE_INSECURE)
    });

    if (!isStealth) {
      this._loadingService.showLoading();
    }


    // prepare the handlers:
    const successHandler = (res: HttpResponse<Result<any>>) => {
    };

    const errorHandler = (res: HttpErrorResponse) => {
      if (isStealth) {
        return;
      }
      if (res.error && res.error.messages) {
        this._notificationService.notifyError(res.error['messages'][0]);
      } else {
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
    return this._oauthService.userInfo$.pipe(first()).pipe(switchMap(userInfo => {

      // if the user is logged in, authorize the request
      if (userInfo.isLoggedIn && !isForceInsecure) {

        // get the access token
        return this._oauthService.auth$.pipe(first()).pipe(switchMap(accessToken => {

          // if the access token is no longer valid, request a new one
          if (!accessToken.isValid) {
            return this._oauthService.refreshAccessToken().pipe(switchMap(newAccessToken => {
              req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + newAccessToken.value)
              });
              return next.handle(req).pipe(tap(successHandler, errorHandler)).pipe(finalize(cleanUpHandler));
            }));

            // else, authorize the request using the existing access token.
          } else {
            req = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + accessToken.value)
            });
            return next.handle(req).pipe(tap(successHandler, errorHandler)).pipe(finalize(cleanUpHandler));
          }
        }));
      }
      return next.handle(req).pipe(tap(successHandler, errorHandler)).pipe(finalize(cleanUpHandler));
    }));
  }
}
