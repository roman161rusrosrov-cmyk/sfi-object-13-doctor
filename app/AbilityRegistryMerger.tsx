"use client";

import { useEffect } from "react";

const MERGER_STYLES = `
  .integrated-ability-card {
    border-color: rgba(255, 91, 119, .22) !important;
    box-shadow: inset 3px 0 0 rgba(190, 38, 67, .7);
  }

  .integrated-ability-card .ability-power-badge {
    color: #ff9aac;
    border-color: rgba(255, 91, 119, .3);
  }

  .integrated-ability-card .ability-section-buffed {
    border-color: rgba(255, 255, 255, .075);
  }

  .bonus-abilities-wrap[data-integrated="true"] {
    display: none !important;
  }

  @media (max-width: 560px) {
    .integrated-ability-card {
      padding: .9rem !important;
    }
  }
`;

function text(element: Element | null): string {
  return element?.textContent?.trim() ?? "";
}

function convertBonusCard(card: HTMLElement): void {
  if (card.dataset.integrated === "true") return;

  const code = text(card.querySelector(".bonus-ability-top span"));
  const classification = text(card.querySelector(".bonus-ability-top strong"));
  const title = text(card.querySelector("h4"));
  const effect = text(card.querySelector(":scope > p"));
  const unlock = text(card.querySelector(".bonus-unlock"));
  const metrics = Array.from(card.querySelectorAll<HTMLElement>(".bonus-metrics > div"));

  const metricsMarkup = metrics
    .map((metric) => {
      const label = text(metric.querySelector("span"));
      const value = text(metric.querySelector("strong"));
      return `<div class="ability-metric-buffed"><span>${label}</span><strong>${value}</strong></div>`;
    })
    .join("");

  card.className =
    "ability-card ability-card-v2 ability-card-buffed integrated-ability-card";
  card.innerHTML = `
    <div class="ability-card-top">
      <span>${code}</span>
      <strong>${classification}</strong>
    </div>
    <h3>${title}</h3>
    <div class="ability-power-badge">${unlock} // ОСНОВНОЙ РЕЕСТР</div>
    <div class="ability-sections-buffed">
      <div class="ability-section-buffed">
        <span>АНОМАЛЬНЫЙ ЭФФЕКТ</span>
        <p>${effect}</p>
      </div>
    </div>
    <div class="ability-metrics-buffed">${metricsMarkup}</div>`;
  card.dataset.integrated = "true";
  card.dataset.mor13Buffed = "true";
}

function mergeAbilities(): void {
  const primaryGrid = document.querySelector<HTMLElement>(".ability-grid");
  const bonusWrap = document.querySelector<HTMLElement>(".bonus-abilities-wrap");
  const bonusGrid = bonusWrap?.querySelector<HTMLElement>(".bonus-abilities-grid");

  if (!primaryGrid || !bonusWrap || !bonusGrid) return;
  if (bonusWrap.dataset.integrated === "true") return;

  const mainCards = Array.from(
    primaryGrid.querySelectorAll<HTMLElement>(
      ":scope > .ability-card-v2:not(.integrated-ability-card)",
    ),
  ).slice(0, 13);
  const bonusCards = Array.from(
    bonusGrid.querySelectorAll<HTMLElement>(":scope > .bonus-ability-card"),
  );

  if (mainCards.length < 13 || bonusCards.length === 0) return;

  bonusCards.forEach((card, index) => {
    convertBonusCard(card);
    const relatedMainCard = mainCards[index + 1];
    if (relatedMainCard) {
      relatedMainCard.insertAdjacentElement("afterend", card);
    } else {
      primaryGrid.appendChild(card);
    }
  });

  primaryGrid.dataset.fullRegistry = "true";
  primaryGrid.setAttribute(
    "aria-label",
    "Основной реестр из двадцати пяти аномальных способностей",
  );
  bonusWrap.dataset.integrated = "true";
  bonusWrap.replaceChildren();
}

export default function AbilityRegistryMerger() {
  useEffect(() => {
    let frame = 0;

    const apply = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(mergeAbilities);
    };

    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    apply();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <style>{MERGER_STYLES}</style>;
}
