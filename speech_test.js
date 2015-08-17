var https = require('https');
var express = require('express');
var pem = require('pem');
var util = require('util');

// port HTTPS -- à changer selon les ports disponibles
var https_port = 4300;

// on renseigne la localisation du fichier config de OPENSSL en créant une variable environmentale
process.env['OPENSSL_CONF'] = __dirname + '\\openssl.cnf';

// la config de PEM: où se trouve OPENSSL ?
pem.config({
    pathOpenSSL: __dirname + '\\openssl'
});

// création du certificat à la volée et du serveur HTTPS
pem.createCertificate({days:9999, selfSigned:true}, function(err, keys){
	var app = express();
	// par défaut les pages sont dans STATIC
	app.use(express.static(__dirname  + '/static'));
	
	// sauf celle qui s'appelle "sarah"
	app.get('/sarah', function(req, res){
		res.writeHead(200,{"Content-Type": "text/html"});
		res.write('<!DOCTYPE html>'+
					'<html><head><meta charset="utf-8" /></head>'+ 
					'<body>');
    	if (typeof req.query.emulate === 'undefined') {
			res.write('Pas de paramètre "emulate"');
			res.end('</body></html>');
		} else {
			res.write("Emulate: " + req.query.emulate);
			console.log("Emulate: " + req.query.emulate);
			var url_client_sarah = 'http://127.0.0.1:8888/' 
			// le client SARAH ne supporte pas les paramètres URIencoded, donc on désencode ...
			var params = {emulate:  decodeURI(req.query.emulate)};
			console.log(url_client_sarah);
			var request = require('request');

			request({ 
				url : url_client_sarah,
				qs: params
				},
				function (err, response, body){
					if (err || response.statusCode != 200) {
						res.write ("Erreur: " + err);
						console.log ("Erreur: " + err);
						if (response != undefined) {
							res.write ("<br/>Response code: " + response.statusCode);
							console.log("Response code: " + response.statusCode);
							res.write ("<br/>Response headers: " + util.inspect(response.headers));
							console.log("Response headers: " + util.inspect(response.headers));
						}
					} else {
						res.write ('<br/>Réponse (http) de Sarah: ' + body);
						console.log('Réponse http de Sarah: ' + body);
					}
					res.end('</body></html>');
				}
			);
			
			
		}
		
	});

	
	if (err!=='null') console.log("Serveur HTTPS en écoute sur le port " + https_port);
	else console.log('Erreur ? : ' + err);
		
	
	// création du serveur HTTPS
	https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(https_port);
});
	

