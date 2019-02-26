import { ElementRef, Injectable } from '@angular/core';



@Injectable()
export class AppAnimationProvider {
  constructor() {}

  /*
  USED TO CHECK IF AN ELEMENT IS IN THE VIEWPORT OR NOT.
  */
  isElementInViewport(el: Element) {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.top < (window.innerHeight + 300 || document.documentElement.clientHeight + 300)
    );
  }

  /*
  USED TO ADD ANIMATION TO THE SECTIONS WHEN A USER SCROLL DOWN AND UP.
  */
  addAnimationsToSections(elRef: ElementRef) {
    const pageSections = elRef.nativeElement.querySelectorAll('.main-section');
    for (const elementToAnimate of pageSections) {
      if (this.isElementInViewport(elementToAnimate)) {
        elementToAnimate.style.animation = 'come-in 0.7s ease forwards';
      }
    }
  }
}
