import type { ReactNode } from 'react';
import { Background } from './Background';
import { CrystalScene } from './Crystal';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { useReveal } from '../useReveal';
import { useKinetic } from '../kinetic';

/** Shell shared by every page: backdrop, 3D scene, nav, content, footer. */
export function Layout({ children }: { children: ReactNode }) {
  useReveal();
  useKinetic();
  return (
    <>
      <Background />
      <CrystalScene />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
