/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  webpack: (config) => {
    // `@wagmi/connectors` lazily references optional wallet SDKs (Coinbase,
    // MetaMask SDK, Safe, Base) that this app does not use - it only enables
    // the injected + WalletConnect connectors. Aliasing them to false keeps
    // the bundler from emitting "Module not found" warnings for packages that
    // are never actually loaded.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@base-org/account": false,
      "@coinbase/wallet-sdk": false,
      "@metamask/connect-evm": false,
      "@metamask/sdk": false,
      "@safe-global/safe-apps-sdk": false,
      "@safe-global/safe-apps-provider": false,
    }
    return config
  },
}

export default nextConfig
