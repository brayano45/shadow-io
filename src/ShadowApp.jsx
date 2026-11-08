import React, { useState } from "react";
import ShadowLanding from "./ShadowLanding";
import ShadowConfigurateur from "./ShadowConfigurateur";
import ShadowAnalyse from "./ShadowAnalyse";
import ShadowDashboard from "./ShadowDashboard";

/* ---------------------------------------------------------
   SHADOW.IO — Orchestrateur
   Parcours réel : Landing -> Questionnaire -> Analyse IA
   -> confirmation. Le Dashboard admin reçoit les demandes
   soumises (accessible via le lien discret en bas de page).
--------------------------------------------------------- */

let idCounter = 100;

export default function ShadowApp() {
  const [page, setPage] = useState("landing");
  const [submission, setSubmission] = useState(null);
  const [prospects, setProspects] = useState([]);

  const goLanding = () => setPage("landing");
  const goConfigurateur = () => setPage("questionnaire");
  const goAnalyse = (sub) => {
    setSubmission(sub);
    setPage("analyse");
  };

  const handleDevisRequest = (analysisData) => {
    const newProspect = {
      id: idCounter++,
      nom: submission?.answers?.secteur || submission?.answers?.objectif || "Nouveau prospect",
      contexte: submission?.contextLabel || "—",
      secteur: analysisData.secteur,
      type: submission?.solutionLabel || "—",
      score: analysisData.score,
      statut: "Nouveau",
      prod: "—",
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      resume: analysisData.resume,
      fonctionnalites: analysisData.fonctionnalites,
      notes: "",
    };
    setProspects((prev) => [newProspect, ...prev]);
    setPage("confirmation");
  };

  if (page === "landing") return <ShadowLanding onStart={goConfigurateur} />;

  if (page === "questionnaire") {
    return <ShadowConfigurateur onSubmit={goAnalyse} />;
  }

  if (page === "analyse") {
    return (
      <ShadowAnalyse
        submission={submission}
        onSubmitDevis={handleDevisRequest}
        onBack={goConfigurateur}
      />
    );
  }

  if (page === "confirmation") {
    return (
      <div style={{
        minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center",
        background: "#08070a", color: "#efe4d0", fontFamily: "Inter, sans-serif", padding: "5vw",
      }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 28, fontWeight: 600 }}>Demande envoyée.</div>
        <p style={{ color: "#8f8879", maxWidth: 420, lineHeight: 1.6 }}>
          L'équipe Shadow a bien reçu votre brief. Vous serez recontacté sous peu pour affiner le devis.
        </p>
        <button
          onClick={goLanding}
          style={{
            marginTop: 10, background: "linear-gradient(135deg, #f0c98a, #e3b23c 55%, #9c691f)",
            color: "#1a1108", border: "none", borderRadius: 8, padding: "13px 22px",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          Retour à l'accueil
        </button>
        <button
          onClick={() => setPage("dashboard")}
          style={{
            background: "none", border: "1px solid rgba(239,228,208,0.15)", color: "#8f8879",
            borderRadius: 8, padding: "11px 18px", cursor: "pointer", fontSize: 12, marginTop: 4,
          }}
        >
          Voir le dashboard admin (démo)
        </button>
      </div>
    );
  }

  if (page === "dashboard") {
    return <ShadowDashboard extraProspects={prospects} />;
  }

  return null;
}
