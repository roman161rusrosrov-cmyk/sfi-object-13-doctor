"use client";

import { useEffect } from "react";

type BonusAbility = {
  code: string;
  unlock: string;
  title: string;
  classification: string;
  effect: string;
  cost: string;
  cooldown: string;
  limit: string;
  risk: string;
};

const BONUS_ABILITIES: BonusAbility[] = [
  {
    code: "MOR‑14",
    unlock: "Стадия II",
    title: "Подавление боли",
    classification: "ПАССИВНАЯ / БОЕВАЯ",
    effect: "На короткое время Скверна блокирует болевой шок и позволяет Доктору продолжать движение после тяжёлого ранения. Повреждение при этом никуда не исчезает.",
    cost: "Пассивно",
    cooldown: "8 минут после срабатывания",
    limit: "Не предотвращает потерю крови",
    risk: "+0,4% прогрессии",
  },
  {
    code: "MOR‑15",
    unlock: "Стадия III",
    title: "Эхо крови",
    classification: "СЕНСОРИКА / РОЗЫСК",
    effect: "По свежим следам крови определяет направление движения раненой цели и примерную давность ранения в радиусе до 120 метров.",
    cost: "4% резерва",
    cooldown: "45 секунд",
    limit: "Не различает следы близнецов и клонов",
    risk: "+0,2% прогрессии",
  },
  {
    code: "MOR‑16",
    unlock: "Стадия IV",
    title: "Удар деформации",
    classification: "БЛИЖНИЙ БОЙ",
    effect: "Накопленная Скверна усиливает один удар и создаёт короткую ударную волну, способную опрокинуть несколько целей перед носителем.",
    cost: "11% резерва",
    cooldown: "80 секунд",
    limit: "Эффективная дистанция до 5 метров",
    risk: "+0,6% прогрессии",
  },
  {
    code: "MOR‑17",
    unlock: "Стадия V",
    title: "Сшивание пространства",
    classification: "ПОДДЕРЖКА",
    effect: "Доктор временно стабилизирует небольшой аномальный разрыв, не позволяя ему расширяться или поглощать окружающее пространство.",
    cost: "17% резерва",
    cooldown: "9 минут",
    limit: "Требует полной неподвижности до 20 секунд",
    risk: "+1% прогрессии",
  },
  {
    code: "MOR‑18",
    unlock: "Стадия VI",
    title: "Команда хищника",
    classification: "ПСИХИЧЕСКОЕ ДАВЛЕНИЕ",
    effect: "Короткая голосовая команда вызывает у одной ослабленной цели непроизвольную остановку или отступление на 1–2 секунды.",
    cost: "13% резерва",
    cooldown: "4 минуты",
    limit: "Не действует на машины и существ без страха",
    risk: "+0,9% прогрессии",
  },
  {
    code: "MOR‑19",
    unlock: "Стадия VII",
    title: "Стая отражений",
    classification: "ОБМАН / КОНТРОЛЬ",
    effect: "Вместо одного двойника создаёт три слабых силуэта на 15 секунд. Они расходятся в разные стороны и имитируют шум шагов.",
    cost: "21% резерва",
    cooldown: "8 минут",
    limit: "Отражения исчезают после первого попадания",
    risk: "+1,2% прогрессии",
  },
  {
    code: "MOR‑20",
    unlock: "Стадия VIII",
    title: "Короткий провал",
    classification: "УКЛОНЕНИЕ",
    effect: "На долю секунды выводит тело из материального пространства, позволяя избежать одного направленного удара или выстрела.",
    cost: "18% резерва",
    cooldown: "6 минут",
    limit: "Не защищает от взрывной волны и площади поражения",
    risk: "+1,3% прогрессии",
  },
  {
    code: "MOR‑21",
    unlock: "Стадия IX",
    title: "Разрыв сухожилий",
    classification: "ДЕБАФ / КАСАНИЕ",
    effect: "После прямого контакта Скверна вызывает у цели краткий мышечный спазм и снижение скорости примерно на 35% в течение 10 секунд.",
    cost: "15% резерва",
    cooldown: "5 минут",
    limit: "Не действует через броню тяжелее III класса",
    risk: "+1% прогрессии",
  },
  {
    code: "MOR‑22",
    unlock: "Стадия X",
    title: "Око тумана",
    classification: "РАЗВЕДКА",
    effect: "Внутри собственного чёрного тумана Доктор видит силуэты, траектории движения и источники тепла без снижения дальности обзора.",
    cost: "Связано с «Пастью тумана»",
    cooldown: "Общий откат способности",
    limit: "Не работает вне созданного тумана",
    risk: "Без отдельного роста",
  },
  {
    code: "MOR‑23",
    unlock: "Стадия XI",
    title: "Пожирание воздействия",
    classification: "КОНТРМЕРА",
    effect: "Частично поглощает один энергетический или аномальный удар и превращает его в резерв Скверны. Избыток энергии повреждает тело носителя.",
    cost: "Требует точного момента",
    cooldown: "15 минут",
    limit: "Не поглощает непрерывные потоки дольше 2 секунд",
    risk: "+2,8% при переполнении",
  },
  {
    code: "MOR‑24",
    unlock: "Стадия XII",
    title: "Казнь охотника",
    classification: "ФИНИШЕР",
    effect: "Находясь в терминальной форме, Доктор совершает сверхбыстрый бросок к тяжело раненой цели и наносит один усиленный удар.",
    cost: "Дополнительно 20% резерва",
    cooldown: "Один раз за трансформацию",
    limit: "Только против обездвиженной или тяжело раненой цели",
    risk: "+2% прогрессии",
  },
  {
    code: "MOR‑25",
    unlock: "Стадия XIII",
    title: "Зов мира Скверны",
    classification: "ТЕРМИНАЛЬНАЯ АНОМАЛИЯ",
    effect: "Через разлом слышны и проявляются сущности мира бесконечной охоты. Доктор больше не управляет вызовом и сам становится проводником между мирами.",
    cost: "Не контролируется",
    cooldown: "Отсутствует",
    limit: "Сдерживание возможно только закрытием разлома",
    risk: "Катастрофический",
  },
];

