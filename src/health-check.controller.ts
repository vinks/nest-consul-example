import { Controller, Get, Res } from '@nestjs/common';
import { InjectHealthChecks } from 'nest-consul-service';
import { Check, PASSING, WARNING, FAILURE } from 'nest-consul-service';

@Controller('/health')
export class HealthController {
    constructor(@InjectHealthChecks() private readonly checks: (() => Check)[]) {
    }

    @Get()
    async check(@Res() res) {
        const checks = this.checks.filter((check) => typeof check === 'function');
        const message = { passing: [], warning: [], failure: [] };

        try {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < checks.length; i++) {
                const result = (await this.do(checks[i]())) as Check;
                console.log(result);

                switch (result.status) {
                    case PASSING:
                        message.passing.push(result.status);
                        break;
                    case WARNING:
                        message.warning.push(result.status);
                        break;
                    case FAILURE:
                        message.failure.push(result.status);
                        break;
                    default:
                        message.passing.push(result.status);
                }
            }
        } catch (e) {
            return res.status(500).json({ messages: [e.message] });
        }

        res.status(message.failure.length ? 500 : message.warning.length ? 429 : 200).json({ message });
    }

    private async do(invoked) {
        if (invoked instanceof Promise) {
            return await invoked;
        }
        return invoked;
    }
}