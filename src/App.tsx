import { useState, useRef, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --clay:    #C4714A;
    --clay-lt: #F2E4D8;
    --clay-dk: #8B4C2C;
    --sand:    #F7F0E6;
    --slate:   #2C3039;
    --slate-lt:#4A5260;
    --stone:   #8D8880;
    --white:   #FEFCF9;
    --green:   #4A7C59;
    --amber:   #D4891A;
    --radius:  14px;
  }

  body { background: var(--sand); font-family: 'DM Sans', sans-serif; color: var(--slate); min-height: 100vh; }

  h1, h2, h3 { font-family: 'Fraunces', Georgia, serif; }

  .app { max-width: 480px; margin: 0 auto; padding: 0 0 100px; min-height: 100vh; background: var(--white); box-shadow: 0 0 60px rgba(0,0,0,0.08); }

  /* Header */
  .header {
    background: linear-gradient(135deg, #1a1f2e 0%, #2C3039 55%, #3d2818 100%);
    color: white; padding: 28px 20px 24px; position: relative; overflow: hidden;
  }
  .header::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(196,113,74,0.4) 0%, transparent 65%);
    border-radius: 50%;
  }
  .header::after {
    content: ''; position: absolute; bottom: -50px; left: -30px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(196,113,74,0.18) 0%, transparent 70%);
    border-radius: 50%;
  }
  .header-inner { position: relative; z-index: 1; }
  .header-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(196,113,74,0.2); border: 1px solid rgba(196,113,74,0.45);
    border-radius: 20px; padding: 4px 12px; font-size: 11px;
    color: #F2C9A8; letter-spacing: 0.8px; text-transform: uppercase;
    font-weight: 600; margin-bottom: 12px;
  }
  .header h1 { font-size: 30px; letter-spacing: -1px; line-height: 1.1; font-weight: 700; }
  .header h1 em { color: #E8916A; font-style: italic; font-weight: 400; }
  .header-sub { font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 6px; font-weight: 300; }
  .header-grid {
    position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
    display: grid; grid-template-columns: repeat(4, 12px); gap: 4px; z-index: 1;
  }
  .header-tile { width: 12px; height: 12px; background: white; border-radius: 2px; opacity: 0.08; }
  .header-tile:nth-child(3n) { opacity: 0.18; }
  .header-tile:nth-child(5n) { opacity: 0.04; }

  /* Nav */
  .nav { display: flex; background: var(--white); border-bottom: 1px solid #E8E2DA; position: sticky; top: 0; z-index: 100; }
  .nav-btn { flex: 1; padding: 12px 4px 10px; background: none; border: none; cursor: pointer; font-family: 'DM Sans'; font-size: 11px; font-weight: 500; color: var(--stone); display: flex; flex-direction: column; align-items: center; gap: 4px; transition: color 0.2s; letter-spacing: 0.3px; text-transform: uppercase; border-bottom: 2px solid transparent; }
  .nav-btn.active { color: var(--clay); border-bottom-color: var(--clay); }
  .nav-btn svg { width: 20px; height: 20px; }

  /* Cards */
  .card { background: white; border: 1px solid #EDE7DF; border-radius: var(--radius); margin: 16px; overflow: hidden; }
  .card-head { padding: 14px 16px; background: var(--clay-lt); border-bottom: 1px solid #E0D5C8; display: flex; justify-content: space-between; align-items: center; }
  .card-head h3 { font-size: 15px; color: var(--clay-dk); }
  .card-body { padding: 16px; }

  /* Inputs */
  label.field { display: block; margin-bottom: 12px; }
  label.field span { display: block; font-size: 12px; font-weight: 500; color: var(--stone); margin-bottom: 4px; letter-spacing: 0.2px; }
  input[type=number], input[type=text], select, textarea {
    width: 100%; padding: 10px 12px; border: 1.5px solid #DDD7CF; border-radius: 8px; font-family: 'DM Sans'; font-size: 14px;
    background: var(--white); color: var(--slate); outline: none; transition: border-color 0.2s;
    appearance: none; -webkit-appearance: none;
  }
  input:focus, select:focus { border-color: var(--clay); }
  select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%238D8880'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; border-radius: 8px; border: none; font-family: 'DM Sans'; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; letter-spacing: 0.2px; }
  .btn-primary { background: var(--clay); color: white; }
  .btn-primary:hover { background: var(--clay-dk); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-outline { background: white; color: var(--slate); border: 1.5px solid #DDD7CF; }
  .btn-outline:hover { border-color: var(--clay); color: var(--clay); }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
  .btn-ghost { background: transparent; color: var(--stone); border: none; }
  .btn-danger { background: #FEE2E2; color: #B91C1C; border: none; }
  .btn-green { background: var(--green); color: white; }
  .btn-full { width: 100%; }

  /* Chip toggles */
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
  .chip { padding: 6px 12px; border-radius: 20px; border: 1.5px solid #DDD7CF; font-size: 12px; font-weight: 500; cursor: pointer; background: white; color: var(--slate-lt); transition: all 0.15s; }
  .chip.active { background: var(--clay); color: white; border-color: var(--clay); }

  /* Room card */
  .room-card { border: 1.5px solid #EDE7DF; border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
  .room-head { padding: 12px 14px; background: var(--sand); display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .room-body { padding: 14px; border-top: 1px solid #EDE7DF; }

  /* Depth toggle */
  .depth-toggle { display: flex; gap: 6px; margin-top: 6px; }
  .depth-btn { flex: 1; padding: 8px; border-radius: 6px; border: 1.5px solid #DDD7CF; font-size: 13px; font-weight: 600; cursor: pointer; background: white; transition: all 0.15s; }
  .depth-btn.active { background: var(--amber); color: white; border-color: var(--amber); }

  /* Materials list */
  .materials-list { padding: 0; }
  .material-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #F0EBE3; }
  .material-item:last-child { border-bottom: none; }
  .material-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .material-info { flex: 1; }
  .material-name { font-size: 14px; font-weight: 500; }
  .material-qty { font-size: 13px; color: var(--stone); }
  .material-badge { background: var(--clay-lt); color: var(--clay-dk); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }

  /* Help section */
  .help-btn { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1.5px solid #EDE7DF; border-radius: var(--radius); margin-bottom: 12px; cursor: pointer; background: white; transition: all 0.2s; text-align: left; width: 100%; }
  .help-btn:hover { border-color: var(--clay); background: var(--clay-lt); }
  .help-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }

  /* Photos */
  .photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
  .photo-thumb { aspect-ratio: 1; border-radius: 8px; object-fit: cover; width: 100%; cursor: pointer; }
  .photo-add { aspect-ratio: 1; border-radius: 8px; border: 2px dashed #DDD7CF; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 28px; color: var(--stone); background: var(--sand); }

  /* Guide */
  .guide-step { display: flex; gap: 14px; padding: 16px; border-bottom: 1px solid #F0EBE3; }
  .guide-num { width: 32px; height: 32px; border-radius: 50%; background: var(--clay); color: white; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces'; font-weight: 700; font-size: 15px; flex-shrink: 0; }
  .guide-content h4 { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
  .guide-content p { font-size: 13px; color: var(--stone); line-height: 1.5; }

  /* Inline row */
  .row { display: flex; gap: 10px; }
  .row > * { flex: 1; }

  /* Checkbox */
  .check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; padding: 4px 0; }
  .check-label input { width: 16px; height: 16px; accent-color: var(--clay); cursor: pointer; }

  /* Alert boxes */
  .info-box { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #1D4ED8; margin-top: 8px; line-height: 1.5; }
  .warn-box { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #92400E; margin-top: 8px; line-height: 1.5; }
  .success-box { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px 12px; font-size: 12px; color: #166534; margin-top: 8px; line-height: 1.5; }

  /* Empty state */
  .empty { text-align: center; padding: 40px 20px; color: var(--stone); }
  .empty .emoji { font-size: 48px; margin-bottom: 12px; }
  .empty h3 { font-size: 18px; color: var(--slate); margin-bottom: 6px; }
  .empty p { font-size: 13px; line-height: 1.5; }

  /* Summary totals */
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #F0EBE3; font-size: 14px; }
  .summary-row:last-child { border-bottom: none; }
  .summary-row.total { font-weight: 700; font-size: 16px; padding-top: 12px; }

  /* Tips ticker */
  .tip-strip { background: var(--slate); color: rgba(255,255,255,0.85); font-size: 12px; padding: 8px 16px; display: flex; gap: 8px; align-items: center; }
  .tip-strip strong { color: var(--clay); }

  /* Photo view overlay */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .overlay img { max-width: 100%; max-height: 80vh; border-radius: 8px; }
  .overlay-close { position: absolute; top: 20px; right: 20px; color: white; font-size: 32px; cursor: pointer; line-height: 1; }

  /* Modular pattern */
  .modular-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .modular-row select { flex: 1; }
  .modular-row input { width: 60px; flex: none; text-align: center; }
  .pct-ok { color: var(--green); font-size: 12px; font-weight: 600; }
  .pct-bad { color: #DC2626; font-size: 12px; font-weight: 600; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.25s ease; }

  /* Print-friendly shopping list */
  @media print {
    .nav, .header, .nav-btn, .btn, .tip-strip { display: none !important; }
    .card { box-shadow: none; border: 1px solid #ccc; margin: 8px 0; }
  }
`;

// ── Constants ─────────────────────────────────────────────────────────────
const TILE_PRESETS = [
  { label: "25×25 (Mosaic)", l: 25, w: 25 },
  { label: "48×48 (Mosaic)", l: 48, w: 48 },
  { label: "100×100", l: 100, w: 100 },
  { label: "150×150", l: 150, w: 150 },
  { label: "200×100", l: 200, w: 100 },
  { label: "300×300", l: 300, w: 300 },
  { label: "600×300", l: 600, w: 300 },
  { label: "600×600", l: 600, w: 600 },
  { label: "900×600", l: 900, w: 600 },
  { label: "1200×600", l: 1200, w: 600 },
];

const DEFAULT_HEIGHT = 2.4;
const GROUT_DENSITY = 1.7;
const JOINT_WIDTH_MM = 2;
const TILE_THICKNESS_MM = 10;
const WASTE_PCT = 10;

// ── Helpers ───────────────────────────────────────────────────────────────
function groutKgPerM2(lMm, wMm) {
  const L = Math.max(lMm, 1), W = Math.max(wMm, 1);
  return ((L + W) / (L * W)) * JOINT_WIDTH_MM * TILE_THICKNESS_MM * GROUT_DENSITY;
}

function calcClipsPerM2(lMm, wMm) {
  if (lMm < 300 || wMm < 300) return 0;
  return Math.ceil((3 / ((lMm / 1000) * (wMm / 1000))) * 1.1);
}

function withWaste(n) { return n * (1 + WASTE_PCT / 100); }

function roomFloorArea(room) {
  return (room.floorAreas || []).reduce((s, a) => s + (a.l || 0) * (a.w || 0), 0);
}

function roomWallArea(room) {
  if (room.useFourWall) {
    return Math.max(0, 2 * ((room.roomL || 0) + (room.roomW || 0)) * (room.roomH || DEFAULT_HEIGHT) - (room.wallDeduct || 0));
  }
  return (room.walls || []).reduce((s, w) => s + (w.l || 0) * (w.h || DEFAULT_HEIGHT) - (w.deduct || 0), 0);
}

function getTileSize(room) {
  if (room.tileSizePreset) {
    const p = TILE_PRESETS.find(p => p.label === room.tileSizePreset);
    if (p) return p;
  }
  return { l: 600, w: 300 }; // default fallback
}

function calcRoomGroutKg(room, area) {
  if (room.useModular && (room.modularTiles || []).length > 0) {
    const totalProp = room.modularTiles.reduce((s, t) => s + (Number(t.pct) || 0), 0);
    if (totalProp > 0) {
      const kgm2 = room.modularTiles.reduce((sum, t) => {
        const p = TILE_PRESETS.find(p2 => p2.label === t.preset);
        if (!p) return sum;
        return sum + ((Number(t.pct) || 0) / totalProp) * groutKgPerM2(p.l, p.w);
      }, 0);
      return area * kgm2;
    }
  }
  const ts = getTileSize(room);
  return area * groutKgPerM2(ts.l, ts.w);
}

// ── Icons (inline SVG) ────────────────────────────────────────────────────
const Icon = {
  ruler: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2v20"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h12M9 6h12M9 18h12M5 12h.01M5 6h.01M5 18h.01"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>,
  print: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
};

// ── Fresh room state ──────────────────────────────────────────────────────
const newRoom = (n) => ({
  id: Date.now() + Math.random(),
  name: `Room ${n}`,
  type: "floor",
  tileSizePreset: "",
  useModular: false,
  modularTiles: [
    { preset: "600×600", pct: 50 },
    { preset: "600×300", pct: 50 },
  ],
  floorAreas: [{ id: 1, l: "", w: "" }],
  walls: [{ id: 1, l: "", h: "", deduct: "" }],
  useFourWall: false,
  roomL: "", roomW: "", roomH: DEFAULT_HEIGHT, wallDeduct: "",
  // floor options
  useCementBoard: false,
  useAntiCrack: false,
  useLevellingCompound: false,
  levellingDepthMm: 3,
  useLevellingClips: false,
  trimLengthM: "",
  isNaturalStone: false,
  // wall options
  useTankingWalls: false,
  useTankingFloor: false,
});

// ── Main App ──────────────────────────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAQABAADASIAAhEBAxEB/8QAHQABAAAHAQEAAAAAAAAAAAAAAAECAwQGBwgFCf/EAGIQAAIBAgMEBQUGCxEPBQEBAQABAgMEBQYRBxIhMQhBUWFxEyIygZEUQlKhsdEVIzNicnSSsrPB0hYYNTdUVWNzdYKElJWio9PhFyQlJic0NkNTVmRlg5PCREVGheLww0f/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAgMEAQUGB//EAD8RAQACAQIDBQUHAgUEAgIDAAABAgMEERIhMQUTMkFRFCJhgZEGUnGhsdHwI8EVM0JD4RYkNHJTYoKSNbLx/9oADAMBAAIRAxEAPwDsoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==";

export default function DIYTilingCalculator() {
  const [tab, setTab] = useState("measure");
  const [rooms, setRooms] = useState([newRoom(1)]);
  const [photos, setPhotos] = useState([]);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | done | error
  const [expandedRooms, setExpandedRooms] = useState(new Set([rooms[0].id]));
  const photoRef = useRef();

  // ── Room helpers ──────────────────────────────────────────────────────
  const updateRoom = (id, field, value) =>
    setRooms(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r));

  const updateFloorArea = (roomId, areaId, field, value) =>
    setRooms(rs => rs.map(r => r.id !== roomId ? r : {
      ...r, floorAreas: r.floorAreas.map(a => a.id === areaId ? { ...a, [field]: value } : a)
    }));

  const addFloorArea = (roomId) =>
    setRooms(rs => rs.map(r => r.id !== roomId ? r : {
      ...r, floorAreas: [...r.floorAreas, { id: Date.now(), l: "", w: "" }]
    }));

  const updateWall = (roomId, wallId, field, value) =>
    setRooms(rs => rs.map(r => r.id !== roomId ? r : {
      ...r, walls: r.walls.map(w => w.id === wallId ? { ...w, [field]: value } : w)
    }));

  const addWall = (roomId) =>
    setRooms(rs => rs.map(r => r.id !== roomId ? r : {
      ...r, walls: [...r.walls, { id: Date.now(), l: "", h: "", deduct: "" }]
    }));

  const updateModular = (roomId, idx, field, value) =>
    setRooms(rs => rs.map(r => r.id !== roomId ? r : {
      ...r, modularTiles: r.modularTiles.map((t, i) => i === idx ? { ...t, [field]: value } : t)
    }));

  const toggleExpanded = (id) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Materials calc ────────────────────────────────────────────────────
  const totalFloorM2 = rooms.reduce((s, r) => s + roomFloorArea(r), 0);
  const totalWallM2 = rooms.reduce((s, r) => s + roomWallArea(r), 0);
  const totalTileM2 = totalFloorM2 + totalWallM2;

  // Adhesive
  const adhesiveBags = totalTileM2 > 0 ? Math.ceil(withWaste(totalTileM2) / 4) : 0;

  // Grout
  let totalGroutKg = 0;
  rooms.forEach(r => {
    const fa = roomFloorArea(r), wa = roomWallArea(r);
    totalGroutKg += calcRoomGroutKg(r, fa + wa);
  });
  totalGroutKg = withWaste(totalGroutKg);
  const groutBags = Math.ceil(totalGroutKg / 2.5);

  // Cement board
  let cbSheets = 0, cbAdhesiveBags = 0;
  rooms.forEach(r => {
    if (r.useCementBoard) {
      const fa = roomFloorArea(r);
      cbSheets += Math.ceil(fa / 0.72);
      cbAdhesiveBags += Math.ceil((fa * 3) / 20);
    }
  });

  // Anti-crack
  let acRolls = 0;
  rooms.forEach(r => { if (r.useAntiCrack) acRolls += Math.ceil(roomFloorArea(r) / 10); });

  // Levelling compound
  let levelBags = 0;
  rooms.forEach(r => {
    if (r.useLevellingCompound) {
      const depth = r.levellingDepthMm || 3;
      levelBags += Math.ceil(roomFloorArea(r) / ((5 * 3) / depth));
    }
  });

  // Levelling clips
  let totalClips = 0;
  rooms.forEach(r => {
    if (r.useLevellingClips) {
      const ts = getTileSize(r);
      const cpm2 = calcClipsPerM2(ts.l, ts.w);
      const fa = roomFloorArea(r), wa = roomWallArea(r);
      if (cpm2 > 0) totalClips += Math.ceil((fa + wa) * cpm2);
    }
  });
  const clipPacks = Math.ceil(totalClips / 100);

  // Tanking
  let tankingTubs = 0;
  rooms.forEach(r => {
    if (r.useTankingWalls) tankingTubs += Math.ceil(roomWallArea(r) / 4);
    if (r.useTankingFloor) tankingTubs += Math.ceil(roomFloorArea(r) / 4);
  });

  // Trim
  let totalTrimM = 0;
  rooms.forEach(r => { totalTrimM += Number(r.trimLengthM) || 0; });
  const trimLengths = Math.ceil(totalTrimM / 2.5);

  // Sealer
  const needsSealer = rooms.some(r => r.isNaturalStone);
  const sealerLitres = needsSealer ? Math.ceil(totalTileM2 / 5) : 0;

  // Spacers (~6 per tile)
  const avgTileM2 = 0.18; // rough average
  const spacerBags = totalTileM2 > 0 ? Math.ceil(totalTileM2 / avgTileM2 * 6 / 500) : 0;

  const hasMaterials = totalTileM2 > 0;

  // ── Photo handler ─────────────────────────────────────────────────────
  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(p => [...p, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  // ── Location handlers ─────────────────────────────────────────────────
  const findNearby = (query) => {
    if (!navigator.geolocation) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocationStatus("done");
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},14z`, "_blank");
      },
      () => {
        setLocationStatus("error");
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
      }
    );
  };

  const shareList = () => {
    const lines = ["🧱 TILING MATERIALS NEEDED\n"];
    if (totalFloorM2 > 0) lines.push(`Floor area: ${totalFloorM2.toFixed(2)} m²`);
    if (totalWallM2 > 0) lines.push(`Wall area: ${totalWallM2.toFixed(2)} m²`);
    lines.push(`Total tile area: ${totalTileM2.toFixed(2)} m²\n`);
    if (adhesiveBags > 0) lines.push(`✅ Tile adhesive: ${adhesiveBags} x 20kg bags`);
    if (groutBags > 0) lines.push(`✅ Grout: ${groutBags} x 2.5kg bags (${totalGroutKg.toFixed(1)} kg needed)`);
    if (spacerBags > 0) lines.push(`✅ Tile spacers: ${spacerBags} bags`);
    if (cbSheets > 0) lines.push(`✅ Cement board: ${cbSheets} sheets (1.2×0.6m)`);
    if (cbAdhesiveBags > 0) lines.push(`✅ CB adhesive: ${cbAdhesiveBags} x 20kg bags`);
    if (acRolls > 0) lines.push(`✅ Anti-crack membrane: ${acRolls} rolls (10m²)`);
    if (levelBags > 0) lines.push(`✅ Levelling compound: ${levelBags} x 25kg bags`);
    if (clipPacks > 0) lines.push(`✅ Levelling clips: ${clipPacks} packs of 100`);
    if (tankingTubs > 0) lines.push(`✅ Tanking compound: ${tankingTubs} tubs (4m² each)`);
    if (trimLengths > 0) lines.push(`✅ Tile trim: ${trimLengths} lengths (2.5m each)`);
    if (sealerLitres > 0) lines.push(`✅ Stone sealer: ${sealerLitres} litre(s)`);
    lines.push("\nCalculated with +10% waste allowance.");

    if (navigator.share) {
      navigator.share({ title: "My Tiling Materials List", text: lines.join("\n") });
    } else {
      navigator.clipboard?.writeText(lines.join("\n"))
        .then(() => alert("List copied to clipboard!"))
        .catch(() => alert(lines.join("\n")));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Header */}
        <div className="header" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", background: "white" }}>
          <img src={LOGO_SRC} alt="Tile Calculator"
            style={{ width: 100, height: 100, borderRadius: 22, boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }} />
        </div>

        {/* Nav */}
        <nav className="nav">
          {[
            { id: "measure", label: "Measure", icon: Icon.ruler },
            { id: "materials", label: "Materials", icon: Icon.list },
            { id: "help", label: "Find Help", icon: Icon.map },
            { id: "guide", label: "Guide", icon: Icon.book },
          ].map(({ id, label, icon }) => (
            <button key={id} className={`nav-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              {icon}{label}
            </button>
          ))}
        </nav>

        {/* ═══════════ MEASURE TAB ═══════════ */}
        {tab === "measure" && (
          <div className="fade-in" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 20 }}>Your Rooms</h2>
              <button className="btn btn-primary btn-sm" onClick={() => {
                const r = newRoom(rooms.length + 1);
                setRooms(rs => [...rs, r]);
                setExpandedRooms(prev => new Set([...prev, r.id]));
              }}>
                {Icon.plus} Add Room
              </button>
            </div>

            {rooms.map((room, ri) => {
              const expanded = expandedRooms.has(room.id);
              const fa = roomFloorArea(room), wa = roomWallArea(room);
              const isFloor = room.type === "floor";

              return (
                <div key={room.id} className="room-card">
                  <div className="room-head" onClick={() => toggleExpanded(room.id)}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{room.name}</div>
                      <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>
                        {fa > 0 && `Floor: ${fa.toFixed(2)} m²`}
                        {wa > 0 && (fa > 0 ? ` · ` : "") + `Wall: ${wa.toFixed(2)} m²`}
                        {fa === 0 && wa === 0 && "No measurements yet"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); setRooms(rs => rs.filter(r => r.id !== room.id)); }}>
                        {Icon.trash}
                      </button>
                      <span style={{ color: "var(--stone)", transform: expanded ? "rotate(180deg)" : "", transition: "0.2s", display: "inline-block" }}>{Icon.chevron}</span>
                    </div>
                  </div>

                  {expanded && (
                    <div className="room-body">
                      {/* Room name */}
                      <label className="field">
                        <span>Room name</span>
                        <input type="text" value={room.name} onChange={e => updateRoom(room.id, "name", e.target.value)} />
                      </label>

                      {/* Type */}
                      <label className="field">
                        <span>What are you tiling?</span>
                        <select value={room.type} onChange={e => updateRoom(room.id, "type", e.target.value)}>
                          <option value="floor">Floor</option>
                          <option value="wall">Wall</option>
                        </select>
                      </label>

                      {/* Tile size */}
                      <label className="field">
                        <span>Tile size <span style={{ fontWeight: 300, color: "var(--stone)" }}>(needed for grout calculation)</span></span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <select style={{ flex: 1 }} value={room.useModular ? "__modular__" : room.tileSizePreset}
                            onChange={e => {
                              if (e.target.value === "__modular__") { updateRoom(room.id, "useModular", true); updateRoom(room.id, "tileSizePreset", ""); }
                              else { updateRoom(room.id, "tileSizePreset", e.target.value); updateRoom(room.id, "useModular", false); }
                            }}>
                            <option value="">Choose tile size to work out grout needed</option>
                            {TILE_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label} mm</option>)}
                            <option value="__modular__">Mixed sizes (modular pattern)</option>
                          </select>
                        </div>
                      </label>

                      {/* Modular pattern */}
                      {room.useModular && (
                        <div style={{ background: "#FFF8EC", border: "1px solid #FDE68A", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)", marginBottom: 8 }}>Mixed pattern — enter proportions (total must = 100%)</div>
                          {room.modularTiles.map((mt, mi) => (
                            <div key={mi} className="modular-row">
                              <select value={mt.preset} onChange={e => updateModular(room.id, mi, "preset", e.target.value)}>
                                {TILE_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                              </select>
                              <input type="number" min="0" max="100" value={mt.pct} placeholder="%" onChange={e => updateModular(room.id, mi, "pct", Number(e.target.value))} />
                              <span style={{ fontSize: 12, color: "var(--stone)" }}>%</span>
                              {room.modularTiles.length > 2 && (
                                <button className="btn btn-ghost btn-sm" style={{ color: "#DC2626", padding: "4px 6px" }}
                                  onClick={() => setRooms(rs => rs.map(r => r.id !== room.id ? r : { ...r, modularTiles: r.modularTiles.filter((_, i) => i !== mi) }))}>✕</button>
                              )}
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                            <button className="btn btn-ghost btn-sm" style={{ color: "var(--amber)" }}
                              onClick={() => setRooms(rs => rs.map(r => r.id !== room.id ? r : { ...r, modularTiles: [...r.modularTiles, { preset: "300×300", pct: 0 }] }))}>
                              + Add tile size
                            </button>
                            {(() => {
                              const tot = room.modularTiles.reduce((s, t) => s + (Number(t.pct) || 0), 0);
                              return <span className={tot === 100 ? "pct-ok" : "pct-bad"}>{tot}% {tot === 100 ? "✓" : "(must = 100%)"}</span>;
                            })()}
                          </div>
                        </div>
                      )}

                      {/* ── FLOOR ── */}
                      {isFloor && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Floor measurements</span>
                            <button className="btn btn-outline btn-sm" onClick={() => addFloorArea(room.id)}>{Icon.plus} Area</button>
                          </div>
                          {room.floorAreas.map((area, ai) => (
                            <div key={area.id} style={{ background: "var(--sand)", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                              {room.floorAreas.length > 1 && <div style={{ fontSize: 12, color: "var(--stone)", marginBottom: 6 }}>Area {ai + 1}</div>}
                              <div className="row">
                                <label className="field" style={{ marginBottom: 0 }}>
                                  <span>Length (m)</span>
                                  <input type="number" value={area.l} placeholder="e.g. 3.5" onChange={e => updateFloorArea(room.id, area.id, "l", e.target.value)} />
                                </label>
                                <label className="field" style={{ marginBottom: 0 }}>
                                  <span>Width (m)</span>
                                  <input type="number" value={area.w} placeholder="e.g. 2.8" onChange={e => updateFloorArea(room.id, area.id, "w", e.target.value)} />
                                </label>
                              </div>
                              {area.l && area.w && (
                                <div style={{ fontSize: 12, color: "var(--clay-dk)", marginTop: 6, fontWeight: 500 }}>
                                  = {(area.l * area.w).toFixed(2)} m²
                                </div>
                              )}
                              {room.floorAreas.length > 1 && (
                                <button className="btn btn-ghost btn-sm" style={{ color: "#DC2626", marginTop: 4 }}
                                  onClick={() => setRooms(rs => rs.map(r => r.id !== room.id ? r : { ...r, floorAreas: r.floorAreas.filter(a => a.id !== area.id) }))}>
                                  Remove area
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Floor options */}
                          <div style={{ borderTop: "1px solid #EDE7DF", paddingTop: 12, marginTop: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--slate-lt)" }}>Floor options</div>
                            <div style={{ display: "grid", gap: 6 }}>
                              {[
                                ["useCementBoard", "Cement board underlay"],
                                ["useAntiCrack", "Anti-crack membrane"],
                                ["useTankingFloor", "Tanking / waterproofing"],
                                ["isNaturalStone", "Natural stone (needs sealer)"],
                              ].map(([key, label]) => (
                                <label key={key} className="check-label">
                                  <input type="checkbox" checked={room[key] || false} onChange={e => updateRoom(room.id, key, e.target.checked)} />
                                  {label}
                                </label>
                              ))}

                              <label className="check-label">
                                <input type="checkbox" checked={room.useLevellingCompound || false} onChange={e => updateRoom(room.id, "useLevellingCompound", e.target.checked)} />
                                Levelling compound
                              </label>
                              {room.useLevellingCompound && (
                                <div style={{ marginLeft: 24, background: "#FFF8EC", border: "1px solid #FDE68A", borderRadius: 8, padding: 10 }}>
                                  <div style={{ fontSize: 12, color: "var(--amber)", marginBottom: 6 }}>How uneven is the floor?</div>
                                  <div className="depth-toggle">
                                    {[2, 3].map(d => (
                                      <button key={d} className={`depth-btn ${(room.levellingDepthMm || 3) === d ? "active" : ""}`}
                                        onClick={() => updateRoom(room.id, "levellingDepthMm", d)}>
                                        {d}mm
                                      </button>
                                    ))}
                                  </div>
                                  <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 6 }}>
                                    ≈ {Math.ceil(roomFloorArea(room) / ((5 * 3) / (room.levellingDepthMm || 3)))} bags needed (25kg bags)
                                  </div>
                                </div>
                              )}

                              <label className="check-label">
                                <input type="checkbox" checked={room.useLevellingClips || false} onChange={e => updateRoom(room.id, "useLevellingClips", e.target.checked)} />
                                Levelling clips (tile lippage system)
                              </label>
                              {room.useLevellingClips && (() => {
                                const ts = getTileSize(room);
                                const cpm2 = calcClipsPerM2(ts.l, ts.w);
                                const fa = roomFloorArea(room);
                                if (cpm2 === 0) return <div className="warn-box" style={{ marginLeft: 24 }}>⚠ Select a tile size ≥ 300×300 for auto-calculation</div>;
                                const qty = Math.ceil(fa * cpm2);
                                return (
                                  <div className="success-box" style={{ marginLeft: 24 }}>
                                    Auto-calculated: <strong>{Math.ceil(cpm2)} clips/m² × {fa.toFixed(2)} m² = {qty} clips ({Math.ceil(qty / 100)} packs of 100)</strong>
                                  </div>
                                );
                              })()}
                            </div>

                            <label className="field" style={{ marginTop: 10 }}>
                              <span>Tile trim / edge strip length (m) <span style={{ fontWeight: 300 }}>optional</span></span>
                              <input type="number" value={room.trimLengthM} placeholder="e.g. 4.5" onChange={e => updateRoom(room.id, "trimLengthM", e.target.value)} />
                              {room.trimLengthM > 0 && (
                                <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 4 }}>
                                  = {Math.ceil(room.trimLengthM / 2.5)} lengths of 2.5m
                                </div>
                              )}
                            </label>
                          </div>
                        </>
                      )}

                      {/* ── WALL ── */}
                      {!isFloor && (
                        <>
                          <label className="check-label" style={{ marginBottom: 10 }}>
                            <input type="checkbox" checked={room.useFourWall || false} onChange={e => updateRoom(room.id, "useFourWall", e.target.checked)} />
                            <span style={{ fontWeight: 500 }}>Calculate all 4 walls automatically</span>
                          </label>

                          {room.useFourWall ? (
                            <div style={{ background: "var(--sand)", borderRadius: 8, padding: 10 }}>
                              <div className="row">
                                <label className="field" style={{ marginBottom: 8 }}>
                                  <span>Room length (m)</span>
                                  <input type="number" value={room.roomL} placeholder="e.g. 3.5" onChange={e => updateRoom(room.id, "roomL", e.target.value)} />
                                </label>
                                <label className="field" style={{ marginBottom: 8 }}>
                                  <span>Room width (m)</span>
                                  <input type="number" value={room.roomW} placeholder="e.g. 2.5" onChange={e => updateRoom(room.id, "roomW", e.target.value)} />
                                </label>
                              </div>
                              <label className="field" style={{ marginBottom: 8 }}>
                                <span>Wall height (m)</span>
                                <input type="number" value={room.roomH} onChange={e => updateRoom(room.id, "roomH", e.target.value)} />
                              </label>
                              <div className="chips" style={{ marginBottom: 8 }}>
                                <button className="chip" onClick={() => updateRoom(room.id, "roomH", 2.4)}>Standard 2.4m</button>
                                <button className="chip" onClick={() => updateRoom(room.id, "roomH", 1.2)}>Half height 1.2m</button>
                              </div>
                              <label className="field" style={{ marginBottom: 0 }}>
                                <span>Deductions — doors, windows (m²)</span>
                                <input type="number" value={room.wallDeduct} placeholder="0" onChange={e => updateRoom(room.id, "wallDeduct", e.target.value)} />
                              </label>
                              {room.roomL && room.roomW && (
                                <div style={{ fontSize: 12, color: "var(--clay-dk)", fontWeight: 500, marginTop: 8 }}>
                                  Wall area: {roomWallArea(room).toFixed(2)} m²
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>Wall measurements</span>
                                <button className="btn btn-outline btn-sm" onClick={() => addWall(room.id)}>{Icon.plus} Wall</button>
                              </div>
                              {room.walls.map((wall, wi) => (
                                <div key={wall.id} style={{ background: "var(--sand)", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                                  {room.walls.length > 1 && <div style={{ fontSize: 12, color: "var(--stone)", marginBottom: 6 }}>Wall {wi + 1}</div>}
                                  <div className="row">
                                    <label className="field" style={{ marginBottom: 6 }}>
                                      <span>Length (m)</span>
                                      <input type="number" value={wall.l} placeholder="e.g. 2.4" onChange={e => updateWall(room.id, wall.id, "l", e.target.value)} />
                                    </label>
                                    <label className="field" style={{ marginBottom: 6 }}>
                                      <span>Height (m)</span>
                                      <input type="number" value={wall.h} placeholder="2.4" onChange={e => updateWall(room.id, wall.id, "h", e.target.value)} />
                                    </label>
                                  </div>
                                  <div className="chips" style={{ marginBottom: 6 }}>
                                    <button className="chip" onClick={() => updateWall(room.id, wall.id, "h", 2.4)}>2.4m</button>
                                    <button className="chip" onClick={() => updateWall(room.id, wall.id, "h", 1.2)}>Half</button>
                                  </div>
                                  <label className="field" style={{ marginBottom: 0 }}>
                                    <span>Deductions (m²) — window, door etc.</span>
                                    <input type="number" value={wall.deduct} placeholder="0" onChange={e => updateWall(room.id, wall.id, "deduct", e.target.value)} />
                                  </label>
                                  {wall.l && <div style={{ fontSize: 12, color: "var(--clay-dk)", fontWeight: 500, marginTop: 6 }}>
                                    = {Math.max(0, (wall.l || 0) * (wall.h || DEFAULT_HEIGHT) - (wall.deduct || 0)).toFixed(2)} m²
                                  </div>}
                                  {room.walls.length > 1 && (
                                    <button className="btn btn-ghost btn-sm" style={{ color: "#DC2626", marginTop: 4 }}
                                      onClick={() => setRooms(rs => rs.map(r => r.id !== room.id ? r : { ...r, walls: r.walls.filter(w => w.id !== wall.id) }))}>
                                      Remove wall
                                    </button>
                                  )}
                                </div>
                              ))}
                            </>
                          )}

                          <div style={{ borderTop: "1px solid #EDE7DF", paddingTop: 12, marginTop: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--slate-lt)" }}>Wall options</div>
                            <div style={{ display: "grid", gap: 6 }}>
                              {[
                                ["useTankingWalls", "Tanking / waterproofing"],
                                ["useLevellingClips", "Levelling clips"],
                                ["isNaturalStone", "Natural stone (needs sealer)"],
                              ].map(([key, label]) => (
                                <label key={key} className="check-label">
                                  <input type="checkbox" checked={room[key] || false} onChange={e => updateRoom(room.id, key, e.target.checked)} />
                                  {label}
                                </label>
                              ))}
                            </div>
                            <label className="field" style={{ marginTop: 10 }}>
                              <span>Tile trim / edge strip (m) <span style={{ fontWeight: 300 }}>optional</span></span>
                              <input type="number" value={room.trimLengthM} placeholder="e.g. 4.5" onChange={e => updateRoom(room.id, "trimLengthM", e.target.value)} />
                              {room.trimLengthM > 0 && <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 4 }}>= {Math.ceil(room.trimLengthM / 2.5)} × 2.5m lengths</div>}
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {rooms.length === 0 && (
              <div className="empty">
                <div className="emoji">🏠</div>
                <h3>No rooms yet</h3>
                <p>Tap "Add Room" to start measuring your tiling project</p>
              </div>
            )}

            {hasMaterials && (
              <div className="info-box" style={{ marginTop: 4 }}>
                📐 Total area: <strong>{totalFloorM2.toFixed(2)} m² floor</strong>
                {totalWallM2 > 0 && <> + <strong>{totalWallM2.toFixed(2)} m² wall</strong></>}
                {" "}→ Head to <strong>Materials</strong> tab for your shopping list
              </div>
            )}
          </div>
        )}

        {/* ═══════════ MATERIALS TAB ═══════════ */}
        {tab === "materials" && (
          <div className="fade-in">
            {!hasMaterials ? (
              <div className="empty">
                <div className="emoji">📋</div>
                <h3>No measurements yet</h3>
                <p>Go to the <strong>Measure</strong> tab and enter your room dimensions to see your shopping list</p>
              </div>
            ) : (
              <>
                <div style={{ padding: "16px 16px 0" }}>
                  <h2 style={{ fontSize: 20, marginBottom: 4 }}>Shopping List</h2>
                  <p style={{ fontSize: 13, color: "var(--stone)" }}>
                    {totalFloorM2.toFixed(2)} m² floor{totalWallM2 > 0 ? ` + ${totalWallM2.toFixed(2)} m² wall` : ""} · includes 10% waste
                  </p>

                  {/* Tile area guide */}
                  <div style={{ background: "var(--slate)", color: "white", borderRadius: 14, padding: "14px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 2 }}>Total tile area to buy</div>
                      <div style={{ fontSize: 28, fontFamily: "Fraunces", fontWeight: 700 }}>{(totalTileM2 * 1.1).toFixed(2)} m²</div>
                      <div style={{ fontSize: 11, opacity: 0.5 }}>inc. 10% for cuts & breakages</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>Show to tile shop</div>
                      <div style={{ fontSize: 36, marginTop: 4 }}>🧱</div>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div className="card" style={{ marginTop: 12 }}>
                  <div className="card-head"><h3>Materials Needed</h3></div>
                  <div className="materials-list">
                    {[
                      { icon: "🪣", bg: "#FEF3C7", name: "Tile adhesive", qty: `${adhesiveBags} × 20kg bags`, show: adhesiveBags > 0, note: "Ask for flexible, waterproof if wet area" },
                      { icon: "🏺", bg: "#F0FDF4", name: "Grout", qty: `${groutBags} × 2.5kg bags (${totalGroutKg.toFixed(1)} kg)`, show: groutBags > 0, note: `Joint width: ${JOINT_WIDTH_MM}mm` },
                      { icon: "📏", bg: "#EFF6FF", name: "Tile spacers", qty: `${spacerBags} bag${spacerBags !== 1 ? "s" : ""} (500 per bag)`, show: spacerBags > 0 },
                      { icon: "🟫", bg: "#FFF7ED", name: "Cement board", qty: `${cbSheets} sheets (1.2×0.6m)`, show: cbSheets > 0 },
                      { icon: "🪣", bg: "#FEF3C7", name: "Cement board adhesive", qty: `${cbAdhesiveBags} × 20kg bags`, show: cbAdhesiveBags > 0 },
                      { icon: "🌊", bg: "#EFF6FF", name: "Anti-crack membrane", qty: `${acRolls} roll${acRolls !== 1 ? "s" : ""} (covers 10m² each)`, show: acRolls > 0 },
                      { icon: "🪨", bg: "#F8FAFC", name: "Levelling compound", qty: `${levelBags} × 25kg bag${levelBags !== 1 ? "s" : ""}`, show: levelBags > 0 },
                      { icon: "🔗", bg: "#F0FDF4", name: "Levelling clips", qty: `${clipPacks} pack${clipPacks !== 1 ? "s" : ""} of 100 (${totalClips} clips)`, show: clipPacks > 0 },
                      { icon: "💧", bg: "#EFF6FF", name: "Tanking compound", qty: `${tankingTubs} tub${tankingTubs !== 1 ? "s" : ""} (each covers ~4m²)`, show: tankingTubs > 0 },
                      { icon: "📐", bg: "#FDF4FF", name: "Tile trim / edge strip", qty: `${trimLengths} length${trimLengths !== 1 ? "s" : ""} of 2.5m`, show: trimLengths > 0 },
                      { icon: "✨", bg: "#FFF7ED", name: "Natural stone sealer", qty: `${sealerLitres} litre${sealerLitres !== 1 ? "s" : ""}`, show: sealerLitres > 0 },
                    ].filter(m => m.show).map((m, i) => (
                      <div key={i} className="material-item">
                        <div className="material-icon" style={{ background: m.bg }}>{m.icon}</div>
                        <div className="material-info">
                          <div className="material-name">{m.name}</div>
                          {m.note && <div className="material-qty">{m.note}</div>}
                        </div>
                        <div className="material-badge">{m.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools reminder */}
                <div className="card">
                  <div className="card-head"><h3>Don't forget tools</h3></div>
                  <div className="materials-list">
                    {[
                      ["🔧", "#F0F9FF", "Notched trowel", "3mm × 3mm for most tiles"],
                      ["✂️", "#FFF0F3", "Tile cutter / angle grinder", "For cutting tiles to size"],
                      ["📏", "#F0FDF4", "Spirit level", "Essential for straight lines"],
                      ["🧹", "#FEF3C7", "Grout float & sponge", "For applying and cleaning grout"],
                      ["🔫", "#F5F3FF", "Silicone gun + sealant", "For corners and edges"],
                      ["🧤", "#F0F9FF", "Rubber gloves & knee pads", "Safety essentials"],
                    ].map(([icon, bg, name, note], i) => (
                      <div key={i} className="material-item">
                        <div className="material-icon" style={{ background: bg }}>{icon}</div>
                        <div className="material-info">
                          <div className="material-name">{name}</div>
                          <div className="material-qty">{note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: "0 16px 16px", display: "flex", gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={shareList}>
                    {Icon.share} Share List
                  </button>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => window.print()}>
                    {Icon.print} Print
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════ FIND HELP TAB ═══════════ */}
        {tab === "help" && (
          <div className="fade-in" style={{ padding: "16px" }}>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Find Help Near You</h2>
            <p style={{ fontSize: 13, color: "var(--stone)", marginBottom: 16 }}>Opens Google Maps to find local businesses</p>

            {/* Location status */}
            {locationStatus === "loading" && <div className="info-box" style={{ marginBottom: 12 }}>📍 Getting your location...</div>}
            {locationStatus === "error" && <div className="warn-box" style={{ marginBottom: 12 }}>📍 Couldn't get your location — showing general search results</div>}

            {/* Tile shops */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 10 }}>🏪 Tile Shops</h3>
              {[
                { label: "Tile shops near me", query: "tile shop near me" },
                { label: "Topps Tiles", query: "Topps Tiles" },
                { label: "Tile Giant", query: "Tile Giant" },
                { label: "CTD Tiles", query: "CTD Tiles" },
                { label: "Bathstore / B&Q tiles", query: "B&Q tiles near me" },
                { label: "Builders merchants", query: "builders merchant near me tiles" },
              ].map(({ label, query }) => (
                <button key={label} className="help-btn" onClick={() => findNearby(query)}>
                  <div className="help-icon" style={{ background: "#FEF3C7" }}>🗺️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>Open in Google Maps</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tilers */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 10 }}>👷 Find a Local Tiler</h3>
              {[
                { label: "Tilers near me", query: "tiler near me" },
                { label: "Rated People — Tilers", query: "site:ratedpeople.com tiler" },
                { label: "Checkatrade — Tilers", query: "site:checkatrade.com tiler" },
                { label: "MyBuilder — Tilers", query: "site:mybuilder.com tiler" },
              ].map(({ label, query }) => (
                <button key={label} className="help-btn" onClick={() => findNearby(query)}>
                  <div className="help-icon" style={{ background: "#F0FDF4" }}>🔨</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>Open in Google Maps / Search</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Photo section */}
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>📸 Job Photos</h3>
              <p style={{ fontSize: 13, color: "var(--stone)", marginBottom: 12 }}>
                Take photos of your space to show the tile shop or a tiler — dimensions, existing tiles, tricky areas
              </p>

              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                style={{ display: "none" }}
                onChange={handlePhotoCapture}
              />

              <button className="btn btn-primary btn-full" style={{ marginBottom: 12 }} onClick={() => photoRef.current?.click()}>
                {Icon.camera} Take / Add Photos
              </button>

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map((src, i) => (
                    <img key={i} src={src} className="photo-thumb" alt={`Job photo ${i + 1}`}
                      onClick={() => setViewPhoto(src)} />
                  ))}
                </div>
              )}

              {photos.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    if (navigator.share && photos.length > 0) {
                      navigator.share({ title: "Tiling job photos", text: `I have ${photos.length} photos of my tiling job` });
                    }
                  }}>{Icon.share} Share photos</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: "#DC2626" }} onClick={() => setPhotos([])}>Clear all</button>
                </div>
              )}

              {photos.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: "var(--stone)", fontSize: 13, background: "var(--sand)", borderRadius: 10, border: "1.5px dashed #DDD7CF" }}>
                  No photos yet — tap above to take or select photos
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ GUIDE TAB ═══════════ */}
        {tab === "guide" && (
          <div className="fade-in">
            <div style={{ padding: "16px 16px 0" }}>
              <h2 style={{ fontSize: 20, marginBottom: 4 }}>DIY Tiling Guide</h2>
              <p style={{ fontSize: 13, color: "var(--stone)" }}>Everything you need to know to tile like a pro</p>
            </div>

            {/* Quick tips */}
            <div className="card">
              <div className="card-head"><h3>⚡ Quick Tips</h3></div>
              <div style={{ padding: 14, display: "grid", gap: 8 }}>
                {[
                  "Always buy 10% extra tiles to allow for cuts, breakages and future repairs",
                  "Check tiles are from the same batch number to avoid colour variation",
                  "Allow 24–48 hours for adhesive to cure before grouting",
                  "Use a spirit level constantly — one bad tile throws everything off",
                  "Seal natural stone before AND after grouting",
                  "Waterproof (tank) bathroom walls and floors before tiling",
                  "Start tiling from the centre of the room outwards, not from a wall",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--clay)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "var(--slate-lt)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by step */}
            <div className="card">
              <div className="card-head"><h3>📋 Step-by-Step Process</h3></div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { title: "Prepare the surface", body: "Surface must be clean, dry, flat and structurally sound. Fill any cracks. Check with a straight edge — no gaps greater than 3mm. On floors, lay cement board if the subfloor flexes." },
                  { title: "Waterproof wet areas", body: "In bathrooms and wet rooms, apply tanking compound to walls and floors. Pay special attention to corners. Allow to dry before tiling (usually 4–6 hours)." },
                  { title: "Plan your layout", body: "Find the centre of the room or wall. Dry-lay tiles from the centre outward to plan the pattern and avoid slivers at the edges. Mark guide lines with chalk." },
                  { title: "Mix adhesive", body: "Follow manufacturer instructions. The right consistency should hold a peak when you pull the trowel away. Don't mix more than you can use in 30–45 minutes." },
                  { title: "Apply adhesive & lay tiles", body: "Use a notched trowel to apply adhesive. Back-butter large tiles too. Press firmly and wiggle slightly to ensure full contact. Use spacers to keep joints even." },
                  { title: "Cut tiles", body: "Measure twice, cut once. Use a tile cutter for straight cuts. An angle grinder with diamond blade or jigsaw with tile blade for curves and notches." },
                  { title: "Allow to cure", body: "Leave adhesive to cure fully — 24 hours minimum for floors, 12 hours for walls. Don't walk on floor tiles or apply pressure during this time." },
                  { title: "Grout", body: "Remove spacers. Mix grout to a smooth paste. Use a rubber float to press grout into joints at 45°. Wipe excess with a damp sponge before it sets. Polish with a dry cloth after 30 minutes." },
                  { title: "Seal & finish", body: "Seal natural stone before and after grouting. Apply silicone sealant to all corners, where walls meet floors, and around baths/showers. Allow 24 hours before using." },
                ].map((step, i) => (
                  <div key={i} className="guide-step">
                    <div className="guide-num">{i + 1}</div>
                    <div className="guide-content">
                      <h4>{step.title}</h4>
                      <p>{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common mistakes */}
            <div className="card">
              <div className="card-head"><h3>🚫 Common Mistakes</h3></div>
              <div style={{ padding: 14, display: "grid", gap: 10 }}>
                {[
                  ["Skipping surface prep", "Tiles will crack or pop off if laid on an uneven or unstable surface"],
                  ["Not using enough adhesive", "You need full contact — 95% coverage for floors, 80% for walls"],
                  ["Grouting too soon", "Wait for adhesive to fully cure or tiles will shift"],
                  ["Forgetting movement joints", "Large tiled areas need expansion gaps every 3–4 metres"],
                  ["Mixing grout too watery", "Weak grout cracks. Follow the bag instructions carefully"],
                  ["Buying exact quantity", "Always buy extra — dye lots vary between batches"],
                ].map(([title, body], i) => (
                  <div key={i} style={{ borderLeft: "3px solid #FECACA", paddingLeft: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>❌ {title}</div>
                    <div style={{ fontSize: 12, color: "var(--stone)", marginTop: 2 }}>{body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tile type guide */}
            <div className="card">
              <div className="card-head"><h3>🧱 Choosing the Right Tile</h3></div>
              <div style={{ padding: 14, display: "grid", gap: 12 }}>
                {[
                  { type: "Ceramic", icon: "⬜", use: "Walls, light-use floors", note: "Budget-friendly. Not frost-proof. Don't use outdoors." },
                  { type: "Porcelain", icon: "🔲", use: "Floors, walls, outdoors", note: "Harder and denser than ceramic. Great for heavy use." },
                  { type: "Natural stone", icon: "🪨", use: "Premium floors and walls", note: "Requires sealing. More maintenance. Beautiful result." },
                  { type: "Mosaic", icon: "🔷", use: "Feature walls, wet areas", note: "Comes on mesh sheets. High grout coverage — more grout needed." },
                ].map(({ type, icon, use, note }) => (
                  <div key={type} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{type}</div>
                      <div style={{ fontSize: 12, color: "var(--clay-dk)", fontWeight: 500 }}>{use}</div>
                      <div style={{ fontSize: 12, color: "var(--stone)" }}>{note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "0 16px 8px", fontSize: 12, color: "var(--stone)", textAlign: "center", lineHeight: 1.6 }}>
              For professional results on complex jobs, always consider hiring a qualified tiler.
              Use the <strong>Find Help</strong> tab to find a tiler near you.
            </div>
          </div>
        )}

        {/* Photo overlay */}
        {viewPhoto && (
          <div className="overlay" onClick={() => setViewPhoto(null)}>
            <span className="overlay-close">×</span>
            <img src={viewPhoto} alt="Photo" />
          </div>
        )}
      </div>
    </>
  );
}
