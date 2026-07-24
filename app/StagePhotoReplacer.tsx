"use client";

import { useEffect } from "react";
import { STAGE_PHOTOS } from "./stagePhotos";

function replaceStagePhotos(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    ".mutation-stage-visual img",
  );

  images.forEach((image, index) => {
    const source = STAGE_PHOTOS[index];
    if (!source) return;

    if (image.src !== source) {
      image.src = source;
    }

    image.alt = `Фоторегистрация стадии ${index + 1} поглощения Скверной`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.dataset.realStagePhoto = "true";
  });
}

export default function StagePhotoReplacer() {
  useEffect(() => {
    let frame = 0;
    const timers: number[] = [];

    const apply = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(replaceStagePhotos);
    };

    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });

    apply();
    [100, 350, 800, 1600].forEach((delay) => {
      timers.push(window.setTimeout(apply, delay));
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
