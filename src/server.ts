import { app } from "@arkecosystem/core-container";
import { createServer, mountServer, plugins } from "@arkecosystem/core-http-utils";
import { Logger } from "@arkecosystem/core-interfaces";
import Hapi from "@hapi/hapi";
import * as handlers from "./handlers";

export class Server {
    private logger = app.resolvePlugin<Logger.ILogger>("logger");

    private http: any;

    public constructor(private readonly config: any) {
        this.config = config;
    }

    public async start(): Promise<void> {
        const options = {
            host: this.config.host,
            port: this.config.port,
        };

        if (this.config.enabled) {
            this.http = await createServer(options);
            this.http.app.config = this.config;

            await Server.registerRoutes("HTTP", this.http);
        }

        // TODO: add SSL support. See plugin `core/packages/core-api` for more information
    }

    public async stop(): Promise<void> {
        if (this.http) {
            this.logger.info(`Stopping Custom HTTP Server`);
            await this.http.stop();
        }
    }

    public async restart(): Promise<void> {
        if (this.http) {
            await this.http.stop();
            await this.http.start();
        }
    }

    public instance(type: string): Hapi.Server {
        return this[type];
    }

    private static async registerRoutes(name: string, server: Hapi.Server): Promise<void> {
        await server.register({
            plugin: plugins.corsHeaders,
        });

        server.route({
            method: "GET",
            path: "/",
            handler() {
                return { data: "Hello ARKies!" };
            },
        });

        server.route([{ method: "GET", path: "/config", ...handlers.config }]);

        await mountServer(`Custom HTTP Public ${name.toUpperCase()} API`, server);
    }
}
