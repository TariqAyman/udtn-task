import { DataSource } from 'typeorm';
import { connectionSource } from './typeorm.config';
import { UsersSeeder } from './seeders/users.seeder';
import { ProductsSeeder } from './seeders/products.seeder';

(async () => {
  const dataSource: DataSource = await connectionSource.initialize();
  console.log('Data source initialized');

  await UsersSeeder.run(dataSource);
  console.log('Users seeded');

  await ProductsSeeder.run(dataSource);
  console.log('Products seeded');

  await dataSource.destroy();
  console.log('Data source destroyed');
})();
