import { useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { effacerSession, lireSession, sabonnerSession } from '../lib/session';

const NOM_APPLICATION = import.meta.env.VITE_APP_NAME ?? 'Kasa';

export default function Header() {
  const session = useSyncExternalStore(sabonnerSession, lireSession);

  return (
    <header className="entete">
      <Link to="/" className="entete-logo">
        {NOM_APPLICATION}
      </Link>
      <nav aria-label="Navigation principale">
        {session ? (
          <>
            <Link to="/mes-sejours">Mes séjours</Link>
            <span>Bonjour {session.prenom}</span>
            <button type="button" className="bouton bouton-secondaire" onClick={effacerSession}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/connexion">Connexion</Link>
        )}
      </nav>
    </header>
  );
}
