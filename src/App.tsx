import { Background } from './components/Background';
import { Filters } from './components/Filters';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Capacidades } from './components/Capacidades';
import { Casos } from './components/Casos';
import { Proceso } from './components/Proceso';
import { Stats } from './components/Stats';
import { Manifesto } from './components/Manifesto';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Filters />
      <Background />
      <Nav />
      <main>
        <Hero />
        <Capacidades />
        <Casos />
        <Proceso />
        <Stats />
        <Manifesto />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
