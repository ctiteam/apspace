import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FireworksSettings } from 'src/app/interfaces/fireworks-settings';

class Particle {
  x: number;
  y: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  radius: number;
  angle: number;
  speed: number;
  initialVelocityX: number;
  initialVelocityY: number;
  velocityX: number;
  velocityY: number;
  startTime: number;
  duration: number;
  currentDuration: number;
  dampening: number;
  colour;

  constructor(
    x = 0,
    y = 0,
    // tslint:disable-next-line: no-bitwise
    red = ~~(Math.random() * 255),
    // tslint:disable-next-line: no-bitwise
    green = ~~(Math.random() * 255),
    // tslint:disable-next-line: no-bitwise
    blue = ~~(Math.random() * 255),
    speed,
    FIREWORK_LIFESPAN,
    isFixedSpeed?
  ) {

    this.x = x;
    this.y = y;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = 0.05;
    this.radius = 1 + Math.random();
    this.angle = Math.random() * 360;
    this.speed = (Math.random() * speed) + 0.1;
    this.velocityX = Math.cos(this.angle) * this.speed;
    this.velocityY = Math.sin(this.angle) * this.speed;
    this.startTime = (new Date()).getTime();
    this.duration = Math.random() * 300 + FIREWORK_LIFESPAN;
    this.currentDuration = 0;
    this.dampening = 30; // slowing factor at the end

    this.colour = this.getColour();

    if (isFixedSpeed) {
      this.speed = speed;
      this.velocityY = Math.sin(this.angle) * this.speed;
      this.velocityX = Math.cos(this.angle) * this.speed;
    }

    this.initialVelocityX = this.velocityX;
    this.initialVelocityY = this.velocityY;

  }

  animate(PARTICLE_INITIAL_SPEED, GRAVITY) {

    this.currentDuration = (new Date()).getTime() - this.startTime;

    // initial speed kick
    if (this.currentDuration <= 200) {

      this.x += this.initialVelocityX * PARTICLE_INITIAL_SPEED;
      this.y += this.initialVelocityY * PARTICLE_INITIAL_SPEED;
      this.alpha += 0.01;

      this.colour = this.getColour(240, 240, 240, 0.9);

    } else {

      // normal expansion
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.colour = this.getColour(this.red, this.green, this.blue, 0.4 + (Math.random() * 0.3));

    }

    this.velocityY += GRAVITY / 1000;

    // slow down particles at the end
    if (this.currentDuration >= this.duration) {
      this.velocityX -= this.velocityX / this.dampening;
      this.velocityY -= this.velocityY / this.dampening;
    }

    if (this.currentDuration >= this.duration + this.duration / 1.1) {

      // fade out at the end
      this.alpha -= 0.02;
      this.colour = this.getColour();

    } else {

      // fade in during expansion
      if (this.alpha < 1) {
        this.alpha += 0.03;
      }

    }
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.lineWidth = ctx.lineWidth;
    ctx.fillStyle = this.colour;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.getColour(this.red + 150, this.green + 150, this.blue + 150, 1);
    ctx.fill();
  }

  getColour(red?, green?, blue?, alpha?) {
    return `rgba(${red || this.red}, ${green || this.green}, ${blue || this.blue}, ${alpha || this.alpha})`;
  }

}

@Component({
  selector: 'app-fireworks',
  templateUrl: './fireworks.component.html',
  styleUrls: ['./fireworks.component.scss'],
})

export class FireworksComponent implements AfterViewInit {
  PARTICLES_PER_FIREWORK = 100; // 100 - 400 or try 1000
  FIREWORK_CHANCE = 0.1; // percentage, set to 0 and click instead
  BASE_PARTICLE_SPEED = 1; // between 0-4, controls the size of the overall fireworks
  FIREWORK_LIFESPAN = 200; // ms
  PARTICLE_INITIAL_SPEED = 6; // 2-8

  // not so fun options =\
  GRAVITY = 2.8;

  @Input() fireworksSettings: FireworksSettings;
  @ViewChild('fireworks', { static: true }) fireworksCanvas: ElementRef;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  requestId;

