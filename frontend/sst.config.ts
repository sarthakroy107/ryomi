/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "nanakura",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("RyomiNext", {
      domain: {
        name: "ryomi.site",
        redirects: ["www.ryomi.site"],
      },

    });
  },
});
