<?php

declare(strict_types=1);

namespace App\Controller;

use App\Donnees\ChargeurCsv;
use App\Donnees\Logement;
use App\Donnees\Sejour;
use App\Donnees\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AdministrationController extends AbstractController
{
    public function __construct(private ChargeurCsv $chargeur)
    {
    }

    #[Route('/api/administration', name: 'administration_resume', methods: ['GET'])]
    public function resume(): JsonResponse
    {
        $donnees = $this->chargeur->charger();
        $sejoursConfirmes = array_filter($donnees->sejours, static fn (Sejour $sejour): bool => 'confirmee' === $sejour->statut);

        return $this->json([
            'indicateurs' => [
                'logementsPublies' => count($donnees->logements),
                'comptesVoyageurs' => $this->compterRole($donnees->utilisateurs, 'utilisateur'),
                'sejoursConfirmes' => count($sejoursConfirmes),
                'volumeReserve' => array_sum(array_map(static fn (Sejour $sejour): int => (int) $sejour->prixTotal, $sejoursConfirmes)),
            ],
            'sejours' => array_map(
                fn (Sejour $sejour): array => $this->presenterSejour($sejour, $donnees->utilisateurs, $donnees->logements),
                $donnees->sejours,
            ),
            'logements' => array_map(static fn (Logement $logement): array => [
                'id' => $logement->id,
                'titre' => $logement->titre,
                'ville' => $logement->ville,
                'prixParNuit' => $logement->prixParNuit,
                'statut' => 'Publié',
            ], $donnees->logements),
        ]);
    }

    /** @param list<Utilisateur> $utilisateurs */
    private function compterRole(array $utilisateurs, string $role): int
    {
        return count(array_filter($utilisateurs, static fn (Utilisateur $utilisateur): bool => $utilisateur->role === $role));
    }

    /**
     * @param list<Utilisateur> $utilisateurs
     * @param list<Logement>    $logements
     *
     * @return array<string, mixed>
     */
    private function presenterSejour(Sejour $sejour, array $utilisateurs, array $logements): array
    {
        $voyageur = array_find($utilisateurs, static fn (Utilisateur $candidat): bool => $candidat->id === $sejour->idVoyageur);
        $logement = array_find($logements, static fn (Logement $candidat): bool => $candidat->id === $sejour->idLogement);

        return [
            'id' => $sejour->id,
            'voyageur' => null === $voyageur ? null : [
                'nom' => $voyageur->prenom.' '.$voyageur->nom,
                'email' => $voyageur->email,
            ],
            'logement' => null === $logement ? null : ['titre' => $logement->titre],
            'arrivee' => $sejour->dateArrivee,
            'statut' => ucfirst($sejour->statut),
            'montant' => $sejour->prixTotal,
        ];
    }
}
