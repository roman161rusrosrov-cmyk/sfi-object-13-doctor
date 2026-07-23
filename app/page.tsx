"use client";

import { FormEvent, useMemo, useState } from "react";
import { gcm } from "@noble/ciphers/aes.js";
import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import {
  MAIN_PAYLOAD,
  MUTATION_PAYLOAD,
  type EncryptedPayload,
} from "./dossier-payload";

type Fact = [string, string];

type ArchiveCard = {
  title: string;
  body: string;
  tag: string;
};

type TimelineEntry = {
  phase: string;
  title: string;
  body: string;
};

type AnomalousAbility = {
  code: string;
  title: string;
  classification: string;
  effect: string;
  limits: string[];
};

type ArchiveSection = {
  id: string;
  nav: string;
  code: string;
  eyebrow: string;
  title: string;
  lead: string;
  facts?: Fact[];
  paragraphs?: string[];
  bullets?: string[];
  cards?: ArchiveCard[];
  timeline?: TimelineEntry[];
  abilities?: AnomalousAbility[];
  warning?: {
    title: string;
    body: string;
  };
};

type Archive = {
  hero: {
    archive: string;
    object: string;
    callsign: string;
    name: string;
    role: string;
    status: string;
    clearance: string;
  };
  sections: ArchiveSection[];
};

type MutationStage = {
  index: string;
  title: string;
  timing: string;
  body: string;
  symptoms: string[];
  image: string;
  alt: string;
};

type MutationArchive = {
  code: string;
  title: string;
  subtitle: string;
  status: string;
  summary: string;
  metrics: Fact[];
  stages: MutationStage[];
  protocol: string[];
  finalNote: string;
};

