import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { Firework } from './firework';
import { Particle } from './particle';
import { Vector } from './vector';

@Component({
  selector: 'fireworks',
  templateUrl: 'fireworks.html',
})
export class FireworksComponent implements OnInit {

  @ViewChild('fireworks') fireworkCanvas;

  fireworks = [];
  // snapTime = 0;
  flash = false;
  gravity = 0.2;
  running = false;
  newFirework = false;
  timeoutHandler = undefined;

  ngOnInit() {
    const numOfFireworks = 1;
    for (let i = 0; i < numOfFireworks; i++) {
      this.fireworks.push(new Firework(this.rndNum(this.canvas.width), this.canvas.height, this));
    }
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(ev) {
    this.canvas.width = ev.target.innerWidth;
    this.canvas.height = ev.target.innerHeight;
  }

  get ctx() {
    return this.canvas.getContext('2d');
  }

  rndNum(num) {
    return Math.random() * num + 1;
  }

  drawDot(x, y, size) {
    this.ctx.beginPath();

    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.closePath();
  }

  update(time) {
    for (let i = 0, len = this.fireworks.length; i < len; i++) {
      const p = this.fireworks[i];
      p.update(time);
    }
  }

  draw(time?: number) {
    if (this.newFirework) {
      this.fireworks.push(new Firework(this.rndNum(this.canvas.width), this.canvas.height, this));
      clearTimeout(this.timeoutHandler);
      setTimeout(() => this.fireworks.pop(), 5000);
      this.timeoutHandler = setTimeout(() => this.running = false, 5000);
      this.newFirework = false;
    }

    const redraw = this.fireworks.length > 0;
    this.update(time);

    this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    if (this.flash) {
      this.flash = false;
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // this.ctx.fillStyle = 'white';
    // this.ctx.font = '30px Arial';
    // const newTime = time - this.snapTime;
    // this.snapTime = time;

    // this.ctx.fillText(newTime,10,50);

    this.ctx.fillStyle = 'blue';
    for (let i = 0, len = this.fireworks.length; i < len; i++) {
      let p = this.fireworks[i];
      if (p.dead && this.running) {
        this.fireworks[i] = new Firework(this.rndNum(this.canvas.width), this.canvas.height, this);
        p = this.fireworks[i];
        p.start = time;
      } else if (p.dead) {
        this.fireworks.splice(i, 1);
        this.canvas.style.backgroundColor = 'white';
        continue;
      }
      p.draw();
    }

    if (redraw) {
      window.requestAnimationFrame(t => this.draw(t));
    } else {
      this.canvas.style.display = 'none';
    }
  }

  launch() {
    this.newFirework = true;
    if (!this.running) {
      this.running = true;
      this.draw();
      this.canvas.style.display = 'block';
    }
  }

  private get canvas() {
    return this.fireworkCanvas.nativeElement;
  }

}
