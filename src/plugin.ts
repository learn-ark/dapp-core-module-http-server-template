import { Container, Logger } from "@arkecosystem/core-interfaces";
import { defaults } from "./defaults";
import { Server } from "./server";

export const plugin: Container.IPluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    alias: "core-custom-server-example",
    async register(container: Container.IContainer, options) {
        container.resolvePlugin<Logger.ILogger>("logger").info("Starting dApp");

        const server = new Server(options);
        await server.start();

        return server;
    },

    async deregister(container: Container.IContainer, options) {
        await container.resolvePlugin<Server>("core-custom-server-example").stop();
    },
};
