/**
 * Tiny mutable singleton bridging the WebGL loop and the DOM HUD without
 * triggering React re-renders. The scene writes into it every frame; DOM
 * readouts poll it with their own rAF.
 */
export const orbitState = {
  azimuthDeg: 0,
  polarDeg: 90,
  dragging: false,
  activeHotspot: null as string | null,
};
