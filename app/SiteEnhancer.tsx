"use client";

import { useEffect } from "react";

type Ability = {
  stage: string;
  code: string;
  title: string;
  classification: string;
  effect: string;
  cost: string;
  cooldown: string;
  limit: string;
  risk: string;
};

const ABILITIES: Ability[] = [
  {
    stage: "I",
    code: "MOR‑01",
    title: "Импульс Скверны",
    classification: "МОБИЛЬНОСТЬ / УСИЛЕНИЕ",
    effect:
      "Доктор совершает взрывной рывок на 8–12 метров либо на 12 секунд усиливает мышечную мощь примерно на 45%. Режим выбирается перед активацией; совместить оба эффекта нельзя.",
    cost: "6% резерва Скверны",
    cooldown: "35 секунд",
    limit: "До 4 применений за 10 минут",
    risk: "+0,3% прогрессии при повторе без отдыха",
  },
  {
    stage: "II",
    code: "MOR‑02",
    title: "Чёрная регенерация",
    classification: "ВОССТАНОВЛЕНИЕ",
    effect:
      "Скверна временно сшивает порезы, ожоги и мышечные разрывы. Тяжёлые повреждения не исчезают, а стабилизируются до оказания медицинской помощи.",
    cost: "10% резерва Скверны",
    cooldown: "4 минуты",
    limit: "Не восстанавливает органы и конечности",
    risk: "+0,6% прогрессии за тяжёлую стабилизацию",
  },
  {
    stage: "III",
    code: "MOR‑03",
    title: "Хищное восприятие",
    classification: "СЕНСОРИКА",
    effect:
      "На 25 секунд выделяет живые цели по сердцебиению, температуре и движению в радиусе 35 метров, включая цели за тонкими препятствиями.",
    cost: "5% резерва Скверны",
    cooldown: "70 секунд",
    limit: "Ложные сигналы рядом с сильными аномалиями",
    risk: "+0,2% прогрессии при перегрузке слуха",
  },
  {
    stage: "IV",
    code: "MOR‑04",
    title: "Костяной заслон",
    classification: "ЗАЩИТА",
    effect:
      "Формирует на предплечьях и груди временные пластины, снижающие урон от пуль, осколков и ударов в течение 18 секунд.",
    cost: "14% резерва Скверны",
    cooldown: "3 минуты",
    limit: "Снижает скорость на 20%",
    risk: "+0,8% прогрессии при разрушении пластин",
  },
  {
    stage: "V",
    code: "MOR‑05",
    title: "Крюк тёмной плоти",
    classification: "КОНТРОЛЬ",
    effect:
      "Выбрасывает органический жгут на дистанцию до 16 метров, позволяя притянуть предмет, сбить цель с ног или резко подтянуть самого носителя к опоре.",
    cost: "12% резерва Скверны",
    cooldown: "55 секунд",
    limit: "Не удерживает массу свыше 240 кг",
    risk: "+0,5% прогрессии при контакте с живой целью",
  },
  {
    stage: "VI",
    code: "MOR‑06",
    title: "Зона подавления",
    classification: "ПСИХОАКТИВНОЕ ПОЛЕ",
    effect:
      "На 20 секунд создаёт вокруг Доктора область радиусом 9 метров, вызывающую у противников дезориентацию, дрожь и замедление реакции.",
    cost: "18% резерва Скверны",
    cooldown: "5 минут",
    limit: "Союзники без защиты также ощущают эффект",
    risk: "+1,1% прогрессии за полную длительность",
  },
  {
    stage: "VII",
    code: "MOR‑07",
    title: "Теневой двойник",
    classification: "ОБМАН / РАЗВЕДКА",
    effect:
      "Создаёт на 30 секунд полуматериальную копию, повторяющую последние движения Доктора и способную отвлекать наблюдателей и датчики движения.",
    cost: "16% резерва Скверны",
    cooldown: "6 минут",
    limit: "Двойник не наносит прямой урон",
    risk: "+0,9% прогрессии при уничтожении двойника",
  },
  {
    stage: "VIII",
    code: "MOR‑08",
    title: "Разрыв охотника",
    classification: "ПРОСТРАНСТВЕННЫЙ СКАЧОК",
    effect:
      "Открывает краткий проход между двумя видимыми точками на расстоянии до 28 метров. Проход существует 2,5 секунды и пропускает только Доктора.",
    cost: "22% резерва Скверны",
    cooldown: "7 минут",
    limit: "Нельзя открыть сквозь экранированную аномальную зону",
    risk: "+1,4% прогрессии за каждый скачок",
  },
  {
    stage: "IX",
    code: "MOR‑09",
    title: "Метка преследования",
    classification: "ОХОТА",
    effect:
      "После касания помечает одну цель на 12 минут. Носитель чувствует направление до неё в пределах 700 метров, но не получает точных координат.",
    cost: "9% резерва Скверны",
    cooldown: "10 минут",
    limit: "Одновременно активна только одна метка",
    risk: "+0,7% прогрессии при длительном преследовании",
  },
  {
    stage: "X",
    code: "MOR‑10",
    title: "Пасть тумана",
    classification: "ЗАХВАТ ТЕРРИТОРИИ",
    effect:
      "Заполняет область радиусом 18 метров густым чёрным туманом на 40 секунд. Доктор видит внутри, остальные теряют ориентацию и дальность обзора.",
    cost: "26% резерва Скверны",
    cooldown: "12 минут",
    limit: "Сильный ветер сокращает длительность вдвое",
    risk: "+1,8% прогрессии при максимальной площади",
  },
  {
    stage: "XI",
    code: "MOR‑11",
    title: "Насильственная адаптация",
    classification: "ЭВОЛЮЦИОННАЯ ЗАЩИТА",
    effect:
      "После получения повторяющегося типа урона Скверна на 90 секунд формирует сопротивление именно этому воздействию, снижая последующий урон до 35%.",
    cost: "30% резерва Скверны",
    cooldown: "20 минут",
    limit: "Только один тип сопротивления одновременно",
    risk: "+2,4% прогрессии и временная потеря речи",
  },
  {
    stage: "XII",
    code: "MOR‑12",
    title: "Аватар бесконечной охоты",
    classification: "ТЕРМИНАЛЬНОЕ УСИЛЕНИЕ",
    effect:
      "На 45 секунд превращает носителя в боевую форму: скорость, сила и регенерация резко возрастают, а большинство болевых ограничителей отключается.",
    cost: "55% резерва Скверны",
    cooldown: "Не чаще одного раза в 24 часа",
    limit: "После завершения — потеря сознания на 5–15 минут",
    risk: "+5% прогрессии; возможен досрочный переход к XIII стадии",
  },
  {
    stage: "XIII",
    code: "MOR‑13",
    title: "Последний переход",
    classification: "НЕОБРАТИМЫЙ ФЕНОМЕН",
    effect:
      "Скверна раскрывает постоянный разлом и забирает Доктора в собственный мир бесконечной охоты. Возврат не подтверждён; тело и сознание становятся частью чужой экосистемы.",
    cost: "Полная утрата контроля",
    cooldown: "Отсутствует",
    limit: "Активация считается исчезновением объекта",
    risk: "100% поглощение Скверной",
  },
];

