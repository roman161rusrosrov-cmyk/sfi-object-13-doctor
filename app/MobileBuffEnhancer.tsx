"use client";

import { useEffect } from "react";

type BuffedAbility = {
  stage: string;
  code: string;
  title: string;
  classification: string;
  active: string;
  passive: string;
  overload: string;
  cooldown: string;
  limit: string;
  risk: string;
};

const BUFFED_ABILITIES: BuffedAbility[] = [
  {
    stage: "I",
    code: "MOR‑01+",
    title: "Импульс Скверны",
    classification: "РЫВОК / ФИЗИЧЕСКОЕ УСИЛЕНИЕ",
    active:
      "Доктор выполняет направленный рывок на расстояние до 18 метров. В течение следующих 20 секунд сила, скорость реакции и устойчивость к отдаче увеличиваются примерно на 80%. Допускается второй рывок в течение четырёх секунд после первого.",
    passive:
      "Скорость бега увеличена на 15%, высота прыжка — на 25%, а падения с высоты до шести метров не вызывают тяжёлых повреждений.",
    overload:
      "Объединяет два рывка в один прорыв до 35 метров и позволяет пробить лёгкое препятствие или сбить несколько целей по линии движения.",
    cooldown: "24 секунды",
    limit: "До 6 обычных активаций за 10 минут",
    risk: "+0,4% поглощения; перегрузка добавляет ещё +0,8%",
  },
  {
    stage: "II",
    code: "MOR‑02+",
    title: "Чёрная регенерация",
    classification: "РЕГЕНЕРАЦИЯ / СТАБИЛИЗАЦИЯ",
    active:
      "За 8–15 секунд закрывает глубокие раны, останавливает внутреннее кровотечение, соединяет переломы и временно восстанавливает работоспособность повреждённых мышц.",
    passive:
      "Свёртываемость крови и устойчивость к токсинам повышены. Лёгкие травмы постепенно затягиваются без сознательной активации.",
    overload:
      "Экстренно стабилизирует тяжёлое повреждение органа и возвращает носителя в сознание, если смерть ещё не наступила.",
    cooldown: "2 минуты 30 секунд",
    limit: "Не создаёт новые органы и не восстанавливает утраченную конечность",
    risk: "+0,7%; перегрузка вызывает +1,8% и сильный голод",
  },
  {
    stage: "III",
    code: "MOR‑03+",
    title: "Хищное восприятие",
    classification: "АНОМАЛЬНАЯ СЕНСОРИКА",
    active:
      "На 40 секунд обнаруживает живые цели в радиусе 80 метров по сердцебиению, теплу, запаху крови и движению. Видит через три обычных стены и распознаёт раненые участки тела.",
    passive:
      "Темнота, дым и ослепляющие вспышки почти не мешают ориентации. Носитель чувствует направленную на него агрессию на близкой дистанции.",
    overload:
      "На 12 секунд замедляет субъективное восприятие времени и подсвечивает траектории движущихся целей.",
    cooldown: "50 секунд",
    limit: "Экранированные помещения и сильные аномалии создают ложные контуры",
    risk: "+0,3%; перегрузка вызывает мигрень и +0,7%",
  },
  {
    stage: "IV",
    code: "MOR‑04+",
    title: "Костяной бастион",
    classification: "БРОНЯ / ОТВЕТНЫЙ УДАР",
    active:
      "На 30 секунд покрывает грудь, шею, голову и предплечья многослойными пластинами. Баллистический и осколочный урон снижается примерно на 65%, ударный — на 50%.",
    passive:
      "Кости и суставы постоянно усилены, вероятность перелома значительно снижена.",
    overload:
      "Разрушает внешние пластины направленной ударной волной радиусом до пяти метров, отбрасывая ближайших противников.",
    cooldown: "2 минуты 40 секунд",
    limit: "Тяжёлая броня снижает скорость на 12% и не защищает от внутреннего урона",
    risk: "+0,9%; взрыв пластин добавляет +1,1%",
  },
  {
    stage: "V",
    code: "MOR‑05+",
    title: "Крюки тёмной плоти",
    classification: "ЗАХВАТ / ПЕРЕМЕЩЕНИЕ",
    active:
      "Создаёт два управляемых органических жгута длиной до 30 метров. Ими можно притянуть цель, обезоружить противника, удержать дверь или быстро переместиться к опоре.",
    passive:
      "Носитель способен удерживаться на вертикальных поверхностях и кратковременно фиксировать тело при сильной отдаче или ударе.",
    overload:
      "Объединяет жгуты в один усиленный крюк, способный сдвинуть массу до 500 килограммов или резко опрокинуть крупную цель.",
    cooldown: "38 секунд",
    limit: "Жгуты уязвимы к огню, кислоте и режущему оружию",
    risk: "+0,6%; перегрузка вызывает разрыв тканей и +1%",
  },
  {
    stage: "VI",
    code: "MOR‑06+",
    title: "Поле подавления",
    classification: "ПСИХИЧЕСКОЕ ДАВЛЕНИЕ",
    active:
      "На 35 секунд создаёт область радиусом 15 метров. Враждебные цели теряют до 35% скорости, хуже координируют движения и слышат ложные шаги и голоса.",
    passive:
      "Слабовольные противники ощущают тревогу ещё до визуального контакта с Доктором.",
    overload:
      "На пять секунд превращает поле в импульс ужаса, прерывающий прицеливание, концентрацию и подготовку сложных действий.",
    cooldown: "3 минуты 40 секунд",
    limit: "Союзники без психозащиты получают ослабленный эффект",
    risk: "+1,2%; импульс добавляет +1,3%",
  },
  {
    stage: "VII",
    code: "MOR‑07+",
    title: "Стая теневых двойников",
    classification: "ИЛЛЮЗИЯ / РАЗВЕДКА",
    active:
      "Создаёт двух полуматериальных двойников на 45 секунд. Они могут двигаться по разным маршрутам, открывать незапертые двери, создавать шум и имитировать атаку.",
    passive:
      "Камеры и датчики движения периодически фиксируют смещённый силуэт носителя, затрудняя точное наведение.",
    overload:
      "Один двойник на три секунды становится плотным и способен нанести удар примерно с 35% силы оригинала или принять атаку на себя.",
    cooldown: "4 минуты 30 секунд",
    limit: "Двойники не используют оружие и разрушаются от мощного попадания",
    risk: "+1%; материализация добавляет +1,5%",
  },
  {
    stage: "VIII",
    code: "MOR‑08+",
    title: "Разрыв охотника",
    classification: "ПРОСТРАНСТВЕННОЕ ПЕРЕМЕЩЕНИЕ",
    active:
      "Открывает проход между двумя видимыми точками на дистанции до 60 метров. Доктор может провести через него одного союзника или перенести удерживаемую цель.",
    passive:
      "Короткие перемещения становятся почти бесшумными, а пространственные аномалии ощущаются как направление давления.",
    overload:
      "Создаёт два последовательных разрыва, позволяя изменить направление движения в промежуточной точке или уйти из окружения.",
    cooldown: "4 минуты",
    limit: "Не проходит через специальные пространственные экраны и нестабильные порталы",
    risk: "+1,5%; двойной разрыв добавляет +2%",
  },
  {
    stage: "IX",
    code: "MOR‑09+",
    title: "Клеймо великой охоты",
    classification: "ПРЕСЛЕДОВАНИЕ / ОСЛАБЛЕНИЕ",
    active:
      "Помечает до трёх целей на 20 минут. В радиусе двух километров Доктор чувствует направление, примерное расстояние и физическое состояние каждой отмеченной цели.",
    passive:
      "Следы крови и запах отмеченной цели не исчезают для восприятия носителя в течение нескольких часов.",
    overload:
      "На десять секунд подавляет регенерацию и маскировочные способности одной помеченной цели.",
    cooldown: "6 минут на новую метку",
    limit: "Метка требует касания или попадания органическим жгутом",
    risk: "+0,8% за метку; подавление добавляет +1,4%",
  },
  {
    stage: "X",
    code: "MOR‑10+",
    title: "Пасть чёрного тумана",
    classification: "КОНТРОЛЬ ТЕРРИТОРИИ",
    active:
      "Заполняет область радиусом 35 метров живым туманом на 90 секунд. Доктор видит внутри без ограничений, а противники теряют ориентацию, связь и запас сил.",
    passive:
      "Тонкий слой тумана скрывает шум дыхания, шагов и слабое тепловое излучение носителя.",
    overload:
      "На восемь секунд туман уплотняется вокруг выбранных целей, замедляя их и частично блокируя обзор даже через приборы.",
    cooldown: "8 минут",
    limit: "Сильный ветер и мощная вентиляция уменьшают область и длительность",
    risk: "+2%; уплотнение добавляет +1,8%",
  },
  {
    stage: "XI",
    code: "MOR‑11+",
    title: "Насильственная адаптация",
    classification: "ЭВОЛЮЦИОННАЯ ЗАЩИТА",
    active:
      "После получения урона формирует сопротивление двум выбранным типам воздействия на 120 секунд. Последующий урон этих типов снижается приблизительно на 60%.",
    passive:
      "Организм быстрее приспосабливается к температуре, давлению, токсичной среде и недостатку кислорода.",
    overload:
      "На 15 секунд позволяет полностью проигнорировать один заранее распознанный тип воздействия, после чего защита разрушается.",
    cooldown: "14 минут",
    limit: "Не адаптируется к мгновенному уничтожению тела и концептуальным аномалиям",
    risk: "+2,5%; абсолютная адаптация добавляет +3% и временно лишает речи",
  },
  {
    stage: "XII",
    code: "MOR‑12+",
    title: "Аватар бесконечной охоты",
    classification: "ТЕРМИНАЛЬНАЯ БОЕВАЯ ФОРМА",
    active:
      "На 90 секунд скорость и физическая сила увеличиваются примерно вдвое, регенерация работает непрерывно, а рывки и крюки получают сокращенный откат.",
    passive:
      "При смертельной угрозе Скверна может на несколько секунд автоматически перехватить управление телом и вывести носителя из зоны поражения.",
    overload:
      "На последние 15 секунд форма снимает ограничения боли и усталости, позволяя продолжать движение даже при критических повреждениях.",
    cooldown: "Один раз в 18 часов",
    limit: "После формы — потеря сознания на 10–25 минут и временная блокировка стадий VIII–XI",
    risk: "+6%; перегрузка может немедленно запустить XIII стадию",
  },
  {
    stage: "XIII",
    code: "MOR‑13Ω",
    title: "Врата мира Скверны",
    classification: "НЕОБРАТИМОЕ ПОГЛОЩЕНИЕ",
    active:
      "Скверна раскрывает постоянный разлом, полностью забирает Доктора и переносит его в собственный мир бесконечной охоты. В момент перехода окружающее пространство искажается, а ближайшие существа могут быть затянуты вслед за ним.",
    passive:
      "На этой стадии человеческая воля больше не считается главным источником управления телом.",
    overload:
      "Отсутствует. Любая попытка использовать предельную силу является частью процесса окончательного поглощения.",
    cooldown: "Отсутствует",
    limit: "Возвращение объекта не подтверждено; применение считается терминальным событием",
    risk: "100% переход под контроль Скверны",
  },
];

