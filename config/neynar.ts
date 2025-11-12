import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const neynarConfig = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});

const neynarClient = new NeynarAPIClient(neynarConfig);

export default neynarClient;
