<?php

declare(strict_types=1);

namespace App\Controller;

use App\Donnees\ChargeurCsv;
use App\Donnees\Logement;
use App\Donnees\Sejour;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class SejourController extends AbstractController
{
    public function __construct(private ChargeurCsv $chargeur)
    {
    }

    #[Route('/api/sejours', name: 'sejours_liste', methods: ['GET'])]
    public function liste(Request $request): JsonResponse
    {
        $voyageurId = (string) $request->query->get('voyageurId', '');
        $donnees = $this->chargeur->charger();
        $sejours = array_filter($donnees->sejours, static fn (Sejour $sejour): bool => $sejour->idVoyageur === $voyageurId);

        return $this->json(array_values(array_map(
            fn (Sejour $sejour): array => $this->presenter($sejour, $donnees->logements),
            $sejours,
        )));
    }

    #[Route('/api/sejours/{id}', name: 'sejour_detail', methods: ['GET'])]
    public function detail(string $id): JsonResponse
    {
        $donnees = $this->chargeur->charger();
        $sejour = array_find($donnees->sejours, static fn (Sejour $candidat): bool => $candidat->id === $id);
        if (null === $sejour) {
            return $this->json(['message' => 'Séjour introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($this->presenter($sejour, $donnees->logements));
    }

    /**
     * @param list<Logement> $logements
     *
     * @return array<string, mixed>
     */
    private function presenter(Sejour $sejour, array $logements): array
    {
        $logement = array_find($logements, static fn (Logement $candidat): bool => $candidat->id === $sejour->idLogement);

        return [
            'id' => $sejour->id,
            'voyageurId' => $sejour->idVoyageur,
            'arrivee' => $sejour->dateArrivee,
            'nuits' => $sejour->nombreNuits,
            'statut' => $sejour->statut,
            'prixTotal' => $sejour->prixTotal,
            'logement' => null === $logement ? null : [
                'id' => $logement->id,
                'titre' => $logement->titre,
                'ville' => $logement->ville,
            ],
        ];
    }
}
