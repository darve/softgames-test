import {
  Assets,
  Container,
  Particle,
  ParticleContainer,
  Sprite,
  Texture,
} from "pixi.js";
import { Scene } from "../types";
import Vec from "../lib/vec2";

export const phoenix_flame = async (container: Container): Promise<Scene> => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const flames: any = [];
  container.alpha = 0;

  const particleTextures: Texture[] = await Promise.all([
    Assets.load("/particle-1.png"),
    Assets.load("/particle-2.png"),
    Assets.load("/particle-3.png"),
    Assets.load("/particle-4.png"),
    Assets.load("/particle-5.png"),
    Assets.load("/particle-6.png"),
  ]);

  for (let i = 0; i < 10; ++i) {
    let particle = new flame(
      particleTextures[Math.floor(Math.random() * particleTextures.length)]
    );
    flames.push(particle);
    container.addChild(particle);
  }

  return {
    container,
    reset: () => {},
    update: (delta: number) => {
      flames.map((particle: FlameParticle) => {
        particle.frame++;
        if (particle.frame > particle.life) {
          particle.reset();
        }
        particle.pos.plusEq(particle.direction);
        particle.x = particle.pos.x;
        particle.y = particle.pos.y;
      });
    },
  };
};

interface FlameParticle extends Sprite {
  frame: number;
  inc: number;
  speed: number;
  pos: Vec;
  direction: Vec;
  life: number;
  reset: () => void;
}

class flame extends Sprite {
  frame: number;
  inc: number;
  speed: number;
  pos: Vec;
  direction: Vec;
  life: number;

  constructor(texture: Texture) {
    super(texture);
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.pos = new Vec(this.x, this.y);
    this.frame = Math.random() * Math.PI * 2;
    this.inc = Math.PI / 60;
    this.life = Math.floor(Math.random() * 100);
    this.speed = Math.random() * 2;
    this.direction = new Vec(0, -this.speed);
    this.direction = this.direction.rotate(Math.random() * 1 - 0.5, true);
    this.scale.set(0.5 + Math.random() * 0.5);
    // this.color = 0xd35400; // Orange color for the flame
    // this.tint = 0xd35400;
  }

  reset() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.pos = new Vec(this.x, this.y);
    this.frame = Math.random() * Math.PI * 2;
    this.life = Math.floor(Math.random() * 100);
    this.inc = Math.PI / 60;
    this.speed = Math.random() * 2;
    this.direction = new Vec(0, -this.speed);
    this.direction = this.direction.rotate(Math.random() * 1 - 0.5, true);
  }
}
