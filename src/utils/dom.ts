const setFont = () => {
  let screenWidth = document.querySelector("html")!.offsetWidth;
  const baseSz = 100;
  const pageWidth = 1534;
  if (screenWidth > 640) screenWidth = 640;

  let fZ = (baseSz * screenWidth) / pageWidth;
  if (fZ > 85) fZ = 85;
  document.querySelector("html")!.style.fontSize = `${fZ}px`;
};

export const setRemUnit = () => {
  if (!window.addEventListener) return;
  document.addEventListener("DOMContentLoaded", setFont, false);
  window.addEventListener("resize", setFont, false);
  window.addEventListener("load", setFont, false);
};

export const loadImg = (url: string) => {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({ code: 200, msg: "success" });
    };
    img.onerror = () => {
      reject({ code: 500, msg: "error" });
    };
  });
};
