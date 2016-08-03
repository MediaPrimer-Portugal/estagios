var cookie = JSON.parse($.cookie("dashboard")),
    baseurl = 'http://localhost:63450/pages/';	//URL base do dashboard

//id da app que tenta aceder à aplicação
var app_id = "primerCORE_Web";
var hostAutentica = 'http://prodserver1/MP/primerCORE/db2/web/';
var path_cookie = "dashboard";


/// <summary>
/// Constroi icon que simbolilza o loading, elemento de suporte para os pedidos ajax
/// </summary>
/// <param name="elemento"> Elemento que vai receber o Spinner </param>
var ConstroiSpinner = function (widget) {
    var opts = {
        lines: 14, // The number of lines to draw
        length: 0, // The length of each line
        width: 20, // The line thickness
        radius: 46, // The radius of the inner circle
        scale: 0.75,
        corners: 1, // Corner roundness (0..1)
        rotate: 81, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 47, // Afterglow percentage
        opacity: 0,
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: "spinner", // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: "50%", // Top position relative to parent
        left: "50%" // Left position relative to parent
    };

    // Atribuir o alvo do spinner
    var alvo = $("#" + widget.id).find(".wrapper")[0];
    // Criar o spinner
    widget.spinner = new Spinner(opts).spin(alvo);
}