const STAGE_TITLES = [
  "Первичное пробуждение",
  "Внутренняя перестройка",
  "Пробуждение хищника",
  "Бронирование тканей",
  "Рост проводников",
  "Психическое заражение",
  "Раздвоение силуэта",
  "Прорыв пространства",
  "Инстинкт преследования",
  "Приход чёрного тумана",
  "Насильственная эволюция",
  "Форма охотника",
  "Поглощение миром Скверны",
];

const ENHANCEMENT_STYLES = `
  .ability-card-v2 { position: relative; overflow: hidden; }
  .ability-card-v2::after { content: ""; position: absolute; inset: auto -20% -45% 35%; height: 170px; background: radial-gradient(circle, rgba(167, 31, 60, .2), transparent 66%); pointer-events: none; }
  .ability-stage-line { display: flex; justify-content: space-between; gap: 12px; margin: 14px 0 0; padding-top: 12px; border-top: 1px solid rgba(210, 49, 77, .2); font-family: var(--font-geist-mono), monospace; font-size: 11px; letter-spacing: .12em; color: #d9a6b0; }
  .ability-metrics-v2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 16px; }
  .ability-metric-v2 { min-height: 76px; padding: 11px; border: 1px solid rgba(255,255,255,.08); background: rgba(4,5,8,.48); }
  .ability-metric-v2 span { display: block; margin-bottom: 7px; color: #8d919d; font: 10px/1.2 var(--font-geist-mono), monospace; letter-spacing: .13em; }
  .ability-metric-v2 strong { display: block; color: #eceef3; font-size: 12px; line-height: 1.45; }
  .stage-unlock-panel { margin-top: 22px; border: 1px solid rgba(213, 43, 73, .34); background: linear-gradient(135deg, rgba(42,7,15,.72), rgba(6,7,11,.88)); box-shadow: inset 3px 0 0 #b72543, 0 18px 45px rgba(0,0,0,.2); }
  .stage-unlock-head { display: flex; justify-content: space-between; gap: 14px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.08); font-family: var(--font-geist-mono), monospace; }
  .stage-unlock-head span { color: #ff6b86; font-size: 11px; letter-spacing: .12em; }
  .stage-unlock-head strong { color: #a8abb4; font-size: 10px; letter-spacing: .08em; }
  .stage-unlock-body { padding: 16px; }
  .stage-unlock-body h5 { margin: 0 0 8px; color: #fff; font-size: 18px; }
  .stage-unlock-body p { margin: 0; color: #c7c9d0; line-height: 1.62; }
  .stage-unlock-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 13px; }
  .stage-unlock-tags span { padding: 6px 8px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.035); color: #e4b7c0; font: 10px/1 var(--font-geist-mono), monospace; letter-spacing: .08em; }
  .mutation-stage-visual img { image-rendering: auto; filter: contrast(1.06) saturate(1.08); }
  .mutation-stage[data-mor13-enhanced="true"] .mutation-stage-heading::after { content: "НОВАЯ СПОСОБНОСТЬ РАЗБЛОКИРОВАНА"; display: inline-flex; margin-top: 9px; padding: 5px 8px; border: 1px solid rgba(255,73,103,.35); color: #ff8298; font: 9px/1 var(--font-geist-mono), monospace; letter-spacing: .12em; }
  @media (max-width: 720px) { .ability-metrics-v2 { grid-template-columns: 1fr; } .stage-unlock-head { flex-direction: column; } }
`;

