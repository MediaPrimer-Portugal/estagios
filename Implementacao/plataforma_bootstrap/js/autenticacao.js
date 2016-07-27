//id da app que tenta aceder à aplicação
var app_id = "primerCORE_Web";
var hostAutentica = 'http://prodserver1/MP/primerCORE/db2/web/';
var baseurl = 'http://localhost:63450/pages/';	//URL base do dashboard
baseurl = './';
var path_cookie = "dashboard";

//chave pública para encriptação
var chave_publica = null;

//chaves de cliente
var chaves_cliente = []


/***************************************** FUNÇÕES *****************************************/

/************************* 
 01. Autenticação & Sessão
**************************/
var escutaTecla = function () {
    $(document).keypress(function (event) {
        if ((event.keyCode || event.which) == 13) { //tecla enter
            if ($('#elementos_recupera').length == 0) {
                if ($('#username').val() == "" || $('#password').val() == "")
                    alert('Todos os campos são de preenchimento obrigatório');
                else
                    obtemDadosAplicacao(0, $('#username').val(), $('#password').val());
            }
        }
    });
}

// Correr método
escutaTecla();

//obtém os dados públicos da aplicação.
var obtemDadosAplicacao = function (operacao, username, password) {
    loading();

    $.ajax({
        type: "POST",
        async: false,
        url: hostAutentica + "DadosPublicosDevolve",
        data: '{"listaDadosPublicos":null}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.DadosPublicosDevolveResult.Sucesso) {
                for (i in data.listaDadosPublicos) {
                    //caso haja mais do que um método de encriptação
                    switch (data.listaDadosPublicos[i].m_Item1) {
                        case "rsaPublicXML":
                            switch (operacao) {
                                case 0: //login
                                    if (doLogin(primerCORECrypt.rsaEncripta(password, data.listaDadosPublicos[i].m_Item2), username, password))
                                        window.location.replace(baseurl + "db_lista.html");
                                    break;
                                case 1: //criar novo utilizador; alterar password
                                    chave_publica = data.listaDadosPublicos[i].m_Item2;
                                    break;
                            }
                    }
                }
            }
            else
                alert(data.DadosPublicosDevolveResult.DadosExtra);

            $.unblockUI();
        },
        error: function (error) {
            unloading();
            alert("Ocorreu um erro com a chamada de Ajax.");
        }
    });

    unloading();
};

//efectua a autenticação do utilizador na aplicação
var doLogin = function (encrypted, username, password) {
    var valida = false;



    $.ajax({
        type: "POST",
        async: false,
        url: hostAutentica + "SessaoInicia",
        data: '{"appID":"' + app_id + '", "appVersao": "*.*.*", "username":"' + username + '", "passwordEncriptada":"' + encrypted + '", "dadosUtilizador":null}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.SessaoIniciaResult.Sucesso) {
                if (data.dadosUtilizador.Activo) {
                    criaCookie('dashboard', data.SessaoIniciaResult.Dados, data.dadosUtilizador.Nome, data.dadosUtilizador.ID, data.dadosUtilizador.Username, 30);
                    valida = true;

                }
                else
                    alert("Não tem permissões de acesso.");

            }
            else
                alert(data.SessaoIniciaResult.DadosExtra);

        },
        error: function () {
            alert("Ocorreu um erro com a chamada de Ajax.");

        }

    });

    //controlaSessoes((valida?1:0), username);

    return valida;
};
/*
var controlaSessoes = function(sucesso, username){

	/*
	edp_regista_login
	<login sucesso='1'><username>mediaprimer</username><imei>12345678910</imei><data>2013-11-28 10:10:10</data><versao>v1</versao></login>
	*/
/*
var data = new Date();
data = dateToString(data);

var xml = "<login sucesso='"+sucesso+"'><username>"+username+"</username><imei>0</imei><data>"+data+"</data><versao>0</versao></login>";

//var resultado = executaAccaoAsincNoSession("edp_regista_login", xml);

};*/


//efectua o logout da aplicação
var logoff = function () {
    verificaSessao();

    $.ajax({
        type: "POST",
        url: hostAutentica + "SessaoTermina",
        data: '{"sessaoID":"' + sessaoId + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            verificaSessaoFim(null);
            $.cookie('dashboard', null, { path: path_cookie });

            window.location.replace(baseurl + "login.html");
        },
        error: function (error) {
            alert("Ocorreu um erro com a chamada de Ajax.");
        }
    });
};

//verifica se a sessao é válida
var verificaSessao = function () {
    if ($.evalJSON($.cookie('dashboard')) == null)
        window.location.replace(baseurl + "login.html");
};

//verifica se depois de uma chamada a um serviço, existe um erro devido à sessão
var verificaSessaoFim = function (resultado) {

    if (resultado == null)
        return;

    if (resultado.Sucesso == false) {
        if (resultado.Codigo == 2) {
            $.cookie('dashboard', null, { path: path_cookie });
            window.location.replace(baseurl + "login.html");
        }
    }
};

