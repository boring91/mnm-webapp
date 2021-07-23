import {
    trigger,
    transition,
    style,
    animate,
    query,
    animateChild,
    group,
} from '@angular/animations';

export const animations = [
    trigger('overlay', [
        transition(':enter', [
            group([
                style({ opacity: 0.0 }),
                animate('150ms', style({ opacity: 1.0 })),
                query('@dialog', animateChild()),
            ]),
        ]),
        transition(':leave', [
            group([
                style({ opacity: 1.0 }),
                animate('150ms', style({ opacity: 0.0 })),
                query('@dialog', animateChild()),
            ]),
        ]),
    ]),

    trigger('dialog', [
        transition(':enter', [
            style({
                transform:
                    'perspective(1cm) rotateX(6deg) rotateY(0deg) translateY(100%)',
            }),
            animate(
                // '500ms cubic-bezier(.19,1.33,.69,.97)',
                '500ms cubic-bezier(.19,1.33,.46,.98)',
                style({
                    transform:
                        'perspective(1cm) rotateX(0deg) rotateY(0deg) translateY(-50%)',
                })
            ),
        ]),

        transition(':leave', [
            style({
                transform:
                    'perspective(1cm) rotateX(0deg) rotateY(0deg) translateY(-50%)',
            }),
            animate(
                '500ms',
                style({
                    transform:
                        'perspective(1cm) rotateX(6deg) rotateY(0deg) translateY(100%)',
                })
            ),
        ]),
    ]),
];
