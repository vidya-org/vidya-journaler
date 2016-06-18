'use strict';

const http     = require('http');
const BPromise = require('bluebird');

// const url    = require('url');
const node_path   = require('path');
const fs     = BPromise.promisifyAll(require('fs'));
const crypto = require('crypto');
const auth   = require('http-auth');
const logDir = '/usr/local/vidya/parser/logs/new'; /* Diretorio pai: Contem os diretorios que serao criados pelo node.js*/

const currentDirTemp = '/usr/local/vidya/parser/logs/new';
const currentDir = '/usr/local/vidya/parser/data';

/* Lembre-se que este valor altera dependendo da quantidade de logs recebidos */
// const MAX_FILES_IN_DIR = 8192; /* Numero indicando o limite de arquivos que um diretorio pode ter */

/* Repare que isto pode ser ultrapassado: indica somente o numero no qual,
   se ultrapassado, sera criado um nodo diretorio de logs */
// const CHECKPOINT_LIMIT = 8192; /* Numero indicando quantas requisicoes sao necessarias ate se fazer a */

/* checagem para criacao de novos diretorios */
const MIN_HOURS_CHECK = 1;
// let numberOfRequests = 0;
// let changingDir = 0;
// let path = '';
const htpasswdPath = node_path.join(__dirname, '/htpasswd');

/* Verifica se existem diretorios vazios. Se existirem diretorios vazios ha algum tempo, eh feita a remocao */

function list_log_directories (root_dir) {
  return fs.readdir(root_dir)
    .then(dirs => {
      return dirs.map(dir => node_path.join(root_dir, `/${dir}`))
        .filter(dir => (dir !== root_dir) && dir.isDirectory());
    });
}

function get_empty_directories (directories) {
  return BPromise.filter(directories, directory => {
    return fs.readdir(directory)
      .then(files => {
        return files.length === 0;
      });
  });
}

function get_expired_directories (directories) {
  return BPromise.filter(directories, directory => {
    return fs.stat(directory)
      .then(stats => {
        const current_timestamp = new Date();

        return (current_timestamp - stats.mtime) > MIN_HOURS_CHECK * 60 * 60 * 1000;
      });
  });
}

function check_empty_dirs () {
  list_log_directories(logDir)
    .then(get_empty_directories)
    .then(get_expired_directories)
    .each(fs.rmdir)
    .catch(console.error);
}

/** *************** INICIO *********************/
// console.log("Cleaning log directories. Please wait...");
// checkEmptyDirs();
// return;

// Checando se os diretorios iniciais existem...
try {
  fs.statSync(logDir).isDirectory();
} catch (err) {
  fs.mkdirSync(logDir, 0o755);
}

try {
  fs.statSync(currentDir).isDirectory();
} catch (err) {
  fs.mkdirSync(currentDir, 0o755);
}

// se não existir o arquivo de usuarios o arquivo sera criado
if (fs.existsSync(htpasswdPath)) {
  // console.log ("arquivo ja existe")  ;
} else {
  fs.writeFileSync(htpasswdPath, 'teste:teste');
}

 /* var basic = auth({
     authRealm: "Private area",
     authFile: htpasswdPath,
     authType: "basic"
   });

 fs.watchFile(htpasswdPath, function (curr, prev) {
   update = true;
   console.log ("arquivo alterado")  ;
 });*/

const basic = auth.basic({
  realm: 'Vidya',
  file:   htpasswdPath
});

// Iniciando o server...
http.createServer(basic, function (request, response) {
  // console.log ("Hello " + request.user);
  console.log('Request from ip:' + request.connection.remoteAddress);
  // response.end();

  // Metodos nao permitidos
  if (request.method !== 'PUT') {
    response.writeHead(405, {'Content-Type': 'text/plain'});
  } else {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    const bodyarr = [];
    request.on('data', function (chunk) {
      bodyarr.push(chunk);
    });
    request.on('end', function () {
      const data = bodyarr.join('');
      const datetime = new Date();
      const randomNumber = Math.random() * 999999;

      const filename = 'log_' + datetime.getTime() + '_' + randomNumber.toFixed(6) + '_' + crypto.createHash('md5').update(data).digest('hex');
      const filepath = currentDir + '/' + filename;
      const filepathTemp = currentDirTemp + '/' + filename;

      fs.writeFileSync(filepath, data);
      fs.linkSync(filepath, filepathTemp);

      let files_parser = [];
      let files_mlogc = [];

      fs.readdir(currentDirTemp, function (err, files) {
        if (err) {
          throw err;
        }
        files_parser = files;
      });

      fs.readdir(currentDir, function (err, files) {
        if (err) {
          throw err;
        }
        files_mlogc = files;
        if (files_mlogc.length > files_parser.length) {
          for (let i = files_mlogc.length - 1; i >= files_parser.length - 1; i--) {
            const file_delete = currentDir + '/' + files_mlogc[i];
            // console.log("DELETANDO ARQUIVO: "+ file_delete);
            // fs.unlink(file_delete);
            if (fs.existsSync(file_delete)) {
              fs.unlinkSync(file_delete, function (err) {
                if (err) {
                  throw err;
                }
                // console.log('successfully deleted ' + file_delete);
              });
            }
          }
        }
      });
    });
  }
  response.end();

}).listen(8080);

// Output a String to the console once the server starts up, letting us know everything
// starts up correctly
console.log('Vidya Log Handler running...');