const MOBILE_STYLES = `
  html, body { max-width: 100%; overflow-x: clip; }
  button, a, input { touch-action: manipulation; }
  .archive-section, .ability-card, .mutation-stage-copy, .stage-unlock-panel { min-width: 0; }
  .archive-section p, .archive-section li, .ability-card p, .stage-unlock-panel p { overflow-wrap: anywhere; }

  .ability-card-buffed { position: relative; isolation: isolate; border-color: rgba(255, 76, 111, .24); }
  .ability-card-buffed::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(145deg, rgba(99, 10, 31, .19), transparent 48%); pointer-events: none; }
  .ability-card-buffed .ability-card-top strong { max-width: 65%; text-align: right; overflow-wrap: anywhere; }
  .ability-power-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 14px; padding: 7px 9px; border: 1px solid rgba(255, 75, 108, .34); background: rgba(111, 11, 34, .18); color: #ff8ba0; font: 10px/1.2 var(--font-geist-mono), monospace; letter-spacing: .11em; }
  .ability-sections-buffed { display: grid; gap: 10px; margin-top: 16px; }
  .ability-section-buffed { padding: 13px 14px; border: 1px solid rgba(255,255,255,.075); background: rgba(1,3,6,.43); }
  .ability-section-buffed > span { display: block; margin-bottom: 7px; color: #ff718b; font: 10px/1.2 var(--font-geist-mono), monospace; letter-spacing: .13em; }
  .ability-section-buffed > p { margin: 0; color: #d5d7de; line-height: 1.68; }
  .ability-section-buffed.passive { border-color: rgba(76, 215, 194, .16); }
  .ability-section-buffed.passive > span { color: #6cdcca; }
  .ability-section-buffed.overload { border-color: rgba(255, 144, 50, .2); }
  .ability-section-buffed.overload > span { color: #ffad64; }
  .ability-metrics-buffed { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
  .ability-metric-buffed { padding: 11px; border: 1px solid rgba(255,255,255,.075); background: rgba(0,0,0,.28); }
  .ability-metric-buffed span { display: block; color: #888f9a; font: 9px/1.2 var(--font-geist-mono), monospace; letter-spacing: .1em; }
  .ability-metric-buffed strong { display: block; margin-top: 6px; color: #f0f1f5; font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }

  .stage-unlock-panel.buffed-stage-panel { border-color: rgba(255, 70, 105, .46); box-shadow: inset 4px 0 0 #dc3155, 0 18px 50px rgba(0,0,0,.25); }
  .buffed-stage-panel .stage-unlock-head span { color: #ff7891; }
  .stage-unlock-sections { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; margin-top: 14px; }
  .stage-unlock-section { padding: 11px; border: 1px solid rgba(255,255,255,.08); background: rgba(0,0,0,.26); }
  .stage-unlock-section span { display: block; margin-bottom: 6px; color: #9a9fac; font: 9px/1.2 var(--font-geist-mono), monospace; letter-spacing: .1em; }
  .stage-unlock-section p { margin: 0; color: #d6d8df; font-size: 13px; line-height: 1.55; }
  .stage-unlock-section.overload span { color: #ffad64; }
  .stage-unlock-section.passive span { color: #6cdcca; }

  @media (max-width: 1100px) {
    .ability-metrics-buffed { grid-template-columns: 1fr; }
  }

  @media (max-width: 860px) {
    body { padding-bottom: env(safe-area-inset-bottom); }
    .archive-main { width: 100%; max-width: 100%; }
    .mobile-header { min-height: 3.65rem; padding: max(.55rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) .55rem max(1rem, env(safe-area-inset-left)); }
    .mobile-header button { min-height: 44px; padding: .45rem .2rem; }
    .mobile-nav { position: sticky; top: calc(3.65rem + env(safe-area-inset-top)); z-index: 29; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; overscroll-behavior-inline: contain; padding-inline: max(.7rem, env(safe-area-inset-left)); }
    .mobile-nav button { min-height: 44px; scroll-snap-align: start; border-radius: 2px; white-space: nowrap; }
    .hero-copy { padding-inline: max(1rem, env(safe-area-inset-left)); }
    .hero h1 { max-width: 100%; overflow-wrap: anywhere; }
    .portrait, .portrait img { min-height: 0 !important; }
    .portrait { aspect-ratio: 4 / 5; }
    .portrait img { width: 100%; height: 100%; object-fit: cover; }
    .status-strip { overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .status-strip span { flex: 0 0 auto; white-space: nowrap; }
    .content-wrap { width: 100%; max-width: 100%; padding: 2rem max(1rem, env(safe-area-inset-right)) 3rem max(1rem, env(safe-area-inset-left)); }
    .section-header, .mutation-header { gap: 1rem; }
    .section-header h2, .mutation-header h2 { overflow-wrap: anywhere; }
    .ability-grid { gap: 14px; }
    .ability-card { padding: 1rem; }
    .ability-card h3 { font-size: clamp(1.25rem, 6vw, 1.65rem); }
    .ability-card-top { align-items: flex-start; gap: 10px; }
    .ability-card-top strong { font-size: 9px; line-height: 1.35; }
    .ability-metrics-buffed { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .mutation-stage-nav { display: flex; grid-template-columns: none; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 7px; }
    .mutation-stage-nav a { flex: 0 0 min(74vw, 260px); scroll-snap-align: start; min-height: 60px; }
    .mutation-stage { gap: 0; scroll-margin-top: 8.5rem; }
    .mutation-stage-visual { aspect-ratio: 16 / 9; min-height: 0; }
    .mutation-stage-visual img { width: 100%; height: 100%; object-fit: cover; }
    .mutation-stage-copy { padding: 1.15rem 0 0; }
    .mutation-stage-heading h4 { font-size: clamp(1.25rem, 6vw, 1.65rem); }
    .stage-unlock-sections { grid-template-columns: 1fr; }
    .mutation-protocol { margin-top: 3rem; }
    .archive-footer { padding-inline: max(1rem, env(safe-area-inset-left)); }
  }

  @media (max-width: 560px) {
    .gate-card { padding-top: max(1.35rem, env(safe-area-inset-top)); padding-bottom: max(1.35rem, env(safe-area-inset-bottom)); }
    .password-row input { font-size: 16px; }
    .peek-button { min-width: 52px; }
    .decrypt-button, .mutation-decrypt, .mutation-close { min-height: 48px; }
    .hero-copy { padding: 2.25rem 1rem 1.8rem; }
    .hero h1 { font-size: clamp(3rem, 17vw, 5rem); line-height: .92; }
    .hero-name, .hero-role { max-width: 100%; overflow-wrap: anywhere; }
    .portrait { aspect-ratio: 4 / 5.25; }
    .content-wrap { padding: 1.6rem .85rem 2.5rem; }
    .section-code, .section-eyebrow { letter-spacing: .08em; }
    .section-header h2 { font-size: clamp(2rem, 11vw, 3rem); }
    .section-lead { font-size: 1rem; line-height: 1.65; }
    .data-grid { grid-template-columns: 1fr; }
    .data-grid > div { min-height: 0; padding: 1rem; }
    .archive-list li { gap: .7rem; }
    .card-grid, .ability-grid { gap: 12px; }
    .ability-card { padding: .9rem; }
    .ability-stage-line { display: grid; font-size: 9px; }
    .ability-sections-buffed { gap: 8px; }
    .ability-section-buffed { padding: 11px; }
    .ability-section-buffed > p { font-size: 14px; line-height: 1.58; }
    .ability-metrics-buffed { grid-template-columns: 1fr; }
    .ability-metric-buffed { min-height: 0; }
    .mutation-view { padding-inline: 0; }
    .mutation-header h2 { font-size: clamp(2rem, 11vw, 3.1rem); }
    .mutation-summary { padding: 1rem; }
    .mutation-section-title h3 { font-size: clamp(1.65rem, 9vw, 2.5rem); }
    .mutation-stage-nav a { flex-basis: 78vw; }
    .mutation-stage-visual figcaption { padding: .65rem .75rem; }
    .mutation-stage-visual figcaption span, .mutation-stage-visual figcaption strong { font-size: 9px; }
    .mutation-stage-index { top: .7rem; right: .7rem; }
    .mutation-stage-copy > p { line-height: 1.65; }
    .stage-unlock-panel { margin-top: 16px; }
    .stage-unlock-head { padding: 11px; }
    .stage-unlock-head span, .stage-unlock-head strong { font-size: 9px; }
    .stage-unlock-body { padding: 12px; }
    .stage-unlock-body h5 { font-size: 1.15rem; }
    .stage-unlock-tags { display: grid; grid-template-columns: 1fr; }
    .stage-unlock-tags span { line-height: 1.35; }
    .mutation-stage-copy ul { gap: .45rem; }
    .mutation-protocol { padding: 1rem; }
    .mutation-protocol li { grid-template-columns: 1.7rem 1fr; gap: .65rem; }
    .terminal-note { grid-template-columns: 1fr; gap: .8rem; }
    .archive-footer { display: grid; gap: 1rem; padding: 1.5rem 1rem; }
    .archive-footer > div:last-child { text-align: left; }
  }

  @media (max-width: 380px) {
    .mobile-header button { font-size: .6rem; letter-spacing: .05em; }
    .mobile-header button span { display: none; }
    .mobile-nav { gap: .35rem; padding: .55rem; }
    .mobile-nav button { padding-inline: .65rem; }
    .hero-tags span { font-size: .55rem; }
    .content-wrap { padding-inline: .7rem; }
    .ability-card, .info-card { padding-inline: .8rem; }
    .mutation-stage-nav a { flex-basis: 84vw; }
  }

  @media (hover: none) {
    button:hover, a:hover { transform: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
`;

