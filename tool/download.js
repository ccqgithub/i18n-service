const fs = require('fs');
const path = require('path');
const request = require('request');

// 创建目录
function mkdirsSync(dirname, mode) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname), mode)) {
      fs.mkdirSync(dirname, mode);
      return true;
    }
  }
}

// getLocale
function getLocale(server, site, locale) {
  
  return new Promise(function(resolve, reject) {
    request({
      baseUrl: server,
      url: '/client/json',
      method: 'GET',
      qs: {
        site: site,
        locale: locale,
      },
      json: true,
      strictSSL: false,
      timeout: 10000,
    }, function(error, response, result) {
      if (error) {
        console.log(`i18n-download error: ${error}`);
        reject(error)
        return;
      }

      if (result.status != 200) {
        console.log(`i18n-download error: ${result.status}`);
        reject(result.status)
        return;
      }

      resolve(result.result);
    });
  });
}

/**
 * config = {
 *   locales: ['zh-CN', 'en'],
 *   server: 'http://8.8.8.8:50011/',
 *   site: 'test'
 * }
 */
module.exports = async function(config={}) {
  let locales = config.locales || [];
  let server = config.server;
  let site = config.site;
  let dir = config.dir;
  let ext = config.ext || '.json';
  let transform = config.transform || ((data) => data);
  let flatContext = config.flatContext || 'com';
  let data;
  
  if (!locales.length || !server || !site || !dir) {
    console.log('==== download error: config not right ===');
    return;
  }

  for (let locale of locales) {
    try {
      data = await getLocale(server, site, locale);
      console.log(`==== download success: ${locale} ====`);
    } catch(e) {
      data = {};
      console.log(`==== download error: ${locale} ====`);
      console.log(e);
    }

    if (typeof data[flatContext] == 'object') {
      data = Object.assign({}, data[flatContext], data);
      delete data[flatContext];
    }

    // transform
    data = transform(data);
    
    let file = path.join(dir, './' + locale + ext);

    mkdirsSync(path.dirname(file));
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`save success: ${file}`);
  }
}