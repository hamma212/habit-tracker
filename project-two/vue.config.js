const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Habitual.ly",
    themeColor: "#374785",
  },
})
