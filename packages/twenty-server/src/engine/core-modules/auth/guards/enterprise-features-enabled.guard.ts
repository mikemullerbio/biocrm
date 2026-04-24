import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class EnterpriseFeaturesEnabledGuard implements CanActivate {

  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
