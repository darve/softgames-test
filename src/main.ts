import { Application, Container, Ticker, Graphics } from "pixi.js";
import { ace_of_shadows } from "./scenes/ace-of-shadows";
import { magic_words } from "./scenes/magic-words";
import { phoenix_flame } from "./scenes/phoenix-flame";
import { Scene } from "./types";
import { quick_button, quick_sprite } from "./lib/utils";
import { Transition } from "./lib/transition";
import Stats from "stats.js";

const get_positions = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    hello: h * 0.4,
    buttons: h * 0.75,
  };
};

(async () => {
  const transitions: any[] = [];
  const app = new Application();
  await app.init({
    canvas: document.querySelector("#pixi-canvas") as HTMLCanvasElement,
    background: "#3498DB",
    resizeTo: window,
  });

  const containers = {
    ui: new Container(),
    ace_of_shadows: new Container(),
    magic_words: new Container(),
    phoenix_flame: new Container(),
  };

  const scenes = {
    ace_of_shadows: await ace_of_shadows(containers.ace_of_shadows),
    magic_words: await magic_words(containers.magic_words),
    phoenix_flame: await phoenix_flame(containers.phoenix_flame),
  } as const;

  let active_scene: any = null;
  let animating = false;
  const stats = new Stats();
  stats.showPanel(0); // 0 = FPS
  document.body.appendChild(stats.dom);

  const ticker = new Ticker();
  ticker.add((ticker) => {
    stats.begin();
    if (active_scene) {
      active_scene.update(ticker.deltaTime);
    }

    transitions.map((t, i) => {
      t.tick();
      if (t.dead) transitions.splice(i, 1);
    });
    stats.end();
  });

  /**
   * Initialize our menu entities
   */
  const hello = await quick_sprite("/hello.png");
  const btn_ace_of_shadows = await quick_sprite("/button-ace-of-shadows.png");
  const btn_magic_words = await quick_sprite("/button-magic-words.png");
  const btn_phoenix_flame = await quick_sprite("/button-phoenix-flame.png");
  const btn_menu = await quick_sprite("/button-menu.png");

  containers.ui.addChild(btn_ace_of_shadows);
  containers.ui.addChild(btn_magic_words);
  containers.ui.addChild(btn_phoenix_flame);
  containers.ui.addChild(btn_menu);

  quick_button(
    btn_ace_of_shadows,
    app.screen.width / 2 - btn_magic_words.width - 32,
    app.screen.height + app.screen.height / 2 + 100
  );
  btn_ace_of_shadows.on("pointerdown", async () => {
    await menu_hide();
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: 0,
        finish: 1,
        step: (v) => {
          containers.ace_of_shadows.alpha = v;
        },
        cb: () => {
          show_btn_menu();
          active_scene = scenes.ace_of_shadows;
        },
      })
    );
  });

  quick_button(
    btn_magic_words,
    app.screen.width / 2,
    app.screen.height + app.screen.height / 2 + 100
  );
  btn_magic_words.on("pointerdown", async () => {
    await menu_hide();
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: 0,
        finish: 1,
        step: (v) => {
          containers.magic_words.alpha = v;
        },
        cb: () => {
          show_btn_menu();
          active_scene = scenes.magic_words;
        },
      })
    );
  });

  quick_button(
    btn_phoenix_flame,
    app.screen.width / 2 + btn_magic_words.width + 20,
    app.screen.height + app.screen.height / 2 + 100
  );
  btn_phoenix_flame.on("pointerdown", async () => {
    await menu_hide();
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: 0,
        finish: 1,
        step: (v) => {
          containers.phoenix_flame.alpha = v;
        },
        cb: () => {
          show_btn_menu();
          active_scene = scenes.phoenix_flame;
        },
      })
    );
  });

  quick_button(btn_menu, -(40 + btn_menu.width / 2), 40 + btn_menu.height / 2);
  btn_menu.on("pointerdown", async () => {
    hide_btn_menu();
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: 1,
        finish: 0,
        step: (v) => {
          active_scene.container.alpha = v;
        },
        cb: () => {
          active_scene = null;
          menu_show();
        },
      })
    );
  });

  containers.ui.addChild(hello);
  hello.anchor.set(0.5);
  hello.x = app.screen.width / 2;
  hello.y = -app.screen.height / 2;

  const menu_show = async (): Promise<void> => {
    const pos = get_positions();
    hello.x = app.screen.width / 2;
    hello.y = -app.screen.height / 2;

    return new Promise((resolve) => {
      transitions.push(
        new Transition({
          delay: 0,
          duration: 100,
          start: -app.screen.height / 2,
          finish: pos.hello,
          step: (v) => {
            hello.y = v;
          },
          cb: () => {
            animating = false;
          },
        })
      );

      transitions.push(
        new Transition({
          delay: 0,
          duration: 100,
          start: app.screen.height + app.screen.height / 2,
          finish: pos.buttons,
          step: (v) => {
            btn_ace_of_shadows.y = v;
            btn_magic_words.y = v;
            btn_phoenix_flame.y = v;
          },
          cb: () => {
            animating = false;
            resolve();
          },
        })
      );
    });
  };

  const show_btn_menu = async (): Promise<void> => {
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: -Number(40 + btn_menu.width / 2),
        finish: Number(40 + btn_menu.width / 2),
        step: (v) => {
          btn_menu.x = v;
        },
      })
    );
  };

  const hide_btn_menu = async (): Promise<void> => {
    transitions.push(
      new Transition({
        delay: 0,
        duration: 100,
        start: Number(40 + btn_menu.width / 2),
        finish: -Number(40 + btn_menu.width / 2),
        step: (v) => {
          btn_menu.x = v;
        },
      })
    );
  };

  const menu_hide = async (): Promise<void> => {
    const pos = get_positions();
    hello.x = app.screen.width / 2;
    hello.y = pos.hello;

    return new Promise((resolve) => {
      transitions.push(
        new Transition({
          delay: 0,
          duration: 100,
          start: pos.hello,
          finish: -app.screen.height / 2,
          step: (v) => {
            hello.y = v;
          },
        })
      );

      transitions.push(
        new Transition({
          delay: 0,
          duration: 100,
          start: pos.buttons,
          finish: app.screen.height + app.screen.height / 2,
          step: (v) => {
            btn_ace_of_shadows.y = v;
            btn_magic_words.y = v;
            btn_phoenix_flame.y = v;
          },
          cb: () => {
            animating = false;
            resolve();
          },
        })
      );
    });
  };

  const init = async () => {
    app.stage.addChild(containers.ace_of_shadows);
    app.stage.addChild(containers.magic_words);
    app.stage.addChild(containers.phoenix_flame);
    app.stage.addChild(containers.ui);
    menu_show();
    ticker.start();
  };

  init();
})();
