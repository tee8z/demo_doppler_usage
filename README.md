# demo_doppler_usage
Small example project showing how to call some nodes that are being run by doppler

Should have the doppler cluster running, this is built with the assumption "examples/doppler_files/all_node_implementations/coreln_lnd_eclair.doppler" is running locally

Needs a simple proxy server to handle the cors headers between the different node's APIs and the browser

#### Install packages for proxy server
```sh
npm install
```

#### Run the proxy on default port 8080
```sh
npm start
```

#### Open the index.html file
```sh
open index.html
```
