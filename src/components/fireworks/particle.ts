import { FireworksComponent } from './fireworks';
import { Vector } from './vector';

export class Particle {
  pos: Vector;
  vel: Vector;
  dead = false;
  start = 0;
  comp: FireworksComponent;

  constructor(pos: Vector, vel: Vector, comp: FireworksComponent) {
    this.pos = new Vector(pos.x, pos.y);
    this.vel = vel;
    this.comp = comp;
  }

  update(time) {
    const timeSpan = time - this.start;

    if (timeSpan > 500) {
      this.dead = true;
    }

    if (!this.dead) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + this.comp.gravity;
    }
  }

  draw() {
    if (!this.dead) {
      this.comp.drawDot(this.pos.x, this.pos.y, 1);
    }
  }
}