/*
var checkGet = function(nome) {
	var match = RegExp('[?&]' + nome + '=([^&]*)').exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
};


//verifica que parâmetros são passados no URL (ver http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html)
var getUrlVars = function() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
};*/


var criaCookie = function (nome_cookie, sessao_id, nome_utilizador, id_utilizador, username_utilizador, minutes) {

    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));


    $.cookie(
		nome_cookie,
		JSON.stringify(
			{
			    sessaoid: sessao_id,
			    nome: nome_utilizador,
			    username: username_utilizador,
                id: id_utilizador
			}
		),
		{ expires: date, path: '/' }
	);


};
/*
var nomeLogout = function() {
	verificaSessao();
	
	//actualiza o tempo de validade da cookie (sempre que uma página do dashboard é acedida)
	$.cookie('dashboard', $.toJSON({sessaoid: $.evalJSON($.cookie('dashboard')).sessaoid, nome: $.evalJSON($.cookie('dashboard')).nome, username: $.evalJSON($.cookie('dashboard')).username}), {path: path_cookie, expires: obtemValorChavesCliente("max_sessao_timeout")});
	
	$("#login").append('<a href="perfil.html?username=' + $.evalJSON($.cookie('dashboard')).username + '">' + $.evalJSON($.cookie('dashboard')).nome + '</a>');
	$("#login").append('<input type="button" title="Logout" value="Logout" onclick="logoff();"/>');
	
	verificaAcessoAdministracao();
	
	if (acesso_administracao) { //administradores
		if ($('ul#elements li.administracao').length == 0 && $('ul#elements li.terminais').length == 0) {
			$('<li class="op terminais"><a href="gestao_terminais.html">Terminais</a></li>').insertAfter($('#elements .pips'));
			$('ul#elements').append('<li class="op administracao"><a href="gestao_utilizadores_cg.html">Administração</a></li>');
		}
	}
} */

/********************* 
   DOM
**********************/
var loading = function () {
    $.blockUI({
        message: 'Por favor aguarde...',
        css: {
            backgroundColor: '#FFF',
            border: 'none',
            color: '#000',
            height: '50px',
            left: '40%',
            'line-height': '50px',
            padding: '15px',
            width: '20%'
        }
    });
}

var unloading = function () {
    $.unblockUI();
}

var modal = function () {
    //select all the a tag with name equal to modal
    $('a[id=modal]').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();

        //Get the A tag
        var id = $(this).attr('href');

        //Get the screen height and width
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        //Set heigth and width to mask to fill up the whole screen
        $('#mask').css({ 'width': maskWidth, 'height': maskHeight });

        //transition effect		
        //$('#mask').fadeIn(1000);	
        $('#mask').fadeTo("fast", 0.8);

        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();

        //Set the popup window to center
        $(id).css('top', winH / 2 - $(id).height() / 2);
        $(id).css('left', winW / 2 - $(id).width() / 2);

        //transition effect
        $(id).fadeIn(100);
    });

    //if close button is clicked
    $('.window .close').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();

        $('#mask').hide();
        $('.window').hide();
    });

    //if mask is clicked
    $('#mask').click(function () {
        $(this).hide();
        $('.window').hide();
    });

    //adiciona os elementos para a página do about
    $('#dialog').append(
		'<h1 class="header"></h1>' +
		'<div class="versao_dashboard">' +
			'<span>Vers&atilde;o:</span> 0.1' +
		'</div>'
	);
}
/*
//cria os elementos necessários para a recuperação de password e username na página do login
var elementosRecupera = function() {
	if ($('#elementos_recupera').length == 0) {
		$('.elementos').append('<div id="elementos_recupera"></div>');
		
		$('#elementos_recupera').append('<div class="sep27"></div>');
	
		$('#elementos_recupera').append(
			'<div class="login_label">Username</div>' +
			'<div class="login_input">' +
				'<input id="input_username" name="input_username" type="text">' +
			'</div>'
		);
		
		$('#elementos_recupera').append('<div class="sep18"></div>');
		
		$('#elementos_recupera').append(
			'<div class="login_label">Email</div>' +
			'<div class="login_input">' +
				'<input id="input_email" name="input_email" type="text" /></div>' +
			'</div>'
		);
		
		$('#elementos_recupera').append(
			'<div class="botoes_form">' + 
				'<input id="alteracao_password" class="botao_form DroidSansBold" type="button" value="Enviar" />' + 
				'<input class="botao_form DroidSansBold" type="button" value="Cancelar" onclick="javascript:$(\'#elementos_recupera\').children().remove();" />' +
			'</div>'
		);
		
		$('#elementos_recupera').append('<div class="clr0"></div>');
		
		$('#alteracao_password').click(function(){
			loading();
			$(this).delay(100)
				 .queue(function(nxt) {
					geraDadosUtilizador();
					$.unblockUI();
					nxt();
				 });
		});
	}
	else
		$('.elementos').children().remove();
}
*/