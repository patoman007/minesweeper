import { 
  Directive, 
  Input, 
  Output, 
  EventEmitter, 
  HostListener 
} from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  private touchTimeout: number;

  @Input()
  timeout = 400;

  @Output()
  longPress = new EventEmitter();

  @HostListener('touchstart')
  touchStart() {
    this.touchTimeout = window.setTimeout(() => {
      this.longPress.emit();
    }, this.timeout);
  }

  @HostListener('touchend')
  touchend() {
    this.touchEnd();
  }

  constructor() { }

  private touchEnd() {
    if (!this.touchTimeout) { return; }
    window.clearTimeout(this.touchTimeout);
  }

}
