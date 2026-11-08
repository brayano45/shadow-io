import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Globe,
  Smartphone,
  Monitor,
  Workflow,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

/* ---------------------------------------------------------
   SHADOW.IO — Landing (Hero + Services)
   Palette : anthracite / cuivre / ambre — plein écran, sans cadre
--------------------------------------------------------- */

function ShadowCore({ reduceMotion }) {
  const group = useRef();
  const inner = useRef();
  const points = useRef();
  const target = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const count = 240;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.3 + Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    target.current.x = state.pointer.y * 0.25;
    target.current.y = state.pointer.x * 0.35;

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.current.x, 0.04);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, target.current.y * 0.3, 0.04);
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.22;
      inner.current.rotation.x += delta * 0.08;
    }
    if (points.current) points.current.rotation.y -= delta * 0.04;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshBasicMaterial color="#EFE4D0" wireframe transparent opacity={0.28} />
      </mesh>

      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshStandardMaterial
          color="#151316"
          metalness={0.92}
          roughness={0.18}
          emissive="#E3B23C"
          emissiveIntensity={0.12}
        />
      </mesh>

      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.026}
          color="#EFE4D0"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function HeroScene({ reduceMotion }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 2, 4]} intensity={2.2} color="#EFE4D0" />
      <pointLight position={[-3, -2, -3]} intensity={0.9} color="#E3B23C" />
      <ShadowCore reduceMotion={reduceMotion} />
    </Canvas>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function ServiceCard({ Icon, tag, title, desc, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="s-card" style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }} data-visible={visible}>
      <div className="s-icon"><Icon size={20} strokeWidth={1.6} /></div>
      <div className="s-tag">{tag}</div>
      <h3 className="s-title">{title}</h3>
      <p className="s-desc">{desc}</p>
    </div>
  );
}

