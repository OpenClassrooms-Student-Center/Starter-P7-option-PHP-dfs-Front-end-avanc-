<?php

declare(strict_types=1);

namespace App\Controller;

use App\Donnees\ChargeurCsv;
use App\Donnees\Logement;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AvisController
{
    public function __construct(private ChargeurCsv $chargeur)
    {
    }

    #[Route('/logements/{id}/avis/apercu', name: 'avis_apercu', methods: ['GET'])]
    public function apercu(string $id, Request $request): Response
    {
        $donnees = $this->chargeur->charger();
        $logement = array_find(
            $donnees->logements,
            static fn (Logement $candidat): bool => $candidat->id === $id,
        );

        if (null === $logement) {
            return new Response('Logement introuvable', Response::HTTP_NOT_FOUND);
        }

        $message = (string) $request->query->get('message', '');

        return new Response(
            '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Avis logement</title>'
            .'<h1>Avis pour '.htmlspecialchars($logement->titre, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8').'</h1>'
            .'<p>'.$message.'</p></html>',
            Response::HTTP_OK,
            ['Content-Type' => 'text/html; charset=UTF-8'],
        );
    }
}
