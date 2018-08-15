import {Claim} from './claim';
import {miscFunctions} from '../misc/misc-functions';

export class AccessToken {
  value: string;
  refreshToken: string;
  expiresIn: number;
  acquiredAt: number;
  claims: Claim[] = [];
  persist: boolean;
  username: string;

  constructor() {
    // JSON.parse(window.localStorage.getItem('accessToken'));
    const acStr = miscFunctions.getCookie('accessToken');
    if (acStr) {
      const accessToken: AccessToken = JSON.parse(acStr);
      this.acquiredAt = accessToken.acquiredAt;
      this.refreshToken = accessToken.refreshToken;
      this.expiresIn = accessToken.expiresIn;
      this.value = accessToken.value;
      this.claims = accessToken.claims;
      this.persist = accessToken.persist;
      this.username = accessToken.username;
    }
  }

  /**
   * Saves the access token to the cookie
   */
  save() {
    // window.localStorage.setItem('accessToken', JSON.stringify(this));
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const expires = this.persist ? d : null;
    miscFunctions.setCookie('accessToken', JSON.stringify(this), expires);

  }

  clear() {
    // window.localStorage.removeItem('accessToken');
    miscFunctions.deleteCookie('accessToken');

    this.value = undefined;
    this.refreshToken = undefined;
    this.expiresIn = undefined;
    this.acquiredAt = undefined;
    this.username = undefined;
    this.claims = [];
  }

  get isObtained(): boolean {
    return this.expiresIn != null && this.acquiredAt != null;
  }

  get isValid(): boolean {
    if (!this.isObtained) {
      return false;
    }

    const acquiredSeconds = this.acquiredAt / 1000;
    const currentTime = Date.now() / 1000;

    return currentTime < acquiredSeconds + this.expiresIn;
  }
}
