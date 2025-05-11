import { NgModuleRef } from '@angular/core';

export interface ModalOptions<T = any> {
    disableAutoDismiss?: boolean;
    title?: string;
    moduleRef?: NgModuleRef<any>;
    size?: {
        width?: string;
        height?: string;
    };
    onDismiss?: () => void;
    beforeInit?: (component: T) => void;
}