const MOBILE_STYLES = `
  html { -webkit-text-size-adjust: 100%; scroll-padding-top: 76px; }
  body { overflow-x: hidden; }
  img { max-width: 100%; height: auto; }
  button, input, a { touch-action: manipulation; }
  .bonus-abilities-wrap { margin-top: 34px; }
  .bonus-abilities-title { margin-bottom: 18px; padding: 16px 18px; border: 1px solid rgba(213,43,73,.3); background: linear-gradient(120deg,rgba(40,7,14,.72),rgba(7,8,12,.9)); }
  .bonus-abilities-title p { margin: 0 0 6px; color: #ff6f88; font: 10px/1.3 var(--font-geist-mono),monospace; letter-spacing: .14em; }
  .bonus-abilities-title h3 { margin: 0; color: #fff; font-size: clamp(22px,4vw,34px); }
  .bonus-abilities-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
  .bonus-ability-card { position: relative; min-width: 0; padding: 18px; border: 1px solid rgba(255,255,255,.09); background: linear-gradient(145deg,rgba(17,18,24,.96),rgba(7,8,12,.96)); box-shadow: inset 3px 0 0 rgba(190,38,67,.7); overflow: hidden; }
  .bonus-ability-card::after { content:""; position:absolute; right:-80px; bottom:-100px; width:210px; height:210px; border-radius:50%; background:radial-gradient(circle,rgba(185,34,66,.18),transparent 67%); pointer-events:none; }
  .bonus-ability-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .bonus-ability-top span { color:#ff607d; font:11px/1.2 var(--font-geist-mono),monospace; letter-spacing:.12em; }
  .bonus-ability-top strong { max-width:58%; color:#9ea2ad; text-align:right; font:9px/1.35 var(--font-geist-mono),monospace; letter-spacing:.08em; }
  .bonus-ability-card h4 { margin:16px 0 9px; color:#fff; font-size:20px; }
  .bonus-ability-card > p { margin:0; color:#c7cad1; line-height:1.62; }
  .bonus-unlock { display:inline-flex; margin-top:14px; padding:6px 8px; border:1px solid rgba(255,91,119,.28); color:#ff9aac; font:9px/1 var(--font-geist-mono),monospace; letter-spacing:.1em; }
  .bonus-metrics { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-top:14px; }
  .bonus-metrics div { min-width:0; padding:9px; border:1px solid rgba(255,255,255,.07); background:rgba(0,0,0,.24); }
  .bonus-metrics span { display:block; margin-bottom:5px; color:#777d89; font:8px/1.2 var(--font-geist-mono),monospace; letter-spacing:.1em; }
  .bonus-metrics strong { display:block; color:#e4e6eb; font-size:11px; line-height:1.4; overflow-wrap:anywhere; }

  @media (max-width: 900px) {
    .archive { display:block !important; }
    .sidebar { display:none !important; }
    .archive-main { width:100% !important; margin:0 !important; min-width:0 !important; }
    .mobile-header { position:sticky !important; top:0; z-index:100; display:flex !important; min-height:56px; padding:10px 14px !important; backdrop-filter:blur(18px); background:rgba(4,5,8,.92) !important; border-bottom:1px solid rgba(255,255,255,.08); }
    .mobile-header button { min-height:42px; padding:9px 11px !important; }
    .hero { grid-template-columns:1fr !important; padding:28px 18px 20px !important; gap:20px !important; }
    .hero-copy { min-width:0; }
    .hero h1 { font-size:clamp(38px,13vw,72px) !important; overflow-wrap:anywhere; }
    .hero-name,.hero-role { max-width:100% !important; }
    .portrait { width:100% !important; min-height:0 !important; aspect-ratio:4/5; }
    .portrait img { width:100%; height:100% !important; object-fit:cover; }
    .status-strip { display:flex !important; overflow-x:auto; gap:10px; padding:11px 14px !important; scrollbar-width:none; }
    .status-strip::-webkit-scrollbar,.mobile-nav::-webkit-scrollbar,.mutation-stage-nav::-webkit-scrollbar { display:none; }
    .status-strip span { flex:0 0 auto; white-space:nowrap; }
    .mobile-nav { position:sticky; top:56px; z-index:90; display:flex !important; overflow-x:auto; gap:7px; padding:9px 12px !important; background:rgba(6,7,10,.94); border-bottom:1px solid rgba(255,255,255,.07); scrollbar-width:none; }
    .mobile-nav button { flex:0 0 auto; min-height:42px; padding:9px 12px !important; white-space:nowrap; }
    .content-wrap { width:100%; padding:18px 14px 42px !important; }
    .archive-section { min-width:0; padding:20px 16px !important; }
    .section-header,.mutation-header { gap:12px; }
    .section-header h2,.mutation-header h2 { font-size:clamp(28px,9vw,46px) !important; overflow-wrap:anywhere; }
    .section-omega,.mutation-omega { font-size:52px !important; }
    .section-lead { font-size:16px !important; line-height:1.65; }
    .data-grid,.card-grid,.ability-grid,.bonus-abilities-grid { grid-template-columns:1fr !important; }
    .ability-card,.info-card,.bonus-ability-card { padding:16px !important; }
    .ability-card-top,.bonus-ability-top { align-items:flex-start; }
    .ability-card-top strong,.bonus-ability-top strong { max-width:54%; overflow-wrap:anywhere; }
    .timeline li { grid-template-columns:42px 1fr !important; gap:12px !important; }
    .mutation-stage-nav { display:flex !important; overflow-x:auto; gap:8px; padding-bottom:8px; scroll-snap-type:x proximity; scrollbar-width:none; }
    .mutation-stage-nav a { flex:0 0 132px; min-height:70px; scroll-snap-align:start; }
    .mutation-stage { display:block !important; margin-bottom:28px !important; scroll-margin-top:122px; }
    .mutation-stage-visual { width:100% !important; min-height:0 !important; aspect-ratio:16/10; }
    .mutation-stage-visual img { width:100%; height:100% !important; object-fit:cover; }
    .mutation-stage-copy { padding:18px 14px !important; }
    .mutation-stage-heading { display:block !important; }
    .mutation-stage-heading span { display:block; margin-top:6px; }
    .stage-unlock-head { display:block !important; }
    .stage-unlock-head strong { display:block; margin-top:7px; }
    .mutation-protocol ol li { grid-template-columns:38px 1fr !important; gap:10px !important; }
    .archive-footer { display:block !important; padding:20px 16px !important; }
    .archive-footer > div + div { margin-top:14px; text-align:left !important; }
    .gate { padding:14px !important; }
    .gate-card { width:min(100%,560px) !important; padding:24px 17px !important; }
    .gate-card h1 { font-size:clamp(34px,11vw,58px) !important; }
    .password-row { grid-template-columns:minmax(0,1fr) auto !important; }
    .password-row input { min-width:0; font-size:16px !important; }
    .decrypt-button,.mutation-decrypt,.mutation-close { width:100%; min-height:50px; }
  }

  @media (max-width: 520px) {
    .mobile-header { padding:8px 10px !important; }
    .mobile-header button:first-child span { display:none; }
    .hero { padding:22px 12px 16px !important; }
    .hero-tags { display:grid !important; grid-template-columns:1fr; }
    .portrait { aspect-ratio:1/1.15; }
    .content-wrap { padding:12px 8px 34px !important; }
    .archive-section { padding:17px 12px !important; border-left:0 !important; border-right:0 !important; }
    .section-header,.mutation-header { align-items:flex-start !important; }
    .section-omega,.mutation-omega { display:none !important; }
    .section-code,.section-eyebrow,.mutation-label { overflow-wrap:anywhere; }
    .ability-stage-line { display:block !important; }
    .ability-stage-line span { display:block; }
    .ability-stage-line span + span { margin-top:7px; }
    .ability-metrics-v2,.bonus-metrics { grid-template-columns:1fr !important; }
    .mutation-stage-visual { aspect-ratio:1/1; }
    .mutation-stage-visual figcaption { padding:9px 10px !important; }
    .mutation-stage-visual figcaption span { font-size:8px !important; }
    .mutation-stage-visual figcaption strong { font-size:9px !important; }
    .stage-unlock-body { padding:13px !important; }
    .stage-unlock-tags { display:grid !important; grid-template-columns:1fr; }
    .stage-unlock-tags span { overflow-wrap:anywhere; }
    .warning-panel,.terminal-note { grid-template-columns:34px 1fr !important; padding:13px !important; }
    .gate-brand { align-items:flex-start !important; }
    .gate-footer { display:grid !important; grid-template-columns:1fr; gap:5px; }
  }
`;

