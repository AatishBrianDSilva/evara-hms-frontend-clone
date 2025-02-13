/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/require-await */

/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  /**
   * Configures the app settings.
   * @param {import("./.sst/node/config").Input} input - The input object containing information about the current build.
   * @returns {import("./.sst/node/config").AppConfig} - The app settings.
   */
  app(input) {
    return {
      name: 'hms-dashboard',
      removal: input?.stage === 'prod' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'ap-south-1',
          profile: 'evara-prod',
        },
      },
    };
  },
  async run() {
    let VITE_API_BASE_URL = '';
    let VITE_API_BASE_URL2 = '';
    let VITE_ENVIRONMENT = 'dev';

    const stage = $app.stage;

    switch (stage) {
      case 'prod':
        VITE_API_BASE_URL =
          'https://aiekvwbyni.execute-api.ap-south-1.amazonaws.com';
        VITE_API_BASE_URL2 =
          'https://aiekvwbyni.execute-api.ap-south-1.amazonaws.com';
        VITE_ENVIRONMENT = 'prod';
        break;
      case 'dev':
        VITE_API_BASE_URL =
          'https://nex0q2i42e.execute-api.ap-south-1.amazonaws.com';
        VITE_API_BASE_URL2 =
          'https://obu9mnabce.execute-api.ap-south-1.amazonaws.com';
        VITE_ENVIRONMENT = 'dev';
        break;
      default:
        VITE_API_BASE_URL =
          process.env.VITE_API_BASE_URL ||
          'https://nex0q2i42e.execute-api.ap-south-1.amazonaws.com';
        VITE_API_BASE_URL2 =
          process.env.VITE_API_BASE_URL2 ||
          'https://obu9mnabce.execute-api.ap-south-1.amazonaws.com';
        VITE_ENVIRONMENT = 'dev';
    }

    new sst.aws.StaticSite('hms-dashboard', {
      build: {
        command: 'npm run build',
        output: 'dist',
      },
      environment: {
        VITE_API_BASE_URL,
        VITE_API_BASE_URL2,
        VITE_ENVIRONMENT,
      },
      domain: {
        name:
          $app.stage === 'prod'
            ? 'dashboard.evarahealth.in'
            : 'dashboard.dev.evarahealth.in',
        redirects:
          $app.stage === 'prod' ? ['evarahealth.in', 'www.evarahealth.in'] : [],
        dns: sst.aws.dns({
          zone: 'Z013315912VIBEEY1T7WH',
        }),
      },
    });
  },
});
