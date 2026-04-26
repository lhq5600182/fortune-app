const config = {
  projectName: 'fortune-app',
  date: '2026-04-25',
  designWidth: 375,
  deviceRatio: {
    '375': 1,
    '375 * 2': 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-platform-h5'],
  defineConstants: {},
  copy: {
    patterns: [
      { from: 'src/sitemap.json', to: 'dist/sitemap.json' },
    ],
    options: {},
  },
  framework: 'react',
  mini: {
    compile: {
      include: [],
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 10240,
        },
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    prebundle: {
      enable: false,
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]',
        },
      },
    },
  },
};

module.exports = config;
