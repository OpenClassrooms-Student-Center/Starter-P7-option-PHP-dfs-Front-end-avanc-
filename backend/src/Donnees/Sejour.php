<?php

declare(strict_types=1);

namespace App\Donnees;

/** Séjour réservé par un voyageur dans un logement. */
final readonly class Sejour
{
    public function __construct(
        public string $id,
        public string $idVoyageur,
        public string $idLogement,
        public string $dateArrivee,
        public int $nombreNuits,
        public string $statut,
        public string $prixTotal,
        public string $dateCreation,
    ) {
    }
}
