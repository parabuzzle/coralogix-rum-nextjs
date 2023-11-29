/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CORALOGIX_URL: process.env["CORALOGIX_URL"] || "US1",
    CORALOGIX_TOKEN: process.env["CORALOGIX_KEY"],
    CORALOGIX_APP_NAME:
      process.env["CORALOGIX_APP_NAME"] || "nextjs-coralogix-rum-test",
  },
};

module.exports = nextConfig;
