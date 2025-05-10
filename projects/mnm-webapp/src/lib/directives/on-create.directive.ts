import {Directive, Output, EventEmitter, OnInit} from '@angular/core';

@Directive({
  selector: '[mnmOnCreate]'
})
export class OnCreateDirective implements OnInit {

  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    this.onCreate.emit();
  }
}
