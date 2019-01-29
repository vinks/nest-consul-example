import { Loadbalancer, IRule } from 'nest-consul-loadbalance';

export class CustomRule implements IRule {
    private loadbalancer: Loadbalancer;

    init(loadbalancer: Loadbalancer) {
        this.loadbalancer = loadbalancer;
    }

    choose() {
        const servers = this.loadbalancer.servers;

        return servers[Math.floor(Math.random() * servers.length)];
    }
}