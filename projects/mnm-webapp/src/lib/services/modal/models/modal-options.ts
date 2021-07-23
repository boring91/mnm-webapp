import { Injector, NgModuleRef } from '@angular/core';

export interface ModalOptions<T = any> {
    disableAutoDismiss?: boolean;
    title?: string;
    moduleRef?: NgModuleRef<any>;
    onDismiss?: () => void;
    beforeInit?: (component: T) => void;
}
