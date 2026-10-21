import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getSejour } from '../lib/api';
import type { Sejour } from '../lib/types';

export default function DetailSejour() {
  const { id } = useParams<{ id: string }>();
  const [sejour, setSejour] = useState<Sejour | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let actif = true;
    getSejour(id)
      .then((resultat) => {
        if (actif) setSejour(resultat);
      })
      .catch((e: unknown) => {
        if (actif) setErreur(e instanceof Error ? e.message : 'Impossible de charger ce séjour');
      });
    return () => {
      actif = false;
    };
  }, [id]);

  if (erreur) return <p className="erreur" role="alert">{erreur}</p>;
  if (!sejour) return <p>Chargement du séjour…</p>;

  return (
    <article className="detail-logement">
      <Link to="/mes-sejours" className="lien-retour">← Retour à mes séjours</Link>
      <h1>{sejour.logement?.titre ?? 'Logement indisponible'}</h1>
      <p>{sejour.logement?.ville}</p>
      <p>Arrivée le {sejour.arrivee} · {sejour.nuits} nuits</p>
      <p>Statut : {sejour.statut} · Total : {sejour.prixTotal} €</p>
      <p className="texte-secondaire">Référence : {sejour.id}</p>
    </article>
  );
}
