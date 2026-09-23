import { ModalAnimations } from './mnm-config';

const dialogHidden = {
    transform: 'perspective(1cm) rotateX(6deg) rotateY(0deg) translateY(100%)',
};
const dialogShown = {
    transform: 'perspective(1cm) rotateX(0deg) rotateY(0deg) translateY(0)',
};

export const animations: ModalAnimations = {
    overlayEnterAnimation: {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: { duration: 150 },
    },
    overlayLeaveAnimation: {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: { duration: 150 },
    },
    dialogEnterAnimation: {
        keyframes: [dialogHidden, dialogShown],
        options: { duration: 500, easing: 'cubic-bezier(.19,1.33,.46,.98)' },
    },
    dialogLeaveAnimation: {
        keyframes: [dialogShown, dialogHidden],
        options: { duration: 500 },
    },
};
