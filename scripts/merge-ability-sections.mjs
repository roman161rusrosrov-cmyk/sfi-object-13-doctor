import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
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

if (changed) {
  await writeFile(pagePath, source, "utf8");
  console.log("Основные и дополнительные аномальные способности объединены.");
} else {
  console.log("Объединение аномальных способностей уже применено.");
}
