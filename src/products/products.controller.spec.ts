import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'Product A', price: 100, stock: 10 };
    const createdProduct = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(productsService, 'create').mockResolvedValue(createdProduct as Product);

    const result = await productsController.create(dto);
    expect(result).toEqual(createdProduct);
    expect(productsService.create).toHaveBeenCalledWith(dto);
  });
  it('should find all products', async () => {
    const result = [{ id: 1, name: 'Product A' }];
    jest.spyOn(productsService, 'findAll').mockResolvedValue(result as Product[]);

    expect(await productsController.findAll()).toEqual(result);
    expect(productsService.findAll).toHaveBeenCalled();
  });

  it('should find one product', async () => {
    const result = { id: 1, name: 'Product A' };
    jest.spyOn(productsService, 'findOne').mockResolvedValue(result as Product);

    expect(await productsController.findOne(1)).toEqual(result);
    expect(productsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { name: 'Updated Product A' };
    const result = { id: 1, ...dto };
    jest.spyOn(productsService, 'update').mockResolvedValue(result as Product);

    expect(await productsController.update(1, dto)).toEqual(result);
    expect(productsService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a product', async () => {
    const result = { id: 1, name: 'Product A' };
    jest.spyOn(productsService, 'remove').mockResolvedValue(result as Product);

    expect(await productsController.remove(1)).toEqual(result);
    expect(productsService.remove).toHaveBeenCalledWith(1);
  });
});
