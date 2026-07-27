import { Test, TestingModule } from '@nestjs/testing';
import { ProductCatalogService } from '../src/catalog/product-catalog.service';
import { BrandService } from '../src/catalog/brand.service';
import { ClaimService } from '../src/catalog/claim.service';
import { AuditService } from '../src/audit/audit.service';

describe('ProductCatalogService & BrandService Unit Tests', () => {
  let catalogService: ProductCatalogService;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCatalogService,
        BrandService,
        ClaimService,
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue({ id: 'audit_123' }),
          },
        },
      ],
    }).compile();

    catalogService = module.get<ProductCatalogService>(ProductCatalogService);
    brandService = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(catalogService).toBeDefined();
    expect(brandService).toBeDefined();
  });
});
