import { useSyncExternalStore } from 'react';

/** Sodium's WhatsApp, opened with the brief request already typed. */
export const WHATSAPP_URL =
  'https://wa.me/5491125918111?text=' +
  encodeURIComponent('Hola Sodium! Quiero agendar un brief de 30 minutos.');

const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)';

function subscribe(onChange: () => void) {
  const mq = matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** True on phones/touch: contact actions go straight to WhatsApp there. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/** Link props for "start a project" buttons: WhatsApp on mobile, the contact section elsewhere. */
export function useContactLink() {
  const mobile = useIsMobile();
  return mobile
    ? { href: WHATSAPP_URL, target: '_blank', rel: 'noopener noreferrer' }
    : { href: '#contacto' };
}
