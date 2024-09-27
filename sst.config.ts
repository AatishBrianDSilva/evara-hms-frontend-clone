/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  /**
   * Configures the app settings.
   * @param {import("./.sst/node/config").Input} input - The input object containing information about the current build.
   * @returns {import("./.sst/node/config").AppConfig} - The app settings.
   */
  app(input) {
    return {
      name: "hms-dashboard",
      // removal: input?.stage === "prod" ? "retain" : "remove",
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
        command: "npm run build",
        output: "dist",
      },
      domain: {
        name:
          $app.stage === "prod"
            ? "dashboard.evarahealth.in"
            : "dashboard.dev.evarahealth.in",
        redirects:
          $app.stage === "prod" ? ["evarahealth.in", "www.evarahealth.in"] : [],
        dns: sst.aws.dns({
          zone: "Z013315912VIBEEY1T7WH",
        }),
      },
    });
  },
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return {
            stage: "prod",
            runner: { engine: "codebuild", compute: "large" },
          };
        } else if (
          event.type === "branch" &&
          event.branch === "development" &&
          event.action === "pushed"
        ) {
          return {
            stage: "dev",
            runner: { engine: "codebuild", compute: "large" },
          };
        }
      },
    },
  },
});
