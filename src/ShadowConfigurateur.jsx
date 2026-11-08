import React, { useState, useMemo } from "react";
import {
  User,
  Building2,
  Briefcase,
  Globe,
  Smartphone,
  Monitor,
  Workflow,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

/* ---------------------------------------------------------
   SHADOW.IO — Questionnaire dynamique
   Étape 1 : pour qui ?  Étape 2 : type de solution
   Étapes suivantes : questions adaptées au contexte choisi
   (contenu prioritaire — esthétique reprise du thème noir/champagne/or)
--------------------------------------------------------- */

const CONTEXTS = [
  { id: "personnel", label: "Mon usage personnel", desc: "Portfolio, projet perso, présence individuelle.", Icon: User },
  { id: "entreprise", label: "Mon entreprise", desc: "Marque, organisation, activité professionnelle.", Icon: Building2 },
  { id: "client", label: "Un projet pour un client", desc: "Vous êtes freelance ou agence.", Icon: Briefcase },
];

const SOLUTION_TYPES = [
  { id: "web", label: "Application web", Icon: Globe },
  { id: "mobile", label: "Application mobile", Icon: Smartphone },
  { id: "desktop", label: "Solution desktop", Icon: Monitor },
  { id: "automation", label: "Automatisation / IA", Icon: Workflow },
  { id: "unsure", label: "Je ne sais pas encore", Icon: HelpCircle },
];

const QUESTIONS_BY_CONTEXT = {
  personnel: [
    { id: "objectif", label: "Quel est l'objectif de votre site ?", type: "textarea", placeholder: "Ex. présenter mon travail, vendre mes créations, partager mes articles..." },
    { id: "public", label: "À qui s'adresse-t-il ?", type: "text", placeholder: "Ex. recruteurs, clients potentiels, communauté..." },
    { id: "type_site", label: "Quel type de site imaginez-vous ?", type: "select", options: ["Portfolio", "Blog", "Landing page", "Réservation", "Communauté", "Autre"] },
    { id: "style", label: "Quel style visuel vous attire ?", type: "text", placeholder: "Ex. sobre et pro, coloré et créatif, sombre et premium..." },
    { id: "budget", label: "Budget et délai envisagés", type: "select", options: ["< 300 000 FCFA", "300 000 – 800 000 FCFA", "800 000 FCFA+", "Pas encore défini"] },
  ],
  entreprise: [
    { id: "secteur", label: "Nom et secteur de votre entreprise", type: "text", placeholder: "Ex. Restaurant, salon de coiffure, e-commerce..." },
    { id: "objectifs", label: "Quels sont vos objectifs commerciaux ?", type: "textarea", placeholder: "Ex. vendre en ligne, centraliser les réservations, gagner du temps..." },
    { id: "canaux", label: "Quels canaux utilisez-vous aujourd'hui ?", type: "multiselect", options: ["WhatsApp", "Téléphone", "Réseaux sociaux", "Boutique physique", "Aucun pour l'instant"] },
    { id: "fonctionnalites", label: "Quelles fonctionnalités vous intéressent ?", type: "multiselect", options: ["Paiement en ligne", "Réservation", "CRM / gestion clients", "Notifications", "Tableau de bord", "E-commerce"] },
    { id: "budget", label: "Budget et délai envisagés", type: "select", options: ["< 800 000 FCFA", "800 000 – 2 000 000 FCFA", "2 000 000 FCFA+", "Pas encore défini"] },
  ],
  client: [
    { id: "secteur_client", label: "Secteur d'activité de votre client", type: "text", placeholder: "Ex. immobilier, santé, éducation..." },
    { id: "objectif_projet", label: "Quel est l'objectif du projet ?", type: "textarea", placeholder: "Ce que le client cherche à obtenir." },
    { id: "fonctionnalites_demandees", label: "Fonctionnalités déjà demandées par le client", type: "textarea", placeholder: "Listez ce qui a été exprimé jusqu'ici." },
    { id: "budget_client", label: "Budget du client", type: "select", options: ["< 800 000 FCFA", "800 000 – 2 000 000 FCFA", "2 000 000 FCFA+", "À définir avec le client"] },
    { id: "delai", label: "Délai souhaité", type: "select", options: ["Moins d'un mois", "1 à 3 mois", "3 mois et plus", "Flexible"] },
  ],
};

function StepShell({ step, total, children, onBack, showBack }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="step-shell">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">Étape {step} / {total}</div>
      {showBack && (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={15} /> Retour
        </button>
      )}
      {children}
    </div>
  );
}

