export type Role = 'utilisateur' | 'hote' | 'administrateur';

export interface Hote {
  prenom: string;
  nom: string;
}

export interface Logement {
  id: string;
  titre: string;
  typeLogement: 'appartement' | 'maison';
  ville: string;
  prixParNuit: string;
  idHote: string;
  dateCreation: string;
  hote: Hote | null;
}

export interface ReponseConnexion {
  id: string;
  role: Role;
  prenom: string;
  nom: string;
  email: string;
}

export interface SessionUtilisateur {
  id: string;
  role: Role;
  prenom: string;
}

export interface Sejour {
  id: string;
  voyageurId: string;
  arrivee: string;
  nuits: number;
  statut: string;
  prixTotal: string;
  logement: {
    id: string;
    titre: string;
    ville: string;
  } | null;
}

export interface ContactConciergerie {
  logement: {
    id: string;
    titre: string;
  };
  partenaire: {
    nom: string;
    email: string;
  };
}

export interface TableauAdministration {
  indicateurs: {
    logementsPublies: number;
    comptesVoyageurs: number;
    sejoursConfirmes: number;
    volumeReserve: number;
  };
  sejours: {
    id: string;
    voyageur: { nom: string; email: string } | null;
    logement: { titre: string } | null;
    arrivee: string;
    statut: string;
    montant: string;
  }[];
  logements: {
    id: string;
    titre: string;
    ville: string;
    prixParNuit: string;
    statut: string;
  }[];
}
