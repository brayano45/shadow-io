import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  CalendarClock,
  CreditCard,
  Users,
  BarChart3,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ---------------------------------------------------------
   SHADOW.IO — Résultat de l'analyse IA
   Résumé du besoin + fonctionnalités détectées + score
   d'opportunité d'automatisation + estimation indicative.
   Données d'exemple (restaurant / réservations WhatsApp),
   à remplacer par la sortie réelle du questionnaire.
--------------------------------------------------------- */

const SAMPLE = {
  contexte: "Entreprise",
  secteur: "Restaurant",
  resume:
    "Le restaurant reçoit la majorité de ses réservations par WhatsApp et téléphone. Les employés confirment manuellement, ce qui crée des oublis et une charge de travail répétitive aux heures de pointe.",
  fonctionnalites: [
    "Réservation en ligne",
    "Confirmation automatique",
    "Base de données clients",
    "Notifications SMS/WhatsApp",
    "Tableau de bord des réservations",
  ],
  suggestions: [
    "Automatiser la confirmation de réservation dès qu'elle est enregistrée.",
    "Centraliser les demandes WhatsApp dans un seul tableau de bord.",
    "Relancer automatiquement les clients réguliers pour fidéliser.",
  ],
  score: 72,
  breakdown: [
    { label: "Communication", Icon: MessageSquare, value: 80 },
    { label: "Réservations", Icon: CalendarClock, value: 88 },
    { label: "Paiements", Icon: CreditCard, value: 45 },
    { label: "Gestion clients", Icon: Users, value: 70 },
    { label: "Reporting", Icon: BarChart3, value: 60 },
    { label: "Support", Icon: Headphones, value: 40 },
  ],
  estimation: {
    niveau: "Intermédiaire",
    delai: "4 à 6 semaines",
    budget: "800 000 – 1 500 000 FCFA",
    inclus: ["Site + réservation en ligne", "Notifications automatiques", "Tableau de bord admin"],
    options: ["Paiement en ligne", "Application mobile compagnon"],
  },
};

function ScoreRing({ value }) {
  const [display, setDisplay] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(t * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(239,228,208,0.10)" strokeWidth="10" />
      <circle
        cx="90" cy="90" r={radius} fill="none"
        stroke="#E3B23C" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 90 90)"
        style={{ transition: "stroke-dashoffset 0.1s linear" }}
      />
      <text x="90" y="86" textAnchor="middle" fontSize="34" fontWeight="600" fill="#EFE4D0" fontFamily="Cinzel, serif">
        {display}
      </text>
      <text x="90" y="110" textAnchor="middle" fontSize="12" fill="#8f8879" fontFamily="JetBrains Mono, monospace">
        / 100
      </text>
    </svg>
  );
}

function buildAnalysis(submission) {
  if (!submission) return SAMPLE;
  const { contextLabel, solutionLabel, answers = {} } = submission;

  const fonctionnalites = Array.isArray(answers.fonctionnalites) && answers.fonctionnalites.length
    ? answers.fonctionnalites
    : Array.isArray(answers.canaux)
      ? ["Site vitrine", "Formulaire de contact", "Notifications"]
      : ["Présentation claire du besoin", "Formulaire de contact"];

  const canaux = Array.isArray(answers.canaux) ? answers.canaux : [];
  const resumeParts = [
    answers.objectif || answers.objectifs || answers.objectif_projet,
    answers.secteur || answers.secteur_client,
  ].filter(Boolean);

  const score = Math.min(95, Math.max(25, 40 + fonctionnalites.length * 8 + canaux.length * 5));

  const breakdown = SAMPLE.breakdown.map((b, i) => ({
    ...b,
    value: Math.min(95, Math.max(20, score - 15 + i * 6)),
  }));

  return {
    contexte: contextLabel || "Contexte",
    secteur: answers.secteur || answers.secteur_client || answers.type_site || solutionLabel || "Projet",
    resume: resumeParts.length
      ? resumeParts.join(" — ")
      : "Le besoin décrit sera analysé plus finement lors de l'échange avec l'équipe Shadow.",
    fonctionnalites,
    suggestions: SAMPLE.suggestions,
    score,
    breakdown,
    estimation: {
      niveau: score > 70 ? "Avancé" : score > 45 ? "Intermédiaire" : "Simple",
      delai: answers.delai || (score > 70 ? "6 à 8 semaines" : "3 à 5 semaines"),
      budget: answers.budget || answers.budget_client || "À définir avec l'équipe",
      inclus: fonctionnalites.slice(0, 3),
      options: fonctionnalites.slice(3),
    },
  };
}

