export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ProductImageContract {
  id: string;
  url: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductCategoryContract {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface ProductContract {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  slug: string;
  brand?: string;
  sku: string;
  shortDescription?: string;
  longDescription?: string;
  productType?: string;
  status: ProductStatus;
  price?: number;
  currency: string;
  category: ProductCategoryContract;
  images: ProductImageContract[];
  createdAt: string;
  updatedAt: string;
}
