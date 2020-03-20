const paths = require("@craco/craco");
module.exports = {
  webpack: {
    alias: {
      // Add the aliases for all the top-level folders in the `src/` folder.
      // assets: `${paths.appSrc}/assets/`,
      // components: `${paths.appSrc}/components/`,
      // interfaces: `${paths.appSrc}/interfaces/`,
      // modules: `${paths.appSrc}/modules/`,
      // jss: `${paths.appSrc}/assets/jss/`,

      // Another example for using a wildcard character
      "*": `${paths.appSrc}/`
    }
  }
};
