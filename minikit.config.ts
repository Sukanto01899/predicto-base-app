const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjMxNzI2MSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDQ5ZWUzMjNFYTFCYjY1RjY4RkE3NWRmMGM2RDQ0MWQyMGQ4M0E4Q2QifQ",
    payload: "eyJkb21haW4iOiJwcmVkaWN0by1nYW1lLnZlcmNlbC5hcHAifQ",
    signature:
      "lPmQSu3MdgGXWVaLSLgicSaZfqtaIv/OCadbBygTTCUSkfexzNbjd2r8H/JDsvCqKoKCUCCHvH51R2wj0icu7hw=",
  },

  baseBuilder: {
    ownerAddress: "0xB23955A49c9974a40e68717813a108002072a368",
  },
  miniapp: {
    version: "1",
    name: "Predicto",
    subtitle: "Bicoin price prediction game",
    description: "",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["example"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
