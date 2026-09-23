import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'mnm-wizard',
  templateUrl: './wizard.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent {
  @Output() public hidden = new EventEmitter();
  @Output() public shown = new EventEmitter();

  isShown = signal(false);

  public show() {
    this.isShown.set(true);
    this.shown.emit();
  }

  public hide() {
    this.isShown.set(false);
    this.hidden.emit();
  }
}
