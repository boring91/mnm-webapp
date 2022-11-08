import { Injectable, Type } from '@angular/core';
import { BroadcasterService } from '../broadcaster/broadcaster.service';
import { ModalBroadcasterMessage } from './models/modal-broadcaster-message';
import { ModalOptions } from './models/modal-options';

@Injectable()
export class ModalService {
    private activeComponents: any[] = [];

    public constructor(private broadcasterService: BroadcasterService) {}

    public async show<T>(
        componentType: Type<T>,
        options: ModalOptions<T> = {}
    ): Promise<T> {
        options = { ...{ disableAutoDismiss: false, title: '' }, ...options };
        // Use the framework-wide broadcaster service
        // to notify the modal component of a new component
        // that should be loaded as modal.
        const component = await new Promise<T>(resolve => {
            this.broadcasterService.broadcast<ModalBroadcasterMessage<T>>(
                'mnm_modal',
                {
                    componentType,
                    type: 'show',
                    options,
                    callback: c => {
                        resolve(c);
                    },
                }
            );
        });

        this.activeComponents.push(component);

        return component;
    }

    public dismiss<T>(component: T): Promise<void> {
        // Notify the modal component through the
        // broadcaster component to dismiss a component
        // shown as a modal.
        return new Promise(resolve => {
            this.broadcasterService.broadcast<ModalBroadcasterMessage<T>>(
                'mnm_modal',
                {
                    type: 'dismiss',
                    component,
                    callback: m => {
                        // Remove it from active modals.
                        const index = this.activeComponents.indexOf(m);
                        this.activeComponents.splice(index, 1);

                        resolve();
                    },
                }
            );
        });
    }

    public dismissAll(): Promise<void> {
        return new Promise(async resolve => {
            // We need to copy the array as it
            // is going to be updated after each
            // dismiss.
            const copy = [...this.activeComponents];
            for (const c of copy.reverse()) {
                await this.dismiss(c);
            }
            resolve();
        });
    }
}
