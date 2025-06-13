export default class Vec {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  reset(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  resize(len: number): this {
    return this.normalise().multiplyEq(len);
  }

  _resize(len: number): Vec {
    return new Vec(this.x, this.y).normalise().multiplyEq(len);
  }

  distance(target: Vec): number {
    return this.minusNew(target).magnitude();
  }

  direction(target: Vec): Vec {
    return this.minusNew(target).normalise();
  }

  projectNew(vec: Vec, distance: number): Vec {
    const newVec = new Vec(this.x, this.y);
    newVec.plusEq(vec.clone().normalise().multiplyEq(distance));
    return newVec;
  }

  directionNew(vec: Vec): Vec {
    return new Vec(this.x, this.y).minusNew(vec).normalise();
  }

  toString(decPlaces: number = 3): string {
    const scalar = Math.pow(10, decPlaces);
    return `[${Math.round(this.x * scalar) / scalar}, ${Math.round(this.y * scalar) / scalar}]`;
  }

  clone(): Vec {
    return new Vec(this.x, this.y);
  }

  copyTo(v: Vec): void {
    v.x = this.x;
    v.y = this.y;
  }

  copyFrom(v: Vec): void {
    this.x = v.x;
    this.y = v.y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magnitude(): number {
    return this.length();
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalise(): this {
    const m = this.magnitude();
    if (m !== 0) {
      this.x /= m;
      this.y /= m;
    }
    return this;
  }

  normaliseNew(): Vec {
    return this.clone().normalise();
  }

  reverse(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  plusEq(v: Vec): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  plusNew(v: Vec): Vec {
    return new Vec(this.x + v.x, this.y + v.y);
  }

  minusEq(v: Vec): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  minusNew(v: Vec): Vec {
    return new Vec(this.x - v.x, this.y - v.y);
  }

  multiplyEq(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  multiplyNew(scalar: number): Vec {
    return this.clone().multiplyEq(scalar);
  }

  divideEq(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  divideNew(scalar: number): Vec {
    return this.clone().divideEq(scalar);
  }

  dot(v: Vec): number {
    return this.x * v.x + this.y * v.y;
  }

  angle(useRadians: boolean = false): number {
    return Math.atan2(this.y, this.x) * (useRadians ? 1 : VecConst.TO_DEGREES);
  }

  rotate(angle: number, useRadians: boolean = false): this {
    const cosRY = Math.cos(angle * (useRadians ? 1 : VecConst.TO_RADIANS));
    const sinRY = Math.sin(angle * (useRadians ? 1 : VecConst.TO_RADIANS));

    const tempX = this.x;
    const tempY = this.y;

    this.x = tempX * cosRY - tempY * sinRY;
    this.y = tempX * sinRY + tempY * cosRY;

    return this;
  }

  equals(v: Vec): boolean {
    return this.x === v.x && this.y === v.y;
  }

  isCloseTo(v: Vec, tolerance: number): boolean {
    if (this.equals(v)) return true;
    const temp = this.clone().minusEq(v);
    return temp.magnitudeSquared() < tolerance * tolerance;
  }

  rotateAroundPoint(
    point: Vec,
    angle: number,
    useRadians: boolean = false
  ): void {
    const temp = this.clone()
      .minusEq(point)
      .rotate(angle, useRadians)
      .plusEq(point);
    this.copyFrom(temp);
  }

  isMagLessThan(distance: number): boolean {
    return this.magnitudeSquared() < distance * distance;
  }

  isMagGreaterThan(distance: number): boolean {
    return this.magnitudeSquared() > distance * distance;
  }
}

const VecConst = {
  TO_DEGREES: 180 / Math.PI,
  TO_RADIANS: Math.PI / 180,
};
