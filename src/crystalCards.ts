/**
 * Registries the 3D scene reads every frame.
 *
 * - Cards: `<Glass>` registers its element; the scene places a refractive
 *   slab exactly behind its live bounding rect.
 * - Anchors: `<SceneAnchor>` marks a DOM box where a 3D piece (a prism that
 *   splits a traced light beam, or the glass fractal) is pinned to the layout.
 */
export type CardMaterial = 'crystal' | 'holo';

export type CrystalCard = {
  el: HTMLElement;
  radius: number;
  material: CardMaterial;
  /** 0..1 target presence — the scene eases the slab towards it. */
  on: number;
};

export type AnchorKind = 'prism' | 'fractal';

export type BeamLight = 'spectrum' | 'white';

export type SceneAnchorEntry = {
  el: HTMLElement;
  kind: AnchorKind;
  /** Prism roll in degrees (0 = apex up). */
  rotation: number;
  /** Incoming beam direction in degrees, screen space (negative = rising). */
  beamAngle: number;
  /** 'spectrum': the prism fans the beam into colours; 'white': it only bends it. */
  light: BeamLight;
};

const cards = new Set<CrystalCard>();
const anchors = new Set<SceneAnchorEntry>();

export function registerCard(card: CrystalCard): () => void {
  cards.add(card);
  return () => {
    cards.delete(card);
  };
}

export function getCards(): ReadonlySet<CrystalCard> {
  return cards;
}

export function registerAnchor(anchor: SceneAnchorEntry): () => void {
  anchors.add(anchor);
  return () => {
    anchors.delete(anchor);
  };
}

export function getAnchors(): ReadonlySet<SceneAnchorEntry> {
  return anchors;
}
