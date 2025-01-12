import { RolesGuard } from './roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard(new Reflector());
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if user has required role', () => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.Admin },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as any;

    jest
      .spyOn(Reflector.prototype, 'getAllAndOverride')
      .mockReturnValue([UserRole.Admin]);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.User },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as any;

    jest
      .spyOn(Reflector.prototype, 'getAllAndOverride')
      .mockReturnValue([UserRole.Admin]);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });});
