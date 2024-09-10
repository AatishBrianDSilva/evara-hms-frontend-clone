/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "hms-dashboard": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
  }
}
export {}
