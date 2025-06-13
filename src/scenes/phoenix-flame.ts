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
  const w2 = w / 2;
  const h2 = h / 2;
  const flames: any = [];
  container.alpha = 0;

  const particles = new ParticleContainer({
    dynamicProperties: {
      position: true, // Allow dynamic position changes (default)
      scale: false, // Static scale for extra performance
      rotation: true, // Static rotation
      color: true, // Static color
      tint: true,
      uv: true,
    },
  });

  const particleTextures: Texture[] = await Promise.all([
    Assets.load("/particle-1.png"),
    Assets.load("/particle-2.png"),
    Assets.load("/particle-3.png"),
    Assets.load("/particle-4.png"),
    Assets.load("/particle-5.png"),
    Assets.load("/particle-6.png"),
  ]);

  const particleTexture = await Assets.load("/particle.png");

  for (let i = 0; i < 100; ++i) {
    let particle = new flame(
      particleTextures[Math.floor(Math.random() * particleTextures.length)]
    );
    flames.push(particle);
    particles.addParticle(particle);
  }

  container.addChild(particles);

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

interface FlameParticle extends Particle {
  frame: number;
  inc: number;
  speed: number;
  pos: Vec;
  direction: Vec;
  reset: () => void;
}

class flame extends Particle {
  frame: number;
  inc: number;
  speed: number;
  pos: Vec;
  direction: Vec;
  life: number;

  constructor(texture: Texture) {
    super(texture);
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight;
    this.pos = new Vec(this.x, this.y);
    this.frame = Math.random() * Math.PI * 2;
    this.inc = Math.PI / 60;
    this.life = Math.floor(Math.random() * 100);
    this.speed = Math.random();
    this.direction = new Vec(0, -this.speed);
    this.direction = this.direction.rotate(Math.random() * 1 - 0.5, true);
    // this.color = 0xd35400; // Orange color for the flame
    // this.tint = 0xd35400;
  }

  reset() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight;
    this.pos = new Vec(this.x, this.y);
    this.frame = Math.random() * Math.PI * 2;
    this.inc = Math.PI / 60;
    this.speed = Math.random() * 10;
    this.direction = new Vec(0, -this.speed);
    this.direction = this.direction.rotate(Math.random() * 1 - 0.5, true);
  }
}
