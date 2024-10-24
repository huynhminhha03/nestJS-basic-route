import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';

export const AUTH_KEY = 'roles';

export const Auth = (...roles: Role[]) => {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata(AUTH_KEY, roles)(target, key, descriptor);
    UseGuards(JwtAuthGuard, RolesGuard)(target, key, descriptor);
  };
};
