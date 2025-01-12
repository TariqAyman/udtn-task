import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/auth/entities/user.entity';

export class UsersSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const admin = await userRepository.findOneBy({
      email: 'admin@udtn.com',
    });
    if (!admin) {
      const adminUser = userRepository.create({
        email: 'admin@udtn.com',
        password: await bcrypt.hash('admin', 10),
        role: UserRole.Admin,
      });
      await userRepository.save(adminUser);
    }

    const regularUser = await userRepository.findOneBy({
      email: 'user@udtn.com',
    });
    if (!regularUser) {
      const user = userRepository.create({
        email: 'user@udtn.com',
        password: await bcrypt.hash('user', 10),
        role: UserRole.User,
      });
      await userRepository.save(user);
    }
  }
}
