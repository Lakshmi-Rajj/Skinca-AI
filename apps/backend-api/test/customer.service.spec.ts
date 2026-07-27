import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../src/customer/customer.service';
import { SkinTypeEnum } from '../src/customer/dto/skin-profile.dto';

describe('CustomerService Unit & Integration Tests', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
