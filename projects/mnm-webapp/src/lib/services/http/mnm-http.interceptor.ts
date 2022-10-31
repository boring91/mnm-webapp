import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { MNMConfig } from '../../config/mnm-config';
import { MNM_CONFIG } from '../../config/mnm.config';
import { defaultMnmConfig } from '../../config/mnm.config.default';
import { Observable, of, Subject } from 'rxjs';
import {
    finalize,
    first,
    switchMap,
    takeUntil,
    tap,
    catchError,
} from 'rxjs/operators';
import { OauthService } from '../oauth.service';
import { LoadingService } from '../../components/loading/loading.service';
import { NotificationService } from '../../components/notification/notification.service';
import { Result } from '../../models/result';
import { NavigationStart, Router } from '@angular/router';
import { mnmHttpInterceptorParams } from './mnm-http-interceptor-params';
import { AccessToken } from '../../models/access-token';
import { mnmHttpInterceptorRouterParams } from './mnm-http-interceptor-router-params';

@Injectable()
export class MNMHttpInterceptor implements HttpInterceptor {
    private oauthService: OauthService;

    private cancelRequestSubject$ = new Subject();
    private sustainRequestSubject$ = new Subject();

    private cancelRequestObservable = this.cancelRequestSubject$.asObservable();
    private sustainRequestObservable =
        this.sustainRequestSubject$.asObservable();

    private readonly contentType: string;

    constructor(
        private loadingService: LoadingService,
        private notificationService: NotificationService,
        private router: Router,
        private injector: Injector,
        @Inject(MNM_CONFIG) mnmConfig: MNMConfig
    ) {
        this.contentType =
            mnmConfig.http?.contentType ?? defaultMnmConfig.http.contentType;
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                const state = this.router.getCurrentNavigation().extras.state;

                // If the navigation is marked to allow current
                // requests to continue, then skip cancellation.
                if (
                    state &&
                    state[mnmHttpInterceptorRouterParams.resumeRequests]
                ) {
                    return;
                }

                this.cancelRequestSubject$.next();
            }
        });

        const isStealth =
            req.params.get(mnmHttpInterceptorParams.stealth) === 'true';
        const isForceInsecure =
            req.params.get(mnmHttpInterceptorParams.forceInsecure) === 'true';
        const isSustainOnNav =
            req.params.get(mnmHttpInterceptorParams.sustainOnNavigation) ===
            'true';
        const areNotificationsHidden =
            req.params.get(mnmHttpInterceptorParams.hideNotifications) ===
            'true';

        // remove the stealth and forceInsecure parameters
        req = req.clone({
            params: req.params
                .delete(mnmHttpInterceptorParams.stealth)
                .delete(mnmHttpInterceptorParams.forceInsecure)
                .delete(mnmHttpInterceptorParams.sustainOnNavigation),
        });

        if (!isStealth) {
            this.loadingService.showLoading();
        }

        // prepare the handlers:
        const successHandler = () => {};

        const errorHandler = (res: HttpErrorResponse) => {
            if (isStealth || areNotificationsHidden) {
                return;
            }
            if (res.error && res.error.messages && !areNotificationsHidden) {
                this.notificationService.notifyError(res.error['messages'][0]);
            } else if (!areNotificationsHidden) {
                this.notificationService.notifyError(res.message);
            }
        };

        const cleanUpHandler = () => {
            if (!isStealth) {
                this.loadingService.hideLoading();
            }
        };

        // set the content type of the request to form urlencoded
        // Check the body type, if it is string, then most probably it has been
        // set with miscFunctions.objectToURLParams. In such a case, attach the
        // the default contentType header, default: 'application/x-www-form-urlencoded'
        if (!req.headers.has('content-type') && typeof req.body === 'string') {
            req = req.clone({
                headers: req.headers.set('content-type', this.contentType),
            });
        }

        if (!this.oauthService) {
            this.oauthService = this.injector.get(OauthService);
        }

        // get the information of the user
        return this.oauthService.userInfo$.pipe(
            takeUntil(
                isSustainOnNav
                    ? this.sustainRequestObservable
                    : this.cancelRequestObservable
            ),
            first(),
            switchMap(userInfo => {
                // if the user is logged in, authorize the request
                if (userInfo.isLoggedIn && !isForceInsecure) {
                    // get the access token
                    return this.oauthService.auth$.pipe(
                        takeUntil(
                            isSustainOnNav
                                ? this.sustainRequestObservable
                                : this.cancelRequestObservable
                        ),
                        first(),
                        switchMap(accessToken => {
                            // if the access token is no longer valid, request a new one
                            if (!accessToken.isValid) {
                                return this.oauthService
                                    .refreshAccessToken()
                                    .pipe(
                                        takeUntil(
                                            isSustainOnNav
                                                ? this.sustainRequestObservable
                                                : this.cancelRequestObservable
                                        ),
                                        // Catch when failing to refresh token.
                                        catchError(e => {
                                            errorHandler(e);
                                            return of(e);
                                        }),
                                        switchMap(
                                            (
                                                newAccessToken:
                                                    | AccessToken
                                                    | HttpErrorResponse
                                            ) => {
                                                // If failed to refresh token.
                                                if (
                                                    newAccessToken instanceof
                                                    HttpErrorResponse
                                                ) {
                                                    return of(
                                                        newAccessToken as any
                                                    );
                                                }

                                                req = req.clone({
                                                    headers: req.headers.set(
                                                        'Authorization',
                                                        'Bearer ' +
                                                            newAccessToken.value
                                                    ),
                                                });
                                                return this.createObservable(
                                                    next,
                                                    req,
                                                    isSustainOnNav,
                                                    successHandler,
                                                    errorHandler,
                                                    cleanUpHandler
                                                );
                                            }
                                        )
                                    );

                                // else, authorize the request using the existing access token.
                            } else {
                                req = req.clone({
                                    headers: req.headers.set(
                                        'Authorization',
                                        'Bearer ' + accessToken.value
                                    ),
                                });
                                return this.createObservable(
                                    next,
                                    req,
                                    isSustainOnNav,
                                    successHandler,
                                    errorHandler,
                                    cleanUpHandler
                                );
                            }
                        })
                    );
                }
                return this.createObservable(
                    next,
                    req,
                    isSustainOnNav,
                    successHandler,
                    errorHandler,
                    cleanUpHandler
                );
            })
        );
    }

    private createObservable(
        next: HttpHandler,
        req: HttpRequest<any>,
        isSustainOnNav: boolean,
        successHandler: (res: HttpResponse<Result<any>>) => void,
        errorHandler: (res: HttpErrorResponse) => void,
        cleanUpHandler: () => void
    ): Observable<HttpEvent<any>> {
        return next
            .handle(req)
            .pipe(
                takeUntil(
                    isSustainOnNav
                        ? this.sustainRequestObservable
                        : this.cancelRequestObservable
                ),
                tap(successHandler, errorHandler),
                finalize(cleanUpHandler)
            );
    }
}
