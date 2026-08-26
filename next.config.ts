import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The e-book LP used to live at /e-book; moved into a
      // sub-path to make room for future e-books at /e-book/*.
      // 301 keeps ad clicks + inbound links working forever.
      {
        source: "/e-book",
        destination: "/e-book/fuehrungskraefte",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
