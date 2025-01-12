import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ProfileDto } from './dto/profile.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const mockUser = new ProfileDto({ ...dto, role: 'user', id: '1' });
    jest.spyOn(authService, 'register').mockResolvedValue({
      message: 'User registered successfully',
      user: mockUser,
    });

    const result = await authController.register(dto);
    expect(result).toEqual({
      message: 'User registered successfully',
      user: mockUser,
    });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });
  it('should login a user', async () => {
    const dto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const payload = { email: 'test@example.com', sub: 1, role: 'user' };

    jest.spyOn(authService, 'login').mockResolvedValue({
      user: payload,
      message: 'Login successful',
      token: 'jwt-token',
    });

    const result = await authController.login(dto);
    expect(result).toEqual({
      message: 'Login successful',
      token: 'jwt-token',
      user: payload,
    });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
