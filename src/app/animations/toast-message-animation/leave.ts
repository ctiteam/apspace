// import { Animation } from '@ionic/core';

// export function toastMessageLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

//   const baseAnimation = new AnimationC();

//   const backdropAnimation = new AnimationC();
//   backdropAnimation.addElement(baseEl.querySelector('ion-toast'));

//   const wrapperAnimation = new AnimationC();
//   const wrapperEl = baseEl.querySelector('.toast-wrapper');
//   wrapperAnimation.addElement(wrapperEl);
//   wrapperAnimation
//     .fromTo('transform', 'scaleX(1) scaleY(1)', 'scaleX(0.1) scaleY(0.1)')
//     .fromTo('opacity', 1, 0);

//   backdropAnimation.fromTo('opacity', 0.4, 0.0);

//   return Promise.resolve(baseAnimation
//     .addElement(baseEl)
//     .easing('ease-out')
//     .duration(400)
//     .add(backdropAnimation)
//     .add(wrapperAnimation));

// }
