import { AnimationMetadata } from '@angular/animations';

export interface MNMConfig {
    oauthConfig?: {
        claimsUrl: string;
        oauthUrl: string;
    };
    http?: {
        contentType?: string;
    };
    modal?: {
        animations?: {
            overlayEnterAnimation?: AnimationMetadata[];

            overlayLeaveAnimation?: AnimationMetadata[];

            dialogEnterAnimation?: AnimationMetadata[];

            dialogLeaveAnimation?: AnimationMetadata[];
        };
    };
}
