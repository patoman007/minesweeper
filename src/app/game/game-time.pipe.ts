import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gameTime'
})
export class GameTimePipe implements PipeTransform {

  private completeWithZero(num: number): string {
    return ('0' + num).slice(-2);
  }

  transform(value: number): string {
    const hours = value >= 3600 ? Math.floor(value / 3600) : 0;
    const minutes = value >= 60 ? Math.floor(value / 60) : 0;
    const seconds = value % 60;
    
    const strHours = this.completeWithZero(hours);
    const strMinutes = this.completeWithZero(minutes);
    const strSeconds = this.completeWithZero(seconds);

    return `${ strHours }:${ strMinutes }:${ strSeconds }`;
  }

}
