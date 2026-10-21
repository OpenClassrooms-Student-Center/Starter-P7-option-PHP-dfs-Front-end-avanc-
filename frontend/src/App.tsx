import { BrowserRouter, Route, Routes } from 'react-router';
import Header from './components/Header';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import DetailLogement from './pages/DetailLogement';
import MesSejours from './pages/MesSejours';
import DetailSejour from './pages/DetailSejour';
import EspaceAdministration from './pages/EspaceAdministration';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="conteneur">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/logements/:id" element={<DetailLogement />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/mes-sejours" element={<MesSejours />} />
          <Route path="/sejours/:id" element={<DetailSejour />} />
          <Route path="/administration" element={<EspaceAdministration />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
