var http = require("http");
 /*begin autenticacao*/

 /*end autenticacao*/
 var url = require("url");
 var fs = require("fs");
 var crypto = require("crypto");
 var auth = require("http-auth");
 var logDir = "/usr/local/vidya/parser/logs/new";						/* Diretorio pai: Contem os diretorios que serao criados pelo node.js*/
 var datetime = new Date();					/* Data atual */
 //var currentDir = logDir + "/" + "log_" + datetime.getTime();	/* Diretorio atual: Diretorio que ira receber os logs neste momento. */
 var currentDirTemp = "/usr/local/vidya/parser/logs/new";
 var currentDir = "/usr/local/vidya/parser/data";
 /* Lembre-se que este valor altera dependendo da quantidade de logs recebidos */
 var MAX_FILES_IN_DIR = 8192					/* Numero indicando o limite de arquivos que um diretorio pode ter */
 /* Repare que isto pode ser ultrapassado: indica somente o numero no qual, */
 /* se ultrapassado, sera criado um nodo diretorio de logs */
 var CHECKPOINT_LIMIT = 8192					/* Numero indicando quantas requisicoes sao necessarias ate se fazer a */
 /* checagem para criacao de novos diretorios */
 var MIN_HOURS_CHECK = 1						/* */
 var numberOfRequests = 0;
 var changingDir = 0;
 var path = "";
 var htpasswdPath = __dirname + "/htpasswd";




 //variavel para atualizacao do arquivo do node
 //var update = false;

 /* Verifica se existem diretorios vazios. Se existirem diretorios vazios ha algum tempo, eh feita a remocao */
 function checkEmptyDirs(){
   try{
     fs.readdir(logDir, function(err, dirs){
       for(i=0; i < dirs.length; i++){
         path = logDir + "/" + dirs[i]
       //Se for o diretorio corrente, pula para o proximo
       if (path == currentDir) {
         continue;
       }
       stats = fs.statSync(path)
       var tempDate = new Date();
       var exceededLimitTime = ((tempDate - stats.mtime) > MIN_HOURS_CHECK*60*60*1000) ? true : false;
       if (stats.isDirectory() && exceededLimitTime && dirs.length > 1){
         files = fs.readdirSync(path)
         if (files.length == 0){
           console.log("Removendo " + path);
           fs.rmdirSync(path)
         }
       }

     }
   });
   }catch (err) {
     console.log(err);
   }
 }


 /***************** INICIO *********************/
 //console.log("Cleaning log directories. Please wait...");
 //checkEmptyDirs();
 //return;

 //Checando se os diretorios iniciais existem...
 try { fs.statSync(logDir).isDirectory() }
 catch (er) { fs.mkdirSync(logDir,0755) }

 try { fs.statSync(currentDir).isDirectory() }
 catch (er) { fs.mkdirSync(currentDir,0755) }


 // se não existir o arquivo de usuarios o arquivo sera criado
 if (fs.existsSync(htpasswdPath)) {
   //console.log ("arquivo ja existe")  ;
 }
 else
   fs.writeFileSync(htpasswdPath, "teste:teste");


 /*var basic = auth({
     authRealm: "Private area",
     authFile: htpasswdPath,
     authType: "basic"
   });

 fs.watchFile(htpasswdPath, function (curr, prev) {
   update = true;
   console.log ("arquivo alterado")  ;
 });*/

 var basic = auth.basic({
   realm: "Vidya",
   file: htpasswdPath
 });



 //Iniciando o server...
 http.createServer(basic, function(request, response) {

     //console.log ("Hello " + request.user);
     console.log ("Request from ip:" + request.connection.remoteAddress);
       //response.end();

       //Metodos nao permitidos
       if (request.method != 'PUT'){
         response.writeHead(405, {"Content-Type": "text/plain"});
       }else{
         response.writeHead(200, {"Content-Type": "text/plain"});
         var bodyarr = [];
         request.on('data', function(chunk){
           bodyarr.push(chunk);
         })
         request.on('end', function(){
           data = bodyarr.join('');
           datetime = new Date();
           randomNumber = new Number(Math.random() * 999999);
           var path = require('path');

           filename = "log_" + datetime.getTime() + "_" + randomNumber.toFixed(6) + "_" + crypto.createHash('md5').update(data).digest("hex");
           filepath = currentDir + "/" + filename;
           filepathTemp = currentDirTemp + "/" + filename;


           fs.writeFileSync(filepath,data);
           fs.linkSync(filepath,filepathTemp );



           var files_parser = [];
           var files_mlogc = [];


           fs.readdir(currentDirTemp, function (err, files) {
             if (err)
             {
               throw err;
             }
             files_parser = files;

           });

           fs.readdir(currentDir, function (err, files) {
             if (err) throw err;
             files_mlogc = files;
             if (files_mlogc.length > files_parser.length)
             {
               for (var i = files_mlogc.length - 1; i >= files_parser.length-1; i--) {
                 var file_delete = currentDir+"/"+files_mlogc[i];
                 //console.log("DELETANDO ARQUIVO: "+ file_delete);
                 //fs.unlink(file_delete);
                 if (fs.existsSync(file_delete)) {
                 fs.unlinkSync(file_delete, function (err) {
                     if (err)
                     {
                       throw err;
                     }
                     //console.log('successfully deleted ' + file_delete);
                   });
               }

               }

             }

           })

         })
}

response.end();




}).listen(8080);

 // Output a String to the console once the server starts up, letting us know everything
 // starts up correctly
 console.log("Vidya Log Handler running...");
