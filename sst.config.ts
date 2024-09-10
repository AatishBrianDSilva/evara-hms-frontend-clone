/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hms-dashboard",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1",
          profile: "evara-prod",
        },
      },
    };
  },
  async run() {
    new sst.aws.StaticSite("hms-dashboard", {
      build: {
        command: "npm run build:prod",
        output: "dist",
      },
      domain: {
        name: "www.evarahealth.in",
      },
    });
  },
});
