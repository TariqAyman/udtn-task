import { Product } from 'src/products/entities/product.entity';
import { DataSource } from 'typeorm';

export class ProductsSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);

    const product1 = productRepository.create({
      name: 'Sample Product 1',
      description: 'This is a sample product',
      price: 100.0,
      stock: 50,
    });
    const product2 = productRepository.create({
      name: 'Sample Product 2',
      description: 'This is another sample product',
      price: 200.0,
      stock: 30,
    });

    await productRepository.save([product1, product2]);
  }
}
