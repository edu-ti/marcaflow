import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@marcaflow/database';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        return new PrismaClient();
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
