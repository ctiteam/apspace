import { FireworksComponent } from './fireworks';
import { Particle } from './particle';
import { Vector } from './vector';

export class Firework {
  pos: Vector;
  vel: Vector;
  comp: FireworksComponent;

  size = 4;

  exParticles = [];
  exPLen = 100;
  color: string;

  dead = false;
  start = 0;
  rootShow = true;

  constructor(x: number, y: number, comp: FireworksComponent) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, -this.rndNum(10) - 3);
    this.color = 'hsl(' + this.rndNum(360) + ', 100%, 50%)';
    this.comp = comp;
  }

  update(time) {
    if (this.dead) {
      return;
    }

    this.rootShow = this.vel.y < 0;

    if (this.rootShow) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + this.comp.gravity;
    } else {
      if (this.exParticles.length === 0) {
        this.comp.flash = true;
        for (let i = 0; i < this.exPLen; i++) {
          this.exParticles.push(new Particle(this.pos,
            new Vector(-this.rndNum(10) + 5, -this.rndNum(10) + 5), this.comp));
          this.exParticles[this.exParticles.length - 1].start = time;
        }
      }
      let numOfDead = 0;
      for (let i = 0; i < this.exPLen; i++) {
        const p = this.exParticles[i];
        p.update(time);
        if (p.dead) {
          numOfDead++;
        }
      }

      if (numOfDead === this.exPLen) {
        this.dead = true;
      }

    }
  }

  draw() {
    if (this.dead) {
      return;
    }

    this.comp.ctx.fillStyle = this.color;
    if (this.rootShow) {
      this.comp.drawDot(this.pos.x, this.pos.y, this.size);
    } else {
      for (let i = 0; i < this.exPLen; i++) {
        const p = this.exParticles[i];
        p.draw();
      }
    }
  }

  private rndNum(num) {
    return Math.random() * num + 1;
  }
}