function bonusCard(ability: BonusAbility): HTMLElement {
  const card = document.createElement("article");
  card.className = "bonus-ability-card";
  card.innerHTML = `
    <div class="bonus-ability-top"><span>${ability.code}</span><strong>${ability.classification}</strong></div>
    <h4>${ability.title}</h4>
    <p>${ability.effect}</p>
    <span class="bonus-unlock">РАЗБЛОКИРОВКА: ${ability.unlock.toUpperCase()}</span>
    <div class="bonus-metrics">
      <div><span>ЦЕНА</span><strong>${ability.cost}</strong></div>
      <div><span>ОТКАТ</span><strong>${ability.cooldown}</strong></div>
      <div><span>ОГРАНИЧЕНИЕ</span><strong>${ability.limit}</strong></div>
      <div><span>РИСК</span><strong>${ability.risk}</strong></div>
    </div>`;
  return card;
}

function injectBonusAbilities(): void {
  const primaryGrid = document.querySelector<HTMLElement>(".ability-grid");
  if (!primaryGrid || document.querySelector(".bonus-abilities-wrap")) return;

  const wrap = document.createElement("section");
  wrap.className = "bonus-abilities-wrap";
  wrap.innerHTML = `
    <header class="bonus-abilities-title">
      <p>SUPPLEMENTARY MOR‑13 CAPABILITIES // 12 RECORDS</p>
      <h3>Дополнительные аномальные способности</h3>
    </header>
    <div class="bonus-abilities-grid"></div>`;
  const grid = wrap.querySelector<HTMLElement>(".bonus-abilities-grid");
  if (!grid) return;
  grid.append(...BONUS_ABILITIES.map(bonusCard));
  primaryGrid.insertAdjacentElement("afterend", wrap);
}

export default function MobileExpansion() {
  useEffect(() => {
    let frame = 0;
    const apply = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(injectBonusAbilities);
    };
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    apply();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <style>{MOBILE_STYLES}</style>;
}
