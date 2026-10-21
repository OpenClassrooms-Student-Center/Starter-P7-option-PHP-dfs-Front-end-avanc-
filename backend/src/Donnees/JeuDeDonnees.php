<?php

declare(strict_types=1);

namespace App\Donnees;

/** Ensemble des enregistrements chargés depuis le CSV. */
final readonly class JeuDeDonnees
{
    /**
     * @param list<Utilisateur> $utilisateurs
     * @param list<Logement>    $logements
     * @param list<Sejour>      $sejours
     */
    public function __construct(
        public array $utilisateurs,
        public array $logements,
        public array $sejours,
    ) {
    }
}