export default function ShadowAnalyse({ submission, data, onSubmitDevis = () => {}, onBack = () => {} }) {
  const resolvedData = data || buildAnalysis(submission);
  return (
    <div className="analyse-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body { margin: 0; padding: 0; }

        .analyse-root {
          --bg: #08070a;
          --bg-elev: #121014;
          --line: rgba(239,228,208,0.10);
          --text: #efe4d0;
          --text-dim: #8f8879;
          --amber: #e3b23c;
          --amber-soft: rgba(227,178,60,0.10);
          --font-display: 'Cinzel', serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          width: 100vw;
          max-width: 100%;
          margin: 0;
        }
        .analyse-root * { box-sizing: border-box; }

        .a-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 5vw;
          border-bottom: 1px solid var(--line);
        }
        .a-logo { font-family: var(--font-display); font-weight: 700; font-size: 17px; letter-spacing: 0.14em; }
        .a-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
          color: var(--amber); border: 1px solid rgba(227,178,60,0.3);
          padding: 6px 12px; border-radius: 20px;
        }

        .a-wrap { max-width: 960px; margin: 0 auto; padding: 6vw 5vw 10vw; }

        .a-head { margin-bottom: 40px; }
        .a-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; color: var(--amber); margin-bottom: 14px; }
        .a-title { font-family: var(--font-display); font-weight: 600; font-size: clamp(26px, 3.2vw, 40px); line-height: 1.2; margin: 0 0 16px 0; }
        .a-context { color: var(--text-dim); font-size: 14px; font-family: var(--font-mono); }

        .a-card {
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .a-card-title {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-size: 17px; font-weight: 600;
          margin: 0 0 16px 0;
        }
        .a-card-title svg { color: var(--amber); }
        .a-resume { color: var(--text); font-size: 15px; line-height: 1.65; }

        .a-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .a-chip {
          display: flex; align-items: center; gap: 8px;
          background: rgba(227,178,60,0.06);
          border: 1px solid rgba(227,178,60,0.2);
          border-radius: 20px;
          padding: 9px 14px;
          font-size: 13px;
          color: var(--text);
        }
        .a-chip svg { color: var(--amber); flex-shrink: 0; }

        .a-suggestions { display: flex; flex-direction: column; gap: 14px; }
        .a-suggestion { display: flex; gap: 12px; font-size: 14px; line-height: 1.55; color: var(--text); }
        .a-suggestion svg { color: var(--amber); flex-shrink: 0; margin-top: 2px; }

        .score-section { display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; }
        .score-breakdown { display: flex; flex-direction: column; gap: 14px; }
        .score-row { display: grid; grid-template-columns: 24px 1fr auto; align-items: center; gap: 10px; }
        .score-row svg { color: var(--text-dim); }
        .score-row-label { font-size: 13px; color: var(--text-dim); }
        .score-bar-track { grid-column: 1 / -1; height: 4px; background: var(--line); border-radius: 2px; overflow: hidden; margin-top: -6px; }
        .score-bar-fill { height: 100%; background: var(--amber); border-radius: 2px; }
        .score-value { font-family: var(--font-mono); font-size: 12px; color: var(--amber); }
        .score-note { color: var(--text-dim); font-size: 12px; margin-top: 18px; line-height: 1.5; }

        .estim-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 16px; }
        .estim-item { }
        .estim-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 6px; }
        .estim-value { font-family: var(--font-display); font-size: 17px; font-weight: 600; }
        .estim-list-title { font-size: 12px; color: var(--text-dim); margin: 18px 0 8px; }
        .estim-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .estim-tag { font-size: 12px; padding: 6px 12px; border-radius: 14px; border: 1px solid var(--line); color: var(--text-dim); }
        .estim-tag.included { border-color: rgba(227,178,60,0.3); color: var(--amber); }

        .a-cta-row { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
        .a-cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #f0c98a, var(--amber) 55%, #9c691f);
          color: #1a1108; border: none; border-radius: 8px;
          padding: 14px 22px; font-weight: 600; font-size: 15px; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .a-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(227,178,60,0.3); }
        .a-cta-ghost {
          font-family: var(--font-mono); font-size: 13px; color: var(--text-dim);
          background: none; border: 1px solid var(--line); border-radius: 8px;
          padding: 13px 20px; cursor: pointer; transition: color .2s, border-color .2s;
        }
        .a-cta-ghost:hover { color: var(--text); border-color: var(--text-dim); }

        .a-disclaimer { font-size: 12px; color: var(--text-dim); margin-top: 20px; line-height: 1.5; }

        @media (max-width: 760px) {
          .score-section { grid-template-columns: 1fr; justify-items: center; text-align: left; }
          .estim-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <nav className="a-nav">
        <div className="a-logo notranslate" translate="no">SHADOW.IO</div>
        <div className="a-badge"><Sparkles size={13} /> ANALYSE IA</div>
      </nav>

      <div className="a-wrap">
        <div className="a-head">
          <div className="a-eyebrow">RÉSULTAT DE L'ANALYSE</div>
          <h1 className="a-title">Voici ce que Shadow a compris de votre besoin.</h1>
          <div className="a-context">{resolvedData.contexte} · {resolvedData.secteur}</div>
        </div>

        <div className="a-card">
          <h2 className="a-card-title"><Sparkles size={18} /> Résumé automatique</h2>
          <p className="a-resume">{resolvedData.resume}</p>
        </div>

        <div className="a-card">
          <h2 className="a-card-title"><CheckCircle2 size={18} /> Fonctionnalités détectées</h2>
          <div className="a-chips">
            {resolvedData.fonctionnalites.map((f) => (
              <div className="a-chip" key={f}><CheckCircle2 size={14} />{f}</div>
            ))}
          </div>
        </div>

        <div className="a-card">
          <h2 className="a-card-title">Score d'opportunité d'automatisation</h2>
          <div className="score-section">
            <ScoreRing value={resolvedData.score} />
            <div className="score-breakdown">
              {resolvedData.breakdown.map((b) => (
                <div className="score-row" key={b.label}>
                  <b.Icon size={16} />
                  <span className="score-row-label">{b.label}</span>
                  <span className="score-value">{b.value}%</span>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="score-note">
            Ce score est une estimation indicative basée sur vos réponses — pas une promesse de gain financier.
          </p>
        </div>

        <div className="a-card">
          <h2 className="a-card-title">Suggestions d'automatisation</h2>
          <div className="a-suggestions">
            {resolvedData.suggestions.map((s, i) => (
              <div className="a-suggestion" key={i}><Sparkles size={15} /><span>{s}</span></div>
            ))}
          </div>
        </div>

        <div className="a-card">
          <h2 className="a-card-title">Estimation indicative</h2>
          <div className="estim-grid">
            <div className="estim-item">
              <div className="estim-label">NIVEAU</div>
              <div className="estim-value">{resolvedData.estimation.niveau}</div>
            </div>
            <div className="estim-item">
              <div className="estim-label">DÉLAI</div>
              <div className="estim-value">{resolvedData.estimation.delai}</div>
            </div>
            <div className="estim-item">
              <div className="estim-label">BUDGET</div>
              <div className="estim-value">{resolvedData.estimation.budget}</div>
            </div>
          </div>
          <div className="estim-list-title">Inclus</div>
          <div className="estim-list">
            {resolvedData.estimation.inclus.map((i) => <span className="estim-tag included" key={i}>{i}</span>)}
          </div>
          <div className="estim-list-title">Options supplémentaires</div>
          <div className="estim-list">
            {resolvedData.estimation.options.map((o) => <span className="estim-tag" key={o}>{o}</span>)}
          </div>
          <p className="a-disclaimer">
            Cette estimation est indicative et sera confirmée par un devis validé par l'équipe Shadow.
          </p>
        </div>

        <div className="a-cta-row">
          <button className="a-cta-primary" onClick={() => onSubmitDevis(resolvedData)}>Demander mon devis <ArrowRight size={16} /></button>
          <button className="a-cta-ghost" onClick={onBack}>Modifier mes réponses</button>
        </div>
      </div>
    </div>
  );
}
