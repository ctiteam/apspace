import { Component, HostListener, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { FireworksCreator } from './fireworks.class';
import { Content } from 'ionic-angular';

@Component({
  selector: 'fireworks',
  templateUrl: 'fireworks.html',
})
export class FireworksComponent implements OnInit {

  @ViewChild("firework") fireworkCanvas: ElementRef;
  fireworksCreator: FireworksCreator;
  hideFirework: boolean = true;

  constructor(private content: Content) {}

  ngOnInit() {
    this.fireworksCreator = new FireworksCreator(this.canvas);
    
    (() => {
      let that = this;
      let then = new Date().getTime();

      function inner() {
        requestAnimationFrame(inner);
        let now = new Date().getTime();
        let delta = now - then;
        that.fireworksCreator.update(delta / 1000);
        then = now;
      }
    
      inner();
    })();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fireworksCreator.resize();
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    this.fireworksCreator.onClick(event);
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event) {
    this.fireworksCreator.onClick(event);
  }

  private get canvas(): HTMLCanvasElement {
    return this.fireworkCanvas.nativeElement;
  }

  launchFirework() {
    const tabBar: HTMLDivElement = document.querySelector("div.tabbar.show-tabbar");
    const tabBarDisplay: string = tabBar.style.display;

    this.hideFirework = false;
    tabBar.style.display = "none";

    this.content.resize();

    setTimeout(() => {
      this.hideFirework = true;
      tabBar.style.display = tabBarDisplay;
      
      this.content.resize();
    }, 5000);
  }
}
