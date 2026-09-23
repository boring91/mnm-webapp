import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { ModalComponent } from '../../services/modal/components/modal/modal.component';

@Component({
    selector: 'mnm-main',
    template: `
        <mnm-loading></mnm-loading>
        <mnm-modal></mnm-modal>
    `,
    standalone: true,
    imports: [LoadingComponent, ModalComponent],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MnmMainComponent {}
