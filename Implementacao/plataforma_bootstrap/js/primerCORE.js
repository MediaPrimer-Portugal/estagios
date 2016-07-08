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
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard?sessaoID=sessaoDebug";
            
        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

               // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/"+ id +"?sessaoID=sessaoDebug";

        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                alert(xhr.status + " - " + thrownError);
            },
        }).responseText;
    };


    /// <summary>
    /// Devolve os dados iniciais de um dashboard  ( Não funciona )
    /// </summary>
    /// <returns> Retorna um objecto com os dados de inicialização (dadomedido, indicadores, etc) </returns> 
    objecto.DashboardDadosIniciais = function () {
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/iniciais?sessaoID=sessaoDebug",
            query = '{}';

        return $.ajax({
            type: "POST",
            data: query,
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/utilizador/" + id + "?sessaoID=sessaoDebug"

        return $.ajax({
            type: "GET",
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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

        console.log(dashboard);

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/cria?sessaoID=sessaoDebug",
            query = '{'
                + '"UtilizadorID":' + "'" + idUtilizador + "'" + ','
                + '"Nome":' + "'" + dashboard.Nome + "'" + ','
                + '"Descricao":' + "'" + dashboard.Descricao + "'" + ','
                + '"Configuracao":' + "'" + dashboard.Configuracao + "'" + ','
                + '"Activo":' + "'" + true + "'"
            + '}';

        console.log(query);

        return $.ajax({
            type: "PUT",
            data: query,
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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

        console.log(id);

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/" + id + "?sessaoID=sessaoDebug"

        return $.ajax({
            type: "DELETE",
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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

        console.log(dashboard);

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/" + dashboard.ID + "?sessaoID=sessaoDebug",
            query = '{'
                + '"Nome":' + "'" + dashboard.Nome + "'" + ',' 
                + '"Descricao":' + "'" + dashboard.Descricao + "'" + ',' 
                + '"Configuracao":' + "'" + dashboard.Configuracao + "'" + ','
                + '"Activo":' + "'" + true + "'"
            + '}';

        console.log(url);
        console.log(query);

        return $.ajax({
            type: "POST",
            data: query,
            async: true,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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
        
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/"+ id +"/activo/" + estado + "?sessaoID=sessaoDebug";

        return $.ajax({
            type: "POST",
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                // $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                //ConstroiSpinner(widget);
                // Adicionar class ao spinner
                //$("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                //widget.spinner.stop();

                //$("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                //$("#" + widget.id).removeClass("carregar");
            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
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
        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard?sessaoID=sessaoDebug";

            return $.ajax({
                type: "POST",
                data: query,
                async: false,
                cache: false,
                // Antes de enviar
                beforeSend: function () {

                    // $("#" + widget.id).find("wrapper").css("display", "none");

                    // Constroi o spinner 
                    //ConstroiSpinner(widget);
                    // Adicionar class ao spinner
                    //$("#" + widget.id).addClass("carregar")
                },
                // Depois do pedido estar completo
                complete: function () {
                    // Parar widget
                    //widget.spinner.stop();

                    //$("#" + widget.id).find("wrapper").css("display", "block");

                    // Remover class do spinner
                    //$("#" + widget.id).removeClass("carregar");
                },
                url: url,
                // Ao receber o pedido
                success: function () {
                    console.log("Dados obtidos");
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
    /// </summary>
    /// <param name="widget"> Widget que está a pedir dados </param>
    /// <param name="opcoes"> Opcoes para filtrar o pedido (data inicio, fim) </param>
    /// <returns> Devolve um objecto com a informação do  widget  </returns>
    objecto.DashboardDevolveWidget = function (widget, opcoes, dashboardID, utilizadorID) {
        // substituir campos na query, funcao e campo????

        var url = "http://prodserver1/MP/primerCORE/db2/rest/dashboard/valores?sessaoID=sessaoDebug";

        query = '{ "sessaoID": "sessaoDebug", "dashboardID": "12", "utilizadorID": "2502", "widgetsDados":'
                + '[{ "id": "widget0", '
                + '"tipo": "1",'
                + '"elemento": "GraficoLinhas", '
                + '"contexto": ["widget3", "widget4", "widget8"], '
                + '"series": [{ "funcao": "Media", "campo": "valor.valorMax", "index": "indicadores", "type": "" }, '
                            +'{ "funcao": "Media", "campo": "valor.valorMed", "index": "indicadores", "type": "" }, '
                            +'{ "funcao": "media", "campo": "valor.valorMin", "index": "indicadores", "type": "" }], '
                + '"buckets": [{ "tipo": "histogramadata", "campo": "data", "intervalo": "dia" }] }], '
                + '"widgetsContexto": { "contextoPesquisa": [{ "id": "widget3", "tipo": "contexto", "filtro": "_index:indicadores" }, '
                                        + '{ "id": "widget4", "tipo": "contexto", "filtro": "_type:dadomedidotriplo" }], '
                + '"contextoData": [{ "id": "widget8", "campo": "data", '
                                    + '"dataInicio": \"' + opcoes.dataInicio + '\",  '
                                    + '"dataFim": \"' + opcoes.dataFim + '\"  }] } }';

        //query = '{ "sessaoID": "sessaoDebug", "dashboardID": "12","utilizadorID": "2502", "widgetsDados": [ { "id": \"' + widget.id +
        //    '\", "tipo": \"' + widget.widgetTipo +
        //    '\", "elemento": \"' + widget.widgetElemento +
        //    '\", "contexto": [ "widget3", "widget8" ], "series": [ {"funcao": "Media", "campo": "valor.valorMax", "index": "indicadores", "type": ""}, { "funcao": "Media", "campo": "valor.valorMed", "index": "indicadores", "type": "" }, { "funcao": "Media", "campo": "valor.valorMin", "index": "indicadores", "type": "" } ], "buckets": [ {"tipo": "histogramadata", "campo": "data", "intervalo": "dia" } ]} ], "widgetsContexto": { "contextoPesquisa": [ { "id": "widget3", "tipo": "contexto",  "filtro": "valor.tagID: 3072" }, { "id": "widget4", "tipo": "contexto", "filtro": "valor.tagID: 3073"} ],  "contextoData": [  {  "id": "widget8",  "campo": "data", "dataInicio": \"' + opcoes.dataInicio + '\",  "dataFim": \"' + opcoes.dataFim + '\" } ] } }';


        $.ajax({
            type: "POST",
            data: query,
            async: true,
            cache: false,
            // Antes de enviar
            beforeSend: function () {
                // Apaga a representação antes de pedir novos dados
                $("#" + widget.id).find(".wrapper").find("svg").remove();
                $("#" + widget.id).find(".dataTables_wrapper").remove();
                $("#" + widget.id).find(".legenda").hide();

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

                // Caso seja um widget do tipo dados
                if (widget.widgetTipo === "dados") {
                    widget.dados = $.parseJSON(event.responseText);
                    widget.RedesenhaGrafico(widget.id);
                }

                // Parar widget
                widget.spinner.stop();


                $("#" + widget.id).find(".legenda").show();

                // Remover class do spinner
                $("#" + widget.id).removeClass("carregar");

            },
            url: url,
            // Ao receber o pedido
            success: function () {
                console.log("Dados obtidos");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);
                //alert(xhr.status);
                //alert(thrownError);
                alert("O seu pedido sofreu um erro e não foi concretizado");
            },
        });



    };

    /// ----- #WIDGETS -----


    return objecto;

})();

