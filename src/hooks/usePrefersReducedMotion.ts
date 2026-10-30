import { useEffect, useState } from 'react';
import { readMotionPreference } from '../lib/motion';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readMotionPreference);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(readMotionPreference());
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
