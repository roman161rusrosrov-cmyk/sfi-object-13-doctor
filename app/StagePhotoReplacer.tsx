"use client";

import { useEffect } from "react";
import { STAGE_PHOTOS } from "./stagePhotos";

const PHOTO_STYLES = `
  .mutation-stage-visual {
    background: #020305 !important;
    overflow: hidden;
  }

  .mutation-stage-visual img[data-real-stage-photo="true"] {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1672 / 941 !important;
    object-fit: cover !important;
    object-position: center !important;
    image-rendering: auto !important;
    filter: none !important;
    opacity: 1 !important;
    transform: none !important;
    backface-visibility: hidden;
  }
`;

function replaceStagePhotos(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    ".mutation-stage-visual img",
  );

  images.forEach((image, index) => {
    const source = STAGE_PHOTOS[index];
    if (!source) return;

    if (image.getAttribute("src") !== source) {
      image.setAttribute("src", source);
    }

    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.alt = `Оригинальная фотография стадии ${index + 1} поглощения Скверной`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    image.dataset.realStagePhoto = "true";
  });
}

export default function StagePhotoReplacer() {
  useEffect(() => {
    let frame = 0;

    const apply = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(replaceStagePhotos);
    };

    const observer = new MutationObserver(apply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    });

    apply();
    const interval = window.setInterval(apply, 750);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);

  return <style>{PHOTO_STYLES}</style>;
}
