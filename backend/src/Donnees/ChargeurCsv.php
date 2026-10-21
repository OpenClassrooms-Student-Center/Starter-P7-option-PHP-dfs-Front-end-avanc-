<?php

declare(strict_types=1);

namespace App\Donnees;

/**
 * Lit le fichier CSV de données et le transforme en comptes, logements et séjours.
 *
 * La première ligne du fichier est l'en-tête ; la colonne type_enregistrement
 * indique la nature de chaque ligne (utilisateur, logement ou séjour). Le fichier n'utilise
 * ni guillemets ni virgules dans ses valeurs : un découpage simple suffit.
 */
final class ChargeurCsv
{
    private const string SEPARATEUR = ',';
    private const string BOM_UTF8 = "\u{FEFF}";

    public function __construct(private string $cheminFichier)
    {
    }

    /**
     * Transforme le contenu texte du CSV en jeu de données. Les lignes vides sont ignorées.
     */
    public static function parser(string $texte): JeuDeDonnees
    {
        if (str_starts_with($texte, self::BOM_UTF8)) {
            $texte = substr($texte, \strlen(self::BOM_UTF8));
        }

        $lignes = preg_split('/\r?\n/', $texte);
        if (false === $lignes) {
            return new JeuDeDonnees([], [], []);
        }

        $lignes = array_values(array_filter($lignes, static fn (string $ligne): bool => '' !== trim($ligne)));
        if ([] === $lignes) {
            return new JeuDeDonnees([], [], []);
        }

        $entetes = self::decouperLigne(array_shift($lignes));
        $utilisateurs = [];
        $logements = [];
        $sejours = [];

        foreach ($lignes as $ligne) {
            $valeurs = self::decouperLigne($ligne);
            $enregistrement = [];
            foreach ($entetes as $index => $cle) {
                $enregistrement[$cle] = $valeurs[$index] ?? '';
            }

            $type = $enregistrement['type_enregistrement'] ?? '';
            if ('utilisateur' === $type) {
                $utilisateurs[] = self::versUtilisateur($enregistrement);
            } elseif ('logement' === $type) {
                $logements[] = self::versLogement($enregistrement);
            } elseif ('sejour' === $type) {
                $sejours[] = self::versSejour($enregistrement);
            }
        }

        return new JeuDeDonnees($utilisateurs, $logements, $sejours);
    }

    /**
     * Lit le fichier sur le disque et renvoie les données parsées.
     */
    public function charger(): JeuDeDonnees
    {
        if (!is_file($this->cheminFichier)) {
            throw new \RuntimeException(sprintf('Fichier de données introuvable : %s', $this->cheminFichier));
        }

        $texte = file_get_contents($this->cheminFichier);
        if (false === $texte) {
            throw new \RuntimeException(sprintf('Impossible de lire le fichier de données : %s', $this->cheminFichier));
        }

        return self::parser($texte);
    }

    /**
     * @return list<string>
     */
    private static function decouperLigne(string $ligne): array
    {
        return array_map(static fn (string $valeur): string => trim($valeur), explode(self::SEPARATEUR, $ligne));
    }

    /**
     * @param array<string, string> $enregistrement
     */
    private static function versUtilisateur(array $enregistrement): Utilisateur
    {
        return new Utilisateur(
            id: $enregistrement['id'] ?? '',
            role: $enregistrement['role'] ?? '',
            prenom: $enregistrement['prenom'] ?? '',
            nom: $enregistrement['nom'] ?? '',
            email: $enregistrement['email'] ?? '',
            motDePasseClair: $enregistrement['mot_de_passe_clair'] ?? '',
            dateCreation: $enregistrement['date_creation'] ?? '',
        );
    }

    /**
     * @param array<string, string> $enregistrement
     */
    private static function versLogement(array $enregistrement): Logement
    {
        return new Logement(
            id: $enregistrement['id'] ?? '',
            titre: $enregistrement['titre'] ?? '',
            typeLogement: $enregistrement['type_logement'] ?? '',
            ville: $enregistrement['ville'] ?? '',
            prixParNuit: $enregistrement['prix_par_nuit'] ?? '',
            idHote: $enregistrement['id_hote'] ?? '',
            dateCreation: $enregistrement['date_creation'] ?? '',
        );
    }

    /**
     * @param array<string, string> $enregistrement
     */
    private static function versSejour(array $enregistrement): Sejour
    {
        return new Sejour(
            id: $enregistrement['id'] ?? '',
            idVoyageur: $enregistrement['id_voyageur'] ?? '',
            idLogement: $enregistrement['id_logement'] ?? '',
            dateArrivee: $enregistrement['date_arrivee'] ?? '',
            nombreNuits: (int) ($enregistrement['nombre_nuits'] ?? 0),
            statut: $enregistrement['statut_sejour'] ?? '',
            prixTotal: $enregistrement['prix_total'] ?? '',
            dateCreation: $enregistrement['date_creation'] ?? '',
        );
    }
}
