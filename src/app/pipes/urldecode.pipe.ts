import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urldecode'
})
export class UrldecodePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
