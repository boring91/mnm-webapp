import { Claim } from './claim';
export class AccessToken {
    value: string;
    refreshToken: string;
    expiresIn: number;
    acquiredAt: number;
    claims: Claim[] = [];
    persist: boolean;
    username: string;

    constructor() {
        const acStr = localStorage.getItem('accessToken');

        if (acStr) {
            const accessToken: AccessToken = JSON.parse(acStr);
            this.acquiredAt = accessToken.acquiredAt;
            this.refreshToken = accessToken.refreshToken;
            this.expiresIn = accessToken.expiresIn;
            // The access token is stored in the local storage,
            // and well be regenerated every time the page is reloaded.
            // this.value = accessToken.value;
            this.claims = accessToken.claims;
            this.persist = accessToken.persist;
            this.username = accessToken.username;
        }
    }

    /**
     * Saves the access token to the cookie
     */
    save() {
        // Get a copy of this object.
        const accessToken = JSON.parse(JSON.stringify(this));

        // Remove the `value`, we want to regenerate the
        // access token on every reload.
        delete accessToken.value;

        localStorage.setItem('accessToken', JSON.stringify(accessToken));
    }

    clear() {
        // window.localStorage.removeItem('accessToken');
        // miscFunctions.deleteCookie('accessToken');
        localStorage.removeItem('accessToken');

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
        const currentTime = Date.now() / 1000 + 1; // +1 second just in case.

        // Ensure that the token is not expired and there is
        // a value for the access token (nullified on page reload)
        return currentTime < acquiredSeconds + this.expiresIn && !!this.value;
    }
}
