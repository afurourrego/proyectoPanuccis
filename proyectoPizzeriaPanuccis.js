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

	session.send({
		type: "message",
		//text: "This is test attachment.",
		attachments: [
		  {
			contentType: "image/jpg",
			contentUrl: "E:/desarrollo apps/bot/media/pizzeria.jpg",
			name: "pizzeria.jpg"
		  }
		]
	  });
	
        if(!session.userData.nombre){
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
			session.dialogData.respuesta = results.response;

			if(session.dialogData.respuesta == 'si' ||
			session.dialogData.respuesta == 'Si' || 
			session.dialogData.respuesta == 'SI' ||
			session.dialogData.respuesta == 'sI'){
		
				session.dialogData.siguienteDialogo = '/TamanoPizza';	

			}else if(session.dialogData.respuesta == 'no' ||
			session.dialogData.respuesta == 'No' ||
			session.dialogData.respuesta == 'NO' ||
			session.dialogData.respuesta == 'nO'){

				session.dialogData.siguienteDialogo = '/NoPedidoSaludos';

			}else{

				session.dialogData.siguienteDialogo = '/ResDifPedido';

			}
		}

		session.beginDialog(session.dialogData.siguienteDialogo);
	}
]);

bot.dialog('/TamanoPizza', [
	function(session){

		if(session.conversationData.respuestaTamano == 1 ||
			session.conversationData.respuestaTamano >= 3){
			
			builder.Prompts.text(session, `Disculpa ${session.userData.nombre} no te entiendo, por favor selecciona uno de los 3 tamaños:\n- Pequeña (4 porciones)\n- Mediana (8 porciones)\n- Familiar (12 porciones)`);

		}else if(session.conversationData.respuestaTamano == 2){

			builder.Prompts.text(session, `¡En español por favor, sigo sin entender 😟!`);
			session.send(`Selecciona uno de los 3 tamaños:\n- Pequeña (4 porciones)\n- Mediana (8 porciones)\n- Familiar (12 porciones)`);

		}else{
			
			session.conversationData.respuestaTamano = 0;
			builder.Prompts.text(session, `De que tamaño quieres tu pizza? tenemos:\n- Pequeña (4 porciones)\n- Mediana (8 porciones)\n- Familiar (12 porciones)`);
		
		}

	},
	function(session,results){
		if(results.response){
			session.conversationData.tamanoPizza = results.response;
			
			if(session.conversationData.tamanoPizza == 'Pequeña'||
			session.conversationData.tamanoPizza == 'pequeña'||
			session.conversationData.tamanoPizza == 'PEQUEÑA'||
			session.conversationData.tamanoPizza == 'Mediana'||
			session.conversationData.tamanoPizza == 'mediana'||
			session.conversationData.tamanoPizza == 'MEDIANA'||
			session.conversationData.tamanoPizza == 'Familiar'||
			session.conversationData.tamanoPizza == 'familiar'||
			session.conversationData.tamanoPizza == 'FAMILIAR'){

				session.endDialog();
				session.beginDialog('/SaborPizza');

			}else{
				
				session.conversationData.respuestaTamano = session.conversationData.respuestaTamano + 1;
				session.endDialog();
				session.beginDialog('/TamanoPizza');
				
			}
		}
	}
]);

bot.dialog('/SaborPizza', [
	function(session){
		if(session.conversationData.respuestaSabor >= 1){

			builder.Prompts.text(session, `Creo que eso no es un sabor.. selecciona uno de los sabores que tenemos:\n- Hawaiana\n- Pollo y Champiñones\n- Estofada\n- Vegetariana\n- Ranchera`);
			
		}else{

			session.conversationData.respuestaSabor = 0;
			builder.Prompts.text(session, `Ahora puedes escoger el sabor de tu pizza:\n- Hawaiana\n- Pollo y Champiñones\n- Estofada\n- Vegetariana\n- Ranchera`);
		
		}
	},
	function(session,results){
		if(results.response){
			session.conversationData.saborPizza = results.response;

			if(session.conversationData.saborPizza == 'hawaiana' ||
			session.conversationData.saborPizza == 'Hawaina' ||
			session.conversationData.saborPizza == 'HAWAIANA' ||
			session.conversationData.saborPizza == 'estofada' ||
			session.conversationData.saborPizza == 'Estofada' ||
			session.conversationData.saborPizza == 'ESTOFADA' ||
			session.conversationData.saborPizza == 'vegetariana' ||
			session.conversationData.saborPizza == 'Vegetariana' ||
			session.conversationData.saborPizza == 'VEGETARIANA' ||
			session.conversationData.saborPizza == 'ranchera' ||
			session.conversationData.saborPizza == 'Ranchera' ||
			session.conversationData.saborPizza == 'RANCHERA'){

				session.endDialog('¡Deliciosa Elección!');
				session.beginDialog('/Direccion');

			}else if(session.conversationData.saborPizza == 'pollo y champiñones' ||
			session.conversationData.saborPizza == 'Pollo y Champiñones' ||
			session.conversationData.saborPizza == 'POLLO Y CHAMPIÑONES' ){

				session.endDialog();
				session.beginDialog('/AgotadoSaborPizza');

			}else {

				session.conversationData.respuestaSabor = session.conversationData.respuestaSabor + 1;
				session.beginDialog('/SaborPizza');

			}

		}
	}
]);

