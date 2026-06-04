import type { NextConfig } from "next";
const nextConfig: NextConfig  = {
  sassOptions: {
    additionalData: `@use "@/styles/_variables" as *;\n@use "@/styles/_mixins" as *;\n`,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

};
export default nextConfig;
