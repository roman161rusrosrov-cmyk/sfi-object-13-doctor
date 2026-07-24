import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const expansionPath = new URL("../app/MobileExpansion.tsx", import.meta.url);

async function patchPage() {
  let source = await readFile(pagePath, "utf8");
  let changed = false;

  const helper = `function mergeAbilitySections(archive: Archive): Archive {
  const abilitySections = archive.sections.filter(
    (section) => Array.isArray(section.abilities) && section.abilities.length > 0,
  );

  if (abilitySections.length < 2) return archive;

  const [primarySection, ...additionalSections] = abilitySections;
  const mergedAbilities = abilitySections
    .flatMap((section) => section.abilities ?? [])
    .filter(
      (ability, index, abilities) =>
        abilities.findIndex(
          (candidate) =>
            candidate.code === ability.code && candidate.title === ability.title,
        ) === index,
    );
  const additionalIds = new Set(additionalSections.map((section) => section.id));

  return {
    ...archive,
    sections: archive.sections
      .filter((section) => !additionalIds.has(section.id))
      .map((section) =>
        section.id === primarySection.id
          ? {
              ...section,
              nav: "Аномальные способности",
              title: "Аномальные способности",
              abilities: mergedAbilities,
            }
          : section,
      ),
  };
}`;

  if (!source.includes("function mergeAbilitySections(archive: Archive)")) {
    const anchor = "function AccessGate({";
    if (!source.includes(anchor)) {
      throw new Error(`Не найден якорь для добавления объединения способностей: ${anchor}`);
    }
    source = source.replace(anchor, `${helper}\n\n${anchor}`);
    changed = true;
  }

  const oldUnlock = "onUnlock(archive);";
  const newUnlock = "onUnlock(mergeAbilitySections(archive));";

  if (source.includes(oldUnlock)) {
    source = source.replace(oldUnlock, newUnlock);
    changed = true;
  } else if (!source.includes(newUnlock)) {
    throw new Error("Не найден вызов разблокировки основного архива.");
  }

  if (changed) await writeFile(pagePath, source, "utf8");
  return changed;
}

async function patchExpansion() {
  let source = await readFile(expansionPath, "utf8");

  const oldFunction = `function injectBonusAbilities(): void {
  const primaryGrid = document.querySelector<HTMLElement>(".ability-grid");
  if (!primaryGrid || document.querySelector(".bonus-abilities-wrap")) return;

  const wrap = document.createElement("section");
  wrap.className = "bonus-abilities-wrap";
  wrap.innerHTML = \`
    <header class="bonus-abilities-title">
      <p>SUPPLEMENTARY MOR‑13 CAPABILITIES // 12 RECORDS</p>
      <h3>Дополнительные аномальные способности</h3>
    </header>
    <div class="bonus-abilities-grid"></div>\`;
  const grid = wrap.querySelector<HTMLElement>(".bonus-abilities-grid");
  if (!grid) return;
  grid.append(...BONUS_ABILITIES.map(bonusCard));
  primaryGrid.insertAdjacentElement("afterend", wrap);
}`;

  const newFunction = `function injectBonusAbilities(): void {
  const primaryGrid = document.querySelector<HTMLElement>(".ability-grid");
  if (!primaryGrid || primaryGrid.dataset.fullRegistry === "true") return;

  const mainCards = Array.from(
    primaryGrid.querySelectorAll<HTMLElement>(
      ":scope > .ability-card-v2:not(.integrated-ability-card)",
    ),
  ).slice(0, 13);

  if (
    mainCards.length < 13 ||
    mainCards.some((card) => card.dataset.mor13Buffed !== "true")
  ) {
    return;
  }

  BONUS_ABILITIES.forEach((ability, index) => {
    const card = bonusCard(ability);
    card.className =
      "ability-card ability-card-v2 ability-card-buffed integrated-ability-card";
    card.innerHTML = \`
      <div class="ability-card-top">
        <span>\${ability.code}</span>
        <strong>\${ability.classification}</strong>
      </div>
      <h3>\${ability.title}</h3>
      <div class="ability-power-badge">\${ability.unlock.toUpperCase()} // ОСНОВНОЙ РЕЕСТР</div>
      <div class="ability-sections-buffed">
        <div class="ability-section-buffed">
          <span>АНОМАЛЬНЫЙ ЭФФЕКТ</span>
          <p>\${ability.effect}</p>
        </div>
      </div>
      <div class="ability-metrics-buffed">
        <div class="ability-metric-buffed"><span>ЦЕНА</span><strong>\${ability.cost}</strong></div>
        <div class="ability-metric-buffed"><span>ОТКАТ</span><strong>\${ability.cooldown}</strong></div>
        <div class="ability-metric-buffed"><span>ОГРАНИЧЕНИЕ</span><strong>\${ability.limit}</strong></div>
        <div class="ability-metric-buffed"><span>РИСК</span><strong>\${ability.risk}</strong></div>
      </div>\`;
    card.dataset.integrated = "true";
    card.dataset.mor13Buffed = "true";

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
}`;

  if (source.includes(oldFunction)) {
    source = source.replace(oldFunction, newFunction);
    await writeFile(expansionPath, source, "utf8");
    return true;
  }

  if (!source.includes("primaryGrid.dataset.fullRegistry === \"true\"")) {
    throw new Error("Не найден блок дополнительных аномальных способностей.");
  }

  return false;
}

const pageChanged = await patchPage();
const expansionChanged = await patchExpansion();

if (pageChanged || expansionChanged) {
  console.log("Все аномальные способности внедрены в единый основной реестр.");
} else {
  console.log("Единый основной реестр аномальных способностей уже сформирован.");
}
