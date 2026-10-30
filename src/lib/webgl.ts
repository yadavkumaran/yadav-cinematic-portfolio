export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('webgl') === 'off') return false;

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return Boolean(context);
  } catch {
    return false;
  }
}

export function devicePixelRatioCap(): number {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const small = typeof window !== 'undefined' && window.innerWidth < 768;
  return Math.min(dpr, small ? 1.25 : 1.5);
}
