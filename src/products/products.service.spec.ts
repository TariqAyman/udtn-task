import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepo: any;

  beforeEach(async () => {
    mockProductRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    mockProductRepo.create.mockImplementation((dto: any) => dto);
    mockProductRepo.save.mockImplementation((product: any) =>
      Promise.resolve({ id: 1, ...product }),
    );

    const dto = { name: 'Product A', price: 100, stock: 10 };
    const result = await service.create(dto);

    expect(result.id).toEqual(1);
    expect(mockProductRepo.save).toHaveBeenCalledWith(dto);
  });

  it('should find all products', async () => {
    mockProductRepo.find.mockResolvedValue([{ id: 1, name: 'Product A' }]);
    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Product A');
  });
});
