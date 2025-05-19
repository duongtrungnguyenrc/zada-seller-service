export class IShop {
  id: string;
  userId: string;
  name: string;
  description: string;
  logoUrl?: string;
  rating: number;
  taxId?: string;
  isVerified: boolean;
  isLocked: boolean;
  createdAt: Date;
}
