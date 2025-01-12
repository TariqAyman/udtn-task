import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('signed-jwt'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    // Arrange: Mock repository and input DTO
    mockUserRepo.findOne.mockResolvedValue(null); // Ensure email is not already registered
    mockUserRepo.create.mockImplementation((dto: any) => dto);
    mockUserRepo.save.mockImplementation(
      (user: any) => Promise.resolve({ id: 1, ...user }), // Simulate DB save with ID
    );

    const dto = {
      email: 'test@example.com',
      password: 'password',
      role: UserRole.User.toString(),
    };

    // Act: Call the register method
    const result = await service.register(dto);

    // Assert: Validate results
    expect(result.user).toBeDefined();
    // expect(result.user.id).toEqual(1);
    expect(result.user.email).toEqual(dto.email);
    expect(result.user.role).toEqual(dto.role);
    expect(mockUserRepo.save).toHaveBeenCalledWith({
      email: dto.email,
      password: expect.any(String), // Password should be hashed
      role: dto.role,
    });
  });

  it('should login a user', async () => {
    // Arrange: Mock repository and input DTO
    const hashedPassword = await bcrypt.hash('password', 10);
    mockUserRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      role: UserRole.User.toString(),
    });

    const dto = { email: 'test@example.com', password: 'password' };

    // Act: Call the login method
    const result = await service.login(dto);

    // Assert: Validate results
    expect(result.token).toBe('signed-jwt');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: dto.email,
      role: UserRole.User.toString(),
    });
  });

  it('should throw error if email is already registered', async () => {
    // Arrange: Mock repository
    mockUserRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });

    const dto = {
      email: 'test@example.com',
      password: 'password',
      role: UserRole.User.toString(),
    };

    // Act & Assert: Expect an error to be thrown
    await expect(service.register(dto)).rejects.toThrow('Email already in use');
  });

  it('should throw error if password is invalid during login', async () => {
    // Arrange: Mock repository
    const hashedPassword = await bcrypt.hash('password', 10);
    mockUserRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      role: UserRole.User.toString(),
    });

    const dto = { email: 'test@example.com', password: 'wrong-password' };

    // Act & Assert: Expect an error to be thrown
    await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
  });
});
