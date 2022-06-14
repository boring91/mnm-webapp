import { Claim } from './claim';
export class AccessToken {
    value: string;
    refreshToken: string;
    expiresIn: number;
    acquiredAt: number;
    claims: Claim[] = [];
    persist: boolean;
    username: string;

    public load(accessTokenStr: string | null) {
        if (accessTokenStr) {
            const accessToken: AccessToken = JSON.parse(accessTokenStr);
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
    public toString(): string {
        // Get a copy of this object.
        const accessToken = JSON.parse(JSON.stringify(this));

        // Remove the `value`, we want to regenerate the
        // access token on every reload.
        delete accessToken.value;

        return JSON.stringify(accessToken);
    }

    public clear() {
        this.value = undefined;
        this.refreshToken = undefined;
        this.expiresIn = undefined;
        this.acquiredAt = undefined;
        this.username = undefined;
        this.claims = [];
    }

    public get isObtained(): boolean {
        return this.expiresIn != null && this.acquiredAt != null;
    }

    public get isValid(): boolean {
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