function metric(label: string, value: string): string {
  return `<div class="ability-metric-v2"><span>${label}</span><strong>${value}</strong></div>`;
}

function abilityCard(ability: Ability): HTMLElement {
  const section = document.createElement("section");
  section.className = "ability-card ability-card-v2";
  section.innerHTML = `
    <div class="ability-card-top"><span>${ability.code}</span><strong>${ability.classification}</strong></div>
    <h3>${ability.title}</h3>
    <p>${ability.effect}</p>
    <div class="ability-stage-line"><span>РАЗБЛОКИРОВКА: СТАДИЯ ${ability.stage}</span><span>13‑LEVEL PROGRESSION</span></div>
    <div class="ability-metrics-v2">
      ${metric("ЦЕНА", ability.cost)}
      ${metric("ОТКАТ", ability.cooldown)}
      ${metric("ЛИМИТ", ability.limit)}
      ${metric("РИСК СКВЕРНЫ", ability.risk)}
    </div>
  `;
  return section;
}

function stageArtwork(stage: number): string {
  const ability = ABILITIES[stage - 1];
  const progress = Math.round((stage / 13) * 100);
  const veinCount = Math.min(14, stage + 2);
  const veins = Array.from({ length: veinCount }, (_, index) => {
    const offset = index * 27;
    const x1 = 715 + ((index % 4) - 1.5) * 42;
    const y1 = 250 + index * 24;
    const x2 = 830 + Math.sin(index * 1.7) * (70 + stage * 4);
    const y2 = 390 + offset;
    return `<path d="M ${x1} ${y1} Q ${770 + Math.cos(index) * 110} ${y1 + 70}, ${x2} ${Math.min(y2, 820)}" />`;
  }).join("");
  const echoes = stage >= 7
    ? `<g opacity="${Math.min(.48, stage * .035)}" filter="url(#blur)">
        <path d="M600 778 Q615 500 670 338 Q720 250 786 338 Q844 500 862 778 Z" fill="#4b0718" transform="translate(-${stage * 12} 0)" />
        <path d="M600 778 Q615 500 670 338 Q720 250 786 338 Q844 500 862 778 Z" fill="#24103d" transform="translate(${stage * 13} 0)" />
      </g>`
    : "";
  const hooks = stage >= 10
    ? `<g stroke="#090a0d" stroke-width="18" fill="none" opacity=".9">
        <path d="M180 820 Q210 430 335 170 Q410 55 495 132 Q533 168 487 207 Q430 247 379 202" />
        <path d="M1490 830 Q1455 450 1345 205 Q1280 76 1193 144 Q1157 178 1202 218 Q1250 260 1305 219" />
      </g>`
    : "";
  const portal = stage === 13
    ? `<ellipse cx="835" cy="482" rx="420" ry="330" fill="none" stroke="#8e1431" stroke-width="28" opacity=".34" filter="url(#glow)" />
       <ellipse cx="835" cy="482" rx="350" ry="275" fill="#030306" opacity=".84" />
       <path d="M505 170 Q835 25 1165 170 M470 785 Q835 930 1200 785" stroke="#d42b50" stroke-width="5" opacity=".6" filter="url(#glow)" />`
    : "";
  const extraArms = stage >= 11
    ? `<path d="M635 420 Q420 475 325 655 Q300 710 355 724 Q455 620 670 558" fill="none" stroke="#180711" stroke-width="58" stroke-linecap="round" />
       <path d="M845 425 Q1060 480 1165 660 Q1190 710 1135 730 Q1025 620 820 560" fill="none" stroke="#180711" stroke-width="58" stroke-linecap="round" />`
    : "";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05070b"/><stop offset=".48" stop-color="#10060b"/><stop offset="1" stop-color="#020306"/></linearGradient>
      <radialGradient id="halo"><stop stop-color="#b51f42" stop-opacity="${Math.min(.7, .15 + stage * .045)}"/><stop offset=".55" stop-color="#42102a" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#20242b"/><stop offset=".46" stop-color="#0b0d12"/><stop offset="1" stop-color="#260711"/></linearGradient>
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="4" seed="${stage * 17}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .12"/></feComponentTransfer></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="distort"><feTurbulence type="turbulence" baseFrequency=".008 .03" numOctaves="2" seed="${stage * 29}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${stage * 2.5}"/></filter>
      <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse"><path d="M54 0H0V54" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern>
    </defs>
    <rect width="1672" height="941" fill="url(#bg)"/>
    <rect width="1672" height="941" fill="url(#grid)"/>
    <ellipse cx="836" cy="475" rx="620" ry="430" fill="url(#halo)"/>
    ${portal}
    ${hooks}
    <g opacity=".32" filter="url(#blur)"><ellipse cx="240" cy="775" rx="360" ry="160" fill="#6b0d26"/><ellipse cx="1430" cy="790" rx="380" ry="170" fill="#32134c"/></g>
    ${echoes}
    <g filter="url(#distort)">
      ${extraArms}
      <path d="M596 810 Q610 565 650 402 Q680 325 732 298 L940 310 Q1002 350 1025 438 Q1056 590 1070 810 Z" fill="url(#body)" stroke="#5b1729" stroke-opacity=".55" stroke-width="4"/>
      <path d="M675 408 Q535 505 480 685" fill="none" stroke="#11141a" stroke-width="88" stroke-linecap="round"/>
      <path d="M963 414 Q1100 510 1160 690" fill="none" stroke="#11141a" stroke-width="88" stroke-linecap="round"/>
      <ellipse cx="836" cy="244" rx="116" ry="132" fill="#151820" stroke="#7d263b" stroke-opacity="${.18 + stage * .035}" stroke-width="5"/>
      <path d="M744 226 Q836 160 928 226 L912 312 Q835 351 760 310 Z" fill="#07090d" stroke="#9c2945" stroke-opacity="${.25 + stage * .04}" stroke-width="4"/>
      <path d="M775 245 L823 258 L810 280 L764 268 Z M897 245 L849 258 L862 280 L908 268 Z" fill="#ff385d" opacity="${Math.min(1, .22 + stage * .065)}" filter="url(#glow)"/>
      <path d="M756 310 Q835 350 916 310" fill="none" stroke="#c0c5ce" stroke-opacity=".23" stroke-width="3"/>
      <g fill="none" stroke="#d1274c" stroke-width="${2 + stage * .2}" stroke-opacity="${Math.min(.9, .2 + stage * .055)}" filter="url(#glow)">${veins}</g>
    </g>
    <rect width="1672" height="941" filter="url(#noise)" opacity=".85"/>
    <path d="M0 770 Q230 680 410 790 T830 760 T1260 800 T1672 735 V941 H0Z" fill="#020306" opacity=".8"/>
    <g font-family="Arial, sans-serif">
      <text x="72" y="82" fill="#d9dce3" font-size="22" letter-spacing="8">SFI // MOR‑13 VISUAL RECORD</text>
      <text x="72" y="126" fill="#ff5674" font-size="15" letter-spacing="5">STAGE ${String(stage).padStart(2, "0")} // CORRUPTION ${progress}%</text>
      <text x="72" y="850" fill="#ffffff" font-size="38" font-weight="700">${STAGE_TITLES[stage - 1]}</text>
      <text x="72" y="890" fill="#c9cbd2" font-size="18" letter-spacing="2">РАЗБЛОКИРОВАНО: ${ability.title.toUpperCase()}</text>
      <text x="1515" y="865" fill="#ff4d6c" font-size="78" font-weight="800" text-anchor="end">${String(stage).padStart(2, "0")}</text>
    </g>
    <rect x="22" y="22" width="1628" height="897" fill="none" stroke="#fff" stroke-opacity=".08"/>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function enhanceAbilities(): void {
  const grid = document.querySelector<HTMLElement>(".ability-grid");
  if (!grid || grid.dataset.mor13Enhanced === "true") return;
  grid.replaceChildren(...ABILITIES.map(abilityCard));
  grid.dataset.mor13Enhanced = "true";
}

function enhanceStages(): void {
  const stages = document.querySelectorAll<HTMLElement>(".mutation-stage");
  stages.forEach((stage, index) => {
    if (stage.dataset.mor13Enhanced === "true" || !ABILITIES[index]) return;
    const ability = ABILITIES[index];
    const image = stage.querySelector<HTMLImageElement>(".mutation-stage-visual img");
    const copy = stage.querySelector<HTMLElement>(".mutation-stage-copy");
    if (!image || !copy) return;

    image.src = stageArtwork(index + 1);
    image.alt = `Стадия ${ability.stage}: ${STAGE_TITLES[index]}. Разблокирована способность «${ability.title}».`;
    image.loading = index < 2 ? "eager" : "lazy";

    const panel = document.createElement("section");
    panel.className = "stage-unlock-panel";
    panel.setAttribute("aria-label", `Новая способность стадии ${ability.stage}`);
    panel.innerHTML = `
      <div class="stage-unlock-head"><span>ABILITY UNLOCK // ${ability.code}</span><strong>ДОСТУПНО ${index + 1} ИЗ 13</strong></div>
      <div class="stage-unlock-body">
        <h5>${ability.title}</h5>
        <p>${ability.effect}</p>
        <div class="stage-unlock-tags">
          <span>ЦЕНА: ${ability.cost}</span>
          <span>ОТКАТ: ${ability.cooldown}</span>
          <span>РИСК: ${ability.risk}</span>
        </div>
      </div>`;
    copy.appendChild(panel);
    stage.dataset.mor13Enhanced = "true";
  });
}

export default function SiteEnhancer() {
  useEffect(() => {
    let queued = false;
    const applyEnhancements = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        enhanceAbilities();
        enhanceStages();
      });
    };

    const observer = new MutationObserver(applyEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });
    applyEnhancements();
    return () => observer.disconnect();
  }, []);

  return <style>{ENHANCEMENT_STYLES}</style>;
}
