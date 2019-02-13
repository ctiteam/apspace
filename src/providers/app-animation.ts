import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

const colorsSet1 = [
  '#67809F',
  '#019875',
  '#96281B',
  '#C0392B',
  '#7f8c8d',
  '#22313F',
  '#004790',
  '#6E248D',
];
const colorsSet2 = [
  '#2E3131',
  '#2ECC71',
  '#EC644B',
  '#40407a',
  '#33d9b2',
  '#c23616',
  '#106B60',
  '#1297E0',
];

@Injectable()
export class AppAnimationProvider {
  private renderer: Renderer2;
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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

  animateBalanceBackground(balanceBackgroundElement) {
    // Some random colors
    const colors = ['#3CC157', '#2AA7FF', '#1B1B1B', '#FCBC0F', '#F85F36'];

    const numBalls = 150;
    const balls = [];

    for (let i = 0; i < numBalls; i++) {
      const ball = document.createElement('div');
      ball.classList.add('ball');
      ball.style.background = colors[Math.floor(Math.random() * colors.length)];
      ball.style.left = `${Math.floor(Math.random() * 110)}vw`;
      ball.style.top = `${Math.floor(Math.random() * 150)}px`;
      ball.style.transform = `scale(${Math.random()})`;
      ball.style.width = `${Math.random()}em`;
      ball.style.height = ball.style.width;

      balls.push(ball);
      this.renderer.appendChild(balanceBackgroundElement.nativeElement, ball);
    }

    // KEYFRAMES
    balls.forEach((el, i, ra) => {
      const to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 18,
      };

      const anim = el.animate(
        [
          { transform: 'translate(0, 0)' },
          { transform: `translate(${to.x}rem, ${to.y}rem)` },
        ],
        {
          duration: (Math.random() + 2) * 2000, // random duration
          direction: 'alternate',
          fill: 'both',
          iterations: Infinity,
          easing: 'ease-in-out',
        },
      );
    });
  }

  // CAN BE MERGED WITH 2
  // giveQuickAccessItemsRandomColors(elRef: ElementRef) {
  //   let quickAccessItems = elRef.nativeElement.querySelectorAll(
  //     ".quick-access-item"
  //   );
  //   for (let i = 0; i < quickAccessItems.length; i++) {
  //     let value = Math.floor(Math.random() * colorsSet1.length);
  //     quickAccessItems[i].style.backgroundColor = colorsSet1[value];
  //     quickAccessItems[i].style.boxShadow =
  //       "1px 1px 1px " +
  //       colorsSet1[value] +
  //       ", -1px -1px 1px " +
  //       colorsSet1[value];
  //     quickAccessItems[i].style.color = "#FFFFFF";
  //   }
  // }

  // 2
  // giveSectionsRandomBorderColors(elRef: ElementRef) {
  //   let sections = elRef.nativeElement.querySelectorAll(".section");
  //   let sectionsHeader = elRef.nativeElement.querySelectorAll(
  //     ".section-header"
  //   );
  //   for (let i = 0; i < sections.length; i++) {
  //     let value = Math.floor(Math.random() * colorsSet2.length);
  //     sections[i].style.borderColor = colorsSet2[value];
  //     sectionsHeader[i].style.color = colorsSet2[value];
  //   }
  // }
}