function sectionMarkup(label: string, text: string, className = ""): string {
  return `<div class="ability-section-buffed ${className}"><span>${label}</span><p>${text}</p></div>`;
}

function metricMarkup(label: string, value: string): string {
  return `<div class="ability-metric-buffed"><span>${label}</span><strong>${value}</strong></div>`;
}

function rewriteAbilityCards(): void {
  const cards = document.querySelectorAll<HTMLElement>(".ability-grid .ability-card-v2");
  cards.forEach((card, index) => {
    const ability = BUFFED_ABILITIES[index];
    if (!ability || card.dataset.mor13Buffed === "true") return;

    card.classList.add("ability-card-buffed");
    card.innerHTML = `
      <div class="ability-card-top"><span>${ability.code}</span><strong>${ability.classification}</strong></div>
      <h3>${ability.title}</h3>
      <div class="ability-power-badge">СТАДИЯ ${ability.stage} // УСИЛЕННЫЙ ПРОТОКОЛ</div>
      <div class="ability-sections-buffed">
        ${sectionMarkup("АКТИВНАЯ СПОСОБНОСТЬ", ability.active)}
        ${sectionMarkup("ПОСТОЯННЫЙ ПАССИВНЫЙ ЭФФЕКТ", ability.passive, "passive")}
        ${sectionMarkup("РЕЖИМ ПЕРЕГРУЗКИ", ability.overload, "overload")}
      </div>
      <div class="ability-metrics-buffed">
        ${metricMarkup("ОТКАТ", ability.cooldown)}
        ${metricMarkup("ОГРАНИЧЕНИЕ", ability.limit)}
        ${metricMarkup("РИСК СКВЕРНЫ", ability.risk)}
      </div>`;
    card.dataset.mor13Buffed = "true";
  });
}

