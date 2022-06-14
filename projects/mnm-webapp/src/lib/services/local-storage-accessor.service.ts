import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class LocalStorageAccessorService {
    private isBrowser: boolean;

    public constructor(@Inject(PLATFORM_ID) platformId: any) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    public get storage(): Storage | null {
        return this.isBrowser ? localStorage : null;
    }
}
