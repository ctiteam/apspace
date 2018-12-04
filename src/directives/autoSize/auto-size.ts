import { Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Directive({
  selector: 'ion-textarea[autosize]',
})

export class AutosizeDirective implements OnInit {

  constructor(public element: ElementRef) { }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  ngOnInit(): void {
    setTimeout(() => this.adjust(), 0);
  }

  adjust(): void {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.height = 'auto';
    if (textArea.scrollHeight < 100) {
      textArea.style.height = textArea.scrollHeight + 'px';
      textArea.style.overflowY = 'hidden';
    } else {
      textArea.style.height = '170px';
      textArea.style.overflowY = 'auto';
    }
  }
}
