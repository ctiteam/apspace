export class Vector {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector) {
    this.x += other.x;
    this.y += other.y;
  }
}
