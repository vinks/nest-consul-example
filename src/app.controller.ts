import { Controller, Get } from '@nestjs/common';
import { InjectConsulService, ConsulService } from 'nest-consul-service';
import { InjectLoadbalance, Loadbalance } from 'nest-consul-loadbalance';

@Controller('app')
export class AppController {
    constructor(
        @InjectConsulService() private readonly service: ConsulService,
        @InjectLoadbalance() private readonly lb: Loadbalance,
    ) {}

    @Get()
    public async getServices() {
        const services = this.service.getServices('user-service', { passing: false});
        return services;
    }

    @Get('balance')
    public async chooseOneNode() {
        const node = this.lb.choose('user-service');
        return node;
    }
}