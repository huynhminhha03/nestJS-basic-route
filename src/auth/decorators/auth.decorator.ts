import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../passport/jwt-auth.guard';
import { RolesGuard } from '../../roles/roles.guard';
import { Role } from '../../roles/role.enum';

export const AUTH_KEY = 'roles';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata(AUTH_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
};
