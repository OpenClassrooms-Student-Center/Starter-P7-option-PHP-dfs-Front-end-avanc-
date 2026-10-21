<?php

declare(strict_types=1);

namespace App\Controller;

use App\Donnees\ChargeurCsv;
use App\Donnees\Logement;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ConciergerieController extends AbstractController
{
    public function __construct(private ChargeurCsv $chargeur)
    {
    }

    #[Route('/api/logements/{id}/conciergerie', name: 'logement_conciergerie', methods: ['GET'])]
    public function partenaire(string $id): JsonResponse
    {
        $donnees = $this->chargeur->charger();
        $logement = array_find(
            $donnees->logements,
            static fn (Logement $candidat): bool => $candidat->id === $id,
        );
        if (null === $logement) {
            return $this->json(['message' => 'Logement introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        /** @var array{integration_partenaire: array{nom: string, email: string, identifiant: string, cle_privee: string}} $configuration */
        $configuration = require dirname(__DIR__, 2).'/config/partenaire.php';

        return $this->json([
            'logement' => ['id' => $logement->id, 'titre' => $logement->titre],
            'partenaire' => $configuration['integration_partenaire'],
        ]);
    }
}
