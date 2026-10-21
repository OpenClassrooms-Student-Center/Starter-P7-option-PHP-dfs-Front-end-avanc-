import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { getSejours } from '../lib/api';
import { lireSession, sabonnerSession } from '../lib/session';
import type { Sejour } from '../lib/types';

export default function MesSejours() {
  const session = useSyncExternalStore(sabonnerSession, lireSession);
  const [sejours, setSejours] = useState<Sejour[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let actif = true;
    getSejours(session.id)
      .then((resultat) => {
        if (actif) setSejours(resultat);
      })
      .catch((e: unknown) => {
        if (actif) setErreur(e instanceof Error ? e.message : 'Impossible de charger les séjours');
      });
    return () => {
      actif = false;
    };
  }, [session?.id]);

  if (!session) {
    return (
      <section>
        <h1>Mes séjours</h1>
        <p>Connectez-vous pour retrouver vos réservations.</p>
        <Link to="/connexion">Se connecter</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Mes séjours</h1>
      <p>Retrouvez les informations pratiques de vos réservations.</p>
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      {!erreur && sejours === null && <p>Chargement des séjours…</p>}
      {sejours?.length === 0 && <p>Aucun séjour à venir.</p>}
      {sejours && sejours.length > 0 && (
        <ul className="liste-sejours">
          {sejours.map((sejour) => (
            <li className="carte-logement" key={sejour.id}>
              <h2>{sejour.logement?.titre ?? 'Logement indisponible'}</h2>
              <p>{sejour.logement?.ville} · Arrivée le {sejour.arrivee} · {sejour.nuits} nuits</p>
              <p>Statut : {sejour.statut} · Total : {sejour.prixTotal} €</p>
              <Link to={`/sejours/${sejour.id}`}>Voir le détail du séjour</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
