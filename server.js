const http = require("http");
const httpProxy = require("http-proxy");

// Create a proxy server with custom SSL config
const proxy = httpProxy.createProxyServer({
  secure: false,
  changeOrigin: true,
});

// Handle proxy errors
proxy.on("error", function (err, req, res) {
  console.error("Proxy error:", err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Proxy error: " + err);
});

// Add more complete CORS headers to the response
proxy.on("proxyRes", function (proxyRes, req, res) {
  // Add CORS headers to the proxied response
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  proxyRes.headers["Access-Control-Allow-Methods"] =
    "GET, POST, OPTIONS, PUT, DELETE";
  proxyRes.headers["Access-Control-Allow-Headers"] =
    "X-Requested-With, Content-Type, Authorization, Grpc-Metadata-macaroon, Rune";
  proxyRes.headers["Access-Control-Expose-Headers"] = "*";
});

// Create the server
const server = http.createServer(function (req, res) {
  // Set CORS headers for preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, Grpc-Metadata-macaroon, Rune",
  );
  res.setHeader("Access-Control-Expose-Headers", "*");

  // Handle OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Get the target URL from the request path
  let targetUrl = req.url.slice(1);

  // If no protocol specified, assume http://
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "http://" + targetUrl;
  }

  console.log("Proxying request to:", targetUrl);

  // Proxy the request
  proxy.web(req, res, {
    target: targetUrl,
    ignorePath: true,
  });
});

const PORT = 8080;
server.listen(PORT);
console.log(`Proxy server running on port ${PORT}`);
