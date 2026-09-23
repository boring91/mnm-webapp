/** A Web Animations API animation: element.animate(keyframes, options). */
export interface MnmAnimation {
    keyframes: Keyframe[];
    options?: KeyframeAnimationOptions;
}

export interface ModalAnimations {
    overlayEnterAnimation: MnmAnimation;
    overlayLeaveAnimation: MnmAnimation;
    dialogEnterAnimation: MnmAnimation;
    dialogLeaveAnimation: MnmAnimation;
}

export interface MNMConfig {
    oauthConfig?: {
        claimsUrl: string;
        oauthUrl: string;
    };
    http?: {
        contentType?: string;
    };
    modal?: {
        animations?: Partial<ModalAnimations>;
    };
}