bot.dialog('/AgotadoSaborPizza', [
	function(session){

		if(session.conversationData.respuestaSiNo == 1){

			builder.Prompts.text(session,'Disculpa no te entiendo, por favor responde si o no, gracias!.');
			session.send('¿Aun quieres pedir tu pizza?');

		}else {

			session.conversationData.respuestaSiNo = 0;
			builder.Prompts.text(session,'Uhh 😟, esto es vergonsozo.. me dicen se nos agoto por el día de hoy este sabor.');
			session.send('¿Aun quieres pedir tu pizza?');

		}	
	},
	function(session,results){
		if(results.response){
			session.dialogData.respuesta =  results.response;

			if(session.dialogData.respuesta == 'si' ||
			session.dialogData.respuesta == 'Si' || 
			session.dialogData.respuesta == 'SI' ||
			session.dialogData.respuesta == 'sI'){
		
				session.endDialog('¡Genial!');
				session.beginDialog('/SaborPizza');

			}else if(session.dialogData.respuesta == 'no' ||
			session.dialogData.respuesta == 'No' ||
			session.dialogData.respuesta == 'NO' ||
			session.dialogData.respuesta == 'nO'){

				session.endConversation('En verdad lo sentimos, gracias por pensar en pizza panucci´s, te esperamos pronto!');

			}else{

				session.conversationData.respuestaSiNo = 1;
				session.endDialog();
				session.beginDialog('/AgotadoSaborPizza');

			}
		}
	}
]);

bot.dialog('/Direccion',[
	function(session){

		if(session.userData.direccion == '0'){
			
			builder.Prompts.text(session,'Por favor ingresa tu nueva direccion! gracias :)');
			
		}else if(session.userData.direccion){

			session.endDialog(`${session.userData.nombre} ¿tu direccion para envio aun es: ${session.userData.direccion}?`);
			session.beginDialog('/DirSiConoce');

		}else {

			builder.Prompts.text(session,'¿Cual es la dirección para enviar tu Pizza Panucci´s?');

		}
	},
	function(session,results){
		if(results.response){
			session.userData.direccion = results.response;
		}
		
		session.endDialog();
		session.beginDialog('/Envio')
	}

]);

bot.dialog('/DirSiConoce', [
	function(session){
		builder.Prompts.text(session,'Por favor responde "Si" o "No"');
	},
	function(session,results){
		if(results.response){
			let respuesta = results.response;

			if(respuesta == 'si' ||
			respuesta == 'Si' || 
			respuesta == 'SI' ||
			respuesta == 'sI'){
		
				session.endDialog('¡Genial!😀');
				session.beginDialog('/Envio');

			}else if(respuesta == 'no' ||
			respuesta == 'No' ||
			respuesta == 'NO' ||
			respuesta == 'nO'){

				session.endDialog();
				session.userData.direccion = '0';
				session.beginDialog('/Direccion');

			}else{

				session.endDialog('No te entiendo');
				session.beginDialog('/DirSiConoce');

			}
		}
	}
]);

bot.dialog('/Envio', [
	function(session){
		builder.Prompts.text(session,'Todo listo, en cuanto este tu pedido enviaremos nuestro domicilio!');
		session.send({
			type: "message",
			attachments: [
			  {
				contentType: "image/gif",
				contentUrl: "E:/desarrollo apps/bot/media/fry.gif",
				name: "fry.gif"
			  }
			]
		  });
	},
	function(session,results){
		if(results.response){

			let envio = results.response;
			
			if(envio == 'gracias' ||
			envio == 'gracias!'){

				session.send(`Con gusto ${session.userData.nombre}, ¡disfrutala!🍕🍕`)
				session.endConversation();

			}else if (envio == 'cuanto tarda?'||
			envio == 'cuanto tarda'){
				session.endDialog('Aproximadamente 35 minutos! :)');
				session.beginDialog('/Envio');
			}else {

				session.send('Un gracias siempre es bienvenido, disfruta tu pedido y hasta pronto!');
				session.endConversation();
			}

		}
	}
]);

bot.dialog('/NoPedidoSaludos', [
	function(session){

		if(!session.userData.nombre){
			builder.Prompts.text(session, `Es bueno que pases a saludar, pero estoy trabajando ahora, ¡Hasta pronto!`);
		}else{
			builder.Prompts.text(session, ` ${session.userData.nombre} Es bueno que pases a saludar, pero estoy trabajando ahora, ¡Hasta pronto!`);
		}
		session.endConversation();
	}
]);

bot.dialog('/ResDifPedido', [
	function(session){
		builder.Prompts.text(session, `Disculpa, no te entiendo 😟`);
		
		session.endDialog();
		session.beginDialog('/PreguntarSiPedido');
	}
]);