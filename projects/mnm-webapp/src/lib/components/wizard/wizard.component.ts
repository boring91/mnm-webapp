import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'mnm-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  animations: [
    trigger('wizardAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('100ms ease-in', keyframes([
            style({ opacity: 0.0, offset: 0.0 }),
            style({ opacity: 1.0, offset: 1.0 })
          ]))
        ]), { optional: true }),

        query(':leave', stagger('100ms', [
          animate('100ms ease-in', keyframes([
            style({ opacity: 1.0, offset: 0.0 }),
            style({ opacity: 0.0, offset: 1.0 })
          ]))
        ]), { optional: true })
      ])
    ])
  ]
})
export class WizardComponent implements OnInit {

  @Output() public hidden = new EventEmitter();
  @Output() public shown = new EventEmitter();

  isShown = false;

  public constructor() {
  }

  public ngOnInit(): void {
  }

  public show() {
    this.isShown = true;
    this.shown.emit();
  }

  public hide() {
    this.isShown = false;
    this.hidden.emit();
  }
}
