// ─── Auth ──────────────────────────────────────────────────────────────────
export type Role = 'CLIENT' | 'LIVREUR' | 'COMMERCANT' | 'ADMIN';

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  avatar?: string;
}

export interface Livreur extends User {
  cartNationalId: string;
  vehiculePapiers: string;
  availability: boolean;
  rating: number;
  totalRevenu: number;
  revenuRetire: number;
  carteBancaire: string;
}

export interface Commercant extends User {
  cartNational: string;
  type: string;
  carteBancaire: string;
  revenuTotal: number;
}

// ─── Boutique / Catalogue / Produit ───────────────────────────────────────
export interface Boutique {
  idBoutique: string;
  nomBoutique: string;
  address: string;
  photoFrontBoutique: string;
  idCommercant: string;
}

export interface Catalogue {
  idCatalogue: string;
  nomCatalogue: string;
}

export interface Produit {
  idProduit: string;
  nomProduit: string;
  price: number;
  description: string;
  photoProduit: string;
  stock: number;
  chargilyId: string;
  idCatalogue: string;
}

// ─── Commande ─────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type LivraisonType = 'STANDARD' | 'EXPRESS';

export interface Commande {
  idCommande: string;
  date: string;
  pickUpAddress: string;
  dropOffAddress: string;
  statusCommande: OrderStatus;
  livraisonType: LivraisonType;
  idClient: string;
  idLivreur?: string;
  totalPrice: number;
  livraisonPrice: number;
  items: CommandeItem[];
}

export interface CommandeItem {
  idProduit: string;
  nomProduit: string;
  quantity: number;
  price: number;
}

// ─── Tracking ─────────────────────────────────────────────────────────────
export interface Position {
  idLivreur: string;
  geoLongitude: number;
  geoLatitude: number;
  timestamp: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  paymentId: string;
  idLivreur: string;
  status: PaymentStatus;
  prixLivraison: number;
}

// ─── API responses ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}