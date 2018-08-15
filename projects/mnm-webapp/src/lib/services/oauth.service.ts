import {Inject, Injectable} from '@angular/core';
import {MNMHttpInterceptor} from './http/mnm-http.interceptor';
import {BehaviorSubject, Observable, Subject, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {MNM_CONFIG} from '../mnm.config';
import {MNMConfig} from '../mnm-config';
import {AccessToken} from '../models/access-token';
import {Claim} from '../models/claim';
import {MNMUrlSearchParams} from './http/mnm-url-search-params';
import {miscFunctions} from '../misc/misc-functions';
import {UserInfo} from '../models/user-info';
import {MNMHttpService} from './http/mnm-http.service';
import {BroadcasterService} from './broadcaster/broadcaster.service';

@Injectable()
export class OauthService {

  private _accessToken = new AccessToken();
  private _auth$ = new BehaviorSubject<AccessToken>(null);
  private _oauthUrl;
  private readonly _claimsUrl;

  private _isFetchingNewToken = false;
  private _tokenRefreshedNotifier: Subject<AccessToken>;

  /**
   * Loads the access token of the provided oauthService from the response
   */
  private static extractAccessToken(oauthService: OauthService, res: any, username: string, persist?: boolean): AccessToken {
    oauthService._accessToken.value = res['access_token'];
    oauthService._accessToken.refreshToken = res['refresh_token'];
    oauthService._accessToken.expiresIn = res['expires_in']; // the number of seconds from the time it has bee acquired
    oauthService._accessToken.acquiredAt = Date.now();
    oauthService._accessToken.username = username;
    if (persist !== undefined || persist !== null) {
      oauthService._accessToken.persist = persist;
    }
    oauthService._accessToken.save();
    return oauthService._accessToken;
  }

  constructor(private http: MNMHttpService, broadcaster: BroadcasterService,
              @Inject(MNM_CONFIG) config: MNMConfig) {
    this._auth$.next(this._accessToken);
    if (config) {
      this._oauthUrl = config.oauthConfig.oauthUrl;
      this._claimsUrl = config.oauthConfig.claimsUrl;
    }

    broadcaster.on('claims-changed').subscribe(() => this.refreshClaims().subscribe());
  }

  // get accessToken() {
  //   return this._accessToken;
  // }

  get auth$(): BehaviorSubject<AccessToken> {
    return this._auth$;
  }

  get userInfo$(): Observable<UserInfo> {
    return this.auth$.pipe(map(accessToken => {
      return {
        isLoggedIn: accessToken.isObtained,
        claims: accessToken.claims
      };
    }));
  }

  /**
   * Logs the user in
   */
  login(email: string, password: string, persist: boolean): Observable<string> {

    return this.http.post(`${this._oauthUrl}/connect/token`, miscFunctions.objectToURLParams({
      'username': email,
      'password': password,
      'grant_type': 'password',
      'client_id': 'roclient.public'
    }), {
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    })
      .pipe(switchMap(res => {

        OauthService.extractAccessToken(this, res, email, persist);

        // fetch the claims of the user
        return this.refreshClaims();
      }));
  }

  refreshAccessToken(): Observable<AccessToken> {
    if (this._isFetchingNewToken) {
      return this._tokenRefreshedNotifier.asObservable();
    }

    this._isFetchingNewToken = true;
    this._tokenRefreshedNotifier = new Subject<AccessToken>();

    const options = new MNMUrlSearchParams();

    // notify the interceptor to force insecure connection (no authorization)
    options.set(MNMHttpInterceptor.FORCE_INSECURE, `${true}`);

    return this.http.post(`${this._oauthUrl}/connect/token`, miscFunctions.objectToURLParams({
      'refresh_token': this._accessToken.refreshToken,
      'grant_type': 'refresh_token',
      'client_id': 'roclient.public',
      'username': this._accessToken.username
    }), {search: options, headers: {'content-type': 'application/x-www-form-urlencoded'}})
      .pipe(map(res => {
        const accessToken = OauthService.extractAccessToken(this, res, this._accessToken.username);
        this._tokenRefreshedNotifier.next(accessToken);
        this._tokenRefreshedNotifier.complete();
        this._isFetchingNewToken = false;
        this._tokenRefreshedNotifier = null;
        return accessToken;
      }));
  }


  logout() {
    this._accessToken.clear();
    this._auth$.next(this._accessToken);
  }

  /**
   * Gets the claims for the logged in user
   */
  private refreshClaims(): Observable<string> {
    const successfulObservable = of('Logged in successfully');
    if (!this._claimsUrl || this._claimsUrl === '') {
      return successfulObservable;
    }
    return this.http.get(this._claimsUrl, {
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    }, true).pipe(tap(res => {
      if (res.success !== 1) {
        return null;
      }
      const extra = res.extra.claims;
      this._accessToken.claims = extra.map(x => <Claim[]> x);
      this._accessToken.save();
      this._auth$.next(this._accessToken);
    })).pipe(switchMap(x => successfulObservable));
  }

}
