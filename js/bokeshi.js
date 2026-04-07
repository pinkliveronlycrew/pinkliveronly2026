/**
 * Bokeshi (modified)
 * Transparent bokeh effect
 */

var Bokeshi = {
  id: "bokeshi",
  config: {
    FPS: 60,
    num_spheres: 25,
    color_set: {
      num_colors: 3,
      colors: ["250,205,191", "250,205,191", "250,205,191"]
    },
    velocity_x_min: 0.3,
    velocity_x_max: 1.2,
    velocity_y_min: 0.3,
    velocity_y_max: 1.5,
    blur_min: 3,
    blur_max: 12
  },
  spheres: [],
  direction: [],
  colors: [],
  blur: []
};

const FPS = Bokeshi.config.FPS;
var canva = document.getElementById(Bokeshi.id);
var context = canva.getContext("2d");

// ⭐ 裝置判斷（關鍵）
const isMobile = window.innerWidth < 768;
const dpr = window.devicePixelRatio || 1;

// 初始化 canvas 尺寸
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 建立光斑
for (let i = 0; i < Bokeshi.config.num_spheres; i++) {
  let x = getRandom(0, window.innerWidth);
  let y = getRandom(0, window.innerHeight);

  // ⭐ 手機縮小光斑尺寸（關鍵）
  let r = isMobile
    ? getRandom(8, 40)   // 手機：比較小
    : getRandom(10, 70); // 桌機：維持原本

  Bokeshi.spheres[i] = new Sphere(x, y, r);

  Bokeshi.direction[i] = roundInt(getRandom(1, 8));

  Bokeshi.colors[i] = roundInt(
    getRandom(0, Bokeshi.config.color_set.num_colors)
  );

  Bokeshi.blur[i] = roundInt(
    getRandom(Bokeshi.config.blur_min, Bokeshi.config.blur_max)
  );
}

// ⭐ 手機降速（關鍵）
var velocity_x = getRandom(
  isMobile ? 0.15 : Bokeshi.config.velocity_x_min,
  isMobile ? 0.6 : Bokeshi.config.velocity_x_max
);

var velocity_y = getRandom(
  isMobile ? 0.15 : Bokeshi.config.velocity_y_min,
  isMobile ? 0.8 : Bokeshi.config.velocity_y_max
);

// 主迴圈
var BokeshiLoop = setInterval(function () {
  update();
  render();
}, 1000 / FPS);

// 更新位置
function update() {
  for (let i = 0; i < Bokeshi.config.num_spheres; i++) {
    switch (Bokeshi.direction[i]) {
      case 1:
        Bokeshi.spheres[i].x_pos -= velocity_x;
        break;
      case 2:
        Bokeshi.spheres[i].x_pos -= velocity_x;
        Bokeshi.spheres[i].y_pos -= velocity_y;
        break;
      case 3:
        Bokeshi.spheres[i].y_pos -= velocity_y;
        break;
      case 4:
        Bokeshi.spheres[i].x_pos += velocity_x;
        Bokeshi.spheres[i].y_pos -= velocity_y;
        break;
      case 5:
        Bokeshi.spheres[i].x_pos += velocity_x;
        break;
      case 6:
        Bokeshi.spheres[i].x_pos += velocity_x;
        Bokeshi.spheres[i].y_pos += velocity_y;
        break;
      case 7:
        Bokeshi.spheres[i].y_pos += velocity_y;
        break;
      case 8:
        Bokeshi.spheres[i].x_pos -= velocity_x;
        Bokeshi.spheres[i].y_pos += velocity_y;
        break;
    }

    // 超出畫面就換方向
    if (
      Bokeshi.spheres[i].x_pos > window.innerWidth ||
      Bokeshi.spheres[i].x_pos < 0 ||
      Bokeshi.spheres[i].y_pos > window.innerHeight ||
      Bokeshi.spheres[i].y_pos < 0
    ) {
      Bokeshi.direction[i] = roundInt(getRandom(1, 8));
    }
  }
}

// 渲染
function render() {
  context.clearRect(0, 0, canva.width, canva.height);

  context.globalCompositeOperation = "screen";

  for (let i = 0; i < Bokeshi.config.num_spheres; i++) {
    Bokeshi.spheres[i].draw(
      "rgba(" +
        Bokeshi.config.color_set.colors[Bokeshi.colors[i]] +
        ",0.2)",
      Bokeshi.blur[i]
    );
  }

  context.globalCompositeOperation = "source-over";
}

// Sphere
function Sphere(x, y, r) {
  this.x_pos = x;
  this.y_pos = y;
  this.radius = r;
}

Sphere.prototype.draw = function (color, blur) {
  // ⭐ 手機 blur 強化（關鍵）
  let finalBlur = isMobile ? blur * dpr : blur;

  context.filter = "blur(" + finalBlur + "px)";
  context.fillStyle = color;
  context.beginPath();
  context.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2);
  context.fill();
};

// resize
function resizeCanvas() {
  canva.width = window.innerWidth;
  canva.height = window.innerHeight;
}

// 工具
function roundInt(value) {
  return Math.round(value);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}