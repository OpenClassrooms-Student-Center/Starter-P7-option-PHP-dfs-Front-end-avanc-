import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { API_URL, getContactConciergerie, getLogement } from '../lib/api';
import type { Logement } from '../lib/types';

export default function DetailLogement() {
  const { id } = useParams<{ id: string }>();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [avis, setAvis] = useState('');
  const [urlApercu, setUrlApercu] = useState<string | null>(null);
  const [contact, setContact] = useState<{ nom: string; email: string } | null>(null);
  const [erreurContact, setErreurContact] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined) return;
    let actif = true;

    getLogement(id)
      .then((resultat) => {
        if (actif) setLogement(resultat);
      })
      .catch((e: unknown) => {
        if (actif) setErreur(e instanceof Error ? e.message : 'Impossible de charger les logements');
      });

    return () => {
      actif = false;
    };
  }, [id]);

  if (erreur) {
    return <p className="erreur" role="alert">{erreur}</p>;
  }

  if (logement === null) {
    return <p>Chargement du logement…</p>;
  }

  function afficherApercu(evenement: FormEvent<HTMLFormElement>) {
    evenement.preventDefault();
    if (!id) return;
    const query = new URLSearchParams({ message: avis });
    setUrlApercu(`${API_URL}/logements/${encodeURIComponent(id)}/avis/apercu?${query.toString()}`);
  }

  async function chargerConciergerie() {
    if (!id) return;
    setErreurContact(null);
    try {
      const resultat = await getContactConciergerie(id);
      setContact(resultat.partenaire);
    } catch (e) {
      setErreurContact(e instanceof Error ? e.message : 'Impossible de charger la conciergerie');
    }
  }

  return (
    <article className="detail-logement">
      <Link to="/" className="lien-retour">← Retour aux logements</Link>
      <h1>{logement.titre}</h1>
      <p className="detail-meta">{logement.typeLogement} · {logement.ville}</p>
      <p className="prix">{logement.prixParNuit} € / nuit</p>
      {logement.hote && <p>Proposé par {logement.hote.prenom}</p>}

      <section className="section-logement">
        <h2>Donner votre avis</h2>
        <p>Prévisualisez votre avis avant de le publier sur ce logement.</p>
        <form className="formulaire" onSubmit={afficherApercu}>
          <label className="champ">
            <span>Votre avis</span>
            <textarea required value={avis} onChange={(e) => setAvis(e.target.value)} rows={4} />
          </label>
          <button className="bouton" type="submit">Prévisualiser l’avis</button>
        </form>
        {urlApercu && <iframe className="cadre-externe" src={urlApercu} title="Aperçu de votre avis" />}
      </section>

      <section className="section-logement">
        <h2>Services pour votre séjour</h2>
        <p>Besoin de linge ou d’une remise de clés ? Contactez notre partenaire local.</p>
        <button className="bouton bouton-secondaire" type="button" onClick={chargerConciergerie}>
          Voir le contact de conciergerie
        </button>
        {erreurContact && <p className="erreur" role="alert">{erreurContact}</p>}
        {contact && <p>{contact.nom} · <a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
      </section>
    </article>
  );
}
