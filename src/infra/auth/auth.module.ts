import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { HttpModule } from '../http/http.module'

import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { JwtStrategy } from './authentication/jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './authentication/jwt-auth-guard'
import { RolesGuard } from './authorization/roles.guard'

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    EnvService,
  ],
})
export class AuthModule {}
