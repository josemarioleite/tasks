module.exports = function (/* ctx */) {
  return {
    supportTS: false,
    boot: ['axios'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      vueRouterMode: 'hash',
      chainWebpack() {},
    },
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },
    framework: {
      iconSet: 'material-icons',
      lang: 'pt-BR',
      config: {},
      importStrategy: 'auto',
      plugins: ['Notify', 'Dialog']
    },
    animations: [],
    ssr: { pwa: false },
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `Remar Semanal`,
        short_name: `Remar Semanal`,
        description: `Controle de Tarefas`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {},
    capacitor: { hideSplashscreen: true },
    electron: {
      bundler: 'packager', // 'packager' or 'builder'
      packager: {},
      builder: { appId: 'remar' },
      nodeIntegration: true,
      extendWebpack () {}
    }
  }
}
