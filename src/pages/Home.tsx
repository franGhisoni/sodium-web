import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { Clientes } from '../components/Clientes';
import { Servicios } from '../components/Servicios';
import { Capacidades } from '../components/Capacidades';
import { Casos } from '../components/Casos';
import { Marquee } from '../components/Marquee';
import { Proceso } from '../components/Proceso';
import { Stats } from '../components/Stats';
import { Manifesto } from '../components/Manifesto';
import { PorQue } from '../components/PorQue';
import { Faq } from '../components/Faq';
import { CTA } from '../components/CTA';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Clientes />
      <Servicios />
      <Capacidades />
      <Casos />
      <Marquee />
      <Proceso />
      <Stats />
      <Manifesto />
      <PorQue />
      <Faq />
      <CTA />
    </Layout>
  );
}