function ChoiceGrid({ options, value, onSelect, columns }) {
  return (
    <div className="choice-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => {
        const Icon = opt.Icon;
        const active = value === opt.id;
        return (
          <button key={opt.id} className="choice-card" data-active={active} onClick={() => onSelect(opt.id)}>
            <div className="choice-icon"><Icon size={22} strokeWidth={1.6} /></div>
            <div className="choice-label">{opt.label}</div>
            {opt.desc && <div className="choice-desc">{opt.desc}</div>}
            {active && <div className="choice-check"><Check size={14} /></div>}
          </button>
        );
      })}
    </div>
  );
}

function QuestionField({ question, value, onChange }) {
  if (question.type === "text") {
    return (
      <input
        className="field-input"
        type="text"
        placeholder={question.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (question.type === "textarea") {
    return (
      <textarea
        className="field-input field-textarea"
        placeholder={question.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    );
  }
  if (question.type === "select") {
    return (
      <div className="pill-row">
        {question.options.map((opt) => (
          <button
            key={opt}
            className="pill"
            data-active={value === opt}
            onClick={() => onChange(opt)}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  if (question.type === "multiselect") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      onChange(arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt]);
    };
    return (
      <div className="pill-row">
        {question.options.map((opt) => (
          <button
            key={opt}
            className="pill"
            data-active={arr.includes(opt)}
            onClick={() => toggle(opt)}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return null;
}

export default function ShadowConfigurateur({ onComplete = () => {}, onSubmit = () => {} }) {
  const [context, setContext] = useState(null);
  const [solutionType, setSolutionType] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const questions = context ? QUESTIONS_BY_CONTEXT[context] : [];
  const totalSteps = 2 + questions.length + 1; // contexte + type + questions + récap
  const currentStep = context === null ? 1 : solutionType === null ? 2 : done ? totalSteps : 2 + qIndex + 1;

  const contextLabel = useMemo(
    () => CONTEXTS.find((c) => c.id === context)?.label,
    [context]
  );
  const solutionLabel = useMemo(
    () => SOLUTION_TYPES.find((s) => s.id === solutionType)?.label,
    [solutionType]
  );

  const goBack = () => {
    if (done) { setDone(false); return; }
    if (context && solutionType === null) { setContext(null); return; }
    if (solutionType && qIndex === 0) { setSolutionType(null); return; }
    if (qIndex > 0) { setQIndex((i) => i - 1); return; }
  };

  const currentQuestion = questions[qIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canProceed = currentQuestion
    ? currentQuestion.type === "multiselect"
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : Boolean(currentAnswer && String(currentAnswer).trim().length > 0)
    : true;

  const nextQuestion = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setDone(true);
      onComplete({ context, contextLabel, solutionType, solutionLabel, answers: { ...answers, [currentQuestion.id]: currentAnswer } });
    }
  };

  const setAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
  };

  return (
    <div className="config-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body { margin: 0; padding: 0; }

        .config-root {
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
          padding: 0;
          margin: 0;
        }
        .config-root * { box-sizing: border-box; }

        .config-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 5vw;
          border-bottom: 1px solid var(--line);
        }
        .config-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.14em;
        }
        .config-time {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
        }

        .step-shell {
          max-width: 720px;
          margin: 0 auto;
          padding: 6vw 5vw 10vw;
        }
        .progress-track {
          width: 100%;
          height: 3px;
          background: var(--line);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-fill {
          height: 100%;
          background: var(--amber);
          transition: width .3s ease;
        }
        .progress-label {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
          margin-bottom: 28px;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none;
          color: var(--text-dim);
          font-family: var(--font-body);
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 18px;
          padding: 0;
        }
        .back-btn:hover { color: var(--text); }

        .step-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(24px, 3vw, 32px);
          line-height: 1.25;
          margin: 0 0 10px 0;
        }
        .step-sub {
          color: var(--text-dim);
          font-size: 15px;
          margin-bottom: 32px;
        }

        .choice-grid { display: grid; gap: 14px; }
        .choice-card {
          position: relative;
          text-align: left;
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 22px 20px;
          cursor: pointer;
          color: var(--text);
          transition: border-color .2s, background .2s, transform .2s;
        }
        .choice-card:hover { border-color: rgba(227,178,60,0.4); transform: translateY(-2px); }
        .choice-card[data-active="true"] { border-color: var(--amber); background: rgba(227,178,60,0.06); }
        .choice-icon { color: var(--amber); margin-bottom: 14px; }
        .choice-label { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .choice-desc { font-size: 13px; color: var(--text-dim); line-height: 1.4; }
        .choice-check {
          position: absolute; top: 16px; right: 16px;
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--amber); color: #1a1108;
          display: flex; align-items: center; justify-content: center;
        }

        .field-input {
          width: 100%;
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 14px 16px;
          color: var(--text);
          font-family: var(--font-body);
          font-size: 15px;
          outline: none;
          transition: border-color .2s;
        }
        .field-input::placeholder { color: var(--text-dim); }
        .field-input:focus { border-color: var(--amber); }
        .field-textarea { resize: vertical; min-height: 100px; }

        .pill-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .pill {
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 9px 16px;
          font-size: 13px;
          color: var(--text-dim);
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
        }
        .pill:hover { color: var(--text); }
        .pill[data-active="true"] { border-color: var(--amber); color: var(--amber); background: rgba(227,178,60,0.08); }

        .step-actions { display: flex; justify-content: flex-end; margin-top: 32px; }
        .next-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #f0c98a, var(--amber) 55%, #9c691f);
          color: #1a1108;
          border: none; border-radius: 8px;
          padding: 13px 22px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .next-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(227,178,60,0.3); }
        .next-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

        .recap-card {
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .recap-row { display: flex; justify-content: space-between; gap: 20px; padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
        .recap-row:last-child { border-bottom: none; }
        .recap-key { color: var(--text-dim); }
        .recap-val { color: var(--text); text-align: right; max-width: 60%; }

        @media (max-width: 620px) {
          .choice-grid { grid-template-columns: 1fr !important; }
          .recap-row { flex-direction: column; gap: 4px; }
          .recap-val { text-align: left; max-width: 100%; }
        }
      `}</style>

      <nav className="config-nav">
        <div className="config-logo notranslate" translate="no">SHADOW.IO</div>
        <div className="config-time">≈ 3 min</div>
      </nav>

      {context === null && (
        <StepShell step={1} total={totalSteps} showBack={false}>
          <h1 className="step-title">Pour qui réalisez-vous ce projet ?</h1>
          <p className="step-sub">Ça nous permet de poser les bonnes questions dès le départ.</p>
          <ChoiceGrid options={CONTEXTS} value={context} onSelect={setContext} columns={1} />
        </StepShell>
      )}

      {context !== null && solutionType === null && (
        <StepShell step={2} total={totalSteps} showBack onBack={goBack}>
          <h1 className="step-title">Quel type de solution imaginez-vous ?</h1>
          <p className="step-sub">Pas d'inquiétude si vous hésitez encore — Shadow peut vous aider à trancher.</p>
          <ChoiceGrid options={SOLUTION_TYPES} value={solutionType} onSelect={setSolutionType} columns={1} />
        </StepShell>
      )}

      {context !== null && solutionType !== null && !done && currentQuestion && (
        <StepShell step={2 + qIndex + 1} total={totalSteps} showBack onBack={goBack}>
          <h1 className="step-title">{currentQuestion.label}</h1>
          <p className="step-sub">{contextLabel} · {solutionLabel}</p>
          <QuestionField question={currentQuestion} value={currentAnswer} onChange={setAnswer} />
          <div className="step-actions">
            <button className="next-btn" disabled={!canProceed} onClick={nextQuestion}>
              {qIndex < questions.length - 1 ? "Suivant" : "Voir le récapitulatif"} <ArrowRight size={16} />
            </button>
          </div>
        </StepShell>
      )}

      {done && (
        <StepShell step={totalSteps} total={totalSteps} showBack onBack={goBack}>
          <h1 className="step-title">Votre brief est prêt</h1>
          <p className="step-sub">Voici ce que Shadow a retenu — vous pouvez revenir en arrière pour ajuster.</p>
          <div className="recap-card">
            <div className="recap-row"><span className="recap-key">Contexte</span><span className="recap-val">{contextLabel}</span></div>
            <div className="recap-row"><span className="recap-key">Type de solution</span><span className="recap-val">{solutionLabel}</span></div>
            {questions.map((q) => (
              <div className="recap-row" key={q.id}>
                <span className="recap-key">{q.label}</span>
                <span className="recap-val">
                  {Array.isArray(answers[q.id]) ? answers[q.id].join(", ") : (answers[q.id] || "—")}
                </span>
              </div>
            ))}
          </div>
          <div className="step-actions">
            <button className="next-btn" onClick={() => onSubmit({ context, contextLabel, solutionType, solutionLabel, answers })}>Demander mon devis <ArrowRight size={16} /></button>
          </div>
        </StepShell>
      )}
    </div>
  );
}
