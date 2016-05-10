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
    /// Devolve todos os dashboards
    /// </summary>
    /// <returns> Objecto com a informação de todos os dashboards </returns>
    objecto.DashboardsDevolveLista = function () {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard?sessaoID=sessaoDebug";
            
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
    /// Devolve um dashboard em especifico 
    /// </summary>
    /// <param name="id"> Id do dashboard a ser pedido </param>
    /// <returns> Devolve a dashboard indicada pelo ID do utilizador </returns>
    objecto.DashboardDevolve = function (id) {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/"+ id +"?sessaoID=sessaoDebug";

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


    /// <summary>
    /// Devolve os dados iniciais de um dashboard
    /// </summary>
    /// <returns> Retorna um objecto com os dados de inicialização (dadomedido, indicadores, etc) </returns> 
    objecto.DashboardDadosIniciais = function () {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/iniciais?sessaoID=sessaoDebug",
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
    /// Devolve os Dashboards ligados a um utilizador em especifico
    /// </summary>
    /// <param name="id"> Id do utilizador a pesquisar </param>
    /// <returns> Retorna todos os dashboards ligados ao ID do utilizador que foi enviado </returns>
    objecto.DashboardsUtilizadorLista = function (id) {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/utilizador/" + id + "?sessaoID=sessaoDebug"

        return $.ajax({
            type: "GET",
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


    // to-do
    /// <summary>
    /// Cria um registo da dashboard
    /// </summary>
    /// <param name="query"> Objecto com os parametros necessários para registar o dashboard </param>
    /// <returns></returns>
    objecto.DashboardCria = function (query) {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/cria?sessaoID=sessaoDebug";

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

    // to-do 400
    /// <summary>
    /// Atualiza um dashboard
    /// </summary>
    /// <param name="id"> Id da dashboard a ser atualizada </param>
    /// <param name="objecto"> Objecto que é utilizado para utilizar o dashboard </param>
    objecto.DashboardAtualiza = function (id, objecto) {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/"+id+"?sessaoID=sessaoDebug";

        return $.ajax({
            type: "POST",
            data: objecto,
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
    /// Apaga dashboard do registo
    /// </summary>
    ///
    objecto.DashbooardApaga = function () {
        // to-do
    };


    /// <summary>
    /// Altera o estado de um dashboard
    /// </summary>
    /// <param name="id"> Id do dashboard a ser alterado </param>
    objecto.DashboardAlteraEstado = function (id) {
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard/15/activo/false?sessaoID=sessaoDebug";

        return $.ajax({
            type: "POST",
            data: objecto,
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
        var url = "http://prodserver1/MP/primerCORE/db/rest/dashboard?sessaoID=sessaoDebug";

            return $.ajax({
                type: "GET",
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
    objecto.DashboardDevolveWidget = function (widget, query) {

        var url = "http://192.168.0.17/dashboard/Implementacao/plataforma_bootstrap/JSON/" + ficheiro + ".JSON",
            url1 = "http://localhost:49167/JSON/" + ficheiro + ".JSON",
            urlprodserver = "http://prodserver1/MP/primerCORE/db/rest/dashboard/valores?sessaoID=sessaoDebug";

        return $.ajax({
            type: "POST",
            data: query,
            async: false,
            cache: false,
            // Antes de enviar
            beforeSend: function () {

                $("#" + widget.id).find("wrapper").css("display", "none");

                // Constroi o spinner 
                ConstroiSpinner(widget);
                // Adicionar class ao spinner
                $("#" + widget.id).addClass("carregar")
            },
            // Depois do pedido estar completo
            complete: function () {
                // Parar widget
                widget.spinner.stop();

                $("#" + widget.id).find("wrapper").css("display", "block");

                // Remover class do spinner
                $("#" + widget.id).removeClass("carregar");
            },
            url: urlprodserver,
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

    /// ----- #WIDGETS -----


    return objecto;

})();

