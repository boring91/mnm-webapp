import { style, animate, group } from '@angular/animations';

export const animations = {
    overlayEnterAnimation: [
        group([
            style({ opacity: 0.0 }),
            animate('150ms', style({ opacity: 1.0 })),
            // query('@dialog', animateChild()),
        ]),
    ],

    overlayLeaveAnimation: [
        group([
            style({ opacity: 1.0 }),
            animate('150ms', style({ opacity: 0.0 })),
            // query('@dialog', animateChild()),
        ]),
    ],

    dialogEnterAnimation: [
        style({
            transform:
                'perspective(1cm) rotateX(6deg) rotateY(0deg) translateY(100%)',
        }),
        animate(
            // '500ms cubic-bezier(.19,1.33,.69,.97)',
            '500ms cubic-bezier(.19,1.33,.46,.98)',
            style({
                transform:
                    'perspective(1cm) rotateX(0deg) rotateY(0deg) translateY(0)',
            })
        ),
    ],

    dialogLeaveAnimation: [
        style({
            transform:
                'perspective(1cm) rotateX(0deg) rotateY(0deg) translateY(0)',
        }),
        animate(
            '500ms',
            style({
                transform:
                    'perspective(1cm) rotateX(6deg) rotateY(0deg) translateY(100%)',
            })
        ),
    ],
};