primerCORE = (function () {
    var objecto = {};


    /// ----- #DASHBOARD -----

    /// <summary>
    /// Devolve todos os dashboards de todos os utilizadores
    /// </summary>
    /// <returns> Objecto com a informação de todos os dashboards </returns>
    objecto.DashboardsDevolveLista = function () {
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard";
            
        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

             
            },
            // Depois do pedido estar completo
            complete: function () {
               
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);
                //alert(xhr.status);
                //alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        }).responseText;
    };

    /// <summary>
    /// Devolve um dashboard em especifico (ID)
    /// </summary>
    /// <param name="id"> Id do dashboard a ser pedido </param>
    /// <returns> Devolve a dashboard indicada pelo ID do utilizador </returns>
    objecto.DashboardDevolve = function (id) {
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/"+ id;

        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

              
            },
            // Depois do pedido estar completo
            complete: function () {
              
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status + " - " + thrownError);
            },
        }).responseText;
    };


    /// <summary>
    /// Devolve os dados iniciais de um dashboard
    /// <returns> Retorna um objecto com os dados de inicialização (dadomedido, indicadores, etc) </returns> 
    objecto.DashboardDadosIniciais = function () {
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/iniciais",
            query = '{}';

        return $.ajax({
            type: "POST",
            data: query,
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

            
            },
            // Depois do pedido estar completo
            complete: function () {
             
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status);
                alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        }).responseText;
    };




    /// ----- #DASHBOARD -----



    /// ----- #OPCOES DASHBOARD -----

    /// <summary>
    /// Devolve os Dashboards ligados a um utilizador em especifico (ID)
    /// </summary>
    /// <param name="id"> Id do utilizador a pesquisar </param>
    /// <returns> Retorna todos os dashboards ligados ao ID do utilizador que foi enviado </returns>
    objecto.DashboardsUtilizadorLista = function (id) {

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/utilizador/" + id;

        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

        
            },
            // Depois do pedido estar completo
            complete: function () {
            
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status);
                alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        }).responseText;
    };


    // to-do
    /// <summary>
    /// Cria um registo da dashboard (CRIA)
    /// </summary>
    /// <param name="query"> Objecto com os parametros necessários para registar o dashboard </param>
    /// <returns></returns>
    objecto.DashboardCria = function (idUtilizador, dashboard) {


        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/cria",
            query = '{'
                + '"UtilizadorID":' + "'" + idUtilizador + "'" + ','
                + '"Nome":' + "'" + dashboard.Nome + "'" + ','
                + '"Descricao":' + "'" + dashboard.Descricao + "'" + ','
                + '"Configuracao":' + "'" + dashboard.Configuracao + "'" + ','
                + '"Activo":' + "'" + true + "'"
            + '}';


        return $.ajax({
            type: "PUT",
            data: query,
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

            },
            // Depois do pedido estar completo
            complete: function () {
           
            },
            url: url,
            // Ao receber o pedido
            success: function () {

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status);
                alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        }).responseText;
    };


    /// <summary>
    /// Remove dashboard
    /// </summary>
    objecto.DashboardApaga = function (id) {

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/" + id;

        return $.ajax({
            type: "DELETE",
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

    
            },
            // Depois do pedido estar completo
            complete: function () {
             
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status + " - " + thrownError);
            },
        }).responseText;
    };


    // to-do 400
    /// <summary>
    /// Atualiza um dashboard
    /// </summary>
    /// <param name="id"> Id da dashboard a ser atualizada </param>
    /// <param name="objecto"> Objecto que é utilizado para utilizar o dashboard </param>
    objecto.DashboardAtualiza = function (idUtilizador, dashboard) {
        
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/" + dashboard.ID,
            query = '{'
                + '"Nome":' + "'" + dashboard.Nome + "'" + ',' 
                + '"Descricao":' + "'" + dashboard.Descricao + "'" + ',' 
                + '"Configuracao":' + "'" + dashboard.Configuracao + "'" + ','
                + '"Activo":' + "'" + true + "'"
            + '}';

        return $.ajax({
            type: "POST",
            data: query,
            async: true,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

           
            },
            // Depois do pedido estar completo
            complete: function () {
            
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
                alert(xhr);
            },
        }).responseText;
    };


    /// <summary>
    /// Altera o estado de um dashboard
    /// </summary>
    /// <param name="id"> Id do dashboard a ser alterado </param>
    objecto.DashboardAlteraEstado = function (id, estado) {
        
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/" + id + "/activo/" + estado;

        return $.ajax({
            type: "POST",
            async: false,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {

          
            },
            // Depois do pedido estar completo
            complete: function () {
         
            },
            url: url,
            // Ao receber o pedido
            success: function () {
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status);
                alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        }).responseText;
    };

    /// ----- #OPCOES DASHBOARD -----



    /// ----- #WIDGETS -----

    /// <summary>
    /// Devolve uma lista de Widgets
    /// </summary>
    /// <returns> </returns>
    objecto.DashboardWidgetsLista = function (query) {
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard";

            return $.ajax({
                type: "POST",
                data: query,
                async: false,
                cache: false,
                headers: {
                    'x-primerCORE-sessionID': cookie.sessaoid
                },
                // Antes de enviar
                beforeSend: function () {

   
                },
                // Depois do pedido estar completo
                complete: function () {
       
                },
                url: url,
                // Ao receber o pedido
                success: function () {
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                    alert(xhr.status);
                    alert(thrownError);
                    alert("O seu pedido sofreu um erro e não foi concretizado");
                },
            }).responseText;
    };


    /// <summary>
    /// Pedido AJAX para um Widget em especifico
    /// Após completar desenha widget no dashboard (caso seja um widget dados)
    /// </summary>
    /// <param name="widget"> Widget que está a pedir dados </param>
    /// <param name="opcoes"> Opcoes para filtrar o pedido (data inicio, fim) </param>
    /// <param name="filtros"> Filtros que estão ligados ao widget </param>
    /// <returns> Devolve um objecto com a informação do  widget  </returns>
    objecto.DashboardDevolveWidget = function (widget, opcoes, filtros, dashboardID, utilizadorID) {

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/valores",
            series,
            pesquisa,
            index = 0,
            contexto = '',
            intervaloData = ["seconds", "hours", "minutes", "days", "weeks", "months", "years"],
            intervaloDataPT = ["Segundo", "Hora", "Minuto", "Dia", "Semana", "Mes", "Ano"];

     
        // years, months, weeks, days, hours, minutes, and seconds. 

        // Enquanto a diferença das datas for maior que 30 num determinado intervalo, seja dias, meses, etc
        // vai avançando no array a testar novos intervalos
        // Com isto ée pretendido achar o numero ideal de dados a dispor, sem causar grande sobrecarga
        // nos pedidos/aplicação
        while (moment(opcoes.dataFim).diff(moment(opcoes.dataInicio), intervaloData[index]) > 40) {
            index++;
        }


        // Preparar todas as séries para a query
        series = '[';
        widget.seriesUtilizadas.forEach(function (item, index) {
            // Para não ir buscar o ultimo campo (proto)
            if (widget.seriesUtilizadas.length > index) {
                series += '{ "funcao": "' + item.Funcao + '", "campo": "' + item.Campo + '", "index": "indicadores", "type": "", "query": "' + item.Pesquisa + '" },';
            }
        });
        series += '],';


        // Preparar todas as pesquisas para a query
        pesquisa = '{ "contextoPesquisa": [';
        // Para todos os contextoFiltro
        widget.contextoFiltro.forEach(function (item, curIndex) {
            var filtro;

            (filtros[curIndex] === undefined) ? valor = "" : valor = filtros[curIndex].valor;
             
            // Caso o filtro esteja disponivel
            if (item !== undefined) {
                pesquisa += '{ "id": "' + item + '", "tipo": "contexto", "filtro": "' + valor + '" }, ';
                contexto += ', "' + item + '"';
            } else {
                alert("ERRO - Filtro não disponivel para pedido");
            }

        })
        pesquisa += '],';

        // Caso exista objecto de onde escolher
        if (widget.periodoEscolhido instanceof Object) {
            // Se for do tipo fixo (Vai utilizar a data atual e adaptar conforme a opção escolhida)
            if (widget.periodoEscolhido.periodo === "fixo") {

                var index = _.findIndex(intervaloDataPT, function (data) { return data === widget.periodoEscolhido.valor; }),
                    datainicio = moment($.datepicker.formatDate('yy/mm/dd', new Date())).subtract(30, intervaloData[index]).format("YYYY/MM/DD");


                query = '{ "sessaoID": "sessaoDebug", "dashboardID": "' + dashboardID + '", "utilizadorID": "' + utilizadorID + '", "widgetsDados":'
                        + '[{ "id": "' + widget.id + '", '
                        + '"tipo": "dados",'
                        + '"elemento": "' + widget.widgetElemento + '", '
                        + '"contexto": ["' + opcoes.id + '"' + contexto + '], '
                        + '"series":' + series
                        + '"buckets": [{ "tipo": "histogramadata", "campo": "data", "intervalo": "' + widget.periodoEscolhido.valor + '" }] }], '
                        + '"widgetsContexto":' + pesquisa
                        + '"contextoData": [{ "id": "' + opcoes.id + '", "campo": "data", '
                                            + '"dataInicio": \"' + datainicio + '\",  '
                                            + '"dataFim": \"' + $.datepicker.formatDate('yy/mm/dd', new Date()) + '\"  }] } }';


            // Senão utiliza a opção do contexto
            } else if(widget.periodoEscolhido.periodo === "contexto") {
                query = '{ "sessaoID": "sessaoDebug", "dashboardID": "' + dashboardID + '", "utilizadorID": "' + utilizadorID + '", "widgetsDados":'
                        + '[{ "id": "' + widget.id + '", '
                        + '"tipo": "dados",'
                        + '"elemento": "' + widget.widgetElemento + '", '
                        + '"contexto": ["' + opcoes.id + '"' + contexto + '], '
                        + '"series":' + series
                        + '"buckets": [{ "tipo": "histogramadata", "campo": "data", "intervalo": "' + intervaloDataPT[index] + '" }] }], '
                        + '"widgetsContexto":' + pesquisa
                        + '"contextoData": [{ "id": "' + opcoes.id + '", "campo": "data", '
                                            + '"dataInicio": \"' + opcoes.dataInicio + '\",  '
                                            + '"dataFim": \"' + opcoes.dataFim + '\"  }] } }';

            }
        // Como não tem objecto vamos é assumido que tem contexto, é utilizado as opcoes do contexto
        } else {
            query = '{ "sessaoID": "sessaoDebug", "dashboardID": "' + dashboardID + '", "utilizadorID": "' + utilizadorID + '", "widgetsDados":'
        + '[{ "id": "' + widget.id + '", '
        + '"tipo": "dados",'
        + '"elemento": "' + widget.widgetElemento + '", '
        + '"contexto": ["' + opcoes.id + '"' + contexto + '], '
        + '"series":' + series
        + '"buckets": [{ "tipo": "histogramadata", "campo": "data", "intervalo": "' + intervaloDataPT[index] + '" }] }], '
        + '"widgetsContexto":' + pesquisa
        + '"contextoData": [{ "id": "' + opcoes.id + '", "campo": "data", '
                            + '"dataInicio": \"' + opcoes.dataInicio + '\",  '
                            + '"dataFim": \"' + opcoes.dataFim + '\"  }] } }';
        }


        $.ajax({
            type: "POST",
            data: query,
            async: true,
            cache: false,
            headers: {
                'x-primerCORE-sessionID': cookie.sessaoid
            },
            // Antes de enviar
            beforeSend: function () {
                // Apaga a representação antes de pedir novos dados
                $("#" + widget.id).find(".wrapper").find("svg").remove();
                $("#" + widget.id).find(".dataTables_wrapper").remove();
                $("#" + widget.id).find(".legenda").css("display", "none");

                // Constroi o spinner 
                ConstroiSpinner(widget);
                // Adicionar class ao spinner
                $("#" + widget.id).addClass("carregar")

                // Remove opção de selecionar
                $("#" + widget.id).css("pointer-events", "none");

            },
            // Depois do pedido estar completo
            complete: function (event) {

                // Adiciona opção de selecionar
                $("#" + widget.id).css("pointer-events", "auto");

                // Parar widget
                widget.spinner.stop();

                // Volta a mostrar legenda
                $("#" + widget.id).find(".legenda").css("display", "show");

                // Remover class do spinner
                $("#" + widget.id).removeClass("carregar");

            },
            url: url,
            // Ao receber o pedido
            success: function (event) {

                // Adiciona opção de selecionar
                $("#" + widget.id).css("pointer-events", "auto");

                // Caso seja um widget do tipo dados
                if (widget.widgetTipo === "dados") {
                    widget.dados = event;
                    widget.RedesenhaGrafico(widget.id);
                }

                // Remove aviso pois foi feito com sucesso o pedido
                widget.RemoveAviso();


            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert("O seu pedido sofreu um erro e não foi concretizado");

                // Adiciona opção de selecionar
                $("#" + widget.id).css("pointer-events", "auto");
               
                // Desenha aviso visual para o utilizador saber qual o widget que está a falhar
                widget.setAviso();

                // Parar widget
                widget.spinner.stop();

                // Remover class do spinner
                $("#" + widget.id).removeClass("carregar");

            },
        });



    };

    /// ----- #WIDGETS -----


    /// ----- #LOGOUT ------

    //efectua o logout da aplicação
    objecto.logoff = function () {
        var self = this;

        self.verificaSessao();

        $.ajax({
            type: "POST",
            url: hostAutentica + "SessaoTermina",
            data: '{"sessaoID":"' + cookie.sessaoid + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.verificaSessaoFim(null);
                $.cookie('dashboard', null, { path: "/" });

                window.location.replace(baseurl + "db_login.html");
            },
            error: function (error) {
                alert("Ocorreu um erro com a chamada de Ajax.");
            }
        });
    };

    //verifica se a sessao é válida
    objecto.verificaSessao = function () {
        if ($.parseJSON($.cookie('dashboard')) == null)
            window.location.replace(baseurl + "db_login.html");
    };

    //verifica se depois de uma chamada a um serviço, existe um erro devido à sessão
    objecto.verificaSessaoFim = function (resultado) {

        if (resultado == null)
            return;

        if (resultado.Sucesso == false) {
            if (resultado.Codigo == 2) {
                $.cookie('dashboard', null, { path: path_cookie });
                window.location.replace(baseurl + "db_login.html");
            }
        }
    };


    return objecto;

})();

