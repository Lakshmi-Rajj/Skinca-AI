import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { SkinController } from './skin.controller';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  // ThrottlerModule already registered globally in AppModule.
  // Re-importing here ensures the guard can resolve even if module order changes.
  imports: [ConfigurationModule, ThrottlerModule],
  controllers: [SkinController],
})
export class SkinModule {}