export default function ShadowLanding({ onStart = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [servicesRef, servicesVisible] = useReveal();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const services = [
    { Icon: Globe, tag: "WEB", title: "Application web", desc: "Sites et plateformes qui transforment vos visiteurs en clients qualifiés." },
    { Icon: Smartphone, tag: "MOBILE", title: "Application mobile", desc: "Des apps iOS et Android pensées pour l'usage réel, pas pour la démo." },
    { Icon: Monitor, tag: "DESKTOP", title: "Solution desktop", desc: "Des logiciels métier fiables, installés là où le travail se fait vraiment." },
    { Icon: Workflow, tag: "AUTOMATION", title: "Automatisation & IA", desc: "Les tâches répétitives disparaissent, remplacées par des flux intelligents." },
  ];

  return (
    <div className="shadow-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        html, body { margin: 0; padding: 0; }

        .shadow-root {
          --bg: #08070a;
          --bg-elev: #121014;
          --line: rgba(239,228,208,0.10);
          --text: #efe4d0;
          --text-dim: #8f8879;
          --copper: #efe4d0;
          --copper-bright: #ffffff;
          --amber: #e3b23c;
          --amber-soft: rgba(227,178,60,0.10);
          --chrome: linear-gradient(135deg, #fff 0%, #efe4d0 30%, #b8ac95 50%, #fff 65%, #efe4d0 100%);
          --font-display: 'Cinzel', serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          background:
            radial-gradient(circle at 12% 0%, rgba(239,228,208,0.05), transparent 45%),
            radial-gradient(circle at 88% 100%, rgba(227,178,60,0.05), transparent 45%),
            var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          width: 100vw;
          max-width: 100%;
          overflow-x: hidden;
          margin: 0;
        }
        .shadow-root * { box-sizing: border-box; }

        .nav {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 5vw;
          background: rgba(16,17,18,0.78);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .nav-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.16em;
          background: var(--chrome);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nav-links { display: flex; gap: 30px; font-size: 14px; color: var(--text-dim); }
        .nav-links a { color: var(--text-dim); text-decoration: none; transition: color .2s; }
        .nav-links a:hover { color: var(--amber); }
        .nav-right { display: flex; align-items: center; gap: 14px; }
        .nav-cta {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: #1a1108;
          background: linear-gradient(135deg, #f0c98a, var(--amber) 55%, #a9691f);
          border: none;
          border-radius: 6px;
          padding: 9px 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: transform .2s, box-shadow .2s;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(217,162,75,0.28); }
        .nav-burger { display: none; background: none; border: none; color: var(--amber); cursor: pointer; }
        .nav-mobile-panel { display: none; }

        .hero {
          position: relative;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          min-height: 84vh;
          width: 100%;
          padding: 4vw 5vw;
          gap: 20px;
        }
        .hero-content { position: relative; z-index: 2; min-width: 0; }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.16em;
          color: var(--amber);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eyebrow::before { content: ''; width: 22px; height: 1px; background: var(--amber); display: inline-block; }
        .headline {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.4vw, 60px);
          line-height: 1.12;
          letter-spacing: 0.01em;
          margin: 0 0 22px 0;
        }
        .headline em {
          font-style: normal;
          background: linear-gradient(135deg, var(--copper-bright), var(--copper) 60%, #7a3f1c);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sub { font-size: 16px; line-height: 1.65; color: var(--text-dim); max-width: 460px; margin-bottom: 32px; }
        .cta-row { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 15px;
          color: #1a1108;
          background: linear-gradient(135deg, #f0c98a, var(--amber) 50%, #9c691f);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 8px;
          padding: 14px 22px;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(217,162,75,0.3); }
        .btn-ghost {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--text-dim);
          text-decoration: none;
          border-bottom: 1px solid var(--line);
          padding-bottom: 3px;
          transition: color .2s, border-color .2s;
        }
        .btn-ghost:hover { color: var(--copper-bright); border-color: var(--copper-bright); }

        .hero-canvas-wrap {
          position: relative;
          height: 60vh;
          min-height: 380px;
          width: 100%;
        }
        .hero-canvas-wrap canvas { outline: none; }
        .hero-glow {
          position: absolute; inset: -10%;
          background: radial-gradient(circle at 60% 45%, rgba(239,228,208,0.10), transparent 60%);
          pointer-events: none;
        }

        .services { padding: 7vw 5vw 9vw; border-top: 1px solid var(--line); width: 100%; }
        .services-head { max-width: 620px; margin-bottom: 52px; }
        .services-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.16em; color: var(--copper-bright); margin-bottom: 16px; }
        .services-title { font-family: var(--font-display); font-weight: 600; font-size: clamp(24px, 2.8vw, 36px); line-height: 1.2; margin: 0 0 14px 0; }
        .services-sub { color: var(--text-dim); font-size: 16px; line-height: 1.6; }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--line);
          width: 100%;
        }
        .s-card {
          background: var(--bg-elev);
          padding: 30px 24px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .6s ease, transform .6s ease, background .25s ease;
          min-width: 0;
        }
        .s-card[data-visible="true"] { opacity: 1; transform: translateY(0); }
        .s-card:hover { background: #211611; }
        .s-icon {
          width: 40px; height: 40px;
          border-radius: 9px;
          background: var(--amber-soft);
          color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .s-tag { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; color: var(--copper-bright); margin-bottom: 10px; }
        .s-title { font-family: var(--font-display); font-size: 17px; font-weight: 600; margin: 0 0 10px 0; }
        .s-desc { font-size: 14px; line-height: 1.55; color: var(--text-dim); margin: 0; }

        .footer {
          width: 100%;
          border-top: 1px solid var(--line);
          padding: 6vw 5vw 3vw;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 5vw;
        }
        .footer-brand-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.16em;
          background: var(--chrome);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 14px;
        }
        .footer-tagline {
          font-size: 15px;
          color: var(--text-dim);
          line-height: 1.6;
          max-width: 320px;
        }
        .footer-col-title {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.12em;
          color: var(--amber);
          margin-bottom: 18px;
        }
        .footer-col a {
          display: block;
          color: var(--text-dim);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 12px;
          transition: color .2s;
        }
        .footer-col a:hover { color: var(--text); }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 26px;
          border-top: 1px solid var(--line);
          font-size: 12px;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        @media (max-width: 720px) {
          .footer-top { grid-template-columns: 1fr; gap: 28px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }

        .contact-fab {
          position: fixed;
          bottom: 22px;
          right: 22px;
          z-index: 50;
          width: 54px; height: 54px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          background: linear-gradient(135deg, #f0c98a, var(--amber) 55%, #9c691f);
          color: #1a1108;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(227,178,60,0.35);
          transition: transform .2s, box-shadow .2s;
        }
        .contact-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 30px rgba(227,178,60,0.5); }

        @media (prefers-reduced-motion: reduce) {
          .s-card { transition: none; opacity: 1; transform: none; }
        }

        @media (max-width: 960px) {
          .nav-links { display: none; }
          .nav-burger { display: block; }
          .nav-mobile-panel[data-open="true"] {
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: fixed;
            top: 60px;
            left: 0; right: 0;
            background: var(--bg-elev);
            border-bottom: 1px solid var(--line);
            padding: 20px 5vw 26px;
            z-index: 39;
          }
          .nav-mobile-panel a { color: var(--text); text-decoration: none; font-size: 15px; }

          .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 8vw; gap: 28px; }
          .hero-canvas-wrap { height: 300px; min-height: 300px; order: 2; }
          .hero-content { order: 1; }
          .sub { max-width: 100%; }

          .services-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 620px) {
          .nav-cta { display: none; }
          .services-grid { grid-template-columns: 1fr; }
          .headline { font-size: 30px; }
          .cta-row { flex-direction: column; align-items: flex-start; gap: 14px; }
        }

        @media (max-width: 380px) {
          .nav { padding: 14px 4vw; }
          .hero { padding: 8vw 4vw; }
          .services { padding: 12vw 4vw; }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-logo notranslate" translate="no">SHADOW.IO</div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#processus">Processus</a>
        </div>
        <div className="nav-right">
          <button className="nav-cta" onClick={onStart}>Créer mon projet</button>
          <button className="nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <div className="nav-mobile-panel" data-open={menuOpen}>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#intelligence" onClick={() => setMenuOpen(false)}>Intelligence</a>
        <a href="#processus" onClick={() => setMenuOpen(false)}>Processus</a>
        <button className="nav-cta" style={{ width: "fit-content" }} onClick={onStart}>Créer mon projet</button>
      </div>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">SYSTÈME D'INGÉNIERIE DIGITALE</div>
          <h1 className="headline">
            Une idée devient <em>un système.</em>
          </h1>
          <p className="sub">
            Décrivez votre besoin. <span className="notranslate" translate="no">Shadow</span> l'analyse, repère ce qu'il faut
            automatiser, et prépare la solution — web, mobile, desktop.
          </p>
          <div className="cta-row">
            <button className="btn-primary" onClick={onStart}>Créer mon projet <ArrowRight size={16} /></button>
            <a className="btn-ghost" href="#services">Voir comment ça marche</a>
          </div>
        </div>
        <div className="hero-canvas-wrap">
          <div className="hero-glow" />
          <HeroScene reduceMotion={reduceMotion} />
        </div>
      </section>

      <section className="services" id="services">
        <div className="services-head" ref={servicesRef} data-visible={servicesVisible}>
          <div className="services-eyebrow">CE QUE SHADOW CONSTRUIT</div>
          <h2 className="services-title">Une seule entrée. Quatre types de solutions.</h2>
          <p className="services-sub">
            Peu importe la forme que prend votre projet — Shadow qualifie le
            besoin d'abord, la plateforme ensuite.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <ServiceCard key={s.tag} {...s} delay={i * 90} />
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-logo notranslate" translate="no">SHADOW.IO</div>
            <p className="footer-tagline">
              Une idée devient un système. Shadow analyse, structure et
              construit — web, mobile, desktop.
            </p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">NAVIGATION</div>
            <a href="#services">Services</a>
            <a href="#intelligence">Intelligence</a>
            <a href="#processus">Processus</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">CONTACT</div>
            <a href="mailto:contact@shadow.io">contact@shadow.io</a>
            <a href="#">Telegram</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 <span className="notranslate" translate="no">Shadow.io</span> — Tous droits réservés.</span>
          <span>Douala, Cameroun</span>
        </div>
      </footer>

      <button className="contact-fab" aria-label="Contacter Shadow">
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
