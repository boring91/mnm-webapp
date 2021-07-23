import { Type } from '@angular/core';
import { ModalOptions } from './modal-options';

export interface ModalBroadcasterMessage<T = any> {
    type: 'show' | 'dismiss';
    componentType?: Type<T>;
    component?: T;
    callback: (component: T) => void;
    options?: ModalOptions;
}
