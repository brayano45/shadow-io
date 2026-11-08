import React, { useMemo, useState } from "react";
import {
  LayoutGrid,
  Users,
  Settings,
  Search,
  X,
  Sparkles,
  FileText,
  StickyNote,
  Send,
} from "lucide-react";

/* ---------------------------------------------------------
   SHADOW.IO — Dashboard admin
   Liste des prospects, filtrage par statut commercial,
   fiche détaillée (réponses, analyse IA, notes, statut).
--------------------------------------------------------- */

const STATUTS = ["Nouveau", "Qualifié", "Devis envoyé", "Gagné", "Perdu"];
const STATUTS_PROD = ["Préparation", "Design", "Développement", "Tests", "Livraison"];

const STATUT_COLOR = {
  "Nouveau": "#8f8879",
  "Qualifié": "#E3B23C",
  "Devis envoyé": "#5FA8D3",
  "Gagné": "#6FCF97",
  "Perdu": "#C96A5A",
};

const SAMPLE_PROSPECTS = [
  {
    id: 1,
    nom: "Le Comptoir",
    contexte: "Entreprise",
    secteur: "Restaurant",
    type: "Application web",
    score: 72,
    statut: "Qualifié",
    prod: "Préparation",
    date: "22 août 2026",
    resume: "Réservations gérées à la main via WhatsApp, veut centraliser et automatiser les confirmations.",
    fonctionnalites: ["Réservation en ligne", "Confirmation automatique", "Notifications WhatsApp"],
    notes: "Rappelé le 20/08, très motivé, veut lancer avant la rentrée.",
  },
  {
    id: 2,
    nom: "Aïcha K.",
    contexte: "Personnel",
    secteur: "Portfolio photographe",
    type: "Application web",
    score: 41,
    statut: "Nouveau",
    prod: "—",
    date: "23 août 2026",
    resume: "Veut un portfolio simple pour présenter ses shootings et être contactée par email.",
    fonctionnalites: ["Galerie photo", "Formulaire de contact"],
    notes: "",
  },
  {
    id: 3,
    nom: "Fasto Delivery",
    contexte: "Entreprise",
    secteur: "Livraison",
    type: "Application mobile",
    score: 85,
    statut: "Devis envoyé",
    prod: "—",
    date: "19 août 2026",
    resume: "Coursiers coordonnés par appels téléphoniques, veut une app de suivi de commandes en temps réel.",
    fonctionnalites: ["Suivi en temps réel", "Notifications push", "Tableau de bord livreurs"],
    notes: "Devis envoyé le 21/08, budget confirmé à 2.4M FCFA.",
  },
  {
    id: 4,
    nom: "Studio Nova (client agence)",
    contexte: "Client",
    secteur: "Immobilier",
    type: "Application web",
    score: 58,
    statut: "Gagné",
    prod: "Développement",
    date: "10 août 2026",
    resume: "Agence partenaire construit un site vitrine pour un promoteur immobilier.",
    fonctionnalites: ["Catalogue de biens", "Prise de rendez-vous"],
    notes: "Contrat signé, sprint 2 en cours.",
  },
  {
    id: 5,
    nom: "Yannick T.",
    contexte: "Personnel",
    secteur: "Blog tech",
    type: "Application web",
    score: 30,
    statut: "Perdu",
    prod: "—",
    date: "2 août 2026",
    resume: "A finalement opté pour une solution no-code moins chère.",
    fonctionnalites: ["Blog", "Newsletter"],
    notes: "Budget trop juste pour une solution sur mesure.",
  },
];

function StatutBadge({ statut }) {
  return (
    <span className="statut-badge" style={{ color: STATUT_COLOR[statut], borderColor: `${STATUT_COLOR[statut]}55` }}>
      {statut}
    </span>
  );
}

