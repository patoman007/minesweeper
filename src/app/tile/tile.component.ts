import { Component, Input, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { TileInterface } from './tile.interface';
import { TilesManager } from './tiles.manager';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input()
  model: TileInterface;

  @Output()
  uncover = new EventEmitter();

  @ViewChild('brick', { static: false })
  brickRef: ElementRef;

  constructor(private renderer: Renderer2) { }

  private appendClip(wrapper: HTMLDivElement, 
                     content: string, 
                     clipStyle: string) {
    const clip = this.renderer.createElement('div');
    this.renderer.setProperty(clip, 'innerHTML', content);
    this.renderer.addClass(clip, 'tile');
    this.renderer.addClass(clip, 'clip');
    this.renderer.setStyle(clip, 'clip', clipStyle);
    this.renderer.appendChild(wrapper, clip);
    
  }

  private createClips(brick: HTMLDivElement, clips = 2) {
    const clipWidth = Math.floor(brick.offsetWidth / clips);
    const clipHeight = Math.floor(brick.offsetHeight / clips);
    const content = brick.innerHTML;

    for (let i = 0; i < (clips * clipWidth); i += clipWidth) {
      for (let j = 0; j < (clips * clipHeight); j+= clipHeight) {
        const clipStyle = `rect(${ j }px, ${ i + clipWidth }px, ${ j + clipHeight }px, ${ i }px)`;
        const wrapper = this.renderer.parentNode(brick);
        this.appendClip(wrapper, content, clipStyle);
      }
    }
  }

  private transformateClip(clip: HTMLDivElement) {
    const scale = TilesManager.GetScale();
    const skew = TilesManager.GetSkew();
    const zRotation = TilesManager.GetZRotation();
    const transform = `scale(${ scale }) skew(${ skew }deg) rotateZ(${ zRotation }deg)`;
    this.renderer.setStyle(clip, 'transform', transform);
  }

  private animateClip(clip: HTMLDivElement) {
    const animationTime = 10;
    const velocity = TilesManager.GetVelocity();
    const theta = TilesManager.GetTheta();
    const direction = TilesManager.GetHorizontalDirection();
    const g = -9.8;
    
    let time = 0;

    const animation = window.setInterval(() => {
      const vx = Math.cos(theta) * velocity * direction;
      const vy = (Math.sin(theta) * velocity) - ((-g) * time);
      const dx = vx * time;
      const dy = (vy * time) + (0.5 * g * Math.pow(time, 2));

      this.renderer.setStyle(clip, 'bottom', `${ dy }px`);
      this.renderer.setStyle(clip, 'left', `${ dx }px`);
      
      time += 0.10;

      if (time > animationTime) {
        window.clearInterval(animation);
        this.renderer.removeChild(clip.parentElement, clip);
      }
    }, 10);
  }

  private animateUncover() {
    if (!this.brickRef) { return; }

    const brick = this.brickRef.nativeElement as HTMLDivElement;
    this.createClips(brick);
    this.renderer.parentNode(brick).querySelectorAll('.clip')
      .forEach((clip: HTMLDivElement) => {
        this.transformateClip(clip);
        this.animateClip(clip);
      });
  }

  clickHandler() {
    if (!this.model) { return; }
    if (this.model.state !== 'covered') { return; }

    this.animateUncover();
    TilesManager.HandleClick(this.model);
    this.uncover.emit();
  }

}