function rewriteStagePanels(): void {
  const stages = document.querySelectorAll<HTMLElement>(".mutation-stage");
  stages.forEach((stage, index) => {
    const ability = BUFFED_ABILITIES[index];
    const panel = stage.querySelector<HTMLElement>(".stage-unlock-panel");
    if (!ability || !panel || panel.dataset.mor13Buffed === "true") return;

    panel.classList.add("buffed-stage-panel");
    panel.innerHTML = `
      <div class="stage-unlock-head"><span>ABILITY UNLOCK // ${ability.code}</span><strong>УСИЛЕННАЯ ВЕРСИЯ // СТАДИЯ ${ability.stage}</strong></div>
      <div class="stage-unlock-body">
        <h5>${ability.title}</h5>
        <p>${ability.active}</p>
        <div class="stage-unlock-sections">
          <div class="stage-unlock-section passive"><span>ПАССИВНЫЙ ЭФФЕКТ</span><p>${ability.passive}</p></div>
          <div class="stage-unlock-section overload"><span>РЕЖИМ ПЕРЕГРУЗКИ</span><p>${ability.overload}</p></div>
        </div>
        <div class="stage-unlock-tags">
          <span>ОТКАТ: ${ability.cooldown}</span>
          <span>ЛИМИТ: ${ability.limit}</span>
          <span>РИСК: ${ability.risk}</span>
        </div>
      </div>`;
    panel.dataset.mor13Buffed = "true";
  });
}

export default function MobileBuffEnhancer() {
  useEffect(() => {
    let frame = 0;
    const apply = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        rewriteAbilityCards();
        rewriteStagePanels();
      });
    };

    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    apply();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <style>{MOBILE_STYLES}</style>;
}
