import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { ProductCatalogController } from './product-catalog.controller';
import { ProductCatalogService } from './product-catalog.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [
    ProductController,
    BrandController,
    ClaimController,
    ProductCatalogController,
  ],
  providers: [
    ProductService,
    BrandService,
    ClaimService,
    ProductCatalogService,
  ],
  exports: [
    ProductService,
    BrandService,
    ClaimService,
    ProductCatalogService,
  ],
})
export class CatalogModule {}
