import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }

  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'sanitizeHtml': return this.sanitizer.sanitize(SecurityContext.HTML, value);
      case 'sanitizeStyle': return this.sanitizer.sanitize(SecurityContext.STYLE, value);
      case 'sanitizeScript': return this.sanitizer.sanitize(SecurityContext.SCRIPT, value);
      case 'bypassHtml': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'bypassStyle': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'bypassScript': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'bypassUrl': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'bypassResourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
