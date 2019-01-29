import { Module, Logger } from '@nestjs/common';
import { ConsulModule } from 'nest-consul';
import { ConsulServiceModule, PASSING } from 'nest-consul-service';
import { AppController } from './app.controller';
import { HealthController } from './health-check.controller';
import { LoadbalanceModule } from 'nest-consul-loadbalance';
import { join } from 'path';

@Module({
  controllers: [AppController, HealthController],
  imports: [
    ConsulModule.register({
        host: '127.0.0.1',
        port: 8500
    }),
    LoadbalanceModule.register({
      rules: [
          {
            service: 'user-service',
            ruleCls: join(__dirname, 'user-service.rule'),
          }
      ]
    }),
    ConsulServiceModule.register({
      serviceId: process.env.APP_ID,
      serviceName: 'user-service',
      port: parseInt(process.env.APP_PORT, 10),
      consul: {
        discovery_host: 'localhost',
        health_check: {
          timeout: '1s',
          interval: '10s',
        },
        max_retry: 5,
        retry_interval: 3000,
      },
      logger: Logger,
      checks: [() => {
        return { status: PASSING, message: 'ok' }
      }]
    }),
],
})
export class AppModule {}