  particles: Particle[] = [];
  disableAutoFireworks = false;
  resetDisable;

  hideFireworks = true;

  // settings from @Input fireworksSettings
  settingWrapper;
  settingLaunchImage;
  settingFontStyle;

  constructor() {}

  ngAfterViewInit() {
    this.canvas = this.fireworksCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.setFireworksSettings(); // execute to set firework settings
  }

  setFireworksSettings() {
    // tslint:disable-next-line: object-literal-key-quotes
    this.settingWrapper = {'background': this.fireworksSettings.backgroundColor};

    this.settingLaunchImage = {
      // tslint:disable-next-line: object-literal-key-quotes
      'top': this.fireworksSettings.launchImageStyle.top,
      // tslint:disable-next-line: object-literal-key-quotes
      'left': this.fireworksSettings.launchImageStyle.left,
      // tslint:disable-next-line: object-literal-key-quotes
      'width': this.fireworksSettings.launchImageStyle.width
    };

    this.settingFontStyle = {
      // tslint:disable-next-line: object-literal-key-quotes
      'color': this.fireworksSettings.fontStyle.color,
      'text-shadow': this.fireworksSettings.fontStyle.textShadow,
      'font-family': this.fireworksSettings.fontStyle.fontFamily,
      'font-size': this.fireworksSettings.fontStyle.fontSize
    };
  }

  loop = () => {
    if (!this.disableAutoFireworks && Math.random() < this.FIREWORK_CHANCE) {
      this.createFirework();
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, i) => {
      particle.animate(this.PARTICLE_INITIAL_SPEED, this.GRAVITY);
      particle.render(this.ctx);
      if (particle.y > this.canvas.height
        || particle.x < 0
        || particle.x > this.canvas.width
        || particle.alpha <= 0
      ) {
        this.particles.splice(i, 1);
      }
    });

    this.requestId = requestAnimationFrame(this.loop);
  }

  createFirework(
    x = Math.random() * this.canvas.width,
    y = Math.random() * this.canvas.height
  ) {

    const speed = (Math.random() * 2) + this.BASE_PARTICLE_SPEED;
    let maxSpeed = speed;

    // tslint:disable-next-line: no-bitwise
    let red = ~~(Math.random() * 255);
    // tslint:disable-next-line: no-bitwise
    let green = ~~(Math.random() * 255);
    // tslint:disable-next-line: no-bitwise
    let blue = ~~(Math.random() * 255);

    // use brighter colours
    red = (red > 150 ? red + 150 : red);
    green = (green > 150 ? green + 150 : green);
    blue = (blue > 150 ? blue + 150 : blue);

    // inner firework
    for (let i = 0; i < this.PARTICLES_PER_FIREWORK; i++) {
      const particle = new Particle(x, y, red, green, blue, speed, this.FIREWORK_LIFESPAN);
      this.particles.push(particle);

      maxSpeed = (speed > maxSpeed ? speed : maxSpeed);
    }

    // outer edge particles to make the firework appear more full
    for (let i = 0; i < 40; i++) {
      const particle = new Particle(x, y, red, green, blue, maxSpeed, this.FIREWORK_LIFESPAN, true);
      this.particles.push(particle);
    }
  }

  temporaryDisableAutoFireworks() {
    this.disableAutoFireworks = true;
    clearTimeout(this.resetDisable);
    this.resetDisable = setTimeout(() => {
      this.disableAutoFireworks = false;
    }, 5000);
  }

  updateCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateCanvasSize();
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    this.createFirework(event.clientX, event.clientY);
    this.temporaryDisableAutoFireworks();
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event) {
    this.createFirework(event.clientX, event.clientY);
    this.temporaryDisableAutoFireworks();
  }

  launchFireworks() {
    this.updateCanvasSize();
    this.loop();
    this.hideFireworks = false;
  }

  terminateFireworks() {
    cancelAnimationFrame(this.requestId);
    this.hideFireworks = true;
  }
}


