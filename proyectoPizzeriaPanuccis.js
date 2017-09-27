// web server
var restify = require('restify');
var builder = require('botbuilder');

//crear servidor
var server = restify.createServer();
//se escucha distintos puertos,particularmente en el 3978
server.listen(
    process.env.port ||
    process.env.PORT ||
    3978, function(){
        console.log('%s listening to %s',server.name,server.url);
     });


var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

var bot = new builder.UniversalBot(connector);
server.post('api/messages', connector.listen());

bot.dialog('/', [
    function(session,result){
	builder.Prompts.text(session, '¡Bienvenido a la Pizzeria Panucci´s!');

        if(!session.userData.nombre){//preguntar si ya sabemos el nombre
            session.send(`¿Como te llamas?`);
        }
        else{
			session.endDialog(`¡Hola de nuevo ${session.userData.nombre}!`);
        }
    },
    function(session,results){
        if(!session.userData.nombre){
            let nombre = results.response;
			session.userData.nombre = nombre;

			session.endDialog(`Muy bien, yo soy el Señor Panucci`);
		}

	session.beginDialog('/PreguntarSiPedido');
    }
]);

bot.dialog('/PreguntarSiPedido', [
	function(session){
		builder.Prompts.text(session, `¿${session.userData.nombre} deseas realizar un pedido?`);

	},
	function(session,results){
		if(results.response){
		let desicionPedido = results.response;

			//error, sin importar la respuesta me abre el dialogo /TamanoPizza, el cual es el
			//siguiente declarado en la linea 78, y los dialogo de 'no' y 'diferentes' estan en 121 y 134
			if(desicionPedido == 'si' || 'SI' || 'Si' || 'sI'){
			
				session.endDialog(`${desicionPedido}`);
				session.beginDialog('/TamanoPizza');			

			}else if(desicionPedido == 'no' || 'NO' || 'No' || 'nO'){

				session.endDialog(`${desicionPedido}`);
				session.beginDialog('/NoPedidoSaludos');

			}else{

				session.endDialog(`${desicionPedido}`);
				session.beginDialog('/ResDifPedido');//ojo no olvidar hacer este no esta en el txt

			}
		}
	}
]);

bot.dialog('/TamanoPizza', [
	function(session){
		builder.Prompts.text(session, `De que tamaño quieres tu pizza? tenemos:\n- Pequeña (4 porciones)\n- Mediana (8 porciones)\n- Familiar (12 porciones)`);

	},
	function(session,results){
		if(results.response){
		let tamanoPizza = results.response;
			
			if(tamanoPizza == 'Pequeña'||'pequeña'||'PEQUEÑA'||'Mediana'||'mediana'||'MEDIANA'||'Familiar'||'familiar'||'FAMILIAR'){
				//session.beginDialog('/SaborPizza');
				//guardar variable del tamaño
				session.endDialog(`bien, ${tamaPizza}`);
			}else{
				session.endDialog(`mal,  ${tamaPizza}`);
				//session.beginDialog('/ResDifTamanoPizza');
				
			}
		}
	}
]);
/*
bot.dialog('/ResDifTamanoPizza', [
	function(session){
		builder.Prompts.text(session, `Disculpa no te entiendo, por favor selecciona uno de los 3 tamaños:\n- Pequeña (4 porciones)\n- Mediana (8 porciones)\n- Familiar (12 porciones)`);

	},
	function(session,results){
		if(results.response){
		let tamanoPizza = results.response;
			
			if(tamanoPizza == 'Pequeña'||'pequeña'||'PEQUEÑA'||'Mediana'||'mediana'||'MEDIANA'||'Familiar'||'familiar'||'FAMILIAR'){
				//session.beginDialog('/SaborPizza');
				//guardar variable del tamaño
			}else{
				session.endDialog();
				session.beginDialog('/ResDifTamanoPizza');
				
			}
		}
	}
]);
*/
bot.dialog('/NoPedidoSaludos', [
	function(session){
		builder.Prompts.text(session, `resp. no`);

	},
	function(session,results){
		if(results.response){
		let desicionPedido = results.response;

		}
	}
]);

bot.dialog('/ResDifPedido', [
	function(session){
		builder.Prompts.text(session, `resp. dif`);

	},
	function(session,results){
		if(results.response){
		let desicionPedido = results.response;

		}
	}
]);