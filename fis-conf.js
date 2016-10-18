var path = require('path');
var domain = '';

// 需要构建的文件
fis.set('project.fileType.text', 'po');
fis.set('project.files', ['src/**']);
fis.set('project.ignore', fis.get('project.ignore').concat([
  'server/**',
  'deploy/**',
  'node_modules/**',
  'public/**',
  'DS_store'
]));

// 模块化支持插件
// https://github.com/fex-team/fis3-hook-commonjs (forwardDeclaration: true)
fis.hook('commonjs', {
  extList: [
    '.js', '.coffee', '.es6', '.jsx',
  ],
  umd2commonjs: true,
  ignoreDependencies: [
    //
  ]
});

// 忽略 commonjs 依赖
fis.match('src/scripts/{engine,vendor}/**.js', {
  ignoreDependencies: true
});
fis.match('node_modules/swiper/**.js', {
  ignoreDependencies: true
});

// 模块文件，会进行require包装
fis.match('/{node_modules,src}/**.{js,jsx}', {
  isMod: true,
  useSameNameRequire: true,
});

// 不是AMD、UMD或者CMD规范的
fis.match('src/scripts/{engine,plugin,shim}/**', {isMod: false});

// 所有文件
fis.match('src/(**)', {release: 'static/$1'});

// html
fis.match('src/page/(**)', {release: '_view/$1'});
fis.match('src/root/(**)', {release: '$1'});

// node_modules
fis.match('node_modules/(**)', {release: 'static/npm/$1'});

// 所有js, jsx
fis.match('src/**.{js,jsx}', {
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    fis.plugin('babel-6.x', {
      presets: ['es2015-loose', 'react', 'stage-3']
    }),
    fis.plugin('es3ify')
  ]
});

// 处理语言文件*.po
fis.match('src/**.po', {
  rExt: '.js',
  isMod: true,
  isJsLike: true,
  parser: fis.plugin('po', {
    //
  }),
});

// page js not mod
fis.match('src/scripts/page/**.{js,jsx}', {isMod: false});

// 不是es6和react模块的文件
fis.match('src/scripts/{engine,vendor,plugin,shim}/**', {parser: null});

// 用 less 解析
fis.match('*.less', {
  rExt: 'css',
  parser: [fis.plugin('less-2.x')],
  postprocessor: fis.plugin('autoprefixer')
});

// 添加css和image加载支持
fis.match('*.{js,jsx,ts,tsx,es}', {
  preprocessor: [
    fis.plugin('js-require-css'),
    fis.plugin('js-require-file', {
      useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
    }),
  ]
});

// 打包阶段
fis.match('::package', {
  // 用 loader 来自动引入资源。
  postpackager: fis.plugin('loader'),
});

// 禁用components
fis.unhook('components');
fis.hook('node_modules', {
  mergeLevel: 3
});

// 所有打包文件
fis.match('/pkg/src/(**)', {
  release: '/static/pkg/$1'
});

// server 不产出
fis.match('server/**', {
  release: false
});

// 部署：=====
// local: 本地环境
fis
  .media('local')
  .match('**.{js,jsx,css,less,svg,ttf,eot,woff,po}', {useHash: false})
  .match('::package', {
    packager: fis.plugin('deps-pack', {
      //
    }),
    postpackager: fis.plugin('loader', {
      allInOne: true,
      ignore: [
        //
      ]
    }),
  })
  .match('**', {
    deploy: fis.plugin('local-deliver', {
      to: path.join(__dirname, './public/')
    })
  });