const encoder = new TextEncoder();
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function publicAsset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${publicBasePath}${normalized}`;
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function decryptPayload<T>(
  password: string,
  payload: EncryptedPayload,
): Promise<T> {
  const salt = decodeBase64(payload.salt);
  const iv = decodeBase64(payload.iv);
  const encrypted = decodeBase64(payload.data);
  const key = await pbkdf2Async(
    sha256,
    encoder.encode(password),
    salt,
    {
      c: payload.iterations,
      dkLen: 32,
    },
  );
  const clear = gcm(key, iv).decrypt(encrypted);
  return JSON.parse(new TextDecoder().decode(clear)) as T;
}

function AccessGate({
  onUnlock,
}: {
  onUnlock: (archive: Archive) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");

    try {
      const archive = await decryptPayload<Archive>(password, MAIN_PAYLOAD);
      setPassword("");
      onUnlock(archive);
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setPassword("");
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(600 + nextAttempts * 300, 2200)),
      );
      setError("КОД ДОСТУПА НЕ ПРИНЯТ");
      setBusy(false);
    }
  }

  return (
    <main className="gate">
      <div className="gate-grid" aria-hidden="true" />
      <div className="gate-glow gate-glow-a" aria-hidden="true" />
      <div className="gate-glow gate-glow-b" aria-hidden="true" />

      <section className="gate-card" aria-labelledby="gate-title">
        <div className="gate-brand">
          <span className="gate-brand-mark">SFI</span>
          <span>
            SPATIAL PHENOMENA
            <br />
            INITIATIVE
          </span>
        </div>

        <div className="gate-classification">
          <span className="status-dot" />
          ENCRYPTED PERSONNEL ARCHIVE
        </div>

        <p className="gate-object">ОБЪЕКТ №‑13</p>
        <h1 id="gate-title">ДОСТУП ОГРАНИЧЕН</h1>
        <p className="gate-copy">
          Досье зашифровано. Введите персональный код допуска для локальной
          расшифровки материалов.
        </p>

        <form className="gate-form" onSubmit={submit} noValidate>
          <label htmlFor="archive-password">КОД ДОСТУПА</label>
          <div className="password-row">
            <input
              id="archive-password"
              type={visible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={busy}
              autoFocus
            />
            <button
              className="peek-button"
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Скрыть код" : "Показать код"}
            >
              {visible ? "СКР" : "ПОК"}
            </button>
          </div>
          <button className="decrypt-button" type="submit" disabled={busy}>
            <span>{busy ? "РАСШИФРОВКА..." : "РАСШИФРОВАТЬ АРХИВ"}</span>
            <span aria-hidden="true">↗</span>
          </button>
          <p className="gate-error" role="alert" aria-live="polite">
            {error}
          </p>
        </form>

        <div className="gate-footer">
          <span>AES‑256‑GCM</span>
          <span>LOCAL DECRYPTION</span>
          <span>NO SESSION STORAGE</span>
        </div>
      </section>
    </main>
  );
}

function DataGrid({ facts }: { facts: Fact[] }) {
  return (
    <dl className="data-grid">
      {facts.map(([label, value]) => (
        <div key={`${label}-${value}`}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionView({ section }: { section: ArchiveSection }) {
  return (
    <article className="archive-section">
      <header className="section-header">
        <div>
          <p className="section-code">{`${section.code} // ACCESS LOGGED`}</p>
          <p className="section-eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
        </div>
        <span className="section-omega">Ω</span>
      </header>

      <p className="section-lead">{section.lead}</p>

      {section.facts && <DataGrid facts={section.facts} />}

      {section.paragraphs && (
        <div className="prose">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {section.bullets && (
        <ul className="archive-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>
              <span aria-hidden="true">+</span>
              <p>{bullet}</p>
            </li>
          ))}
        </ul>
      )}

      {section.cards && (
        <div className="card-grid">
          {section.cards.map((card) => (
            <section className="info-card" key={card.title}>
              <div className="info-card-top">
                <span>{card.tag}</span>
                <i aria-hidden="true" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </section>
          ))}
        </div>
      )}

      {section.timeline && (
        <ol className="timeline">
          {section.timeline.map((entry) => (
            <li key={entry.phase}>
              <div className="timeline-index">{entry.phase}</div>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {section.abilities && (
        <div className="ability-grid">
          {section.abilities.map((ability) => (
            <section className="ability-card" key={ability.code}>
              <div className="ability-card-top">
                <span>{ability.code}</span>
                <strong>{ability.classification}</strong>
              </div>
              <h3>{ability.title}</h3>
              <p>{ability.effect}</p>
              <div className="ability-limits">
                <span>ОГРАНИЧЕНИЯ</span>
                <ul>
                  {ability.limits.map((limit) => (
                    <li key={limit}>{limit}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      )}

      {section.warning && (
        <aside className="warning-panel">
          <div className="warning-icon" aria-hidden="true">
            !
          </div>
          <div>
            <strong>{section.warning.title}</strong>
            <p>{section.warning.body}</p>
          </div>
        </aside>
      )}
    </article>
  );
}

function MutationGate({
  onUnlock,
}: {
  onUnlock: (mutation: MutationArchive) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");

    try {
      const mutation = await decryptPayload<MutationArchive>(
        password,
        MUTATION_PAYLOAD,
      );
      setPassword("");
      onUnlock(mutation);
    } catch {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setPassword("");
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(700 + nextAttempts * 350, 2400)),
      );
      setError("ПОВТОРНАЯ АВТОРИЗАЦИЯ ОТКЛОНЕНА");
      setBusy(false);
    }
  }

  return (
    <article className="archive-section mutation-seal mutation-gate">
      <div className="seal-ring" aria-hidden="true">
        <span>Ω</span>
      </div>
      <p className="section-code">OMEGA‑BLACK // DOUBLE ENCRYPTED</p>
      <h2>Поглощение Скверной</h2>
      <p>
        Терминальный прогноз хранится в отдельном зашифрованном контуре.
        Требуется повторная авторизация уровня Ω.
      </p>

      <form className="mutation-form" onSubmit={submit} noValidate>
        <label htmlFor="mutation-password">ПОВТОРНЫЙ КОД ДОСТУПА</label>
        <div className="password-row">
          <input
            id="mutation-password"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={busy}
          />
          <button
            className="peek-button"
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Скрыть повторный код" : "Показать повторный код"}
          >
            {visible ? "СКР" : "ПОК"}
          </button>
        </div>
        <button className="mutation-decrypt" type="submit" disabled={busy}>
          <span>{busy ? "РАСШИФРОВКА..." : "ОТКРЫТЬ МАТЕРИАЛ ΩB"}</span>
          <span aria-hidden="true">↗</span>
        </button>
        <p className="gate-error" role="alert" aria-live="polite">
          {error}
        </p>
      </form>

      <div className="seal-status" aria-label="Статус модуля">
        <span className="status-dot status-dot-red" />
        ТЕРМИНАЛЬНЫЙ ПРОГНОЗ // ДОСТУП ЗАБЛОКИРОВАН
      </div>
    </article>
  );
}

function MutationView({
  mutation,
  onClose,
}: {
  mutation: MutationArchive;
  onClose: () => void;
}) {
  return (
    <article className="archive-section mutation-view">
      <header className="mutation-header">
        <div>
          <p className="section-code">{`${mutation.code} // ACCESS LOGGED`}</p>
          <div className="mutation-status">
            <span className="status-dot status-dot-red" />
            {mutation.status}
          </div>
          <h2>{mutation.title}</h2>
          <p>{mutation.subtitle}</p>
        </div>
        <span className="mutation-omega" aria-hidden="true">
          Ω
        </span>
      </header>

      <section className="mutation-summary" aria-labelledby="mutation-summary">
        <p className="mutation-label">ЗАКЛЮЧЕНИЕ НАУЧНОГО ОТДЕЛА</p>
        <h3 id="mutation-summary">Носитель больше не является единственным хозяином тела</h3>
        <p>{mutation.summary}</p>
      </section>

      <DataGrid facts={mutation.metrics} />

      <section className="mutation-timeline" aria-labelledby="mutation-stages">
        <div className="mutation-section-title">
          <p>PROGRESSION MODEL // THIRTEEN STAGES</p>
          <h3 id="mutation-stages">Стадии поглощения</h3>
        </div>

        <nav
          className="mutation-stage-nav"
          aria-label="Быстрый переход по стадиям поглощения"
        >
          {mutation.stages.map((stage, index) => (
            <a href={`#mutation-stage-${index + 1}`} key={stage.index}>
              <span>{stage.index}</span>
              <small>{stage.title}</small>
            </a>
          ))}
        </nav>

        <ol>
          {mutation.stages.map((stage, index) => (
            <li
              id={`mutation-stage-${index + 1}`}
              key={stage.index}
              className="mutation-stage"
            >
              <figure className="mutation-stage-visual">
                <img
                  src={publicAsset(stage.image)}
                  alt={stage.alt}
                  loading="lazy"
                  width="1672"
                  height="941"
                />
                <span className="mutation-stage-index" aria-hidden="true">
                  {stage.index}
                </span>
                <figcaption>
                  <span>MOR‑13 // STAGE {stage.index}</span>
                  <strong>{stage.timing}</strong>
                </figcaption>
              </figure>
              <div className="mutation-stage-copy">
                <div className="mutation-stage-heading">
                  <h4>{stage.title}</h4>
                  <span>{stage.timing}</span>
                </div>
                <p>{stage.body}</p>
                <ul>
                  {stage.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mutation-protocol" aria-labelledby="mutation-protocol">
        <p className="mutation-label">CONTAINMENT DIRECTIVE // Ω‑13</p>
        <h3 id="mutation-protocol">Протокол при ухудшении</h3>
        <ol>
          {mutation.protocol.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <aside className="terminal-note">
        <span aria-hidden="true">!</span>
        <div>
          <p>ТЕРМИНАЛЬНЫЙ ПРОГНОЗ</p>
          <strong>{mutation.finalNote}</strong>
        </div>
      </aside>

      <button className="mutation-close" type="button" onClick={onClose}>
        ЗАБЛОКИРОВАТЬ МАТЕРИАЛ ΩB
      </button>
    </article>
  );
}

function ArchiveShell({
  archive,
  onRelock,
}: {
  archive: Archive;
  onRelock: () => void;
}) {
  const [active, setActive] = useState(archive.sections[0]?.id ?? "containment");
  const [mutation, setMutation] = useState<MutationArchive | null>(null);
  const section = useMemo(
    () => archive.sections.find((item) => item.id === active),
    [active, archive.sections],
  );

  function selectSection(id: string) {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="archive">
      <a className="skip-link" href="#archive-content">
        Перейти к материалам
      </a>

      <aside className="sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => selectSection("containment")}
          aria-label="Открыть главную страницу досье"
        >
          <strong>SFI</strong>
          <span>
            SPATIAL PHENOMENA
            <br />
            INITIATIVE
          </span>
        </button>

        <div className="clearance">
          <span>ACCESS LEVEL</span>
          <strong>Ω</strong>
          <small>SECURE CHANNEL</small>
        </div>

        <nav className="archive-nav" aria-label="Разделы досье">
          <p>PERSONNEL FILES</p>
          {archive.sections.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? "active" : ""}
              onClick={() => selectSection(item.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.nav}
            </button>
          ))}
          <button
            type="button"
            className={`nav-classified ${active === "mutation" ? "active" : ""}`}
            onClick={() => selectSection("mutation")}
          >
            <span>ΩB</span>
            Поглощение Скверной
            <b aria-hidden="true">⌁</b>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div>
            <span className="status-dot" />
            ARCHIVE ONLINE
          </div>
          <button type="button" onClick={onRelock}>
            ЗАКРЫТЬ АРХИВ
          </button>
        </div>
      </aside>

      <main className="archive-main" id="archive-content">
        <header className="mobile-header">
          <button type="button" onClick={() => selectSection("containment")}>
            SFI <span>{"// OBJECT 13"}</span>
          </button>
          <button type="button" onClick={onRelock}>
            ЗАКРЫТЬ
          </button>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">{archive.hero.archive}</p>
            <div className="hero-classification">
              <span className="status-dot" />
              PERSONNEL STATUS // VERIFIED
            </div>
            <p className="hero-object">{archive.hero.object}</p>
            <h1>{archive.hero.callsign}</h1>
            <p className="hero-name">{archive.hero.name}</p>
            <p className="hero-role">{archive.hero.role}</p>
            <div className="hero-tags">
              <span>{archive.hero.status}</span>
              <span>{archive.hero.clearance}</span>
            </div>
          </div>

          <figure className="portrait">
            <img
              src={publicAsset("/doctor.webp")}
              alt="Объект №-13 «Доктор» в чёрной медицинской маске и тактическом капюшоне"
            />
            <figcaption>
              <span>VISUAL RECORD // 13‑A</span>
              <strong>АКТУАЛЬНЫЙ ОБЛИК</strong>
            </figcaption>
            <div className="portrait-scan" aria-hidden="true" />
          </figure>
        </section>

        <div className="status-strip" aria-label="Статус объекта">
          <span>MEDICAL RESEARCHER</span>
          <i />
          <span>MOR‑13 CARRIER</span>
          <i />
          <span>ANOMALOUS MUTATION</span>
          <i />
          <span>ACTIVE SERVICE</span>
        </div>

        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {archive.sections.map((item) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? "active" : ""}
              onClick={() => selectSection(item.id)}
            >
              {item.nav}
            </button>
          ))}
          <button
            type="button"
            className={active === "mutation" ? "active classified" : "classified"}
            onClick={() => selectSection("mutation")}
          >
            Скверна // ΩB
          </button>
        </nav>

        <div className="content-wrap">
          {active === "mutation" ? (
            mutation ? (
              <MutationView
                mutation={mutation}
                onClose={() => setMutation(null)}
              />
            ) : (
              <MutationGate onUnlock={setMutation} />
            )
          ) : section ? (
            <SectionView section={section} />
          ) : null}
        </div>

        <footer className="archive-footer">
          <div>
            <strong>SFI SECURE ARCHIVE // OBJECT №‑13</strong>
            <span>ДОСТУП К МАТЕРИАЛАМ ЗАРЕГИСТРИРОВАН</span>
          </div>
          <div>
            <span>НЕСАНКЦИОНИРОВАННОЕ РАСПРОСТРАНЕНИЕ ЗАПРЕЩЕНО</span>
            <strong>SECURE CONNECTION // ACCESS LEVEL Ω</strong>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  const [archive, setArchive] = useState<Archive | null>(null);

  if (!archive) {
    return <AccessGate onUnlock={setArchive} />;
  }

  return <ArchiveShell archive={archive} onRelock={() => setArchive(null)} />;
}
