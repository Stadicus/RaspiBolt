import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// GitHub Pages deploy lives at https://stadicus.github.io/RaspiBolt/,
// so assets and internal links need the /RaspiBolt prefix.
// Skipped in local dev (NEXT_PUBLIC_BASE_PATH not set).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
