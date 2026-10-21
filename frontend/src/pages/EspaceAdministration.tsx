import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getTableauAdministration } from '../lib/api';
import type { TableauAdministration } from '../lib/types';
import '../styles/administration.css';

export default function EspaceAdministration() {
  const [tableau, setTableau] = useState<TableauAdministration | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;
    getTableauAdministration()
      .then((resultat) => {
        if (actif) setTableau(resultat);
      })
      .catch((e: unknown) => {
        if (actif) setErreur(e instanceof Error ? e.message : 'Impossible de charger le tableau de bord');
      });
    return () => {
      actif = false;
    };
  }, []);

  if (erreur) return <p className="erreur" role="alert">{erreur}</p>;
  if (!tableau) return <p>Chargement du tableau de bord…</p>;

  const { indicateurs } = tableau;

  return (
    <div className="console-admin">
      <aside className="console-admin__sidebar">
        <Link className="console-admin__brand" to="/">
          Kasa <span>interne</span>
        </Link>
        <p className="console-admin__section-label">ESPACE OPÉRATIONS</p>
        <a className="console-admin__nav-active" href="#vue-generale">Vue générale</a>
        <a href="#sejours">Réservations</a>
        <a href="#logements">Annonces</a>
        <a href="#activite">Journal d’activité</a>
        <div className="console-admin__environment">
          <span className="console-admin__online-dot" /> Environnement de gestion
          <small>Console interne · Europe</small>
        </div>
      </aside>

      <main className="console-admin__main">
        <header className="console-admin__topbar">
          <span>Opérations / Vue générale</span>
          <span className="console-admin__account">Kasa · Équipe interne</span>
        </header>

        <section className="console-admin__intro" id="vue-generale">
          <div>
            <p className="console-admin__eyebrow">TABLEAU DE BORD</p>
            <h1>Vue générale</h1>
            <p>Suivi des séjours, des annonces et de l’activité de la plateforme.</p>
          </div>
          <button className="console-admin__primary-action" type="button">Exporter le rapport</button>
        </section>

        <section className="console-admin__metrics" aria-label="Indicateurs de la plateforme">
          <article>
            <span>Logements publiés</span>
            <strong>{indicateurs.logementsPublies}</strong>
            <small>Sur la plateforme</small>
          </article>
          <article>
            <span>Comptes voyageurs</span>
            <strong>{indicateurs.comptesVoyageurs}</strong>
            <small>Comptes actifs</small>
          </article>
          <article>
            <span>Séjours confirmés</span>
            <strong>{indicateurs.sejoursConfirmes}</strong>
            <small>Réservations enregistrées</small>
          </article>
          <article>
            <span>Volume réservé</span>
            <strong>{indicateurs.volumeReserve.toLocaleString('fr-FR')} €</strong>
            <small>Total des séjours confirmés</small>
          </article>
        </section>

        <section className="console-admin__panel" id="sejours">
          <div className="console-admin__panel-heading">
            <div>
              <h2>Réservations récentes</h2>
              <p>Données voyageurs et séjours · accès interne</p>
            </div>
            <button type="button">Voir tout</button>
          </div>
          <div className="console-admin__table-wrap">
            <table>
              <thead>
                <tr><th>Référence</th><th>Voyageur</th><th>Logement</th><th>Arrivée</th><th>État</th><th>Montant</th><th /></tr>
              </thead>
              <tbody>
                {tableau.sejours.map((sejour) => (
                  <tr key={sejour.id}>
                    <td>{sejour.id}</td>
                    <td>{sejour.voyageur?.nom ?? 'Compte indisponible'}<small>{sejour.voyageur?.email}</small></td>
                    <td>{sejour.logement?.titre ?? 'Logement indisponible'}</td>
                    <td>{sejour.arrivee}</td>
                    <td><span className="console-admin__status">{sejour.statut}</span></td>
                    <td>{Number(sejour.montant).toLocaleString('fr-FR')} €</td>
                    <td><button type="button">Ouvrir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="console-admin__panel" id="logements">
          <div className="console-admin__panel-heading">
            <div>
              <h2>Annonces à suivre</h2>
              <p>Inventaire des logements actuellement publiés</p>
            </div>
            <button type="button">Gérer les annonces</button>
          </div>
          <div className="console-admin__table-wrap">
            <table>
              <thead>
                <tr><th>Référence</th><th>Logement</th><th>Ville</th><th>Prix / nuit</th><th>État</th><th /></tr>
              </thead>
              <tbody>
                {tableau.logements.map((logement) => (
                  <tr key={logement.id}>
                    <td>{logement.id}</td>
                    <td>{logement.titre}</td>
                    <td>{logement.ville}</td>
                    <td>{Number(logement.prixParNuit).toLocaleString('fr-FR')} €</td>
                    <td><span className="console-admin__status">{logement.statut}</span></td>
                    <td><button type="button">Examiner</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="console-admin__footer" id="activite">
          Console de gestion Kasa · Données mises à jour à partir du référentiel de la plateforme
        </footer>
      </main>
    </div>
  );
}