export default function ShadowDashboard({ extraProspects = [] }) {
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [prospects, setProspects] = useState([...extraProspects, ...SAMPLE_PROSPECTS]);

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      const matchStatut = filter === "Tous" || p.statut === filter;
      const matchQuery = p.nom.toLowerCase().includes(query.toLowerCase()) || p.secteur.toLowerCase().includes(query.toLowerCase());
      return matchStatut && matchQuery;
    });
  }, [prospects, filter, query]);

  const updateSelected = (patch) => {
    setProspects((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)));
    setSelected((s) => ({ ...s, ...patch }));
  };

  return (
    <div className="dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body { margin: 0; padding: 0; }

        .dash-root {
          --bg: #08070a;
          --bg-elev: #121014;
          --bg-elev-2: #18151a;
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
          display: flex;
          margin: 0;
        }
        .dash-root * { box-sizing: border-box; }

        .sidebar {
          width: 220px;
          flex-shrink: 0;
          border-right: 1px solid var(--line);
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .sidebar-logo { font-family: var(--font-display); font-weight: 700; font-size: 16px; letter-spacing: 0.14em; padding: 0 6px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
        .sidebar-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          font-size: 14px; color: var(--text-dim);
          cursor: pointer; transition: background .2s, color .2s;
        }
        .sidebar-link[data-active="true"] { background: rgba(227,178,60,0.08); color: var(--amber); }
        .sidebar-link:hover { color: var(--text); }

        .main { flex: 1; min-width: 0; padding: 32px 40px; }
        .main-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px; flex-wrap: wrap; gap: 14px; }
        .main-title { font-family: var(--font-display); font-size: 24px; font-weight: 600; margin: 0; }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-elev); border: 1px solid var(--line); border-radius: 8px;
          padding: 9px 14px; width: 260px;
        }
        .search-box input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .search-box svg { color: var(--text-dim); flex-shrink: 0; }

        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
        .filter-pill {
          font-size: 12px; padding: 7px 14px; border-radius: 16px;
          border: 1px solid var(--line); color: var(--text-dim);
          background: none; cursor: pointer; transition: all .2s;
          font-family: var(--font-mono);
        }
        .filter-pill[data-active="true"] { border-color: var(--amber); color: var(--amber); background: rgba(227,178,60,0.08); }

        .table-wrap { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        .p-row {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1.1fr 0.7fr 1fr 0.9fr;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
          transition: background .15s;
          font-size: 13px;
        }
        .p-row:last-child { border-bottom: none; }
        .p-row:hover { background: var(--bg-elev); }
        .p-row.head { background: var(--bg-elev-2); color: var(--text-dim); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; cursor: default; }
        .p-row.head:hover { background: var(--bg-elev-2); }
        .p-nom { font-weight: 600; }
        .p-sub { color: var(--text-dim); font-size: 12px; margin-top: 2px; }
        .p-score { font-family: var(--font-mono); color: var(--amber); }

        .statut-badge {
          display: inline-block;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid;
          font-family: var(--font-mono);
        }

        .drawer-overlay {
          position: fixed; inset: 0; background: rgba(8,7,10,0.6);
          backdrop-filter: blur(2px);
          z-index: 60;
        }
        .drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(460px, 100vw);
          background: var(--bg-elev);
          border-left: 1px solid var(--line);
          z-index: 61;
          overflow-y: auto;
          padding: 26px;
        }
        .drawer-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
        .drawer-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; margin: 0 0 4px; }
        .drawer-sub { color: var(--text-dim); font-size: 13px; }
        .drawer-close { background: none; border: none; color: var(--text-dim); cursor: pointer; }
        .drawer-close:hover { color: var(--text); }

        .drawer-section { margin-bottom: 22px; }
        .drawer-label { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; color: var(--amber); margin-bottom: 10px; }
        .drawer-text { font-size: 14px; line-height: 1.6; color: var(--text); }
        .drawer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .drawer-chip { font-size: 12px; padding: 6px 12px; border-radius: 14px; border: 1px solid var(--line); color: var(--text-dim); }

        .status-select-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .status-select { flex: 1; }
        .status-select label { display: block; font-size: 11px; color: var(--text-dim); margin-bottom: 6px; font-family: var(--font-mono); }
        .status-select select {
          width: 100%; background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
          padding: 9px 10px; color: var(--text); font-size: 13px; outline: none;
        }

        .drawer-notes {
          width: 100%; background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
          padding: 12px; color: var(--text); font-size: 13px; font-family: var(--font-body);
          min-height: 80px; resize: vertical; outline: none;
        }
        .drawer-notes:focus { border-color: var(--amber); }

        .drawer-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #f0c98a, var(--amber) 55%, #9c691f);
          color: #1a1108; border: none; border-radius: 8px;
          padding: 12px 18px; font-weight: 600; font-size: 14px; cursor: pointer;
          width: 100%; justify-content: center; margin-top: 6px;
        }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .p-row { grid-template-columns: 1.4fr 1fr 0.8fr; }
          .p-row .col-type, .p-row .col-date, .p-row .col-score { display: none; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-logo notranslate" translate="no">SHADOW.IO</div>
        <nav className="sidebar-nav">
          <div className="sidebar-link" data-active="true"><Users size={16} /> Prospects</div>
          <div className="sidebar-link"><LayoutGrid size={16} /> Projets</div>
          <div className="sidebar-link"><Settings size={16} /> Paramètres</div>
        </nav>
      </aside>

      <main className="main">
        <div className="main-head">
          <h1 className="main-title">Prospects</h1>
          <div className="search-box">
            <Search size={14} />
            <input placeholder="Rechercher un prospect..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="filter-row">
          {["Tous", ...STATUTS].map((s) => (
            <button key={s} className="filter-pill" data-active={filter === s} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <div className="p-row head">
            <div>Prospect</div>
            <div>Contexte</div>
            <div className="col-type">Type</div>
            <div className="col-score">Score</div>
            <div>Statut</div>
            <div className="col-date">Date</div>
          </div>
          {filtered.map((p) => (
            <div className="p-row" key={p.id} onClick={() => setSelected(p)}>
              <div>
                <div className="p-nom">{p.nom}</div>
                <div className="p-sub">{p.secteur}</div>
              </div>
              <div>{p.contexte}</div>
              <div className="col-type">{p.type}</div>
              <div className="col-score p-score">{p.score}</div>
              <div><StatutBadge statut={p.statut} /></div>
              <div className="col-date">{p.date}</div>
            </div>
          ))}
        </div>
      </main>

      {selected && (
        <>
          <div className="drawer-overlay" onClick={() => setSelected(null)} />
          <div className="drawer">
            <div className="drawer-head">
              <div>
                <h2 className="drawer-title">{selected.nom}</h2>
                <div className="drawer-sub">{selected.secteur} · {selected.contexte} · {selected.type}</div>
              </div>
              <button className="drawer-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div className="status-select-row">
              <div className="status-select">
                <label>STATUT COMMERCIAL</label>
                <select value={selected.statut} onChange={(e) => updateSelected({ statut: e.target.value })}>
                  {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="status-select">
                <label>STATUT PRODUCTION</label>
                <select value={selected.prod} onChange={(e) => updateSelected({ prod: e.target.value })}>
                  <option value="—">—</option>
                  {STATUTS_PROD.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="drawer-section">
              <div className="drawer-label"><Sparkles size={13} /> RÉSUMÉ ANALYSE IA</div>
              <p className="drawer-text">{selected.resume}</p>
            </div>

            <div className="drawer-section">
              <div className="drawer-label"><FileText size={13} /> FONCTIONNALITÉS DÉTECTÉES</div>
              <div className="drawer-chips">
                {selected.fonctionnalites.map((f) => <span className="drawer-chip" key={f}>{f}</span>)}
              </div>
            </div>

            <div className="drawer-section">
              <div className="drawer-label"><Sparkles size={13} /> SCORE D'AUTOMATISATION</div>
              <p className="drawer-text">{selected.score} / 100</p>
            </div>

            <div className="drawer-section">
              <div className="drawer-label"><StickyNote size={13} /> NOTES INTERNES</div>
              <textarea
                className="drawer-notes"
                value={selected.notes}
                placeholder="Ajouter une note..."
                onChange={(e) => updateSelected({ notes: e.target.value })}
              />
            </div>

            <button className="drawer-cta"><Send size={15} /> Envoyer le devis</button>
          </div>
        </>
      )}
    </div>
  );
}
