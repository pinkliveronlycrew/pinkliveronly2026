// Fonction pour générer un nombre aléatoire entre min et max
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// ⭐ 中央禁區（可調整）
const safeZone = {
  xMin: 30,
  xMax: 70,
  yMin: 30,
  yMax: 70
};

// ⭐ 取得「偏邊緣 + 避開中央」的位置
function getSafePosition() {
  let x, y;

  do {
    // 🔥 這裡就是你問的那段（已幫你放好）
    x = Math.random() < 0.5
      ? getRandom(0, 30)
      : getRandom(70, 100);

    y = getRandom(0, 100);

  } while (
    x > safeZone.xMin &&
    x < safeZone.xMax &&
    y > safeZone.yMin &&
    y < safeZone.yMax
  );

  return { x, y };
}

// Sélectionnez toutes les étoiles
const stars = document.querySelectorAll('.star');

// Appliquez des positions aléatoires à chaque étoile
stars.forEach((star) => {
  const pos = getSafePosition();

  const top = pos.y + 'vh';
  const left = pos.x + 'vw';
  const delay = getRandom(0, 15) + 's';

  star.style.top = top;
  star.style.left = left;
  star.style.animationDelay = delay;
});