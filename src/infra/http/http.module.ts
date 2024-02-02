import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/store.module'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, ServicesModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
