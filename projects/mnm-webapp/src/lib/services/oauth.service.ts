import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MNM_CONFIG } from '../mnm.config';
import { MNMConfig } from '../mnm-config';
import { AccessToken } from '../models/access-token';
import { Claim } from '../models/claim';
import { miscFunctions } from '../misc/misc-functions';
import { UserInfo } from '../models/user-info';
import { BroadcasterService } from './broadcaster/broadcaster.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Result } from '../models/result';
import { mnmHttpInterceptorParams } from './http/mnm-http-interceptor-params';

@Injectable()
export class OauthService {
    private accessToken = new AccessToken();
    private _auth$ = new BehaviorSubject<AccessToken>(null);
    private oauthUrl: string;
    private readonly claimsUrl: string;
    private _status$ = new Subject<'logged_in' | 'logged_out'>();

    private isFetchingNewToken = false;
    private tokenRefreshedNotifier: Subject<AccessToken>;

    /**
     * Loads the access token of the provided oauthService from the response
     */
    private static extractAccessToken(
        oauthService: OauthService,
        res: any,
        username: string,
        persist?: boolean
    ): AccessToken {
        oauthService.accessToken.value = res['access_token'];
        oauthService.accessToken.refreshToken = res['refresh_token'];
        oauthService.accessToken.expiresIn = res['expires_in']; // the number of seconds from the time it has bee acquired
        oauthService.accessToken.acquiredAt = Date.now();
        oauthService.accessToken.username = username;
        if (persist !== undefined || persist !== null) {
            oauthService.accessToken.persist = persist;
        }
        oauthService.accessToken.save();
        return oauthService.accessToken;
    }

    constructor(
        private http: HttpClient,
        broadcaster: BroadcasterService,
        @Inject(MNM_CONFIG) config: MNMConfig
    ) {
        this._auth$.next(this.accessToken);
        if (config) {
            this.oauthUrl = config.oauthConfig.oauthUrl;
            this.claimsUrl = config.oauthConfig.claimsUrl;
        }

        broadcaster
            .on('claims-changed')
            .subscribe(() => this.refreshClaims().subscribe());
    }

    // get accessToken() {
    //   return this._accessToken;
    // }

    get auth$(): Observable<AccessToken> {
        return this._auth$;
    }

    get userInfo$(): Observable<UserInfo> {
        return this.auth$.pipe(
            map(accessToken => {
                return {
                    isLoggedIn: accessToken.isObtained,
                    claims: accessToken.claims,
                };
            })
        );
    }

    get status$(): Observable<'logged_in' | 'logged_out'> {
        return this._status$.asObservable();
    }

    /**
     * Logs the user in
     */
    login(
        email: string,
        password: string,
        persist: boolean
    ): Observable<string> {
        const params = new HttpParams().set(
            mnmHttpInterceptorParams.hideNotifications,
            `${true}`
        );

        return this.http
            .post(
                `${this.oauthUrl}/connect/token`,
                miscFunctions.objectToURLParams({
                    'username': email,
                    'password': password,
                    'grant_type': 'password',
                    'client_id': 'roclient.public',
                    '': '',
                }),
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    params,
                }
            )
            .pipe(
                switchMap(res => {
                    OauthService.extractAccessToken(this, res, email, persist);

                    this._status$.next('logged_in');

                    // fetch the claims of the user
                    return this.refreshClaims();
                })
            );
    }

    refreshAccessToken(): Observable<AccessToken> {
        if (this.isFetchingNewToken) {
            return this.tokenRefreshedNotifier.asObservable();
        }

        this.isFetchingNewToken = true;
        this.tokenRefreshedNotifier = new Subject<AccessToken>();

        let params = new HttpParams();
        let headers = new HttpHeaders();

        headers = headers.append(
            'content-type',
            'application/x-www-form-urlencoded'
        );

        // notify the interceptor to force insecure connection (no authorization)
        params = params
            .set(mnmHttpInterceptorParams.forceInsecure, `${true}`)
            .set(mnmHttpInterceptorParams.sustainOnNavigation, `${true}`)
            .set(mnmHttpInterceptorParams.hideNotifications, `${true}`);

        return this.http
            .post(
                `${this.oauthUrl}/connect/token`,
                miscFunctions.objectToURLParams({
                    'refresh_token': this.accessToken.refreshToken,
                    'grant_type': 'refresh_token',
                    'client_id': 'roclient.public',
                    'username': this.accessToken.username,
                }),
                { params: params, headers: headers }
            )
            .pipe(
                map(res => {
                    const accessToken = OauthService.extractAccessToken(
                        this,
                        res,
                        this.accessToken.username
                    );
                    this.tokenRefreshedNotifier.next(accessToken);
                    this.tokenRefreshedNotifier.complete();
                    this.isFetchingNewToken = false;
                    this.tokenRefreshedNotifier = null;
                    return accessToken;
                })
            );
    }

    logout() {
        this.accessToken.clear();
        this._auth$.next(this.accessToken);
        this._status$.next('logged_out');
    }

    /**
     * Gets the claims for the logged in user
     */
    private refreshClaims(): Observable<string> {
        const successfulObservable = of('Logged in successfully');
        if (!this.claimsUrl || this.claimsUrl === '') {
            return successfulObservable;
        }

        let params = new HttpParams();
        let headers = new HttpHeaders();

        headers = headers.append(
            'content-type',
            'application/x-www-form-urlencoded'
        );

        // notify the interceptor to force insecure connection (no authorization)
        params = params.set(
            mnmHttpInterceptorParams.sustainOnNavigation,
            `${true}`
        );
        params = params.set(
            mnmHttpInterceptorParams.hideNotifications,
            `${true}`
        );

        return this.http
            .get<Result<any>>(this.claimsUrl, {
                headers: headers,
                params: params,
            })
            .pipe(
                tap(res => {
                    if (res.success !== 1) {
                        return null;
                    }
                    const extra = res.extra.claims;
                    this.accessToken.claims = extra.map(x => <Claim[]>x);
                    this.accessToken.save();
                    this._auth$.next(this.accessToken);
                })
            )
            .pipe(switchMap(x => successfulObservable));
    }
}
