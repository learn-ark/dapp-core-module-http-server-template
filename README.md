![Imgur](https://i.imgur.com/S48ntWe.png)
## Reusable ARK Core Module - dApp Template Project With Operational HTTP Server

This is a basic template project for ARK core dApp development. Create a new project based on this template and load your plugin into the corresponding network configuration by following the steps below.

> This Example is currently operational only on our `core/develop` branch!

This template project provides initial structure for your dApp development with a HTTP Server Implemented (using HAPI).

## dApp Creation Steps

### STEP 0: Create New Project Based On This Template

### STEP 1: Checkout Your New dApp Project As a GitSubmodule in `core/plugins`

You should already have a running core and a local testnet running. If not head over to https://learn.ark.dev/core-getting-started/spinning-up-your-first-testnet#step-2-testnet-network-boot.

```bash
cd plugins/ #location for loading of custom non-core dApps
git submodule add -f https://github.com/your-gh-handle/your-dapp-name
cd your-dapp-name
```

### STEP 2: Load The dApp In The Corresponding Network Configurations.

We will enable our dApp `@vendorname/dappname` in the testnet network configuration. dApp name is taken from `node` package name as defined in package.json.
You can change it to your needs.

Go to:
`core/packages/core/bin/testnet`

```bash
cd packages/core/bin/config/testnet
```

Locate file `plugins.js`. We will add our dApp name to end of the list of the loaded plugins. This means that core will pickup the dapp and load it for a specific network configuration.

Add line `"@learn-ark/dapp-custom-module-name": {}`: to the end of the `plugins.js` file, so it looks something like this:

```javascript
    "@arkecosystem/core-exchange-json-rpc": {
        enabled: process.env.CORE_EXCHANGE_JSON_RPC_ENABLED,
        host: process.env.CORE_EXCHANGE_JSON_RPC_HOST || "0.0.0.0",
        port: process.env.CORE_EXCHANGE_JSON_RPC_PORT || 8080,
        allowRemote: false,
        whitelist: ["127.0.0.1", "::ffff:127.0.0.1"],
    },
    "@arkecosystem/core-snapshots": {},
    "@learn-ark/dapp-core-module-http-server-template": {}, //our application hook (here we load the plugin/dapp, as defined in your dapp package.json)
```

> Make sure to run `yarn setup` from the `core` root folder when you change or add code to `core/plugins`

After `yarn setup` completes, you should see the following log

```bash
lerna success - @arkecosystem/core-vote-report
lerna success - @arkecosystem/core-wallet-api
lerna success - @arkecosystem/core-webhooks
lerna success - @arkecosystem/core
lerna success - @arkecosystem/crypto
lerna success - @vendorname/dappname
```

Last line showing that your dApp was detected and compiled.

### STEP 3: Setup Development Docker Database

Setup docker database config and run Postgres DB via Docker. Follow the steps from here:
https://learn.ark.dev/core-getting-started/spinning-up-your-first-testnet#step-1-start-docker-testnet-database


### STEP 4: Start Local Testnet Blockchain

Start local blockchain with testnet running on your developer computer. Follow steps defined in here:
https://learn.ark.dev/core-getting-started/spinning-up-your-first-testnet#step-2-testnet-network-boot

If you already have running and compiled core, you should go to `core/packages/core` and run command `yarn full:testnet`.

After local testnet starts, the log should show that dApp was loaded. It should look like this (if you haven't changed the source code):

```bash
[2019-12-04 10:23:58.269] INFO : Starting dApp
[2019-12-04 10:23:58.273] INFO : Custom HTTP Public HTTP API Server running at: http://0.0.0.0:5003
```

> Congratulations. Your first distributed blockchain application is loaded and working and compatible with any ARK Core based blockchain.

Now, let's test our new HTTP server. The default registered route should return "Hello Arkies!". Let's try it out:

```bash
curl --request GET \
  --url http://127.0.0.1:5003/
```

You should receive the following response:
```json
{
  "data": "Hello World!"
}
```

You can also try the following call:
```bash
curl --request GET \
  --url http://127.0.0.1:5003/config
```

You can see the code and registered route here:
https://github.com/learn-ark/dapp-core-module-http-server-template/blob/master/src/server.ts#L49-L56.

Now you can start playing around, adding more custom endpoints.

>If you plan to add a lot of routes make sure to checkout the official `core-api` package and follow its best-practices.


### Optional:
Feel free to look into `common/base-service.ts` class that exposes important Core Platform classes that you can work with. Your newly developed classes can extend this class and gain access to:

-   wallets and state
-   transaction pool
-   blockchain protocol
-   events
-   database
    -... actually any module :)

> Also check other packages/modules as they follow the same dApp structure.


#### Use Block Explorer To View Local Running Testnet


Click here to setup local blockchain explorer in a few simple steps:
https://learn.ark.dev/core-getting-started/setup-local-blockchain-explorer

---

> Congrats, your dapp is loaded. Now look at the resources below to understand more about our dapp development.

-   [Learn Development With ARK](https://learn.ark.dev)

## License

[MIT](LICENSE) © [ArkEcosystem](https://ark.io)
