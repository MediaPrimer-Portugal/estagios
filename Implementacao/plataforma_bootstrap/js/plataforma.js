$("document").ready(function () {
    var cookie = JSON.parse($.cookie("dashboard")),
        baseurl = 'http://localhost:63450/pages/';	//URL base do dashboard
    
    // Caso exista um cookie
    if (!(cookie === null)) {



        /************************* 
            Variáveis
        **************************/

        var gridPrincipal,
        // Verifica em que modo está a página
            modo = document.body.id,
            idUnico = 0;


        /// Constantes
        /// Valor que simboliza a data no objecto de dados recebido do servidor
        var ValorData = "Data";



        /************************* 
            Métodos Auxiliares
        **************************/

        /// CONFIGURAÇÃO DE TOOLTIPS
        /// Widgets        
        // Modificar tooltips
        // Caso os dados a receber sejam diferentes, arranjar maneira de analisar e
        // alterar para que possam encaixar todos num método
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {


                // Caso seja um grafico de area
                if (d.tipo === "GraficoArea") {
                    return "<p>Indicador: <span style='color:green'>" + d.nome + "</span></p>" +
                        "<p></p>" +
                        "<p>Data: " + moment(d.date).format("DD-MM-YYYY") + "</p>" +
                        "<p>Valor: " + ((Number(d.y).toFixed(2))) + "</p>";

                }

                // Caso seja gráfico de linhas
                if (d.tipo === "GraficoLinhas") {
                    return "<p>Indicador: <span style='color:green'>" + d.nome + "</span></p>" +
                        "<p></p>" +
                        "<p>Data: " + moment(d.date).format("DD-MM-YYYY") + "</p>" +
                        "<p>Valor: " + ((Number(d.y).toFixed(2))) + "</p>";

                }

                // Caso seja um grafico de barras
                if (d.tipo === "GraficoBarras") {

                    return "<p>Indicador: <span style='color:green'>" + d.nome + "</span></p>" +
                        "<p></p>" +
                        "<p>Data: " + moment(d.date).format("DD-MM-YYYY") + "</p>" +
                        "<p>Valor: " + ((Number(d.y).toFixed(2))) + "</p>";

                }


                // Caso seja um pie chart
                if (d.tipo === "GraficoPie") {

                    return "<p>Indicador: <span style='color:green'>" + d.data.name + "</span></p>" +
                        "<p></p>" +
                       // "<p>Data: " + moment(d.date).format("DD-MM-YYYY") + "</p>" +
                        "<p>Valor: " + ((Number(d.value).toFixed(2))) + "%</p>";
                }


                return "<p>Dados: <span style='color:green'>" + d.nome + "</span></p>" +
                    "<p></p>" +
                    "<p>Data: " + (d.y1 - d.y0) + "</p>" +
                    "<p>Percentagem: " + ((Number(d.y).toFixed(2))) + "%</p>";
            });

        // Dados temporários para KPI
        var random = Math.random();

        setInterval(function () {
            random = Number(Math.random() * 100).toFixed(0);
        }, 1500);


        /// to-do encapsular métodos auxiliares

        /// <summary>
        /// Método auxiliar para concretizar a herança entre classes, neste caso atribuimos o
        /// Construtor ao filho
        /// </summary>
        /// <param name="Filho"> Class que vai herdar os métodos da classe Base </param>
        /// <param name="Pai"> Class base que vai partilhar os seus métodos </param>
        var Herda = function (Filho, Pai) {
            Filho.prototype = Object.create(Pai.prototype);
            Filho.prototype.constructor = Filho;
        }



        /// <summary>
        /// Função que efetua os pedidos ajax para adquirir os dados necessários para a visualização
        /// </summary>
        /// <param name="widget"> Widget que está a pedir dados </param>
        /// <param name="ficheiro"> ficheiro para fazer o pedido </param>
        var getDados = function (widget, opcoes) {

            var url = "http://192.168.0.17/dashboard/Implementacao/plataforma_bootstrap/JSON/" + ficheiro + ".JSON",
                url1 = "http://localhost:49167/JSON/" + ficheiro + ".JSON",
                urlprodserver = "http://prodserver1/MP/primerCORE/db/rest/dashboard/valores?sessaoID=sessaoDebug HTTP/1.1",
                query = '{"sessaoID": "sessaoDebug","dashboardID": "8", "utilizadorID": "2502","widgetsDados": [{"id": "widget0","contexto": ["widget3","widget8"],"agregacoes": [{"funcao": "avg","campo": "valor.valorMax"},{"funcao": "avg","campo": "valor.valorMed"},{"funcao": "avg","campo": "valor.valorMin"}]}], "widgetsContexto": {"contextoQuery": [{"id": "widget3","tipo": "query","filtro": "valor.tagID: 3072"},{"id": "widget4","tipo": "query","filtro": "valor.tagID: 3073"}],"contextoHistograma": [{"id": "widget8","tipo": "histograma","dataInicio": \"' + opcoes.dataInicio + '\","dataFim": \"' + opcoes.dataFim + '\"}]}}';

            return $.ajax({
                type: "POST",
                data: query,
                async: false,
                cache: false,
                // Antes de enviar
                beforeSend: function () {
                    $("#" + widget.id).find(".wrapper").find("svg").remove();

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

        }



        /// <summary>
        /// Verifica linguagem do browser do utilizador
        /// </summary>
        /// <returns> Retorna uma string que equivale a linguagem a ser usada pelo utilizador no browser </returns>
        var getLinguagem = function () {
            return userLang = navigator.language || navigator.userLanguage;
        }



        /// <summary>
        /// Cria e devolve um GUID
        /// </summary>
        /// <returns> GUID </returns>
        var getGUID = function () {
            var uuid;

            uuid = UUID.genV4().urn;

            return uuid;

        }



        /// <summary>
        /// Função para verificar se um número é inteiro
        /// </summary>
        /// <param name="valor"> Valor recebido para testar </param>
        /// <returns> Retorna true se for inteiro, false se não for </returns>
        var confirmaInteiro = function (valor) {
            var inteiro = /[0-9 -()+]+$/;

            return inteiro.test(valor) && Math.floor(valor) == valor;
        }


        /// <summary>
        /// Adquire os parametros enviados pelo URL
        /// formato: ?parametro=valor
        /// <param name="sParam"> Parametro a ser adquirido do URL </param>
        /// <returns> Retorna o valor dessa parametro </returns>
        var GetURLParameter = function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');

            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        }



        /// <summary>
        /// Fabrica de classes de widgets
        /// </summary>
        /// <param name="tipoClasse"> Tipo de classe a ser criada </param>
        /// <returns> Retorna um objecto da nova classe </returns>
        var FabricaClasses = function (id, tipoClasse, dados) {

            // todo Factory de classes
            switch (tipoClasse) {
                case "GraficoArea":
                    return (new GraficoArea(id, "GraficoArea"));
                    break;
                case "GraficoBarras":
                    return (new GraficoBarras(id, "GraficoBarras"));
                    break;
                case "GraficoLinhas":
                    return (new GraficoLinhas(id, "GraficoLinhas"));
                    break;
                case "gauge":
                    return (new Gauge(id, "Gauge"));
                    break;
                case "Etiqueta":
                    return (new KPI(id, "Etiqueta"));
                    break;
                case "Tabela":
                    return (new Tabela(id, "Tabela", dados));
                    break;
                case "GraficoPie":
                    return (new PieChart(id, "GraficoPie"));
                    break;
                case "Filtros":
                    return (new Filtros(id, "Filtros"));
                    break;
                case "Data":
                    return (new Data(id, "Data"));
                    break;
            }

        }




        /************************* 
            Classes
        **************************/


        /// <summary>
        /// Class pai de todas as outras, contém maior parte da informação que vai ser partilhada entre os widget
        /// Vão herdar desta class em especifico
        /// Module Pattern
        /// </summary>
        var Widget = (function () {
            var widgetLargura,
                widgetAltura,
                widgetX,
                widgetY,
                widgetTipo,
                widgetElemento,
                visivel,
                titulo,
                id,
                largura,
                altura,
                svg,
                mostraToolTip,
                mostraLegenda,
                ultimaAtualizacao,
                dados,
                spinner,
                descricao,
                seriesUtilizadas,
                TamanhoLimite = 250,
                margem = { cima: 20, baixo: 50, esquerda: 40, direita: 40 };

            /// <summary>
            /// Construtor da class Widget
            /// </summary>
            function Widget(el, titulo) {
                // Definir elemento que contém os atributos do widget
                var $elemento = $("#" + el).parent();

                // Atribuição de altura e largura conforme o elemento em que se encontra
                // to-do
                this.largura = $("#" + el).width();
                this.altura = $("#" + el).height();

                // Inicialização dos dados relativos ao widget
                (titulo !== undefined) ? this.titulo = titulo : this.titulo = "titulo";
                this.widgetAltura = $elemento.attr("data-gs-height");
                this.widgetLargura = $elemento.attr("data-gs-width");
                this.widgetX = $elemento.attr("data-gs-x");
                this.widgetY = $elemento.attr("data-gs-y");

                // to-do Criação de um ID unico
                this.id = el;

                // Verifica se titulo é valido
                (titulo !== undefined) ? this.titulo = titulo : this.titulo = el;
                this.setTitulo(titulo);

                // Descrição
                this.setDescricao("Descricao do widget");


                // Inicialização dos dados default
                this.mostraLegenda = true;
                this.mostraToolTip = true;
                this.estadoTabela = false;
                this.ultimaAtualizacao = $.datepicker.formatDate('yy/mm/dd', new Date());
                this.margem = margem;
                this.TamanhoLimite = TamanhoLimite;

                // Boolean que indica se está visivel ou não
                this.visivel = true;

                // Botão para esconder o widget
                this.OpcaoEsconder();

                // Objecto que comunica com o servidor
                this.objectoServidor = {
                    id: "",
                    descricao: "",
                    modoVisualizacao: "",
                    titulo: "",
                    widgetAltura: "",
                    widgetLargura: "",
                    widgetX: "",
                    widgetY: "",
                    widgetTipo: "",
                    widgetElemento: "",
                    mostraLegenda: "",
                    mostraToolTip: "",
                    visivel: "",
                    ultimaAtualizacao: ""
                }

                // Widgets que estão relacionados com o widget
                this.contexto = [];
                this.contextoFiltro = [];

                this.agregacoes = [];
                this.seriesUtilizadas = [];

            }


            /// <summary>
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            Widget.prototype.ConstroiSVG = function (id, self) {
                var selector;

                self.svg = d3.select("#" + id).select(".wrapper").insert("svg")
                    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                    .attr("height", self.altura + self.margem.cima + self.margem.baixo)
                  .append("g")
                    .attr("transform", "translate(" + self.margem.esquerda + "," + self.margem.cima / 2 + ")");


                self.svg.call(tip);

            }


            /// <summary>
            /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados
            /// </summary>
            Widget.prototype.Renderiza = function () {

                var self = this;
                // to-do self?

                // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
                svg = d3.select("[name=" + self.parent().attr("name") + "]").select(".wrapper");

                // Atualizar dimensões conforme a "widget"
                self.AtualizaDimensoes();

                //update svg elements to new dimensions
                d3.select("#main-gridstack").select("[name=" + self.parent().attr("name") + "]").select(".wrapper svg")
                  .attr("width", largura + margem.esquerda + margem.direita)
                  .attr("height", altura + margem.cima + margem.baixo);

                self.Atualiza();
            }


            /// <summary>
            /// Método para adaptar os dados de forma correta ao gráfico pretendido
            /// </summary>
            Widget.prototype.InsereDados = function (dados) {
                // to-do
            }


            /// <summary>
            /// Método que atualiza o widget, p.ex a sua escala ou os dados
            /// </summary>
            Widget.prototype.Atualiza = function () {
                // to-do
                console.log("widget prototype atualiza");
            }


            /// <summary>
            /// Método para atualizar as dimensões atuais de um certo widget de acordo com o seu wrapper
            /// </summary>
            Widget.prototype.AtualizaDimensoes = function () {
                var self = this;

                self.largura = $("#" + self.id).width();

                // Se for maior for que a sua altura original, volta ao seu Max
                if (self.largura > $("#" + self.id).width() - self.margem.esquerda - self.margem.direita) {
                    self.largura = $("#" + self.id).width() - self.margem.esquerda - self.margem.direita;
                }

                self.altura = $("#" + self.id).height();

                // Retirados 20 pixeis por causa do nome que ocupa mais espaço devido ao seu angulo
                if (self.altura > $("#" + self.id).height() - self.margem.cima - self.margem.baixo - 50) {
                    self.altura = $("#" + self.id).height() - self.margem.cima - self.margem.baixo - 50;
                }

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            Widget.prototype.ConstroiGrafico = function (id) {
                var self = this;

                this.ConstroiSVG();
                this.Renderiza();

            }


            /// <summary>
            /// Associa widget e regista no atributo apropriado
            /// </summary>
            /// <param name="widget"> STRING com o id do widget </param>
            /// <returns> Booleano que retorna true caso associe com sucesso</returns>
            Widget.prototype.AssociaWidget = function (widget) {
                var self = this;

                // Caso algum dos widgets a associar seja do tipo filtros
                if (self.widgetElemento === "filtros" || gridPrincipal.getWidget(widget).widgetElemento === "filtros") {
                    // Verificar que contexto do widget tem apenas um item do tipo dados, para não redesenhar por cima
                    index = _.findIndex(self.contextoFiltro, function (valor) { return valor === widget; });

                    if (index === -1) {
                        self.contextoFiltro.push(widget);

                        return true;
                    }
                    // Já existe contexto
                    return false;

                } else {
                    // Verificar que contexto do widget tem apenas um item do tipo dados, para não redesenhar por cima
                    index = _.findIndex(self.contexto, function (valor) { return valor === widget; });

                    if (index === -1) {
                        if (self.contexto.length > 0 && self.widgetTipo === "dados") {
                            // Caso tenha outro data contexto, é removido
                            gridPrincipal.getWidget(self.contexto[0]).DesassociaWidget(self.id);

                            // Limpa contexto para apenas ter um widget
                            self.contexto = [];

                        }
                        // Guarda o widget
                        self.contexto.push(widget);

                        return true;
                    }
                    // Já existe contexto
                    return false;

                }
                return false;

            }


            /// <summary>
            /// Remove associacao dos widgets
            /// </summary>
            /// <param name="widget"> STRING do id de widget a ser desassociado </param>
            /// <returns> Booleano que retorna true caso desaassocie com sucesso</returns>
            Widget.prototype.DesassociaWidget = function (widget) {
                var self = this,
                    removido,
                    removidoFiltro,
                    tamanho = self.contexto.length;

                // Método lodash, qualquer item que seja equivalente dentro do self.contexto é removido
                removido = _.remove(self.contexto, function (item) {
                    return widget === item;
                });

                removidoFiltro = _.remove(self.contextoFiltro, function (item) {
                    return widget === item;
                });



                // Caso tenha removido algum widget
                if (removido.length > 0) {
                    gridPrincipal.getWidget(removido[0]).DesassociaWidget(self.id);
                    if (self.widgetTipo === "dados") {
                        alert("O widget " + self.titulo + " foi desassociado de " + gridPrincipal.getWidget(widget).titulo);
                    }
                    // Caso tenha removido algum filtro
                } else if (removidoFiltro.length > 0) {
                    gridPrincipal.getWidget(removidoFiltro[0]).DesassociaWidget(self.id);
                    if (self.widgetTipo === "dados") {
                        alert("O widget " + self.titulo + " foi desassociado de " + gridPrincipal.getWidget(widget).titulo);
                    }

                }



                // Caso não tenha nenhum contexto
                if (self.widgetTipo === "dados" && self.contexto.length === 0) {
                    // Dados passam a 0
                    self.dados = {};

                    self.seriesUtilizadas = [];

                    // Apaga gráfico, pois não tem nenhuma fonte de dados
                    self.RedesenhaGrafico(self.id);

                }

                // Caso o tamanho do contexto seja diferente que o inicial foi desassociado com sucesso
                if (self.contexto.length !== tamanho) {
                    return true;
                }

                return false;

            }


            /// <summary>
            /// Retorna o objectoServidor atualizado deste widget
            /// </summary>
            /// <returns> objecto para meios de comunicação, especificamente guardar a informação do widget </returns>
            Widget.prototype.AtualizaObjectoServidor = function () {
                var self = this,
                    $elemento = $("#" + self.id).parent(),
                    objecto = {};

                // Atualização do widget e o Objecto que comunica com o servidor
                objecto["widgetLargura"] = $elemento.attr("data-gs-width");
                objecto["widgetAltura"] = $elemento.attr("data-gs-height");
                objecto["widgetX"] = $elemento.attr("data-gs-x");
                objecto["widgetY"] = $elemento.attr("data-gs-y");
                objecto["widgetTipo"] = self.widgetTipo;
                objecto["widgetElemento"] = self.widgetElemento;

                objecto["id"] = self.id;
                objecto["descricao"] = self.descricao;
                objecto["modoVisualizacao"] = self.modoVisualizacao;
                objecto["visivel"] = self.visivel;
                objecto["mostraLegenda"] = self.mostraLegenda;
                objecto["mostraToolTip"] = self.mostraToolTip;
                objecto["titulo"] = self.titulo;
                objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;

                objecto["contexto"] = self.contexto;
                objecto["contextoFiltro"] = self.contextoFiltro;

                objecto["agregacoes"] = self.agregacoes;

                if (self.suavizar !== undefined) {
                    objecto["suavizar"] = self.suavizar;
                }

                if (self.widgetTipo === "dados") {
                    objecto["seriesUtilizadas"] = self.getSeriesUtilizadas();
                }

                return objecto;

            }


            /// <summary>
            /// Atualiza o widget com as funções que podem ser alteradas
            /// </summary>
            Widget.prototype.AtualizaObjectoWidget = function () {
                var self = this,
                    $elemento = $("#" + self.id).parent(),
                    objecto = {};

                // Atualizar dimensões do object
                self.altura = $elemento.height();
                self.largura = $elemento.width();

                // Atualização do widget e o Objecto que comunica com o servidor
                self.widgetLargura = $elemento.attr("data-gs-width");
                self.widgetAltura = $elemento.attr("data-gs-height");
                self.widgetX = $elemento.attr("data-gs-x");
                self.widgetY = $elemento.attr("data-gs-y");

                self.visivel = self.visivel;
                self.mostraLegenda = self.mostraLegenda;
                self.mostraToolTip = self.mostraToolTip;
                self.titulo = self.titulo;
                self.ultimaAtualizacao = self.ultimaAtualizacao;

                self.contexto = self.contexto;


                self.agregacoes = self.agregacoes;

                $("#" + self.id).find('[data-toggle="tooltip"]').attr("title", self.descricao);

            }


            /// <summary>
            /// Apaga o gráfico e desenha uma tabela com os dados que o widget contém
            /// </summary>
            Widget.prototype.TransformaWidgetTabela = function () {
                var self = this;
                construtorTabela = new Tabela("tab", "Tabela", self.dados);

                // Remove todos os elementos excepto a navbar
                $("#" + self.id).children().not(".widget-navbar").children().remove();

                if (self.dados !== undefined) {
                    // Constroi tabela dentro do Widget selecionado
                    construtorTabela.seriesUtilizadas = self.seriesUtilizadas;
                    construtorTabela.InsereDadosAlternativo.call(this, self.id, construtorTabela);

                    // Adiciona classe para formatar a tabela dentro do widget
                    $("#" + self.id).find(".wrapper").addClass("visualizaTabela");


                    // Caso não existam dados disponiveis
                } else {
                    $("#" + self.id).find(".wrapper").append("<span class=\"avisoDados-widget\">" + self.dados.dados.Widgets[0].Resultado + "</span>");

                }

            }


            /// <summary>
            /// Expande o widget para ocupar o ecra inteiro
            /// </summary>
            Widget.prototype.ExpandirWidget = function () {
                var self = this,
                    widgetExpandido,
                    opcoesEstilo = "position:relative;top:20px";

                // Cria novo div para dispor o widget ampliado
                if (self.widgetElemento === "gauge") {
                    $("body").prepend("<div id='ecraExpandido-widget'> <span style='float:right; margin-right: 10px; margin-top:5px' class='glyphicon glyphicon-remove removeExpandir' aria-hidden='true'></span> <div class='wrapper' style=" + opcoesEstilo + ";left:12%" + "></div> <div class='legenda'></div> </div>")
                } else {
                    $("body").prepend("<div id='ecraExpandido-widget'> <span style='float:right; margin-right: 10px; margin-top:5px' class='glyphicon glyphicon-remove removeExpandir' aria-hidden='true'></span> <div class='wrapper' style=" + opcoesEstilo + "></div> <div class='legenda'></div> </div>")

                }

                $("body").prepend("<div id='ecraFadeout-widget'></div>");


                // Adicionar o tamanho conforme o tamanho da main-gridstack mais a diferença das barras de navegação
                $("#ecraFadeout-widget").css("height", gridPrincipal.AlturaMaxima());

                // Evento para o botão de remoção do novo gráfico
                self.RemoveExpandir();


                // Cria um objecto para construir o widget em formato ampliado
                widgetExpandido = FabricaClasses("ecraExpandido-widget", self.widgetElemento);
                widgetExpandido.modoVisualizacao = self.modoVisualizacao;

                // Suavizar linhas
                if (self.suavizar !== undefined) {
                    widgetExpandido.suavizar = self.suavizar;
                }

                // Caso o widget expandido seja do tipo gauge
                if (widgetExpandido.widgetElemento === "gauge") {
                    // Passar os valores
                    widgetExpandido.valorAtual = self.valorAtual;
                    widgetExpandido.valorMaximo = self.valorMaximo;
                    widgetExpandido.valorMinimo = self.valorMinimo;
                    widgetExpandido.valorMeta = self.valorMeta;

                    // Construir o gráfico
                    widgetExpandido.ConstroiGrafico();


                    // Senão é tratado como um widget dados
                } else {
                    // Copia os dados do original para objecto criado
                    widgetExpandido.dados = self.dados;
                    widgetExpandido.seriesUtilizadas = self.seriesUtilizadas;
                    // Desenha o gráfico no widget criado
                    widgetExpandido.RedesenhaGrafico("ecraExpandido-widget");

                }


                // Reposiciona o gráfico para se adequar a posição da scrollbar
                $("#ecraExpandido-widget").css("position", "absolute").animate({
                    top: $(window).scrollTop() + 20
                });

            }


            /// <summary>
            /// Evento para o botão de remoção da versão expandida de um widget
            /// </summary>  
            Widget.prototype.RemoveExpandir = function () {
                var self = this;

                $(".removeExpandir").click(function () {
                    $("#ecraFadeout-widget").remove();
                    $("#ecraExpandido-widget").remove();

                })

            }


            /// <summary>
            /// Redesenha completamente o gráfico
            /// </summary>
            /// <param name="id"> Id do widget a ser desenhado </param>
            Widget.prototype.RedesenhaGrafico = function (id) {
                var self = this;

                // Remove todos os elementos excepto a navbar
                $("#" + self.id).children().not(".widget-navbar").children().remove();

                // Caso seja redesenho de tabela para widget
                if ($("#" + self.id).find(".wrapper").hasClass("visualizaTabela")) {
                    // Remover class visualizaTabela
                    $("#" + self.id).find(".wrapper").removeClass("visualizaTabela");

                }

                if (self.widgetTipo === "dados" && self.dados !== undefined) {
                    // caso os dados estejam vazios
                    if (self.dados.dados !== undefined && self.dados.dados.Widgets[0] !== undefined) {
                        // caso tenha items para desenhar
                        if (self.dados.dados.Widgets[0].Items.length != 0) {

                            if (self.widgetElemento === "GraficoPie") {

                                self.ConstroiSVG.call(this, id);
                                self.InsereDados.call(this);
                                self.ConstroiLegenda.call(this);

                            } else {
                                // volta a desenhar o gráfico
                                self.AtualizaDimensoes.call(this);

                                if (!(self.widgetElemento === "Tabela")) {
                                    self.ConstroiSVG.call(this, id, self);
                                    self.ConstroiEixos.call(this);
                                    self.InsereDados.call(this);
                                    self.InsereEixos.call(this);
                                    self.Atualiza.call(this);
                                    self.ConstroiLegenda.call(this);

                                } else {
                                    self.ConstroiGrafico.call(this, id);
                                    self.InsereDados.call(this);
                                    self.Atualiza.call(this);
                                }
                            }

                            if ($("#" + self.id).find(".expandir-widget").length === 0) {
                                self.OpcaoExpandir();
                                self.OpcaoExportar();
                            }

                        } else {
                            $("#" + self.id).find(".wrapper").append("<span class=\"avisoDados-widget\">" + self.dados.dados.Widgets[0].Resultado + "</span>");

                        }
                    } else {
                        // Caso tenha dados
                        if (self.dados.length > 0) {
                            // Caso o pedido tenha recebido dados
                            if (self.dados.resultado.Dados === true) {
                                $("#" + self.id).find(".wrapper").append("<span class=\"avisoDados-widget\">" + self.dados.dados.Widgets[0].Resultado + "</span>");
                            } else {
                                $("#" + self.id).find(".wrapper").append("<span class=\"avisoDados-widget\">" + "Não existem dados" + "</span>");
                            }
                        }
                    }

                }
                

            }


            /// <summary>
            /// Verifica se o widget contém algum "contexto", caso não tenha apresenta um aviso
            /// </summary>
            /// <returns> Retorna true se > 0, caso contrário retorna false </returns>
            Widget.prototype.VerificaContexto = function () {
                var self = this,
                    resposta;

                (self.contexto.length > 0) ? resposta = true : resposta = false;

                return resposta;
            }


            /// <summary>
            /// Verifica se o widget tem um certo widget no seu contexto
            /// </summary>
            /// <param name="widget"> Widget que vai ser comparado </param>
            /// <returns> Retorna true caso estiver contido no widget, false caso contrário
            Widget.prototype.PertenceContexto = function (widget) {
                var self = this,
                    resultado;

                // Caso widget nao seja indefinido
                if (widget !== undefined) {
                    // Para cada item no contexto
                    self.contexto.forEach(function (item) {
                        if (item === widget.id) {
                            // Se tiver o mesmo ID devolver o resultado como  true
                            resultado = true;
                        }
                    });
                }

                (resultado !== true) ? resultado = false : resultado = true;
                return resultado;

            }

            /// <summary>
            /// Verifica se o widget tem um certo widget como seu Filtro
            /// </summary>
            /// <param name="widget"> Widget que vai ser comparado </param>
            /// <returns> Retorna true caso estiver contido no widget, false caso contrário
            Widget.prototype.PertenceFiltro = function (widget) {
                var self = this,
                    resultado;

                // Caso widget nao seja indefinido
                if (widget !== undefined) {
                    // Para cada item no contexto
                    self.contextoFiltro.forEach(function (item) {
                        if (item === widget.id) {
                            // Se tiver o mesmo ID devolver o resultado como  true
                            resultado = true;
                        }
                    });
                }

                (resultado !== true) ? resultado = false : resultado = true;
                return resultado;

            }


            /// <summary>
            /// Averigua se tem contexto data
            /// </summary>
            /// <returns> True se for verdade, false caso contrário, não há contexto data </returns>
            Widget.prototype.VerificaDataContexto = function () {
                var self = this,
                    resposta;

                self.contexto.forEach(function (item) {
                    if (gridPrincipal.getWidget(item).widgetElemento === "datahora_simples") {
                        resposta = true;
                    }
                });

                (resposta === undefined) ? resposta = false : resposta = true;

                return resposta;
            }


            /// <summary>
            /// Averigua se tem contexto Filtro
            /// </summary>
            /// <returns> True se for verdade, false caso contrário, não há contexto data </returns>
            Widget.prototype.VerificaFiltroContexto = function () {
                var self = this,
                    resposta;



                (self.contextoFiltro.length > 0) ? resposta = true : resposta = false;

                return resposta;
            }


            /// <summary>
            /// Atribui a class de acordo com o tipo de widget ao elemento
            /// </summary>
            Widget.prototype.setWidgetClass = function (widgetTipo) {
                var self = this;

                $("#" + self.id).addClass(widgetTipo);
            }


            /// <summary>
            /// Método que adquire a informação da base de dados
            /// </summary>
            /// <param name="opcoes"> Datas </param>
            /// <param name="filtros"> Filtros </param>
            Widget.prototype.setDados = function (opcoes) {
                var self = this,
                    filtros = [];


                self.contextoFiltro.forEach(function (item) {
                    gridPrincipal.getWidget(item).opcoes.forEach(function (opcao) {
                        if (opcao.activo === true) {
                            filtros.push(opcao);
                        }
                    })
                });




                // Push a "pesqusa" do widget
                //filtros.push();

                console.log(self);

                // Trata do pedido
                primerCORE.DashboardDevolveWidget(self, opcoes, filtros, gridPrincipal.idUnico, Utilizador.idUtilizador);

            }


            /// <summary>
            /// Evento que vai modificar o titulo do Widget
            /// </summary>
            Widget.prototype.setTitulo = function (titulo) {
                var self = this;

                // Atribui o titulo
                self.titulo = titulo;
                // Substitui na DOM
                $("#" + self.id).find(".titulo").text(self.titulo);

            }


            /// <summary>
            /// Atualiza o estado das tooltips
            /// </summary>
            Widget.prototype.setTooltip = function () {
                var self = this;

                self.mostraToolTip = !self.mostraToolTip;
            }


            /// <summary>
            /// Atualiza o estado das legendas
            /// </summary>
            Widget.prototype.setLegendas = function () {
                var self = this;

                self.mostraLegenda = !self.mostraLegenda;

            }


            /// <summary>
            /// Atualiza o estado do widget em termos da Tabela
            /// </summary>
            Widget.prototype.setEstadoTabela = function () {
                var self = this;

                self.estadoTabela = !self.estadoTabela;
            }


            /// <summary>
            /// Gets e Sets para a Descricao
            /// </summary>
            Widget.prototype.setDescricao = function (descricao) {
                var self = this;

                self.descricao = descricao;

                $("#" + self.id).find('[data-toggle="tooltip"]').attr("title", self.descricao);
                self.AtualizaTooltipDescricao();

            }
            Widget.prototype.getDescricao = function () {
                var self = this;

                return self.descricao;
            }

            /// <summary>
            /// Gets e Sets para o Contexto
            /// </summary>
            Widget.prototype.setContexto = function (contexto) {
                var self = this;

                self.contexto = contexto;

            }
            Widget.prototype.getContexto = function () {
                var self = this;

                return self.contexto;
            }
            Widget.prototype.setContextoFiltro = function (contexto) {
                var self = this;

                self.contextoFiltro = contexto;

            }
            Widget.prototype.getContextoFiltro = function () {
                var self = this;

                return self.contextoFiltro;
            }


            /// <summary>
            /// Gets e Sets para as Agregacoes
            /// </summary>
            Widget.prototype.setAgregacoes = function (agregacoes) {
                var self = this;

                self.agregacoes = agregacoes
            }
            Widget.prototype.getAgregacoes = function () {
                var self = this;

                return self.agregacoes;
            }


            /// <summary>
            /// Atualizar indicadores
            /// </summary>
            Widget.prototype.getIndicadores = function () {
                var self = this,
                indicadores = [];

                if (self.contexto.length <= 0) {
                    return indicadores;
                    // Caso não seja uma Tabela
                } else if (self.widgetElemento !== "Tabela") {
                    if (self.dadosNormal !== undefined && self.dadosNormal !== null) {
                        // Para cada tipo de valor adicionar ao array de indicadores
                        self.dadosNormal.forEach(function (indicador) {
                            indicadores.push(indicador.name);
                        });
                    }
                } else {
                    // Caso os dados da tabela não estejam vazios
                    if (self.dados !== undefined) {
                        if (self.dados.dados.Widgets[0].Items[0].Valores !== undefined && self.dados.dados.Widgets[0].Items[0].Valores !== null) {
                            self.dados.dados.Widgets[0].Items[0].Valores.forEach(function (indicador) {
                                indicadores.push(indicador.Nome);
                            })
                        }

                    }

                }

                return indicadores;
            }


            /// <summary>
            /// Adicionar uma série
            /// </summary>
            Widget.prototype.AdicionaSerieUtilizada = function (series) {
                var self = this;

                // Limpar seriesUtilizadas
                self.seriesUtilizadas = [];

                // Se os dados não foram nulos ou indefinidos
                //if (self.dados !== undefined && self.dados !== null) {
                //    series.forEach(function (item) {
                //        // Caso o objecto não esteja vazio, ter mais que uma chave
                //        if (Object.keys(self.dados).length > 0) {
                //            // Caso o indicador exista
                //            if (_.findIndex(self.dados.dados.Widgets[0].Items[0].Valores, function (valor) { return valor.Nome === item.ComponenteSerie }) !== -1) {
                //                // Caso não seja repetido
                //                if (_.findIndex(self.seriesUtilizadas, function (valor) { return item.ComponenteSerie === valor.ComponenteSerie }) === -1) {
                //                    self.seriesUtilizadas.push(item);
                //                }
                //            }
                //        }
                //    })


                series.forEach(function (item, curIndex) {
                    if (series.length - 1 > curIndex || series.length === 1) {
                        // Caso o objecto não esteja vazio, ter mais que uma chave
                        if (Object.keys(self.dados).length > 0) {
                            // Se não houver um campo igual existente
                            if (_.findIndex(self.seriesUtilizadas, function (valor) { return item.Campo === valor.Campo }) === -1) {
                                self.seriesUtilizadas.push(item);
                                // Caso haja um campo igual existente, se o seu Indicador for diferente
                            } else if (_.findIndex(self.seriesUtilizadas, function (valor) { return item.ComponenteSerie === valor.ComponenteSerie }) === -1) {
                                self.seriesUtilizadas.push(item);
                            }
                        }
                    }
                });


            }


            /// <summary>
            /// Retorna as séries utilizadas pelo widget
            /// </summary>
            Widget.prototype.getSeriesUtilizadas = function () {
                var self = this;

                return self.seriesUtilizadas;
            }

            /// <summary>
            /// Atualiza  tooltip de descrição de um widget
            /// </summary>
            Widget.prototype.AtualizaTooltipDescricao = function () {
                var self = this;


                $("#" + self.id).find('[data-toggle="tooltip"]').attr("data-original-title", self.descricao);

            }



            /// #Region - Botões

            /// <summary>
            /// Cria o botão para esconder o widget
            /// </summary>
            Widget.prototype.OpcaoEsconder = function () {
                var self = this;

                // Criar botão para simbolizar o update
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"esconde-widget\">" + "Esconde Widget" + "</a></li>");
            }

            /// <summary>
            /// Cria o botão para mostrar os dados de um widget
            /// </summary>
            Widget.prototype.OpcaoMostraDados = function () {
                var self = this;

                // Criar botão para simbolizar o update
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"verTabela-widget\">" + "Ver Tabela" + "</a></li>")
            }

            /// <summary>
            /// Cria o botão e liga o evento de mudança de formato
            /// </summary>
            Widget.prototype.OpcaoUpdate = function () {
                var self = this;

                // Criar botão para simbolizar o update
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"modificaVisualizacao-widget\">" + "Update Widget" + "</a></li>")

                // Atualizar gráfico ao clickar o botão
                $("#" + self.id).on("click", ".modificaVisualizacao-widget", function () {
                    self.Atualiza();
                });
            }

            /// <summary>
            /// Cria o botão para mostrar a legenda de um widget
            /// </summary>
            Widget.prototype.OpcaoLegenda = function () {
                var self = this;

                // Criar botão para simbolizar o "toggle" das legendas
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"legenda-widget\">" + "Ativar Legenda" + "</a></li>");

                // Cria evento para alternar entre legendas visiveis e invisiveis
                $("#" + self.id).find(".legenda-widget").on("click", function () {
                    // Define o widget
                    var $widget = $("#" + self.id);


                    // Atualiza o estado das legendas
                    self.setLegendas();

                    // Caso esteja visivel
                    if ($widget.find(".legenda").is(":visible")) {
                        // Esconder
                        $widget.find(".legenda").hide();
                        // Aumentar o conteudo gráfico
                        $widget.find(".wrapper").css("width", "100%");
                        self.Atualiza();

                        // Caso esteja escondida
                    } else {

                        // Mostra
                        $widget.find(".legenda").show();
                        // Diminui a largura
                        $widget.find(".wrapper").css("width", "80%");
                        self.Atualiza();

                    }

                });
            }

            /// <summary>
            /// Cria o botão para mostrar/esconder as tooltips
            /// </summary>
            Widget.prototype.OpcaoTooltip = function () {
                var self = this;

                // Criar botão para simbolizar o "toggle" das legendas
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"tooltip-widget\">" + "Ativar tooltip" + "</a></li>");

                $("#" + self.id).find(".dropdown-menu").on("click", ".tooltip-widget", function () {
                    self.setTooltip();
                    self.Atualiza();
                });
            }

            /// <summary>
            /// Opção para "interpolar"/suavizar o gráfico
            /// </summary>
            Widget.prototype.OpcaoSuavizarLinhas = function () {
                var self = this;

                // Criar botão para simbolizar o "toggle" das legendas
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"suavizaLinhas-widget\">" + "Suavizar Linhas" + "</a></li>");

                $("#" + self.id).find(".dropdown-menu").on("click", ".suavizaLinhas-widget", function () {
                    //  Modifica o tipo de visualização
                    self.suavizar = !self.suavizar;

                    self.SuavizarLinhas(self.suavizar);
                    self.objectoServidor = self.AtualizaObjectoServidor();
                    self.Atualiza();

                });
            }

            /// <summary>
            /// Cria o botao para "expandir" o widget para ecra inteiro
            /// </summary>
            Widget.prototype.OpcaoExpandir = function () {
                var self = this;

                // Criar botão para simbolizar o "toggle" das legendas
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"expandir-widget\">" + "Expandir" + "</a></li>");

                $("#" + self.id).find(".dropdown-menu").on("click", ".expandir-widget", function () {
                    self.ExpandirWidget();
                });

            }

            /// <summary>
            /// Cria o botao para exportar os dados do widget
            /// </summary>
            Widget.prototype.OpcaoExportar = function () {
                var self = this;

                // Criar botão para simbolizar o "toggle" das legendas
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"exportar-widget\">" + "Exportar" + "</a></li>");

                $("#" + self.id).find(".dropdown-menu").on("click", ".exportar-widget", function () {
                    self.downloadCSV();
                });

            }


            /// #Region 



            /// #Region -  Eventos


            /// <summary>
            /// Evento que vai modificar o nome caso o utilizador o queira
            /// </summary>
            Widget.prototype.ModificaTitulo = function () {
                var self = this;

                // Ligamos o evento ao botão do widget
                $("#" + self.id).on("click", ".edita-widget", function () {
                    // Ao clicar chama o método setTitulo
                    self.setTitulo(prompt("Digite o titulo que pretende", "titulo"));
                });

            }


            /// <summary>
            /// Método para adicionar class widget-ativo, para mostrar que o widget está em foco
            /// </summary>
            Widget.prototype.setAtivo = function () {
                var self = this;

                // Ao clickar no widget especifico
                $("#" + self.id).click(function () {


                    if (!($(this).hasClass("widget-ativo"))) {
                        // Remove todos os que estão ativos anteriormente
                        $(this).parent().parent().find(".widget-ativo").removeClass("widget-ativo");

                        // Caso haja Grids ativas
                        if ($("#main-gridstack").hasClass("widget-ativo")) {

                            $("#main-gridstack").removeClass("widget-ativo");
                            PropertyGrid.RemoveGrid();

                        }

                        // Adiciona a class ativo ao widget
                        $(this).addClass('widget-ativo');

                        // Remove o aviso de não haver nenhum widget/dashboard selecionado
                        PropertyGrid.TogglePropertyGrid();

                        // Substitui o titulo na propertyGrid
                        PropertyGrid.SetWidgetPropertyGrid(self.titulo, self.id, self.widgetElemento);

                        // Mostra a propertyGrid
                        PropertyGrid.MostraPropertyGrid(self.widgetElemento);


                        // "Puxa" widget atual para o topo da lista, por motivos de imposição de CSS
                        $(".widget-ativo").parent().appendTo($(".widget-ativo").parent().parent());


                        // Modo Tabela
                        //$(".opcoes-propriedades").css("display", "block");
                    }

                });

            }


            /// <summary>
            /// Remove class widget-ativo
            /// </summary>
            Widget.prototype.RemoveAtivo = function () {
                var self = this;

                // Ao clickar no documento
                $(document).on("click", function (event) {

                    // Caso o widget tenha a class que simboliza um widget ativo
                    if ($("#" + self.id).hasClass("widget-ativo")) {
                        // Se o target for diferente de qualquer elemento no widget
                        if (!($(event.target).is($("#" + self.id).find("*"))) && !($(event.target).is($(".propriedades-sidebar").find("*")))) {
                            // Se o ID do target não foi um botão da propertyGrid
                            if (!($(event.target)[0].id === "pgButton")) {

                                // Remover a class ativo do widget
                                $("#" + self.id).removeClass("widget-ativo");


                                // Caso a main-grid esteja ativa não será possivel remover a grid
                                if (!($("#main-gridstack").hasClass("widget-ativo"))) {
                                    // Remove propertyGrid atual
                                    PropertyGrid.RemoveGrid();

                                }

                                // Faz "Reset" nas boxes de opção da propertyGrid
                                //$(".opcoes-propertyGrid").find(".box-propriedades").removeClass("box-ativo");
                                //$("[value='geral']").addClass("box-ativo");

                            }
                        }
                    }
                });

            }


            /// <summary>
            /// Método para adicionar class widget-aviso, para mostrar que está algo incorrecto com o widget
            /// </summary>
            Widget.prototype.setAviso = function () {
                var self = this;

                $("#" + self.id).addClass("widget-aviso");

            }


            /// <summary>
            /// Remove class widget-aviso
            /// </summary>
            Widget.prototype.RemoveAviso = function () {
                var self = this;

                $("#" + self.id).RemoveClass("widget-aviso");

            }


            /// #Region



            /// #Region  -  Verificações

            /// <summary>
            /// Verifica se o widget tem series para serem mostradas
            /// </summary>
            Widget.prototype.VerificaSeries = function () {
                var self = this;

                // Aviso caso não existam séries
                if (self.seriesUtilizadas.length === 0) {
                    // Remove svg
                    $("#" + self.id).find("svg").remove();

                    // Remove aviso anterior caso exista
                    $("#" + self.id).find(".avisoDados-widget").remove();


                    // Adicionar aviso
                    $("#" + self.id).find(".wrapper").prepend("<span class=\"avisoDados-widget\">" + self.dados.dados.Widgets[0].Resultado + "</span>");

                }

            }


            /// #Region



            /// #Region - Exportação de widgets

            /// <summary>
            /// Passa os dadosEscolhidos de um dado widget para formato CSV, retorna o CSV
            /// </summary>
            /// <returns> uma string no formato CSV dos valores dos dadosEscolhidos do widget </returns>
            Widget.prototype.ExportaWidget = function () {
                var self = this,
                    dados = [],
                    datas = [],
                    chave = [],
                    saltarColuna,
                    array,
                    nomeColunas = "",
                    str = '';


                if (self.widgetElemento === "Tabela") {
                    self.dadosAnalisados.forEach(function (item) {

                    });

                    // Adquire o nome das colunas através dos dados escolhidos
                    chave = Object.keys(self.dadosAnalisados[0]);

                    //  Adiciona a uma string, separado por ; cada coluna
                    chave.forEach(function (item, curIndex) {
                            nomeColunas += item + ";";

                    });

                    // Fim de linha
                    nomeColunas += '\r\n';

                    array = self.dadosAnalisados

                    // Vai adquirir todos os dados e formata-los para uma unica string, cada linha representa
                    // um "ponto" de informação
                    for (var curIndex = 0; curIndex < array.length; curIndex++) {
                        var line = '';

                        // Para cada parametro dentro do "valor" atual
                        for (var index in array[curIndex]) {
                            if (index !== "yStacked") {
                                // Caso o valor não esteja vazio, adiciona o separador
                                if (line != '') line += ';'

                                // Caso o parametro seja uma data
                                if (array[curIndex][index] instanceof Date) {
                                    line += array[curIndex][index].getFullYear() + "/" + array[curIndex][index].getMonth() + 1 + "/" + array[curIndex][index].getDate() + " " +
                                         array[curIndex][index].getHours() + ":" + array[curIndex][index].getMinutes() + ":" + array[curIndex][index].getSeconds()

                                } else {
                                    line += array[curIndex][index];
                                }
                            }
                        }

                        // Adiciona o resultado do valor mais o final de linha
                        str += line + '\r\n';
                    }

                    // Retorna as colunas mais os seus valores
                    return nomeColunas + str;


                } else {

                    self.dadosEscolhidos.forEach(function (item) {
                        console.log(item);
                        chave.push(item.name);
                        nomeColunas += (item.name + ";");

                    })

                    // Adiciona coluna Data
                    nomeColunas += "Data;";
                    nomeColunas += '\r\n';

                    for (curIndex = 0; curIndex < self.dadosEscolhidos[0].values.length; curIndex++) {
                        var line = '',
                            date;

                        // Para cada indicador
                        chave.forEach(function (item, index) {
                            if (line != '') line += ";";

                            line += self.dadosEscolhidos[index].values[curIndex].y;

                        });

                        // Adquirir data de celula atual
                        date = self.dadosEscolhidos[0].values[curIndex].date;

                        // Adicionar separador
                        line += ";";
                        line += date.getFullYear() + "/" + date.getMonth() + 1 + "/" + date.getDate() + " " +
                                         date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        
                        str += line + '\r\n';
                    }

                    // Retorna as colunas mais os seus valores
                    return nomeColunas + str;

                }

            }


            /// <summary>
            /// Faz o download do CSV escolhido
            /// </summary>
            /// <param name="args"> Nome do ficheiro </param>
            Widget.prototype.downloadCSV = function (args) {
                var self = this,
                    data,
                    filename,
                    link,
                    csv = self.ExportaWidget(),
                    date = new Date();

                // Caso o CSV seja nulo
                if (csv == null) return;


                // Se o nome do ficheiro for inválido, fica como export.csv por defeito
                filename = self.titulo + "_" + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate() + ".csv";


                if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + 'sep=;\r\n' + csv;
                }

                data = encodeURI(csv);
                console.log(csv)

                link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();

                //$('<a href="data:' + data + '" download="data.csv">download CSV</a>').appendTo('body')

            }


            /// #Region


            /// Retorna o objeto
            return Widget;


        })();



        /// <summary>
        /// Classe Gráfico de Área
        /// Module Pattern
        /// </summary>
        var GraficoArea = (function () {
            var series,
                escalaY,
                escalaX,
                transformaX,
                transformaY,
                area,
                stack,
                dadosNormal,
                dadosStacked,
                valores,
                pontos,
                chave = [],
                color = d3.scale.category20c(),
                nomeEixoX = "Eixo X",
                nomeEixoY = "Eixo Y",
                modoVisualizacao = "normal",  // stacked
                suavizar = false,
                parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse,
                formatPercent = d3.format(".0%");

            /// <summary>
            /// Método construtor para a classe GraficoArea, chama o construtor do Widget
            /// </summary>
            function GraficoArea(el, titulo) {
                // Construtor de Widget é chamado
                Widget.call(this, el, titulo);

                // Inicializar elementos widget
                this.modoVisualizacao = "normal";
                this.widgetTipo = "dados";
                this.widgetElemento = "GraficoArea";

                // Inicializar elementos restantes objecto servidor
                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "graficoArea";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];
                this.objectoServidor["suavizar"] = false;

                this.chave = [];

                this.suavizar = false;

                this.dadosEscolhidos = [];

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(GraficoArea, Widget);


            /// <summary>
            /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
            /// </summary>
            GraficoArea.prototype.InsereDados = function () {
                var self = this,
                    objectoAuxiliar;


                // Largura de cada rectangulo, de acordo com o tamanho de dados do widget
                larguraRect = ($("#" + self.id).width() / self.dados.dados.Widgets[0].Items.length);


                //if (self.modoVisualizacao === "stacked") {
                //    stack = d3.layout.stack()
                //        .values(function (d) { return d.values; });
                //}


                // Update nos paths do gráfico
                // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                self.area = d3.svg.area()
                    // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                    .x(function (d) { return self.transformaX(d.date); })
                    // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                    .y0(function (d) { return self.altura; })
                    // Devolve o "Y" de cada valor no objecto Dados de acordo com a escala Y
                    .y1(function (d) { return self.transformaY(d.y); });


                if (self.modoVisualizacao === "stacked") {
                    self.area
                        // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                        .y0(function (d) { return self.transformaY(d.y0); })
                        // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                        .y1(function (d) { return self.transformaY(d.y0 + d.y); });
                }


                // Inicia controlo de cores padrão to-do
                // Controla as keys (Series) que vão estar contidas no gráfico
                color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));



                // Caso esteja em modo Stacked
                if (self.modoVisualizacao === "stacked") {

                    // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
                    // Recorre ao método stack do d3
                    self.dadosNormal = (color.domain().map(function (name) {
                        return {
                            // Atribuir nome da chave
                            name: name,
                            // Mapear os valores
                            values: self.dados.dados.Widgets[0].Items.map(function (d) {
                                var arrayValores = [],
                                    arrayDatas = [],
                                    index;

                                //Encontrar index do parametro atual
                                index = _.findIndex(d.Valores, function (valor) { return valor.Nome === name; });


                                // Devolve objecto
                                return {
                                    y: +d.Valores[index].Valor,
                                    date: parseDate(d.Data),
                                    tipo: self.widgetElemento,
                                    nome: name
                                };
                            })
                        }
                    }));

                    // "Reset" ao array da chave
                    self.chave = [];

                    // Adquirir valor máximo de cada uma das chaves(keys)
                    self.dadosNormal.forEach(function (item) {
                        self.chave.push(d3.max(item.values, function (d) { return d.y; }));
                    });

                    self.DesenhaSerie();

                    // Caso esteja em modo normal
                } else {
                    // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
                    self.dadosNormal = color.domain().map(function (name) {
                        return {
                            // Atribuir nome da chave (Serie)
                            name: name,
                            // Mapear os valores
                            values: self.dados.dados.Widgets[0].Items.map(function (d) {
                                var arrayValores = [],
                                    arrayDatas = [],
                                    index;

                                // Encontrar index do parametro atual
                                index = _.findIndex(d.Valores, function (valor) { return valor.Nome === name; });


                                // Devolve objecto
                                return {
                                    y: +d.Valores[index].Valor,
                                    date: parseDate(d.Data),
                                    tipo: self.widgetElemento,
                                    nome: name

                                };
                            })
                        }
                    });

                    // "Reset" ao array da chave
                    self.chave = [];

                    // Adquirir valor máximo de cada uma das chaves(keys)
                    self.dadosNormal.forEach(function (item) {
                        self.chave.push(d3.max(item.values, function (d) { return d.y; }));
                    });


                    self.transformaY.domain([0, d3.max(self.chave)]);

                    // Atualizar eixo depois de dados inseridos
                    self.transformaX.domain(d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));


                    // Passar os dados para dentro de um objecto para serem facilmente lidos pelos métodos d3
                    //valores = [{ values: self.dadosNormal }];

                    self.DesenhaSerie();

                }

            }


            /// <summary>
            /// Desenha as séries que foram selecionadas pelo utilizador (seriesUtilizadas)
            /// </summary>
            /// TODO
            /// incompleto
            GraficoArea.prototype.DesenhaSerie = function () {
                var self = this,
                    index,
                    id = 0;


                // Fazer "reset" aos dados utilizados anteriormente
                self.dadosEscolhidos = [];


                // Remove as séries anteriores
                $("#" + self.id).find(".series").remove();
                $("#" + self.id).find(".pontos").remove();

                // Para cada serie utilizada
                self.seriesUtilizadas.forEach(function (item) {
                    // Descobrir quais as que têm o valor de indicador correto
                    index = _.findIndex(self.dadosNormal, function (serie) { return serie.name === item.Campo })
                    if (index !== -1) {

                        // Adiciona um numero a cada série para ser facilmente identificada
                        self.dadosNormal[index]["Numero"] = id++;
                        self.dadosNormal[index]["Nome"] = item.Nome;

                        self.dadosEscolhidos.push(self.dadosNormal[index]);

                    }
                });


                // Caso esteja em modo normal (Agrupado)
                if (self.modoVisualizacao !== "stacked") {

                    // Acrescentar ao SVG
                    dados = self.svg.selectAll(".dados")
                                    .data(self.dadosEscolhidos)
                                  .enter().append("g")
                                    .attr("class", "dados")
                                  // Atribui o nome da série a um atributo 
                                    .attr("value", function (d) { return d.Nome; })
                                    .attr("numero", function (d) { return d.Numero; });

                    // Verificar o tipo de linha do widget
                    self.SuavizarLinhas(self.suavizar);


                    // Grupo das tooltips
                    self.pontos = self.svg.append("g")
                        .attr("class", "pontos");


                    // Circulo que apresenta o "foco" do utilizador
                    self.pontos.append("circle")
                        .attr("class", "circuloFoco")
                        .style("fill", "none")
                        .style("stroke", "red")
                        .style("stroke-width", "2")
                        .attr("r", 20)
                            .style("display", "none");


                    // Para cada objecto ( Ponto )
                    self.dadosEscolhidos.forEach(function (item, curIndex) {

                        // Para cada "variável"
                        self.pontos.selectAll(".ponto" + curIndex)
                            // Ligar o valor dos pontos
                            .data(item.values)
                          // Inserir rectangulo
                          .enter().append("rect")
                            .attr("class", "ponto" + curIndex)
                            .attr("x", function (d) { return self.transformaX(d.date) - larguraRect / 4; })
                            .attr("y", function (d) { return self.transformaY(d.y); })
                            .attr("width", (larguraRect / 2))
                            .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                            .style("opacity", "0");

                    });

                    // Acrescenta o desenho do gráfico
                    dados.append("path")
                        .attr("class", "area")
                        .attr("title", "")
                        // Chamar area() para desenhar de acordo o "path" com os valores
                        .attr("d", function (d) { return self.area(d.values); })
                        // Adiciona tooltips
                        .style("fill", function (d) { return color(d.Nome); })


                    // Caso esteja em modo Stacked
                } else {

                    // "Define" a função do d3 para "empilhar" os valores
                    stack = d3.layout.stack()
                        .values(function (d) { return d.values; });

                    // Conforme os valores dados faz os cálculos para atribuir valores a y0 e y1 para se empilharem
                    self.dadosEscolhidos = stack(self.dadosEscolhidos);

                    // Acrescentar ao SVG
                    dados = self.svg.selectAll(".dados")
                                    .data(self.dadosEscolhidos)
                                  .enter().append("g")
                                    .attr("class", "dados")
                                  // Atribui o nome da série a um atributo 
                                    .attr("value", function (d) { return d.Nome; })
                                    .attr("numero", function (d) { return d.Numero; });

                    // Verificar o tipo de linha do widget
                    self.SuavizarLinhas(self.suavizar);


                    // Grupo das tooltips
                    self.pontos = self.svg.append("g")
                        .attr("class", "pontos");


                    // Circulo que apresenta o "foco" do utilizador
                    self.pontos.append("circle")
                        .attr("class", "circuloFoco")
                        .style("fill", "none")
                        .style("stroke", "red")
                        .style("stroke-width", "2")
                        .attr("r", 20)
                            .style("display", "none");


                    // Atualizar eixo depois de dados inseridos
                    self.transformaX.domain(d3.extent(self.dadosEscolhidos[0].values, function (d) { return d.date; }));


                    // Para cada objecto ( Ponto )
                    self.dadosEscolhidos.forEach(function (item, curIndex) {
                        // Para cada "variável"
                        self.pontos.selectAll(".ponto" + curIndex)
                            // Ligar o valor dos pontos
                            .data(item.values)
                          // Inserir rectangulo
                          .enter().append("rect")
                            .attr("class", "ponto" + curIndex)
                            .attr("x", function (d) { return self.transformaX(d.date) - larguraRect / 4; })
                            .attr("y", function (d) { return self.transformaY(d.y0 + d.y); })
                            .attr("width", (larguraRect / 2))
                            .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                            .style("opacity", "0");

                    });


                    // Acrescenta o desenho do gráfico
                    dados.append("path")
                        .attr("class", "area")
                        .attr("title", "")
                        // Chamar area() para desenhar de acordo o "path" com os valores
                        .attr("d", function (d) { return self.area(d.values); })
                        // Adiciona tooltips
                        .style("fill", function (d) { return color(d.Nome); })


                }

                // Verifica se existem séries
                self.VerificaSeries();

            }


            /// <summary>
            /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
            /// </summary>
            GraficoArea.prototype.ConstroiEixos = function () {

                var self = this;

                // TESTE ATUAL

                var customTimeFormat = d3.time.format.multi([
                  [".%L", function (d) { return d.getMilliseconds(); }],
                  [":%S", function (d) { return d.getSeconds(); }],
                  ["%I:%M", function (d) { return d.getMinutes(); }],
                  ["%I %p", function (d) { return d.getHours(); }],
                  ["%a %d", function (d) { return d.getDay() && d.getDate() != 1; }],
                  ["%b %d", function (d) { return d.getDate() != 1; }],
                  ["%B", function (d) { return d.getMonth(); }],
                  ["%Y", function () { return true; }]
                ]);



                // to-do
                // nome? data
                // teste1? valores


                // Atribui valores a Y conforme a sua escala
                self.transformaX = d3.time.scale()
                    // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
                    //.domain(self.dados.map(function (d) { return d.nome; }))
                    // Intervalo de valores que podem ser atribuidos, conforme o dominio
                    .range([0, self.largura]);

                // Construtor do Eixo dos X
                self.escalaX = d3.svg.axis()
                  .scale(self.transformaX)
                  // Orientação da escala
                  .orient("bottom")
                  .tickFormat(customTimeFormat);

                // Atribui valores a Y conforme a sua escala
                self.transformaY = d3.scale.linear()
                  //.domain([0, d3.max(self.dados, function (d) { return d.teste1; })])
                  .range([self.altura, 0]);

                // Construtor do Eixo dos Y
                self.escalaY = d3.svg.axis()
                  .scale(self.transformaY)
                  .orient("left");

                // Adiciona escala em formato percentagem
                //if (self.modoVisualizacao === "stacked") {
                //    self.escalaY
                //        .tickFormat(formatPercent);
                //}
            }


            /// <summary>
            /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
            /// </summary>
            GraficoArea.prototype.AtualizaEixos = function () {
                var valores,
                    self = this,
                    intervaloData = (d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));

                // Atribui valores a Y conforme a sua escala
                self.transformaX = d3.time.scale()
                    // Intervalo de valores que podem ser atribuidos, conforme o dominio
                    .range([0, $("#" + self.id).find(".wrapper").width() - self.margem.esquerda])
                    // Mapeia o dominio conforme a a data disponivel nos dad
                    .domain(d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));

                if (self.modoVisualizacao === "stacked") {
                    // Atribui valores a Y conforme a sua escala
                    self.transformaY = d3.scale.linear()
                        // Para stack não é preciso domain
                        .domain([0, d3.sum(self.chave)])
                        .range([self.altura, 0]);

                } else {
                    self.transformaY = d3.scale.linear()
                        .domain([0, d3.max(self.chave)])
                        .range([self.altura, 0]);

                }


                //// Atualização da escala dos Eixos
                self.escalaX.scale(self.transformaX);
                self.escalaY.scale(self.transformaY);


                // Estabelecer limites para os ticks dos widgets na escala X
                self.escalaX.ticks(self.dados.dados.Widgets[0].length);


                // Utiliza um formato compacto (50, 500, 5k, 50k, 500k, 5M, etc.. )
                self.escalaY.tickFormat(d3.format("s"));


                // Numero de representações nos eixos de acordo com o tamanho do widget
                if (self.altura > self.TamanhoLimite) {
                    self.escalaY.ticks(10);
                }
                if (self.altura <= self.TamanhoLimite) {
                    self.escalaY.ticks(5);
                }
                if (self.altura <= (self.TamanhoLimite - 100)) {
                    self.escalaY.ticks(3);
                }


                // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
                if (self.largura > self.TamanhoLimite) {
                    //ATUAL----
                    //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
                }
                // Caso seja menor ou igual, apenas dispões os numeros pares
                if (self.largura <= self.TamanhoLimite) {
                    self.escalaX.ticks(4);
                }
                // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
                if (self.largura < (self.TamanhoLimite - 100)) {
                    //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
                }


                // Atualização do eixo dos X
                self.svg.select(".x.axis")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0 ," + self.altura + ")")
                    .call(self.escalaX)
                .selectAll("text")
                  .attr("dx", "-2em")
                  .attr("dy", ".5em")
                  .attr("transform", "rotate(-35)");

                // Atualiza Nome do eixo do X
                // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                if (self.mostraLegenda === true) {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura * 0.8 - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                } else {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                }

                // Atualização do eixo dos Y
                self.svg.select(".y.axis")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0 , 0)")
                    .call(self.escalaY);


                // LIMITES PARA INSERIR OS EIXOS
                // Se a altura do widget for menor
                if (self.altura <= 180) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text(nomeEixoY);
                }
                // Se a altura do widget for menor
                if (self.largura <= 250) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text(nomeEixoX);
                }

            }




            /// <summary>
            /// Inserção dos eixos no SVG do widget
            /// </summary>
            GraficoArea.prototype.InsereEixos = function () {
                var self = this;


                if (self.modoVisualizacao === "stacked") {
                    // Insere eixo dos X (Stacked)
                    self.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + self.margem.esquerda + "," + self.altura + ")")
                        .call(self.escalaX);

                    // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                    if (self.mostraLegenda === true) {
                        self.svg.append("text")
                            .attr("class", "nomeEixoX")
                            .attr("dx", self.largura * 0.8 - 10)
                            .attr("dy", self.altura - 5)
                            .style("text-anchor", "end")
                                .text(nomeEixoX);
                    } else {
                        self.svg.append("text")
                            .attr("class", "nomeEixoX")
                            .attr("dx", self.largura - 10)
                            .attr("dy", self.altura - 5)
                            .style("text-anchor", "end")
                                .text(nomeEixoX);
                    }

                    // Insere eixo dos Y (Stacked)
                    self.svg.append("g")
                        .attr("class", "y axis")
                        .call(self.escalaY)
                    .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                            .text(nomeEixoY);


                } else {

                    // Append Escala do X
                    self.svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + self.altura + ")")
                        .call(self.escalaX);


                    // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                    if (self.mostraLegenda === true) {
                        self.svg.append("text")
                            .attr("class", "nomeEixoX")
                            .attr("dx", self.largura * 0.8 - 10)
                            .attr("dy", self.altura - 5)
                            .style("text-anchor", "end")
                                .text(nomeEixoX);
                    } else {
                        self.svg.append("text")
                            .attr("class", "nomeEixoX")
                            .attr("dx", self.largura - 10)
                            .attr("dy", self.altura - 5)
                            .style("text-anchor", "end")
                                .text(nomeEixoX);
                    }


                    // Append Escala do Y e Eixo
                    self.svg.append("g")
                        .attr("class", "y axis")
                        .call(self.escalaY)
                      .append("text")
                        .attr("class", "nomeEixoY")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                            .text(nomeEixoY);

                }

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            GraficoArea.prototype.ConstroiGrafico = function (id) {
                var self = this;


                // To-do Query? Get Query?
                //self.setDados($.parseJSON(getDados(self, "age")));

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("area");

                //Atualiza dimensoes atuais
                //self.AtualizaDimensoes();
                //self.ConstroiSVG(id, self);
                //self.ConstroiEixos();
                //self.InsereDados();


                //self.InsereEixos();
                //self.Atualiza();

                // Insere Botões na navbar
                self.OpcaoLegenda();
                self.OpcaoTooltip();
                self.OpcaoMostraDados();

                // Exportar dados
                //self.OpcaoExportar();

                self.OpcaoSuavizarLinhas();

                // Liga evento de modificar visualização ao gráfico
                self.ModificaVisualizacao();

                // Liga evento para modificar titulo
                self.ModificaTitulo();

                self.setAtivo();
                self.RemoveAtivo();

                //self.ConstroiLegenda();
            }


            /// <summary>
            /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados
            /// </summary>
            GraficoArea.prototype.Renderiza = function () {
                var self = this;


                // Atualizar dimensões conforme a "widget"
                self.AtualizaDimensoes();

                // Atualiza SVG
                d3.select("#" + self.id).select(".wrapper svg")
                    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                    .attr("height", self.altura + self.margem.cima + self.margem.baixo);


                // Atualizar escala - para dentro do atualiza to-do
                self.AtualizaEixos();

            }


            /// <summary>
            /// Cria a legenda do gráfico, procura por "desenhos"(gráficos) e para cada um deles cria uma legenda apropriada
            /// </summary>
            GraficoArea.prototype.ConstroiLegenda = function () {
                var self = this,
                    series = $("#" + self.id).find(".wrapper").find(".dados").length,
                    legenda,
                    nomesLegenda = [];



                // Inserir SVG legenda
                legenda = d3.select("#" + self.id).select(".legenda").insert("svg");

                // Para cada index
                for (var index = 0; index < series; index++) {
                    // Selecionar o index no DOM
                    var nome = $("#" + self.id + " .wrapper").find(".dados:eq(" + index + ")").attr("value");

                    // Adicionar circulo "legenda"
                    legenda.append("circle")
                        .attr("r", 5)
                        .attr("cx", 15)
                        .attr("cy", 15 + 20 * index)
                        .style("fill", color(nome));

                    //$(".legenda").prepend("<span style='float:right; padding-top:4px'>" + nome + "</span>")

                    legenda.append("text")
                        .attr("x", 30)
                        .attr("y", ((15 + 20 * index) + 5))
                        .text(nome);

                }



                //legenda = d3.select("#" + self.id).select(".legenda").insert("svg");

                //for (var i = 0; i < series; i++) {
                //    legenda.append("circle")
                //        .attr("r", 5)
                //        .attr("cx", 15)
                //        .attr("cy", 15 + 20 * i)
                //        .style("fill", color(color.domain()[i]));

                //    legenda.append("text")
                //        .attr("x", 30)
                //        .attr("y", ((15 + 20 * i) + 5))
                //        .text(color.domain()[i]);

                //}

            }



            /// <summary>
            /// Método que atualiza os elementos que representam os dados
            /// atualiza os elementos dentro do SVG do widget
            /// </summary>
            GraficoArea.prototype.Atualiza = function () {
                var self = this,

                // Largura de cada rectangulo, de acordo com o tamanho de dados do widget
                larguraRect = ($("#" + self.id).width() / self.dados.dados.Widgets[0].Items.length);

                // Pintar gráfico
                self.Renderiza();

                // Atualizar os dados
                // Seleciona todos os elementos com class .area e liga-os aos dados
                self.svg.selectAll(".area")
                    .attr("d", function (d) { return self.area(d.values); })
                    .style("fill", function (d) { return color(d.Nome); });

                // Caso esteja modo visualização stacked
                if (self.modoVisualizacao === "stacked") {

                    // Para cada objecto ( Ponto )
                    self.dadosEscolhidos.forEach(function (item, curIndex) {

                        // Largura de cada rectangulo, de acordo com o tamanho do widget

                        // Para cada "variável"
                        self.pontos.selectAll(".ponto" + curIndex)
                            // Ligar o valor dos pontos
                            .data(item.values)
                          // Inserir rectangulo
                            .attr("x", function (d) { return self.transformaX(d.date) - larguraRect / 4; })
                            .attr("y", function (d) { return self.transformaY(d.y0 + d.y); })
                            .attr("width", (larguraRect / 2))
                            .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                                .style("opacity", "0");
                        // Compensar margem para eixo dos Y
                        //.attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");


                        // Adicionar tooltip
                        if (self.mostraToolTip === true) {
                            self.pontos.selectAll(".ponto" + curIndex)
                            .on("mouseover", tip.show)
                            .on("mouseout", tip.hide);

                        } else {
                            self.pontos.selectAll(".ponto" + curIndex)
                            .on("mouseover", function () { })
                            .on("mouseout", function () { });
                        }

                        // Marcas no gráfico
                        // Mostra a marca no gráfico
                        //// to-do  !!!
                        //// Mostra circulo/ponto onde o utilziar está focado
                        // d3.select("."+self.id).select(".circuloFoco").style("display", null)
                        //// Adicionar metade da largura de um rectangulo para centrar o ponto
                        //    .attr("transform", "translate(" + ((parseInt($(this).attr("x")) + larguraRect / 2) + self.margem.esquerda) + "," + $(this).attr("y") + ")");

                        //// Cria uma marca auxiliar no gráfico
                        //d3.select(this.parentNode).append("rect")
                        //    .attr("class", "marcaAuxiliar")
                        //    .attr("x", (parseInt($(this).attr("x")) + self.margem.esquerda))
                        //    .attr("y", $(this).attr("y"))
                        //    .attr("width", "2")
                        //    .attr("height", (self.altura - $(this).attr("y")))
                        //    .style("fill", "red");

                        // Mostra a marca do ponto
                        // Esconde circulo/ponto
                        //d3.select("." + self.id).select(".circuloFoco").style("display", "none");

                        // Remove marca auxiliar
                        //d3.select(".marcaAuxiliar").remove();


                    });

                } else {

                    // Para cada objecto ( Ponto )
                    self.dadosEscolhidos.forEach(function (item, curIndex) {
                        // Para cada "variável"
                        self.pontos.selectAll(".ponto" + curIndex)
                            // Ligar o valor dos pontos
                            .data(item.values)
                          // Inserir rectangulo
                            .attr("x", function (d) { return self.transformaX(d.date) - larguraRect / 4; })
                            .attr("y", function (d) { return self.transformaY(d.y); })
                            .attr("width", (larguraRect / 2))
                            .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                                .style("opacity", "0");
                        // Compensar margem para eixo dos Y
                        //.attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");

                        // Adicionar tooltip
                        if (self.mostraToolTip === true) {
                            self.pontos.selectAll(".ponto" + curIndex)
                            .on("mouseover", tip.show)
                            .on("mouseout", tip.hide);

                        } else {
                            self.pontos.selectAll(".ponto" + curIndex)
                            .on("mouseover", function () { })
                            .on("mouseout", function () { });
                        }

                        // to-do MARCAS no gráfico?

                    });
                }

            }


            /// <summary>
            /// Suaviza as linhas do gráfico através da interpolação
            /// </summary>
            GraficoArea.prototype.SuavizarLinhas = function (suavizar) {
                var self = this;

                //suavizarLinhas = !suavizarLinhas;

                if (self.modoVisualizacao !== "stacked") {
                    if (suavizar === true) {
                        // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                        self.area = d3.svg.area()
                            // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                            .x(function (d) { return self.transformaX(d.date); })
                            // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                            .y0(function (d) { return self.altura; })
                            // Devolve o "Y" de cada valor no objecto Dados de acordo com a escala Y
                            .y1(function (d) { return self.transformaY(d.y); })
                            .interpolate("basis");

                    } else {
                        // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                        self.area = d3.svg.area()
                            // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                            .x(function (d) { return self.transformaX(d.date); })
                            // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                            .y0(function (d) { return self.altura; })
                            // Devolve o "Y" de cada valor no objecto Dados de acordo com a escala Y
                            .y1(function (d) { return self.transformaY(d.y); })

                    }
                } else {
                    if (suavizar === true) {
                        // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                        self.area = d3.svg.area()
                            // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                            .x(function (d) { return self.transformaX(d.date); })
                            // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                            .y0(function (d) { return self.transformaY(d.y0); })
                            // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                            .y1(function (d) { return self.transformaY(d.y0 + d.y); })
                            .interpolate("basis");

                    } else {
                        self.area = d3.svg.area()
                            // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                            .x(function (d) { return self.transformaX(d.date); })
                            // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                            .y0(function (d) { return self.transformaY(d.y0); })
                            // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                            .y1(function (d) { return self.transformaY(d.y0 + d.y); })
                    }
                }

            }


            /// <summary>
            /// Modifica entre os vários tipos de visualização
            /// </summary
            GraficoArea.prototype.ModificaVisualizacao = function () {
                var self = this;

                // Cria botão para sinalizar o modo visualizacao
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"modificaVisualizacao-widget\">" + "Modifica Visualizacao" + "</a></li>")

                // Ao pressionar o botão modificaVisualizacao-widget, troca entre visualizações
                $("#" + self.id).on("click", ".modificaVisualizacao-widget", function () {

                    // Caso esteja em modo grouped ( Agrupado )
                    if (self.modoVisualizacao !== "normal") {
                        self.modoVisualizacao = "normal";

                        self.RedesenhaGrafico(self.id);

                    }
                        // Caso esteja em modo stacked ( Empilhado )
                    else {
                        if (self.modoVisualizacao !== "stacked") {
                            self.modoVisualizacao = "stacked";

                            self.RedesenhaGrafico(self.id);

                        }
                    }
                });

            }


            /// Retorna o objecto criado
            return GraficoArea;

        })();



        /// <summary>
        /// Classe Gráfico de Barras
        /// Module Pattern
        /// </summary>
        var GraficoBarras = (function () {
            var series,
                dadosAnalisados,
                valores,
                chave = [],
                escalaOriginal,
                escalaSecundaria,
                escalaY,
                escalaX,
                transformaX,
                transformaX1,
                transformaY,
                nomeEixoX = "Eixo X",
                nomeEixoY = "Eixo Y",
                modoVisualizacao = "normal",
                parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse,
                selecao,
                color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
                chave = [];

            /// <summary>
            /// Método construtor para a classe GraficoBarras, chama o construtor do Widget
            /// </summary>
            function GraficoBarras(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
                this.modoVisualizacao = "grouped";
                this.widgetTipo = "dados";
                this.widgetElemento = "GraficoBarras";

                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "GraficoBarras";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];

                this.dadosEscolhidos = [];

                this.chave = []
            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(GraficoBarras, Widget);


            /// <summary>
            /// Diferente da class Widget, pois precisa de mais espaço do que os outros gráfico de dados
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            GraficoBarras.prototype.ConstroiSVG = function (id, self) {
                var selector;

                self.svg = d3.select("#" + id).select(".wrapper").insert("svg")
                    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                    .attr("height", self.altura + self.margem.cima + self.margem.baixo)
                  .append("g")
                    .attr("transform", "translate(" + self.margem.esquerda / 2 + "," + self.margem.cima / 2 + ")");


                self.svg.call(tip);

            }


            /// <summary>
            /// Passa o gráfico para modo Grouped ( Agrupado )
            /// desenha todas as barras novamente e calcula o máximo, para os eixos depois serem ajustados
            /// </summary>
            GraficoBarras.prototype.Agrupa = function () {
                var self = this;

                self.AtualizaEixos();

                self.dadosEscolhidos.forEach(function (item, curIndex) {
                    self.selecao.selectAll(".barra" + curIndex)
                        .attr("x", function (d, curIndex) { return escalaSecundaria(d.nome); })
                    .transition("grouped")
                        .attr("y", function (d) { return transformaY(d.y); })
                        .attr("width", escalaSecundaria.rangeBand())
                        .attr("height", function (d) { return self.altura - transformaY(d.y); })
                        // Translação da data, mais o pequeno desvio do eixo (margem)
                        .attr("transform", function (d) { return "translate(" + (escalaOriginal(d.date) + self.margem.esquerda / 2) + ",0)"; })
                        .style("fill", function (d) { return color(d.nome); });

                })

                // Adicionar tooltip
                if (self.mostraToolTip === true) {
                    self.selecao.selectAll("rect")
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);

                } else {
                    self.selecao.selectAll("rect")
                    .on("mouseover", function () { })
                    .on("mouseout", function () { });
                }

            }


            /// <summary>
            /// Passa o gráfico para o modo Stacked ( Empilhado )
            /// Desenha novamente o gráfico e retira o atributo X, para o caso de estar em modo grouped
            /// </summary>
            GraficoBarras.prototype.Empilha = function () {
                var self = this;

                // Atualiza o dominio Y
                transformaY.domain([0, d3.max(self.dados, function (d) { return d.total; })]);


                // Atribui o valor "yStacked" que é a soma de todas as barras anteriores para que seja possivel
                // a concretização do tipo e gráfico stacked
                // Para cada data
                for (var index = 0; self.dadosEscolhidos[0].values.length > index; index++) {
                    // Para cada série
                    for (var indexSeries = 1; self.dadosEscolhidos.length > indexSeries ; indexSeries++) {
                        // Adicionar ao yStacked a soma entre o y e o yStacked anteriores
                        self.dadosEscolhidos[indexSeries].values[index].yStacked = self.dadosEscolhidos[indexSeries - 1].values[index].y + self.dadosEscolhidos[indexSeries - 1].values[index].yStacked;
                    }
                }


                self.AtualizaEixos();


                self.dadosEscolhidos.forEach(function (item, curIndex) {

                    // Para todas as barras com numero curIndex
                    self.selecao.selectAll(".barra" + curIndex)
                        // "Remover" atributo X, caso tenha sido atribuido quando estava em modo Grouped
                        .attr("x", null)
                    //.transition("grouped")
                        .attr("y", function (d, valorAtual) { return transformaY(d.y + d.yStacked); })
                        .attr("width", escalaOriginal.rangeBand())
                        .attr("height", function (d, valorAtual) { return self.altura - transformaY(d.y); })
                        // Translação da data, mais o pequeno desvio do eixo (margem)
                        .attr("transform", function (d) { return "translate(" + (escalaOriginal(d.date) + self.margem.esquerda / 2) + ",0)"; })
                        .style("fill", function (d) { return color(d.nome); });
                })

                // Adicionar tooltip
                if (self.mostraToolTip === true) {
                    self.selecao.selectAll("rect")
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);

                } else {
                    self.selecao.selectAll("rect")
                    .on("mouseover", function () { })
                    .on("mouseout", function () { });
                }


            }

            /// <summary>
            /// Desenha as séries que foram selecionadas pelo utilizador (seriesUtilizadas)
            /// </summary>
            /// TODO
            /// incompleto
            GraficoBarras.prototype.DesenhaSerie = function () {
                var self = this,
                    index,
                    id = 0,
                    dadosEscolhidos = [],
                    color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
                    listaSeries = [];


                // Remove as séries anteriores
                $("#" + self.id).find(".series").remove();


                // Guarda o nome de cada série para "filtrar"
                self.dadosNormal.forEach(function (item) {
                    listaSeries.push(item.name);
                });

                // Como está a ser guardado os dados temporariamente no widget, é necessário limpar sempre que ocorre o desenhaSerie
                self.dadosEscolhidos = [];

                // Para cada serie utilizada
                self.seriesUtilizadas.forEach(function (item) {
                    // Descobrir quais as que têm o valor de indicador correto
                    index = _.findIndex(self.dadosNormal, function (serie) { return serie.name === item.Campo })
                    if (index !== -1) {
                        // Adiciona um numero a cada série para ser facilmente identificada
                        self.dadosNormal[index]["Numero"] = id++;
                        self.dadosNormal[index]["Nome"] = item.Nome;


                        self.dadosEscolhidos.push(self.dadosNormal[index]);

                    }
                });

                // Atualizar eixo X
                escalaOriginal
                    .rangeRoundBands([0, self.largura], 0.1)
                    .domain(self.dadosNormal[0].values.map(function (d) { return d.date; }));

                // Atualizar eixo secundário X
                escalaSecundaria
                    .domain(listaSeries).rangeRoundBands([0, escalaOriginal.rangeBand()]);


                // Criar elemento "g" para cada representação
                self.selecao = self.svg.append("g")
                    .attr("class", "dados")


                // Caso seja modo Stacked (Empilhado)
                if (self.modoVisualizacao === "stacked") {

                    // Para cada "serie" criar as barras necessárias para complementar o atributo data
                    // desse elemento
                    self.dadosEscolhidos.forEach(function (item, curIndex) {
                        // Adicionar "barras" ao gráfico
                        self.selecao.selectAll(".barra" + curIndex)
                            .data(item.values)
                        .enter().append("rect")
                            .attr("class", "barra" + curIndex)
                            .attr("x", function (d) { return escalaOriginal(d.date); })
                            .attr("y", function (d) { return transformaY(d.y); })
                            // rangeBand() - Função que divide o espaço em "bandas" equivalentes
                            .attr("width", escalaOriginal.rangeBand())
                            .attr("height", function (d) { return self.altura - transformaY(d.y); })
                                .style("fill", function (d) { return color(d.name); })
                                // Atribuir tooltips
                                .on("mouseover", tip.show)
                                .on("mouseout", tip.hide);

                    })
                }


                // Caso seja modo Grouped ( Agrupado )
                if (self.modoVisualizacao === "grouped") {

                    // Para cada "serie" criar as barras necessárias para complementar o atributo data
                    // desse elemento
                    self.dadosEscolhidos.forEach(function (item, curIndex) {
                        // Adicionar "barras" ao gráfico
                        self.selecao.selectAll(".barra" + curIndex)
                            .data(item.values)
                        .enter().append("rect")
                            .attr("class", "barra" + curIndex)
                            .attr("x", function (d, curIndex) { return escalaOriginal(d.date); })
                            .attr("y", function (d) { return transformaY(d.y); })
                            // rangeBand() - Função que divide o espaço em "bandas" equivalentes
                            .attr("width", escalaSecundaria.rangeBand())
                            .attr("height", function (d) { return self.altura - transformaY(d.y); })
                            .style("fill", function (d, curIndex) { return color(item.name); })
                               // Atribuir tooltips
                               .on("mouseover", tip.show)
                               .on("mouseout", tip.hide);

                    })
                }

                // Verifica se existem séries
                self.VerificaSeries();

            }

            /// <summary>
            /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
            /// </summary>
            GraficoBarras.prototype.InsereDados = function () {
                var self = this,
                    objectoAuxiliar,
                    listaSeries = [];


                // Controla as keys (Series) que vão estar contidas no gráfico
                color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));



                // Criar novo array de objectos para guardar a informação de uma forma mais fácil de utilizar
                self.dadosNormal = color.domain().map(function (name, curIndex) {
                    return {
                        // Atribuir nome a chave (Serie)
                        name: name,
                        // Mapear os valores
                        values: self.dados.dados.Widgets[0].Items.map(function (d) {
                            var arrayvalores = [],
                                arrayDatas = [],
                                index;

                            // Encontrar index do parametro atual
                            index = _.findIndex(d.Valores, function (valor) { return valor.Nome === name; });


                            return {
                                nome: name,
                                y: +d.Valores[index].Valor,
                                yStacked: 0,
                                tipo: self.widgetElemento,
                                date: parseDate(d.Data)

                            };
                        })
                    }
                });


                // Reset no parametro chave
                self.chave = [];

                // Adquirir valor máximo de cada uma das séries (chave)
                self.dadosNormal.forEach(function (item) {
                    self.chave.push(d3.max(item.values, function (d) { return d.y; }))
                });


                // Ajustar escalas de acordo com o máximo
                transformaY.domain([0, d3.max(self.chave)]);


                //// Guarda o nome de cada série para "filtrar"
                //self.dadosAnalisados.forEach(function (item) {
                //    listaSeries.push(item.name);
                //});


                self.DesenhaSerie();



                //// Atualizar eixo X
                //escalaOriginal
                //    .rangeRoundBands([0, self.largura], 0.1)
                //    .domain(self.dadosAnalisados[0].values.map(function (d) { return d.date; }));

                //// Atualizar eixo secundário X
                //escalaSecundaria
                //    .domain(listaSeries).rangeRoundBands([0, escalaOriginal.rangeBand()]);


                //// Criar elemento "g" para cada representação
                //self.selecao = self.svg.append("g")
                //    .attr("class", "dados")


                //// Caso seja modo Stacked (Empilhado)
                //if (self.modoVisualizacao === "stacked") {

                //    // Para cada "serie" criar as barras necessárias para complementar o atributo data
                //    // desse elemento
                //    self.dadosAnalisados.forEach(function ( item, curIndex) {
                //        // Adicionar "barras" ao gráfico
                //        self.selecao.selectAll("rect")
                //            .data(item.values)
                //        .enter().append("rect")
                //            .attr("class", "barra"+curIndex)
                //            .attr("x", function (d) { return escalaOriginal(d.date); })
                //            .attr("y", function (d) { return transformaY(d.y); })
                //            // rangeBand() - Função que divide o espaço em "bandas" equivalentes
                //            .attr("width", escalaOriginal.rangeBand())
                //            .attr("height", function (d) { return self.altura - transformaY(d.y); })
                //                .style("fill", function (d) { return color(d.name); })
                //                // Atribuir tooltips
                //                .on("mouseover", tip.show)
                //                .on("mouseout", tip.hide);

                //    })
                //}


                //// Caso seja modo Grouped ( Agrupado )
                //if (self.modoVisualizacao === "grouped") {

                //    // Para cada "serie" criar as barras necessárias para complementar o atributo data
                //    // desse elemento
                //    self.dadosAnalisados.forEach(function (item, curIndex) {
                //        self.selecao.selectAll(".barra"+curIndex)
                //            .data(item.values)
                //        .enter().append("rect")
                //            .attr("class", "barra"+curIndex)
                //            .attr("x", function (d, curIndex) { return escalaOriginal(d.date); })
                //            .attr("y", function (d) { return transformaY(d.y); })
                //            // rangeBand() - Função que divide o espaço em "bandas" equivalentes
                //            .attr("width", escalaSecundaria.rangeBand())
                //            .attr("height", function (d) { return self.altura - transformaY(d.y); })
                //            .style("fill", function (d, curIndex) { return color(item.name); })
                //               // Atribuir tooltips
                //               .on("mouseover", tip.show)
                //               .on("mouseout", tip.hide);

                //    })
                //}

            }


            /// <summary>
            /// Método que atualiza o gráfico, p.ex a sua escala ou os dados
            /// </summary>
            GraficoBarras.prototype.Atualiza = function () {
                var self = this

                //self.RedesenhaGrafico(self.id);

                //// Pintar gráfico
                self.Renderiza();

                // Caso esteja em modo Stacked ( Empilhado )
                if (self.modoVisualizacao === "stacked") {
                    //TODO
                    //console.log("")

                    // Muda de modo
                    self.Empilha();

                }


                // Caso esteja em modo Grouped ( Agrupado )
                if (self.modoVisualizacao === "grouped") {
                    // Muda de modo
                    self.Agrupa();

                }

            }


            /// <summary>
            /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
            /// </summary>
            GraficoBarras.prototype.ConstroiEixos = function () {
                var self = this;

                // Escala original do eixo dos X
                escalaOriginal = d3.scale.ordinal()
                        .rangeRoundBands([0, self.largura], 0.1);


                // Escala secundária por causa do "agrupamento das barras"
                escalaSecundaria = d3.scale.ordinal();


                // Construtor do Eixo dos X
                self.escalaX = d3.svg.axis()
                  .scale(escalaOriginal)
                  // Orientação da escala
                  .orient("bottom");


                // Atribui valores a Y conforme a sua escala
                transformaY = d3.scale.linear()
                  // to-do numero?
                  //.domain([0, d3.max(self.dados, function (d) { return d.numero; })])
                  .range([self.altura, 0]);


                // Construtor do Eixo dos Y
                self.escalaY = d3.svg.axis()
                  .scale(transformaY)
                  .orient("left")
                // Formato dos ticks
                //.tickFormat(d3.format(".2s"));

            }


            /// <summary>
            /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
            /// </summary>
            GraficoBarras.prototype.AtualizaEixos = function () {
                var self = this,
                    intervaloData = (d3.extent(self.dadosNormal[0].values, function (d) { return d.date; })),
                    listaSeries = [];

                // Guarda os nomes de todas as séries
                self.dadosNormal.forEach(function (item) {
                    listaSeries.push(item.name);
                });

                // Atualizar escala original
                escalaOriginal
                    .rangeRoundBands(([0, $("#" + self.id).find(".wrapper").width() - self.margem.esquerda]), 0.1)
                    .domain(self.dadosNormal[0].values.map(function (d) { return d.date; }));

                // Atualizar escala secundária
                escalaSecundaria
                    .domain(listaSeries).rangeRoundBands([0, escalaOriginal.rangeBand()]);


                // Caso o modo seja stacked ( Empilhado )
                if (self.modoVisualizacao === "stacked") {

                    // Cria lista de total de somas para cada Data
                    var soma = 0,
                        listaTotal = [];

                    for (var indexValores = 0; indexValores < self.dadosNormal[0].values.length; indexValores++) {
                        for (var index = 0; index < self.dadosNormal.length; index++) {
                            soma += self.dadosNormal[index].values[indexValores].y;
                        }
                        listaTotal.push(soma);
                        soma = 0;
                    }

                    console.log(listaTotal);


                    // Atribui valores a Y conforme a sua escala
                    transformaY = d3.scale.linear()
                        .domain([0, d3.max(listaTotal)])
                        .range([self.altura, 0]);

                }

                // Caso o modo seja grouped ( Agrupado )
                if (self.modoVisualizacao === "grouped") {
                    // Atualiza o dominio
                    transformaY.domain([0, d3.max(self.chave)])
                    .range([self.altura, 0]);

                }


                // Atualização da escala dos Eixos
                self.escalaX.scale(escalaOriginal);
                self.escalaY.scale(transformaY);

                // Utiliza um formato compacto (50, 500, 5k, 50k, 500k, 5M, etc.. )
                self.escalaY.tickFormat(d3.format("s"));


                // Atualiza Nome do eixo do X
                // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                if (self.mostraLegenda === true) {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura * 0.8 - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                } else {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                }


                // LIMITES PARA INSERIR OS EIXOS
                // Se a altura do widget for menor
                if (self.altura <= 180) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text(nomeEixoY);
                }
                // Se a altura do widget for menor
                if (self.largura <= 250) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text(nomeEixoX);
                }


                // Numero de representações nos eixos de acordo com o tamanho do widget
                if (self.altura > self.TamanhoLimite) {
                    self.escalaY.ticks(10);
                }
                if (self.altura <= self.TamanhoLimite) {
                    self.escalaY.ticks(5);
                }
                if (self.altura <= (self.TamanhoLimite - 100)) {
                    self.escalaY.ticks(2);
                }

                // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
                if (self.largura > self.TamanhoLimite) {
                    //self.escalaX.tickValues(transformaX.domain());
                }
                // Caso seja menor ou igual, apenas dispões os numeros pares
                if (self.largura <= self.TamanhoLimite) {
                    self.escalaX.ticks(4);
                }
                // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
                if (self.largura < (self.TamanhoLimite - 100)) {
                    //escalaX.tickValues(transformaX.domain().filter(function (d, i) { return !(i % 5); }));
                }

                // TODO
                self.escalaX.tickFormat(function (d) { return d.getYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); })

                // Atualização do eixo dos X
                self.svg.select(".x.axis")
                    .attr("class", "x axis")
                   // Translacção menos 5 pixeis para haver espaço para as letras no eixo do X
                  .attr("transform", "translate(" + self.margem.esquerda / 2 + " ," + self.altura + ")")
                  .call(self.escalaX)
                .selectAll("text")
                  .attr("dx", "-2em")
                  .attr("dy", ".5em")
                  .attr("transform", "rotate(-35)");

                // Atualização do eixo dos Y
                self.svg.select(".y.axis")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + self.margem.esquerda / 2 + " , 0)")
                  .call(self.escalaY);

            }


            /// <summary>
            /// Inserção dos eixos no SVG do widget
            /// </summary>
            GraficoBarras.prototype.InsereEixos = function () {
                var self = this;

                // Acrescentar no g a escala Y e o seu nome to-do
                self.svg.append("g")
                  .attr("class", "y axis")
                  .call(self.escalaY)
                // Insere nome do eixo do Y
                .append("text")
                  .attr("class", "nomeEixoY")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(nomeEixoY);


                // Acrescentar no g a escala X  e o seu nome
                self.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + self.altura + ")")
                  .call(self.escalaX)
                    .selectAll("text")
                    .attr("dx", "-2em")
                    .attr("dy", ".5em")
                    .attr("transform", "rotate(-35)");

                // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                if (self.mostraLegenda === true) {
                    self.svg.append("text")
                        .attr("class", "nomeEixoX")
                        .attr("dx", self.largura * 0.8 - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                } else {
                    self.svg.append("text")
                        .attr("class", "nomeEixoX")
                        .attr("dx", self.largura - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                }

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            GraficoBarras.prototype.ConstroiGrafico = function (id) {
                var self = this;

                // to-do
                // nome?
                // teste1?

                //// to-do Query? Get Query?
                //self.setDados($.parseJSON(getDados(self, "age")));

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("barras");

                // Atualiza dimensoes atuais
                //self.AtualizaDimensoes();
                //self.ConstroiSVG(id, self);
                //self.ConstroiEixos();
                //self.InsereDados();

                //self.InsereEixos();
                //self.Atualiza();

                // Cria botões na navbar
                self.OpcaoLegenda();
                self.OpcaoTooltip();
                self.OpcaoMostraDados();

                // Exportar dados
                //self.OpcaoExportar();

                // Liga o evento de mudar o tipo de gráfico de barras ( stacked/grouepd)
                self.OpcaoModificaVisualizacao();

                // Liga evento para modificar titulo
                self.ModificaTitulo();

                self.setAtivo();
                self.RemoveAtivo();

                // Constroi a legenda do gráfico
                //self.ConstroiLegenda();
            }


            /// <summary>
            /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados
            /// </summary>
            GraficoBarras.prototype.Renderiza = function () {
                var self = this;


                // Atualizar dimensões conforme a "widget"
                self.AtualizaDimensoes();


                //update svg para novas dimensões
                d3.select("#" + self.id).select(".wrapper svg")
                    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                    .attr("height", self.altura + self.margem.cima + self.margem.baixo);

                // Atualizar escala - para dentro do atualiza to-do
                self.AtualizaEixos();

            }


            /// <summary>
            /// Cria a legenda do gráfico, procura por "desenhos"(gráficos) e para cada um deles cria uma legenda apropriada
            /// </summary>
            GraficoBarras.prototype.ConstroiLegenda = function () {
                var self = this,
                    series = self.seriesUtilizadas.length,
                    legenda;

                //color.domain(d3.keys(self.dados[0]).filter(function (key) { return key !== "date"; }));
                legenda = d3.select("#" + self.id).select(".legenda").insert("svg");

                for (var i = 0; i < series; i++) {
                    legenda.append("circle")
                        .attr("r", 5)
                        .attr("cx", 15)
                        .attr("cy", 15 + 20 * i)
                        .style("fill", color(color.domain()[i]));

                    legenda.append("text")
                        .attr("x", 30)
                        .attr("y", ((15 + 20 * i) + 5))
                        .text(self.dadosNormal[i].Nome);

                }

                // Cria evento para alternar entre legendas visiveis e invisiveis
                $("#" + self.id).find(".legenda").on("click", function () {

                    // Define o widget
                    var $widget = $("#" + self.id);


                    // Atualiza o estado das legendas
                    self.setLegendas();


                    // Caso esteja visivel
                    if ($widget.find(".legenda").is(":visible")) {
                        // Esconder
                        $widget.find(".legenda").hide();
                        // Aumentar o conteudo gráfico
                        $widget.find(".wrapper").css("width", "100%");
                        self.Atualiza();
                        // Caso esteja escondida
                    } else {
                        // Mostra
                        $widget.find(".legenda").show();
                        // Diminui a largura
                        $widget.find(".wrapper").css("width", "80%");
                        self.Atualiza();
                    }

                });
            }


            /// <summary>
            /// Modifica entre os vários tipos de visualização
            /// </summary
            GraficoBarras.prototype.OpcaoModificaVisualizacao = function () {
                var self = this;

                // Cria botão para sinalizar o modo visualizacao
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"modificaVisualizacao-widget\">" + "Modifica Visualizacao" + "</a></li>")

                // Ao pressionar o botão modificaVisualizacao-widget, troca entre visualizações
                $("#" + self.id).on("click", ".modificaVisualizacao-widget", function () {

                    // Caso esteja em modo grouped ( Agrupado )
                    if (self.modoVisualizacao !== "grouped") {
                        self.modoVisualizacao = "grouped";
                        self.Atualiza();
                    }
                        // Caso esteja em modo stacked ( Empilhado )
                    else {
                        if (self.modoVisualizacao !== "stacked") {
                            self.modoVisualizacao = "stacked";
                            self.Atualiza();
                        }
                    }
                });

            }


            /// Retorna o objecto criado
            return GraficoBarras;

        })();



        /// <summary>
        /// Classe Gráfico de Linhas
        /// Module Pattern
        /// </summary>
        var GraficoLinhas = (function () {
            var dataNest,
                series,
                color,
                escalaY,
                escalaX,
                transformaX,
                transformaY,
                linha,
                dadosNormal,
                color = d3.scale.category20(),
                chave = [],
                nomeEixoX = "Eixo X",
                nomeEixoY = "Eixo Y",
                modoVisualizacao = "normal",
                suavizar = false,
                linhasConexao = "false",
                circulos = "false",
                parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;


            /// <summary>
            /// Método construtor para a classe GraficoLinhas, chama o construtor do Widget
            /// </summary>
            function GraficoLinhas(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
                this.modoVisualizacao = "normal";
                this.widgetTipo = "dados";
                this.widgetElemento = "GraficoLinhas";

                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "graficoLinhas";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];

                this.chave = [];

                this.suavizar = false;

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(GraficoLinhas, Widget);


            /// <summary>
            /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
            /// </summary>
            GraficoLinhas.prototype.InsereDados = function () {
                var self = this;


                //self.captura = self.svg.append("g")
                //    .attr("class", "capturas");

                // Grupo das tooltips
                self.pontos = self.svg.append("g")
                    .attr("class", "pontos");

                // Circulo que apresenta o "foco" do utilizador
                self.pontos.append("circle")
                    .attr("class", "circuloFoco")
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", "2")
                    .attr("r", 20)
                        .style("display", "none");


                // Update nos paths do gráfico
                // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                self.linha = d3.svg.line()
                    // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                    .x(function (d) { return self.transformaX(d.date); })
                    // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                    .y(function (d) { return self.transformaY(d.y); });


                // Inicia controlo de cores padrão to-do
                // Controla as keys (Series) que vão estar contidas no gráfico
                color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));

                // Modificar??
                //if (!(self.dados[0].date instanceof Date)) {
                //    // Para cada objecto vamos analisar a data
                //    self.dados.forEach(function (d) {
                //        // MELHORAR, modificar entre graficos
                //        d.date = parseDate(d.date);
                //    });
                //}

                // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
                self.dadosNormal = color.domain().map(function (name) {
                    return {
                        // Atribuir nome da chave
                        name: name,
                        // Mapear os valores
                        values: self.dados.dados.Widgets[0].Items.map(function (d) {
                            var arrayValores = [],
                                arrayDatas = [],
                                index;

                            //Encontrar index do parametro atual
                            index = _.findIndex(d.Valores, function (valor) { return valor.Nome === name; });


                            // Devolve objecto
                            return {
                                nome: name,
                                y: +d.Valores[index].Valor,
                                tipo: self.widgetElemento,
                                date: parseDate(d.Data)

                            };
                        })
                    }
                });

                // "Limpa" a chave para poder recalcular com novos dados
                self.chave = [];

                // Adquirir valor máximo de cada uma das chaves
                self.dadosNormal.forEach(function (item, i) {
                    self.chave.push(d3.max(item.values, function (d) { return d.y; }));
                });


                //// Seleciona todas as series
                //series = self.svg.selectAll(".series")
                //   // Liga os elementos aos dados dataNest
                //  .data(self.dadosNormal)
                //// Acrescenta séries, caso não hajam suficientes para representar dataNest
                //.enter().append("g")
                //  .attr("class", "series");

                //// Acrescenta um path para cada série
                //series.append("path")
                //  .attr("class", "linha")
                //  // Componente D3(area) devolve o path calculado de acordo com os valores
                //  .attr("d", function (d) { return linha(d.values); })
                //    // Uma cor é automaticamente escolhida de acordo com o componente color, para cada key
                //    .style("stroke", function (d) { return color(d.name); })
                //    .style("stroke-width", "2px")
                //    .style("fill", "none");

                //self.DesenhaSerie();


            }


            /// <summary>
            /// Desenha as séries que foram selecionadas pelo utilizador (seriesUtilizadas)
            /// </summary>
            GraficoLinhas.prototype.DesenhaSerie = function () {
                var self = this,
                    index,
                    id = 0;
                dadosEscolhidos = [],
                larguraRect = ($("#" + self.id).width() / self.dados.dados.Widgets[0].Items.length);

                self.dadosEscolhidos = [];


                // Remove as séries anteriores
                $("#" + self.id).find(".series").remove();

                // Para cada serie utilizada
                self.seriesUtilizadas.forEach(function (item) {
                    // Descobrir quais as que têm o valor de indicador correto
                    index = _.findIndex(self.dadosNormal, function (serie) { return serie.name === item.Campo })
                    if (index !== -1) {

                        // Adiciona um numero a cada série para ser facilmente identificada
                        self.dadosNormal[index]["Numero"] = id++;
                        self.dadosNormal[index]["Nome"] = item.Nome;

                        self.dadosEscolhidos.push(self.dadosNormal[index]);
                    }
                });


                // Seleciona todas as series
                series = self.svg.selectAll(".series")
                   // Liga os elementos aos dados 
                  .data(self.dadosEscolhidos)
                // Acrescenta séries, caso não hajam suficientes para representar dataNest
                .enter().append("g")
                  .attr("class", "series")
                  // Atribui o nome da série a um atributo 
                  .attr("value", function (d) { return d.Nome; })
                  .attr("numero", function (d) { return d.Numero; });


                // Acrescenta um path para cada série
                series.append("path")
                  .attr("class", "linha")
                  // Componente D3(area) devolve o path calculado de acordo com os valores
                  .attr("d", function (d) { return self.linha(d.values); })
                    // Uma cor é automaticamente escolhida de acordo com o componente color, para cada key
                    .style("stroke", function (d) { return color(d.Nome); })
                    .style("stroke-width", "2px")
                    .style("fill", "none");


                // Verificar se os dados existem e insere os pontos
                if (self.dadosEscolhidos.length > 0) {
                    // Para cada série
                    self.dadosEscolhidos.forEach(function (item, curIndex) {
                        self.pontos.selectAll(".ponto" + curIndex)
                        .data(item.values)
                      .enter().append("circle")
                        .attr("class", "sinalizaPonto ponto" + curIndex)
                        .attr("r", 15)
                        .attr("cx", function (d) { return self.transformaX(d.date); })
                        .attr("cy", function (d) { return self.transformaY(d.y); })
                            .attr('pointer-events', 'all')
                            .attr("fill", "red")
                            .style("visibility", "hidden")
                        .on("mouseover", tip.show)
                        .on("mouseout", tip.hide)

                        // TODO - Largura rect???

                        //self.captura.selectAll(".rect" + curIndex)
                        //    .data(item.values)
                        //.enter().append("rect")
                        //    .attr("class", "rect" + curIndex)
                        //    .attr("width", larguraRect)
                        //    .attr("height", function (d) { return self.altura; })
                        //    .attr("x", function (d) { return self.transformaX(d.date); })
                        //    .attr("y", function (d) { return self.transformaY(d.y); })
                        //        .attr('pointer-events', 'all')
                        //        .style("opacity", "0");

                    });

                }

                // Verificar o tipo de linha do widget
                self.SuavizarLinhas(self.suavizar);


                // Verifica existência de séries
                self.VerificaSeries();

            }


            /// <summary>
            /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
            /// </summary>
            GraficoLinhas.prototype.ConstroiEixos = function () {
                var self = this;

                // to-do
                // dadosSelecionados?
                // nome? data
                // teste1? valores

                // Atribui valores a Y conforme a sua escala
                self.transformaX = d3.time.scale()
                    // Intervalo de valores que podem ser atribuidos, conforme o dominio
                    .range([0, self.largura])
                // Mapeia o dominio conforme a a data disponivel nos dad

                // Construtor do Eixo dos X
                self.escalaX = d3.svg.axis()
                  .scale(self.transformaX)
                  // Orientação da escala
                  .orient("bottom");

                // Atribui valores a Y conforme a sua escala
                self.transformaY = d3.scale.linear()
                  // to-do numero?
                  //.domain([0, d3.max(self.dados, function (d) { console.log(d); return d.y; })])
                  .range([self.altura, 0]);

                // Construtor do Eixo dos Y
                self.escalaY = d3.svg.axis()
                  .scale(self.transformaY)
                  .orient("left");
                //.ticks(10);

            }


            /// <summary>
            /// Atualização dos eixos através da construção de escalas novas, incluindo o método da área
            /// </summary>
            GraficoLinhas.prototype.AtualizaEixos = function () {
                var self = this;

                // Atribui valores a X conforme a sua escala
                self.transformaX = d3.time.scale()
                    // Intervalo de valores que podem ser atribuidos, conforme o dominio
                    .range([0, $("#" + self.id).find(".wrapper").width() - self.margem.esquerda])
                    // Mapeia o dominio conforme a data disponivel nos dados
                    .domain(d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));


                // Atribui valores a Y conforme a sua escala
                self.transformaY = d3.scale.linear()
                    .domain([0, d3.max(self.chave)])
                    .range([self.altura, 0]);

                // Atualização da escala dos Eixos
                self.escalaX.scale(self.transformaX);
                self.escalaY.scale(self.transformaY);


                // Estabelecer limites para os ticks dos widgets na escala X
                self.escalaX.ticks(self.dados.dados.Widgets[0].length);

                // Utiliza um formato compacto (50, 500, 5k, 50k, 500k, 5M, etc.. )
                self.escalaY.tickFormat(d3.format("s"));


                // Atualiza Nome do eixo do X
                // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                if (self.mostraLegenda === true) {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura * 0.8 - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                } else {
                    self.svg.select(".nomeEixoX")
                        .attr("dx", self.largura - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                }


                // LIMITES PARA INSERIR OS EIXOS
                // Se a altura do widget for menor
                if (self.altura <= 180) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoY")
                        .text(nomeEixoY);
                }
                // Se a altura do widget for menor
                if (self.largura <= 250) {
                    // Remover nomeEixo
                    // melhorar a visualização
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text("");
                } else {
                    // Senão, voltar a adicionar o nome
                    d3.select("#" + self.id).select(".nomeEixoX")
                        .text(nomeEixoX);
                }




                // Numero de representações nos eixos de acordo com o tamanho do widget
                if (self.altura > self.TamanhoLimite) {
                    self.escalaY.ticks(10);
                }
                if (self.altura <= self.TamanhoLimite) {
                    self.escalaY.ticks(6);
                }
                if (self.altura <= (self.TamanhoLimite - 100)) {
                    self.escalaY.ticks(4);
                }

                // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
                if (self.largura > self.TamanhoLimite) {

                }
                // Caso seja menor ou igual, apenas dispões os numeros pares
                if (self.largura <= self.TamanhoLimite) {
                    self.escalaX.ticks(4);
                }
                // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
                if (self.largura < (self.TamanhoLimite - 100)) {

                }

                // Atualização do eixo dos X
                self.svg.select(".x.axis")
                  // Translacção menos 5 pixeis para haver espaço para as letras no eixo do X
                  .attr("transform", "translate(0," + (self.altura) + ")")
                  .call(self.escalaX)
                .selectAll("text")
                  .attr("dx", "-2em")
                  .attr("dy", ".5em")
                  .attr("transform", "rotate(-35)");

                // Atualização do eixo dos Y
                self.svg.select(".y.axis")
                  .call(self.escalaY);

            }


            /// <summary>
            /// Inserção dos eixos no SVG do widget
            /// </summary>
            GraficoLinhas.prototype.InsereEixos = function () {
                var self = this;

                // Acrescentar no g a escala X e o seu nome
                self.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + self.altura + ")")
                  .call(self.escalaX)
                    // Roda os elementos do eixo dos X
                    .selectAll("text")
                    .attr("dx", "-2em")
                    .attr("dy", ".5em")
                    .attr("transform", "rotate(-35)");

                // Append Eixo dos X ( Caso haja legenda a largura vai apenas até aos 80%
                if (self.mostraLegenda === true) {
                    self.svg.append("text")
                        .attr("class", "nomeEixoX")
                        .attr("dx", self.largura * 0.8 - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                } else {
                    self.svg.append("text")
                        .attr("class", "nomeEixoX")
                        .attr("dx", self.largura - 10)
                        .attr("dy", self.altura - 5)
                        .style("text-anchor", "end")
                            .text(nomeEixoX);
                }


                // Acrescentar no g a escala Y e o seu nome to-do
                self.svg.append("g")
                  .attr("class", "y axis")
                  .call(self.escalaY)
                // Insere nome do eixo do Y
                .append("text")
                  .attr("class", "nomeEixoY")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(nomeEixoY);

                self.AtualizaEixos();
            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            GraficoLinhas.prototype.ConstroiGrafico = function (id) {
                var self = this;

                //self.AtualizaDimensoes()
                //self.ConstroiSVG(id, self);
                //self.ConstroiEixos();
                //self.InsereDados();

                //self.InsereEixos();
                //self.Atualiza();

                // Insere botões na navbar
                //self.OpcaoUpdate();
                self.OpcaoMostraDados();
                self.OpcaoSuavizarLinhas();
                self.OpcaoLegenda();

                //self.OpcaoExportar();

                // Liga evento para modificar titulo
                //self.ModificaTitulo();


                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// ATUALIZAR DESCRIÇÃO
            /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados
            /// </summary>
            GraficoLinhas.prototype.Renderiza = function () {
                var self = this;

                // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
                //svg = d3.select("[name=" + self.parent().attr("name") + "]").select(".wrapper");

                // Atualizar dimensões conforme a "widget"
                self.AtualizaDimensoes();


                // Atualiza SVG
                d3.select("#" + self.id).select(".wrapper svg")
                    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                    .attr("height", self.altura + self.margem.cima + self.margem.baixo);


                // Atualizar escala - para dentro do atualiza to-do
                self.AtualizaEixos();

            }


            /// <summary>
            /// Método que atualiza os elementos que representam os dados
            /// atualiza os elementos dentro do SVG do widget
            /// </summary>
            GraficoLinhas.prototype.Atualiza = function () {
                var self = this,
                    larguraRect = ($("#" + self.id).width() / self.dados.dados.Widgets[0].Items.length);

                console.log("larguraRECT");
                console.log(larguraRect);

                self.Renderiza();
                self.DesenhaSerie();

                $("#" + self.id).find(".series").prependTo($("#" + self.id).find(".series").parent());


                // Para cada objecto ( Ponto )
                self.dadosEscolhidos.forEach(function (item, curIndex) {

                    // Largura de cada rectangulo, de acordo com o tamanho do widget

                    //// Para cada "variável"
                    //self.pontos.selectAll(".ponto" + curIndex)
                    //    // Ligar o valor dos pontos
                    //.data(item.values)
                    //    .attr("x", function (d) { return self.transformaX(d.date); })
                    //    .attr("y", function (d) { return self.transformaY(d.y); })
                    //    .attr("height", function (d) { return self.altura; })
                    //    .attr("width", larguraRect);


                    self.pontos.selectAll(".ponto" + curIndex)
                        .data(item.values)
                        .attr("cx", function (d) { return self.transformaX(d.date); })
                        .attr("cy", function (d) { return self.transformaY(d.y); });

                    // Adicionar tooltip
                    if (self.mostraToolTip === true) {
                        self.pontos.selectAll(".ponto" + curIndex)
                        .on("mouseover", tip.show)
                        .on("mouseout", tip.hide);

                    } else {
                        self.pontos.selectAll(".rect" + curIndex)
                        .on("mouseover", function () { })
                        .on("mouseout", function () { });
                    }

                });

            }


            /// <summary>
            /// Suaviza as linhas do gráfico através da interpolação
            /// </summary>
            GraficoLinhas.prototype.SuavizarLinhas = function (suavizar) {
                var self = this;

                if (suavizar === true) {

                    // Aplica o método svg.line do d3 à variável self.linha
                    self.linha = d3.svg.line()
                        // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                        .x(function (d) { return self.transformaX(d.date); })
                        // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                        .y(function (d) { return self.transformaY(d.y); })
                        // Faz a interpolação para suavizar as linhas
                        .interpolate("basis");

                } else {
                    // Aplica o método svg.line do d3 à variável linha
                    self.linha = d3.svg.line()
                        // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                        .x(function (d) { return self.transformaX(d.date); })
                        // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                        .y(function (d) { return self.transformaY(d.y); });

                }

            }


            /// <summary>
            /// Constroi legenda do widget
            /// </summary>
            GraficoLinhas.prototype.ConstroiLegenda = function () {
                var self = this,
                    series = $("#" + self.id).find(".wrapper").find(".series").length,
                    legenda,
                    nomesLegenda = [];

                // Inserir SVG legenda
                legenda = d3.select("#" + self.id).select(".legenda").insert("svg");

                // Para cada index
                for (var index = 0; index < series; index++) {
                    // Selecionar o index no DOM
                    var nome = $("#" + self.id + " .wrapper").find(".series:eq(" + index + ")").attr("value");

                    // Adicionar circulo "legenda"
                    legenda.append("circle")
                        .attr("r", 5)
                        .attr("cx", 15)
                        .attr("cy", 15 + 20 * index)
                        .style("fill", color(nome));

                    //$(".legenda").prepend("<span style='float:right; padding-top:4px'>" + nome + "</span>")

                    legenda.append("text")
                        .attr("x", 30)
                        .attr("y", ((15 + 20 * index) + 5))
                        .text(nome);

                }
            }


            /// <summary>
            /// Devolve os indicadores recebidos através da "query" ligada ao widget
            /// </summary>
            GraficoLinhas.prototype.getIndicadores = function () {
                var self = this,
                    indicadores = [];

                if (self.contexto.length <= 0) {
                    return indicadores;
                } else {
                    if (self.dadosNormal !== undefined && self.dadosNormal !== null) {
                        self.dadosNormal.forEach(function (indicador) {
                            indicadores.push(indicador.name);
                        });
                    }
                }

                return indicadores;
            }


            /// Retorna o objecto criado
            return GraficoLinhas;


        })();



        /// <summary>
        /// Classe Gauge
        /// Module Pattern
        /// </summary>
        var Gauge = (function () {
            var TamanhoLimite = 350, /// to-do?
                valorMinimo = 0,
                valorMaximo = 1,
                valorAtual = 0,
                escalaX,
                barraAtual,
                grafico,
                arcMeta,
                arcoVazio,
                arcoPintado,
                percentagem = 0,
                meta = 0,
                percentagemInicio = 0.75,
                raio = 100,
                modoVisualizacao = "arco";


            /// <summary>
            /// Método construtor para a classe GraficoArea, chama o construtor do Widget
            /// </summary>
            function Gauge(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);

                this.widgetTipo = "dados";
                this.widgetElemento = "gauge";

                // Inicializa objectoServidor;
                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "gauge";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];

                this.valorMinimo = 0;
                this.valorMaximo = 0;
                this.valorAtual = 0;
                this.valorMeta = 0;

            };


            /// <summary>
            /// Converte de percentagem para graus
            /// </summary>
            /// <param name="percentagem"> Valor em percentagem entre 0 e 1</param>
            /// <returns> Valor convertido para Graus </returns>
            var PercentagemParaGraus = function (percentagem) {
                return percentagem * 360;
            }


            /// <summary>
            /// Converte de percentagem para graus
            /// </summary>
            /// <param name="percentagem"> Valor em graus </param>
            /// <returns> Valor convertido para Radianos </returns>
            var GrausParaRadianos = function (graus) {
                return graus * Math.PI / 180;
            }


            /// <summary>
            /// Converte de percentagem para radianos, converte primeiro para graus e só depois
            /// para radianos
            /// </summary>
            /// <param name="percentagem"> Valor em percentagem entre 0 e 1</param>
            /// <returns> Valor convertido para Radianos </returns>
            var PercentagemParaRadianos = function (percentagem) {
                return GrausParaRadianos(PercentagemParaGraus(percentagem));
            }


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(Gauge, Widget);


            /// <summary>
            /// GAUGE ARCO
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            Gauge.prototype.ConstroiSVGArco = function () {
                var self = this;

                // Seleciona Widget
                self.svg = d3.select("#" + self.id).select(".wrapper").append("svg")
                          .attr("width", "95%")
                          .attr("height", "95%")
                          // Atribuida viewBox para ser responsivo
                          .attr('viewBox', '0 0 ' + "200" + ' ' + "100")
                          // Mantem proporção e tenta ir para o minimo de X e o meio do Y
                          .attr("preserveAspectRatio", "xMidYMid")


                // Acrescentar g
                grafico = self.svg.append("g")
                  // Translaciona para colocar o centro no fundo e no meio do svg
                  .attr("transform", "translate(" + raio + "," + raio + ")");


                grafico.append("path").attr("class", "arc grafico-vazio");
                // Liga ao gráfico um endAngle para as transições futuras
                grafico.append("path").datum({ endAngle: .75 }).attr("class", "arc grafico-pintado");
                grafico.append("path").attr("class", "arc meta");

                // Criados três arcos iguais, pois todos vão ter angulos diferentes
                arcMeta = d3.svg.arc().outerRadius(raio).innerRadius(raio / 2);
                arcVazio = d3.svg.arc().outerRadius(raio).innerRadius(raio / 2);
                arcPintado = d3.svg.arc().outerRadius(raio).innerRadius(raio / 2);

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            Gauge.prototype.ConstroiGrafico = function (id) {
                var self = this;


                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("gauge");

                // to-do
                //self.MostraOpcoes();

                self.setAtivo();
                self.RemoveAtivo();
                self.OpcaoExpandir();

                // Constroi Gráfico Arco
                if (modoVisualizacao === "arco") {
                    self.ConstroiSVGArco();
                    self.DesenhaGauge(0);
                    //self.Atualiza();
                    //setInterval(self.Atualiza(), 1500);
                    //setInterval(function () {
                    //    self.Atualiza();
                    //}, 1500);

                }
                // Constroi Gráfico Horizontal
                if (modoVisualizacao === "horizontal") {
                    self.ConstroiSVG(id, self);
                    self.ConstroiEixos();
                    self.InsereEixos();
                    self.Atualiza();
                }

            }


            /// <summary>
            /// Constroi eixos de acordo com os dados fornecidos, liga o valor a um dos elementos SVG
            /// Apenas para o gauge horizontal
            /// </summary>
            Gauge.prototype.ConstroiEixos = function () {
                var self = this;


                // Caso valores não sejam numéricos, atribuimos valores base para não dar erro
                if (!$.isNumeric($(".valor-maximo").val())) {
                    valorMaximo = 1;
                }
                if (!$.isNumeric($(".valor-meta").val())) {
                    meta = 0;
                }
                if (!$.isNumeric($(".valor-atual").val())) {
                    valorAtual = 0;
                }

                // to-do  elemento
                d3.select(".wrapper").select("g").selectAll(".atual").data(valorAtual);

                escalaX = d3.scale.linear()
                  .domain([0, valorMaximo])
                  .range([0, 200]);

            }


            /// <summary>
            /// Insere o eixo construido
            /// Apenas para o gauge horizontal
            /// </summary>
            Gauge.prototype.InsereEixos = function () {
                var self = this;


                // Acrescenta um rectangulo para a gauge
                self.svg.append("rect")
                  .attr("class", "base")
                  .attr("x", 0)
                  .attr("y", 0)
                  // Dá uma largura conforme a escala e o seu valor
                  .attr("width", escalaX(valorMaximo))
                  .attr("height", 50)
                    .style("fill", "grey");

                // Acrescenta um rectangulo com o valor atual
                self.svg.append("rect")
                  .attr("class", "atual")
                  .attr("x", 0)
                  .attr("y", 0)
                  // Começa sempre a 0
                  .attr("width", escalaX(0))
                  .attr("height", 50)
                    .style("fill", "red");

                // Acrescenta uma barra para simbolizar a recta
                self.svg.append("rect")
                  .attr("class", "meta")
                  .attr("x", escalaX(meta))
                  .attr("y", -10)
                  .attr("width", 2)
                  .attr("height", 70)
                    .style("fill", "green");

                // Acrescenta texto para sinalizar a meta
                self.svg.append("text")
                  .attr("class", "meta-text")
                  // Menos uns pixeis para não sobrepor a barra
                  .attr("x", escalaX(meta) - 3)
                  .attr("y", -15)
                  .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .style("fill", "black")
                    .text("Meta");
            }


            /// <summary>
            /// Pinta a gauge de acordo com os valores atuais
            /// </summary>
            /// <param name="percentagem> Percentagem que vai ser pintada no arco </param>
            Gauge.prototype.DesenhaGauge = function (percentagem) {
                var self = this;


                // Definir angulo inicial do arco pintado
                arcStartRad = PercentagemParaRadianos(percentagemInicio);
                // Define angulo final do arco pintado
                // Divisão por dois devido a ser um arco e não uma circunferencia completa
                self.arcEndRad = arcStartRad + PercentagemParaRadianos(percentagem / 2);
                // Path do arco pintado calculado
                arcPintado.startAngle(arcStartRad).endAngle(self.arcEndRad);

                /// Definimos o angulo final, neste caso meia circunferencia
                self.arcEndRad = PercentagemParaRadianos(0.5 + 0.75);
                // Path do arco vazio calculado
                arcVazio.startAngle(arcStartRad).endAngle(self.arcEndRad);


                //Meta divido por 2, por ser um arco e não uma circunferencia
                arcStartRad = PercentagemParaRadianos(self.valorMeta / 2);
                // Adicionamos um valor minimo no angulo final para ser explicito
                self.arcEndRad = PercentagemParaRadianos((self.valorMeta / 2 + 0.005));
                // Path do arco meta calculado
                arcMeta.startAngle(arcStartRad).endAngle(self.arcEndRad);

                // Angulo final é guardado como inicio do arco
                arcEndRad = PercentagemParaRadianos(percentagemInicio);

                // Atribuir paths
                grafico.select(".grafico-vazio").attr("d", arcVazio);
                grafico.select(".grafico-pintado").attr("d", arcPintado);
                grafico.select(".meta").attr("d", arcMeta).style("fill", "green");
                // texto com percentagem atual é acrescentado
                grafico.append("text").attr("class", "gauge-percentagem").attr("x", 0).attr("y", -5).style("font-size", "1.5em").style("fill", "black").style("text-anchor", "middle").text(percentagem + "%");
            }

            /// <summary>
            /// Cria uma transição nova com os dados que lhe são fornecidos
            /// Recebe um angulo novo e a partir do ultimo angulo conhecido calcula as posições a serem desenhadas
            /// até chegar a esse destino
            /// </summary>
            /// <param name="elemento"> Elemento a aplicar o tween </param>
            /// <param name="anguloNovo"> Novo angulo final </param>
            Gauge.prototype.arcTween = function (elemento, anguloNovo) {

                // Transição customizada para os arcos
                elemento.attrTween("d", function (d) {
                    // Atribuimos o ultimo angulo conhecido ao d.endAngle
                    d.endAngle = self.arcEndRad

                    // Constroi um novo conjunto de dados a começar no ultimo angulo conhecido até ao novo angulo
                    // O valor do angulo é dividido devido ao desenho ser apenas meia circunferencia
                    // É somado o valor 0.75 para este começar a partir da posição correcta de acordo com a visualização
                    var interpolate = d3.interpolate(d.endAngle, PercentagemParaRadianos(anguloNovo / 2 + 0.75));
                    return function (t) {
                        // Para cada valor de T, é utilizado a interpolação e dado um valor ao endAngle
                        d.endAngle = interpolate(t);
                        arcPintado.endAngle(d.endAngle);
                        // Guardado o ultimo valor caso haja outra tween
                        self.arcEndRad = d.endAngle;
                        // Retornamos o novo path
                        return arcPintado(d);
                    };
                });

            }


            /// <summary>
            /// Desenha a meta no gráfico de acordo com os valores introduzidos
            /// </summary>
            Gauge.prototype.DesenhaMeta = function () {
                var self = this;

                // Definir angulos para a meta, adicionado percentagemInicio para se
                // encaixar dentro do arco de forma correta
                arcStartRadMeta = PercentagemParaRadianos(meta / 2 + percentagemInicio);
                arcEndRadMeta = PercentagemParaRadianos((meta / 2 + 0.005 + percentagemInicio));
                // Path do arco meta calculado
                arcMeta.startAngle(arcStartRadMeta).endAngle(arcEndRadMeta);

                // Atribuir o valor calculado
                grafico.select(".meta").attr("d", arcMeta).style("fill", "green");

            }


            /// <summary>
            /// Método que atualiza os elementos que representam os dados
            /// atualiza os elementos dentro do SVG do widget
            /// </summary>
            Gauge.prototype.Atualiza = function () {
                var self = this,
                    textTween;

                if (modoVisualizacao === "arco") {
                    // Vamos buscar os valores
                    // to-do
                    //valorAtual = $(".valor-atual").val();
                    //valorMaximo = $(".valor-maximo").val();
                    //valorMinimo = $(".valor-minimo").val();
                    //meta = $(".valor-meta").val();

                    valorAtual = self.valorAtual;
                    valorMaximo = self.valorMaximo;
                    valorMinimo = self.valorMinimo;
                    meta = self.valorMeta;


                    // Caso valores não sejam numéricos
                    if (!$.isNumeric(valorMaximo)) {
                        valorMaximo = 1;
                    }
                    if (!$.isNumeric(meta)) {
                        meta = 0;
                    }
                    if (!$.isNumeric(valorAtual)) {
                        valorAtual = 0;
                    }


                    // Se percentagem for igual a zero, não fazer o calculo
                    if ((valorMaximo - valorMinimo) !== 0) {
                        // Calculada percentagem atual de acordo com os valores
                        self.percentagem = (((valorAtual - valorMinimo) * 100) / (valorMaximo - valorMinimo)) / 100;

                    } else {
                        self.percentagem = 0;
                    }


                    // Calculada meta atual de acordo com os valores
                    meta = (((meta - valorMinimo) * 100) / (valorMaximo - valorMinimo)) / 100;

                    console.log(valorAtual + " - " + valorMinimo + "* 100 / ( " + valorMaximo + " - " + valorMinimo + " )) / 100");
                    console.log(self.percentagem);

                    // Selecionar gráfico pintado
                    d3.select("#" + self.id).select(".grafico-pintado")
                        .transition()
                        .delay(50)
                        .duration(300)
                        // Chama a transição personalizada arcTween para desenhar a transição do arco
                        .call(self.arcTween, self.percentagem);

                    textTween = function () {
                        // Cria nova interpolação desta vez, entre a atual percentagem, até ao valor final da percentagem
                        // Multiplicação por 100 devido ao angulo estar entre 0 e 1
                        var textInterpolate = d3.interpolate(parseInt(this.textContent), self.percentagem * 100);
                        // Modifica o valor de acordo com a interpolação
                        return function (t) { this.textContent = Number(textInterpolate(t)).toFixed(0) + "%"; }
                    };


                    d3.select("#" + self.id).select(".gauge-percentagem")
                        .transition()
                        .duration(350)
                        // Chama a transição personalizada do texto
                        .tween("text", textTween);


                    // Chamar método para desenhar a nova meta
                    self.DesenhaMeta();
                }


                if (modoVisualizacao === "horizontal") {
                    // Vamos buscar os valores
                    valorAtual = $(".valor-atual").val();
                    valorMaximo = $(".valor-maximo").val();
                    valorMinimo = $(".valor-minimo").val();
                    meta = $(".valor-meta").val();

                    // Construimos novamente os eixos, com os valores novos
                    self.ConstroiEixos();

                    // Atualizamos o valor atual
                    self.svg.select(".atual")
                        .transition()
                        .duration(300)
                        // Conforme a escala
                        .attr("width", escalaX(valorAtual));

                    // Atualizar a meta
                    self.svg.select(".meta")
                      // Conforme a escala
                      .attr("x", escalaX(meta));

                    // Atualizar o texto Meta
                    self.svg.select(".meta-text")
                       // Conforme a escala, menos pixies para não sobrepor
                      .attr("x", escalaX(meta) - 3);
                }

            }


            /// <summary>
            /// Atribui ao gráfico o seu modo de visualização e chama o método update
            /// </summary>
            Gauge.prototype.setModoVisualizacao = function (modo, id) {
                var self = this;

                // Atribui modo visualização
                modoVisualizacao = modo;


                // Caso o modo seja arco
                if (modoVisualizacao === "arco") {
                    // Remover o atual
                    d3.select("svg").remove();
                    // Construir um novo
                    self.ConstroiGrafico(id);
                    // Atualizar
                    self.Atualiza();
                }
                // Caso o modo seja horizontal
                if (modoVisualizacao === "horizontal") {
                    // Remover o atual
                    d3.select("svg").remove();
                    // Construir um novo
                    self.ConstroiGrafico(id);
                    // Atualizar
                    self.Atualiza();
                }

            }


            /// <summary>
            /// Atualiza os dados da Gauge conforme o que recebe
            /// </summary>
            Gauge.prototype.AtualizaOpcoesProperty = function (dados, geral) {
                var self = this;

                // Atualiza opções gerais
                self.titulo = geral.Nome;
                self.descricao = geral.Descricao;

                // Atualiza Valores
                self.valorAtual = dados.valorAtual;
                self.valorMaximo = dados.valorMaximo;
                self.valorMeta = dados.valorMeta;
                self.valorMinimo = dados.valorMinimo;


                self.Atualiza();
            }

            /// <summary>
            /// Retorna um objectoServidor para guardar este widget dentro do servidor 
            /// </summary>
            Gauge.prototype.AtualizaObjectoServidor = function () {
                var self = this,
                        $elemento = $("#" + self.id).parent(),
                        objecto = {};

                // Atualização do widget e o Objecto que comunica com o servidor
                objecto["widgetLargura"] = $elemento.attr("data-gs-width");
                objecto["widgetAltura"] = $elemento.attr("data-gs-height");
                objecto["widgetX"] = $elemento.attr("data-gs-x");
                objecto["widgetY"] = $elemento.attr("data-gs-y");
                objecto["widgetTipo"] = self.widgetTipo;
                objecto["widgetElemento"] = self.widgetElemento;

                objecto["id"] = self.id;
                objecto["descricao"] = self.descricao;
                objecto["modoVisualizacao"] = self.modoVisualizacao;
                objecto["visivel"] = self.visivel;
                objecto["mostraLegenda"] = self.mostraLegenda;
                objecto["mostraToolTip"] = self.mostraToolTip;
                objecto["titulo"] = self.titulo;
                objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;
                objecto["contexto"] = self.contexto;
                objecto["agregacoes"] = self.agregacoes;


                objecto["valorMaximo"] = self.valorMaximo;
                objecto["valorMinimo"] = self.valorMinimo;
                objecto["valorMeta"] = self.valorMeta;
                objecto["valorAtual"] = self.valorAtual;


                if (self.suavizar !== undefined) {
                    objecto["suavizar"] = self.suavizar;
                }

                if (self.widgetTipo === "dados") {
                    objecto["seriesUtilizadas"] = self.getSeriesUtilizadas();
                }

                return objecto;

            }


            /// Retorna o objecto criado
            return Gauge;

        })();



        /// <summary>
        /// Classe KPI, label texto, label valor, etc
        /// Module Pattern
        /// </summary>
        var KPI = (function () {
            var TamanhoLimite = 350, /// to-do?
                valorTextTween,
                ligacao,
                cor,
                valor,
                valorLimite = 50;



            /// <summary>
            /// Método construtor para a classe PieChart, chama o construtor do Widget
            /// </summary>
            function KPI(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {

                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
                this.widgetTipo = "dados";
                this.widgetElemento = "Etiqueta";

                // Inicializar o raio
                this.raio = Math.min(this.largura, this.altura) / 2;
                // Inicializar toolTip a true
                this.mostraToolTip = true;

                this.valor = valor;
                this.valorLimite = valorLimite;

                this.tipo = "";

                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "Etiqueta";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];
                this.objectoServidor["tipo"] = "";

                this.opcoes =
                    {
                        texto: "Inserir texto..",
                        valor: 0,
                        variavel: "Inserir parametros.."
                    };


            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(KPI, Widget);


            /// <summary>
            /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
            /// </summary>
            KPI.prototype.InsereDados = function () {
                var self = this,
                    textTween;

                // Ciclo para atualizar widget

                // Começa o ciclo para atualizar os dados
                setInterval(function () {

                    //valorTextTween = self.valor;

                    // Seleciona o elemento to-do
                    //self.svg.select(".valorAtual")
                    //    .transition()
                    //    .duration(10)
                    //.text(self.valor);
                    // Chama a transição personalizada
                    //.tween("text", self.TextTween);

                    if (self.tipo === "valor") {
                        // Valor numérico, centrar
                        self.CentrarValor(true);
                        // Modificar valor
                        $("#" + self.id).find(".valorLabel").text(self.opcoes.valor);

                    } else if (self.tipo === "texto") {
                        // Não é um tipo de variável não é necessário centrar
                        self.CentrarValor(false);
                        // Modificar valor
                        $("#" + self.id).find(".valorLabel").text(self.opcoes.texto);

                    } else if (self.tipo === "variavel") {
                        // Valor numérico, centrar
                        self.CentrarValor(true);

                        // Reset ao valor da label
                        $("#" + self.id).find(".valorLabel").empty();

                        // Caso o objecto do servido já tenha sido recebido, escrever
                        if (self.opcoes.variavel instanceof Object) {
                            // Adicionar valores
                            self.opcoes.variavel.forEach(function (objecto) {
                                $("#" + self.id).find(".valorLabel").append(objecto.nome + ": " + objecto.valor + "\n");
                                $("#" + self.id).find(".valorLabel").append("<br />");
                            });
                        } else {
                            $("#" + self.id).find(".valorLabel").append("Inserir Parametros...");
                        }

                    }


                    // to-do?
                    //self.setValor(self.valor);

                    //self.VerificaValor();

                }, 100);


                //self.setValor(self.valor);
                //$(".valorLabel").text(self.valor);

            }


            /// <summary>
            /// Método para calcular transições personalizadas para elementos do tipo texto
            /// </summary>
            KPI.prototype.TextTween = function () {

                // Cria nova interpolação desta vez, entre a atual percentagem, até ao valor final da percentagem
                // Multiplicação por 100 devido ao angulo estar entre 0 e 1
                var textInterpolate = d3.interpolate(parseInt(this.textContent), valorTextTween);
                // Modifica o valor de acordo com a interpolação
                return function (t) { this.textContent = Number(textInterpolate(t)).toFixed(0); }

            }


            /// <summary>
            /// Compara o valor atual com o valor Limite, ao comparar pode modificar o elemento valorCompara para
            /// sinalizar o utilizador de melhor forma
            /// </summary>
            KPI.prototype.VerificaValor = function () {
                var self = this;

                // Caso o valor seja maior ou igual que o valor limite
                if (self.valor >= self.valorLimite) {
                    self.svg.select(".valorCompara")
                        .transition()
                        // Aumentar raio do sinalizador
                        .attr("r", "12")
                          .style("fill", "green");
                } else {
                    self.svg.select(".valorCompara")
                        .transition()
                        // Diminuir raio do sinalizador
                        .attr("r", "5")
                          .style("fill", "red");
                }
            }


            /// <summary>
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            KPI.prototype.ConstroiSVG = function () {
                var self = this;


                //// Seleciona o wrapper para inserir o svg
                //self.svg = d3.select("#" + self.id).select(".wrapper").insert("svg")
                //    // 80% para deixar algum espaço para as tooltip/legenda
                //    .attr("width", "100%")
                //    .attr("height", "100%")
                //    // Atribuida uma viewBox de acordo com o valor minimo de entro a sua altura ou largura
                //    .attr('viewBox', '0 0 ' + (Math.min(self.largura, self.altura)) + ' ' + (Math.min(self.largura, self.altura)))
                //    // Mantém a proporção de imagem independentemente do tamanho, e tenta sempre posiciona-la a meio
                //    .attr("preserveAspectRatio", "xMidYMid")
                //  .append("g")
                //    // Translação do raio minimo para estar dentro do svg de forma adequada
                //    .attr("transform", "translate(" + (Math.min(self.largura, self.altura) / 2) + "," + (Math.min(self.largura, self.altura) / 2) + ")");

            }

            /// <summary>
            /// Constroi o HTML necessário para mostrar a informação ao utilizador
            /// </summary>
            //KPI.prototype.ConstroiHTML = function (id) {
            //    var self = this;

            //    // Redefinimos a translação dos elementos para se enquadrarem no meio do SVG
            //    //self.svg.attr("transform", "translate(" + (self.largura / 2) + "," + (self.altura / 2) + ")");

            //    // Atribui class ao SVG
            //    d3.select("." + id).select(".wrapper").select("svg")
            //        .attr("class", "labelValor");

            //    // Insere texto que indica o nome do valor observado
            //    self.svg.insert("text")
            //        // Atribuir class
            //        .attr("class", "valorSelecionado")
            //        .attr("dy", "-2em")
            //          .style("font-size", "1.5em")
            //          .style("text-anchor", "middle")
            //          //  Nome da variável
            //          .text("Valor ID: ");

            //    // Insere texto que guarda valor atual
            //    self.svg.insert("text")
            //        .attr("class", "valorAtual")
            //          .style("font-size", "3em")
            //          .style("text-anchor", "middle")
            //          // to-do?
            //          .text(valor);

            //    // Insere texto que guarda valor Limite
            //    self.svg.insert("text")
            //        .attr("class", "valorLimite")
            //        .attr("dy", "3em")
            //          .style("font-size", "1em")
            //          .style("text-anchor", "middle")
            //          .text("Valor Limite: " + self.valorLimite);

            //    // Insere circulo para melhor sinalizar estado dos dados
            //    self.svg.insert("circle")
            //        .attr("class", "valorCompara")
            //        .attr("cx", "3em")
            //        .attr("cy", "-1em")
            //        .attr("r", "10")
            //          .style("fill", "grey");

            //}


            KPI.prototype.ConstroiHTML = function () {
                var self = this;


                //if (self.tipo === "texto") {
                //    // Redefinimos a translação dos elementos para se enquadrarem no meio do SVG
                //    self.svg.attr("transform", "translate(" + (self.largura / 2) + "," + (self.altura / 2) + ")");

                //    // Atribui class ao SVG
                //    d3.select("." + self.id).select(".wrapper").select("svg")
                //        .attr("class", "labelValor");

                //    // Insere texto que indica o nome do valor observado
                //    self.svg.insert("text")
                //        // Atribuir class
                //        .attr("class", "valorSelecionado")
                //        .attr("dy", "-2em")
                //          .style("font-size", "1.5em")
                //          .style("text-anchor", "middle")
                //          //  Nome da variável
                //          .text(self.valor);

                //} else {
                //        // Redefinimos a translação dos elementos para se enquadrarem no meio do SVG
                //        self.svg.attr("transform", "translate(" + (self.largura / 2) + "," + (self.altura / 2) + ")");

                //        // Atribui class ao SVG
                //        d3.select("." + self.id).select(".wrapper").select("svg")
                //            .attr("class", "labelValor");

                //        // Insere texto que indica o nome do valor observado
                //        self.svg.insert("text")
                //            // Atribuir class
                //            .attr("class", "valorSelecionado")
                //            .attr("dy", "-2em")
                //              .style("font-size", "1.5em")
                //              .style("text-anchor", "middle")
                //              //  Nome da variável
                //              .text("Valor ID: ");

                //        // Insere texto que guarda valor atual
                //        self.svg.insert("text")
                //            .attr("class", "valorAtual")
                //              .style("font-size", "3em")
                //              .style("text-anchor", "middle")
                //              // to-do?
                //              .text(self.valor);
                //}


                // Wrapper para centrar o elemento valor mais facilmente, em caso de valor
                $("#" + self.id).find(".wrapper").append("<div class=\"etiquetaWrapper\"><div class=\"valorLabel\"></div></div>")


            }




            /// <summary>
            /// Encapsula todos os elementos necessários à construção do Elemento
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            KPI.prototype.ConstroiGrafico = function (id) {
                var self = this;

                // to-do
                // nome?
                // teste1?

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("kpi");

                // Constroi SVG
                self.ConstroiSVG();
                // Constroi elementos necessários do HTML
                self.ConstroiHTML(id);
                // Começa o ciclo de busca de dados
                self.InsereDados();
                // Atualiza o valorLimite
                self.Atualiza();

                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// Método que atualiza os elementos que representam os dados
            /// atualiza os elementos dentro do SVG do widget
            /// </summary>
            KPI.prototype.Atualiza = function () {
                var self = this;

                $(".update-KPI").click(function () {
                    self.setValorLimite($(".valor-Limite").val());
                    self.VerificaValor();
                });

            }



            /// <summary>
            /// Atualiza os dados da Gauge conforme o que recebe
            /// </summary>
            KPI.prototype.AtualizaOpcoesProperty = function (dados, geral) {
                var self = this,
                    objecto,
                    conteudo = [],
                    teste = [{
                        "valor.valorMax": {
                            "value": 3424161.2663653945
                        },
                        "valor.valorMin": {
                            "value": 1851488.991908083
                        },
                        "valor.valorMed": {
                            "value": 2483002.726101718
                        }
                    }];

                // Atualiza opções gerais
                self.setTitulo(geral.Nome);
                self.setDescricao(geral.Descricao);

                // Dependente da checkbox que esteja ligada, atualizar os valores contidos
                if (dados.CheckboxTexto === true) {
                    self.tipo = "texto";
                    self.opcoes.texto = dados.Texto;

                    // TODO ATUAL
                    // RECEBE UM ARRAY COM APENAS UM  OBEJCTO
                    // Caso seja maior é apresentado um erro ao utilizador para modificar
                    // os parametrs de pesquisa
                } else if (dados.CheckboxVariavel === true) {
                    self.tipo = "variavel";
                    // Fazer pedido com o parametro dados.Pesquisa ou dados.Componente
                    // Pedido..... TODO

                    // Caso opedido só tenha um Item
                    //if (pedido.dados.Widgets[0].Items.length === 1) {
                    if (teste.length === 1) {
                        teste.forEach(function (item) {
                            Object.keys(item).forEach(function (key) {
                                conteudo.push({ nome: key, valor: item[key].value });
                            })
                        });
                        // Definir o parametro "valor" com o objecto conteudo
                        self.opcoes.variavel = conteudo;


                    } else {
                        // Avisar utilizador de erro
                        alert("[ERRO] Demasiados parametros!");
                    }

                } else if (dados.CheckboxValor === true) {
                    self.tipo = "valor";
                    self.opcoes.valor = dados.valorAtual;

                }


                console.log(dados);
                console.log(geral);

                // Atualiza objectoServidor ( Guarda os seus dados no servidor )
                objecto = self.AtualizaObjectoServidor();
                self.objectoServidor = objecto;


                //self.Atualiza();

            }

            /// <summary>
            /// Retorna um objectoServidor para guardar este widget dentro do servidor 
            /// </summary>
            KPI.prototype.AtualizaObjectoServidor = function () {
                var self = this,
                    $elemento = $("#" + self.id).parent(),
                    objecto = {};

                // Atualização do widget e o Objecto que comunica com o servidor
                objecto["widgetLargura"] = $elemento.attr("data-gs-width");
                objecto["widgetAltura"] = $elemento.attr("data-gs-height");
                objecto["widgetX"] = $elemento.attr("data-gs-x");
                objecto["widgetY"] = $elemento.attr("data-gs-y");
                objecto["widgetTipo"] = self.widgetTipo;
                objecto["widgetElemento"] = self.widgetElemento;

                objecto["id"] = self.id;
                objecto["descricao"] = self.descricao;
                objecto["modoVisualizacao"] = self.modoVisualizacao;
                objecto["visivel"] = self.visivel;
                objecto["mostraLegenda"] = self.mostraLegenda;
                objecto["mostraToolTip"] = self.mostraToolTip;
                objecto["titulo"] = self.titulo;
                objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;
                objecto["contexto"] = self.contexto;
                objecto["agregacoes"] = self.agregacoes;

                // Dados especificos da label
                // tipo = tipo de label ( Texto ou valor/variavel)
                // Valor = valor a dispor no widget, seja texto ou valor/variavel
                objecto["tipo"] = self.tipo;


                objecto["opcoes"] = self.opcoes

                if (self.suavizar !== undefined) {
                    console.log(self.suavizar);
                    objecto["suavizar"] = self.suavizar;
                }

                if (self.widgetTipo === "dados") {
                    objecto["seriesUtilizadas"] = self.getSeriesUtilizadas();
                }

                return objecto;

            }


            /// <summary>
            /// Função para centrar ou retirar o posicionamento
            /// </summary>
            /// <param name="estado"> Booleano que indica o estado do posicionamento (true = centrado, false = não centrado</param>
            KPI.prototype.CentrarValor = function (estado) {
                var self = this;

                // Adicionar/Remover classe de acordo com o estado
                (estado === true) ? $("#" + self.id).find(".valorLabel").addClass("centrarValor") : $("#" + self.id).find(".valorLabel").removeClass("centrarValor");

            }


            /// <summary>
            /// Get e Set do atributo valor
            /// </summary>
            KPI.prototype.getValor = function () {
                var self = this;
                return self.valor;
            }
            KPI.prototype.setValor = function (valor) {
                this.valor = valor;
            }


            /// <summary>
            /// Get e Set do atributo valorLimite
            /// </summary>
            KPI.prototype.getValorLimite = function () {
                var self = this;
                return self.valorLimite;
            }
            KPI.prototype.setValorLimite = function (valorLimite) {
                var self = this;

                self.valorLimite = valorLimite;

                // Seleciona o elemento to-do
                self.svg.select(".valorLimite")
                    // Chama a transição personalizada
                    .text("Valor Limite: " + self.valorLimite);
            }


            /// Retorna o objecto criado
            return KPI;

        })();



        /// <summary>
        /// Classe Gráfico de Barras
        /// Module Pattern
        /// </summary>
        var PieChart = (function () {
            var TamanhoLimite = 350, /// to-do?
                /// to-do dataNest? series?
                fatias,
                dataNest,
                series,
                arc,
                pie,
                path,
                raio,
                donut = false,
                color = d3.scale.category20(),
                parseDate = d3.time.format("%y-%b-%d").parse;


            /// <summary>
            /// Método construtor para a classe PieChart, chama o construtor do Widget
            /// </summary>
            function PieChart(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                var self = this;

                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
                this.widgetTipo = "dados";
                this.widgetElemento = "GraficoPie";
                // Inicializar o raio

                // Inicializar modo donut a false
                self.donut = donut;

                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "GraficoPie";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];

                this.dadosEscolhidos = [];

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(PieChart, Widget);


            /// <summary>
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            PieChart.prototype.ConstroiSVG = function (id) {
                var self = this;

                $("#" + self.id).find(".wrapper").css("height", "calc(100% - 35px)");

                // Seleciona o wrapper para inserir o svg
                self.svg = d3.select("#" + id).select(".wrapper").insert("svg")
                    // 80% para deixar algum espaço para as tooltip/legenda
                    .attr("width", "80%")
                    .attr("height", "100%")
                    // Atribuida uma viewBox de acordo com o valor minimo de entro a sua altura ou largura
                    .attr('viewBox', '0 0 ' + (Math.min(self.largura, self.altura)) + ' ' + (Math.min(self.largura, self.altura)))
                    // Mantém a proporção de imagem independentemente do tamanho, e tenta sempre posiciona-la a meio
                    .attr("preserveAspectRatio", "xMidYMid")
                  .append("g")
                    // Translação do raio minimo para estar dentro do svg de forma adequada
                    .attr("transform", "translate(" + (Math.min(self.largura, self.altura) / 2) + "," + (Math.min(self.largura, self.altura) / 2) + ")");


                // Se mostra legenda estiver a falso, centra o pie chart
                if (!self.mostraLegenda) {
                    $("#" + self.id).find(".wrapper").find("svg").css("display", "block")
                                                                 .css("margin", "auto");

                    $(".pie > .wrapper").css("width", "100%");
                } else {
                    $("#" + self.id).find(".wrapper").find("svg").css("display", "inline")
                                                                 .css("margin", "");

                    $(".pie > .wrapper").css("width", "80%");
                }

                self.svg.call(tip);

            }


            /// <summary>
            /// Alterna entre legenda ou não legendas
            /// </summary>
            PieChart.prototype.AlternaLegendas = function () {
                var self = this;

                self.mostraLegenda = !self.mostraLegenda;

                // Se msotra legenda estiver a falso, centra o pie chart
                if (!self.mostraLegenda) {
                    $("#" + self.id).find(".wrapper").find("svg").css("display", "block")
                                                                 .css("margin", "auto");
                } else {
                    $("#" + self.id).find(".wrapper").find("svg").css("display", "")
                                                                 .css("margin", "");

                    $(".pie > .wrapper").css("width", "80%");
                }

                // TODO legendas

            }


            /// <summary>
            /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
            /// </summary>
            PieChart.prototype.InsereDados = function () {
                var self = this,
                    ArraySoma = [0],
                    soma = 0,
                    somaAtual = 0,
                    dadosPie = [0],
                    percentagemSlice = [0],
                    color = d3.scale.category10(),
                    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;


                // Controla as keys (Series) que vão estar contidas no gráfico
                color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));

                // Criar novo array de objectos para guardar a informação de uma forma mais fácil de utilizar
                self.dadosNormal = color.domain().map(function (name, curIndex) {
                    return {
                        // Atribuir nome a chave (Serie)
                        name: name,
                        // Mapear os valores
                        values: self.dados.dados.Widgets[0].Items.map(function (d) {
                            var arrayvalores = [],
                                arrayDatas = [],
                                index;

                            // Encontrar index do parametro atual
                            index = _.findIndex(d.Valores, function (valor) { return valor.Nome === name; });

                            return {
                                name: name,
                                y: +d.Valores[index].Valor,
                                date: parseDate(d.Data)
                            };
                        })
                    }
                });

                //// Ciclo para descobrir a soma de todos os valores de uma "Serie"
                //// Para cada "Serie"
                //color.domain().forEach(function (nome, curIndex) {
                //    // Definir cada entrada no array a zero
                //    ArraySoma[curIndex] = 0;
                //    // Fazer soma para essa "Serie"
                //    self.dadosNormal[curIndex].values.forEach(function (valor) {
                //            ArraySoma[curIndex] += valor.y;
                //    })
                //});


                //// Soma total de elementos
                //ArraySoma.forEach(function (item) {
                //    soma += item;
                //});


                //// Para cada uma da soma dos conjuntos
                //ArraySoma.forEach(function (valorSlice, curIndex) {
                //    // Calculamos a percentagem e guardamos
                //    percentagemSlice[curIndex] = (valorSlice / soma) * 100;
                //});


                //// Método d3 que constroi uma função pie
                //pie = d3.layout.pie()
                //    // Inserimos os valores de percentagem para proceder a construção
                //    .value(function (d, curIndex) { return percentagemSlice[curIndex]; })
                //    .sort(null);

                //self.raio = Math.min(self.largura, self.altura) / 2;


                //// Método d3 que constroi um arco
                //self.arc = d3.svg.arc()
                //    // Raio interior ( 0 = circunferência completa )
                //    .innerRadius(0)
                //    // Raio exterior
                //    .outerRadius(self.raio);


                //// Seleciona todos os path
                //self.path = self.svg.selectAll("path")
                //    // utilizamos o pie para calcular os angulos e atribuimos a data
                //    .data(pie(self.dadosNormal))
                //  // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
                //  .enter().append("path")
                //    // Atribuido id a cada "fatia"
                //    .attr("id", function (d, i) { return "path" + i; })
                //    // Atribuida class slice ao elemento
                //    .attr("class", "slice")
                //    // Atribuida cor através do método color
                //    .attr("fill", function (d, i) { return color(i); })
                //    // É criado o path utilizando o método arc do d3
                //    .attr("d", self.arc);


                self.DesenhaSerie();

                // Caso legendas esteja a true
                //self.InsereLegenda(percentagemSlice);

                // ----------------------------------

                //// Mapear dados através de d.ages (to-do)
                //self.dados.forEach(function (d) {

                //    d.date = parseDate(d.date);
                //    d.objecto = color.domain().map(function (name) { return { name: name, y: +d[name] }; });
                //    d.total = d.objecto[0].y + d.objecto[1].y;

                //});


                //// Ciclo para descobrir a soma de todos os valores de uma "chave"
                //// Para cada "chave"
                //color.domain().forEach(function (nome, curIndex) {
                //    // Definir cada entrada no array a zero
                //    ArraySoma[curIndex] = 0;
                //    // Fazer soma para essa "chave"
                //    self.dados.forEach(function (item) {
                //        ArraySoma[curIndex] += item[nome];
                //    })
                //});


                //// Soma total de elementos
                //ArraySoma.forEach(function (item) {
                //    soma += item;
                //});


                //// Para cada uma da soma dos conjuntos
                //ArraySoma.forEach(function (valorSlice, curIndex) {
                //    // Calculamos a percentagem e guardamos
                //    percentagemSlice[curIndex] = (valorSlice / soma) * 100;
                //});

                //// Método d3 que constroi uma função pie
                //pie = d3.layout.pie()
                //    // Inserimos os valores de percentagem para proceder a construção
                //    .value(function (d, i) { return percentagemSlice[i]; })
                //    .sort(null);

                //// Método d3 que constroi um arco
                //self.arc = d3.svg.arc()
                //    // Raio interior ( 0 = circunferência completa )
                //    .innerRadius(0)
                //    // Raio exterior
                //    .outerRadius(self.raio);

                //// Método d3 para definir as cores
                //color = d3.scale.category10()
                //    // atribuimos a cada "key" uma cor
                //    .domain(d3.keys(self.dados[0]).filter(function (key) { return key === "id"; }));


                //// Seleciona todos os path
                //self.path = self.svg.selectAll("path")
                //    // utilizamos o pie para calcular os angulos e atribuimos a data
                //    .data(pie(self.dados))
                //  // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
                //  .enter().append("path")
                //    // Atribuido id a cada "fatia"
                //    .attr("id", function (d, i) { return "path" + i; })
                //    // Atribuida class slice ao elemento
                //    .attr("class", "slice")
                //    // Atribuida cor através do método color
                //    .attr("fill", function (d, i) { return color(i); })
                //    // É criado o path utilizando o método arc do d3
                //    .attr("d", self.arc);

                //// Caso legendas esteja a true
                //self.InsereLegenda(percentagemSlice);

            }


            /// <summary>
            /// Desenha séries para o pie chart
            /// </summary>
            PieChart.prototype.DesenhaSerie = function () {
                var self = this,
                    objectoPie,
                    id = 0,
                    dadosEscolhidos = [],
                    listaSeries = [],
                    ArraySoma = [0],
                    soma = 0,
                    somaAtual = 0,
                    dadosPie = [0],
                    percentagemSlice = [0],
                    color = d3.scale.category10(),
                    parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;


                self.color = d3.scale.category10();

                // Como está a ser guardado os dados temporariamente no widget, é necessário limpar sempre que ocorre o desenhaSerie
                self.dadosEscolhidos = [];

                // Para cada serie utilizada
                self.seriesUtilizadas.forEach(function (item) {
                    // Descobrir quais as que têm o valor de indicador correto
                    index = _.findIndex(self.dadosNormal, function (serie) { return serie.name === item.Campo })
                    if (index !== -1) {
                        // Adiciona um numero a cada série para ser facilmente identificada
                        self.dadosNormal[index]["Numero"] = id++;
                        self.dadosNormal[index]["Nome"] = item.Nome;


                        self.dadosEscolhidos.push(self.dadosNormal[index]);

                    }
                });


                // Controla as keys (Series) que vão estar contidas no gráfico
                self.color.domain(d3.values(self.dadosEscolhidos).map(function (d) { return d.name; }));


                // Ciclo para descobrir a soma de todos os valores de uma "Serie"
                // Para cada "Serie"
                self.color.domain().forEach(function (nome, curIndex) {
                    // Definir cada entrada no array a zero
                    ArraySoma[curIndex] = 0;
                    // Fazer soma para essa "Serie"
                    self.dadosEscolhidos[curIndex].values.forEach(function (objecto) {
                        ArraySoma[curIndex] += objecto.y;

                    })
                });

                // Soma total de elementos
                ArraySoma.forEach(function (item) {
                    soma += item;
                });


                // Para cada uma da soma dos conjuntos
                ArraySoma.forEach(function (valorSlice, curIndex) {
                    // Calculamos a percentagem e guardamos
                    percentagemSlice[curIndex] = (valorSlice / soma) * 100;
                });


                // Método d3 que constroi uma função pie
                pie = d3.layout.pie()
                    // Inserimos os valores de percentagem para proceder a construção
                    .value(function (d, curIndex) { return percentagemSlice[curIndex]; })
                    .sort(null);

                self.raio = Math.min(self.largura, self.altura) / 2;


                // Método d3 que constroi um arco
                self.arc = d3.svg.arc()
                    // Raio interior ( 0 = circunferência completa )
                    .innerRadius(0)
                    // Raio exterior
                    .outerRadius(self.raio);

                // Cria um objecto através do pie
                objectoPie = pie(self.dadosEscolhidos);
                // Para cada "pedaço" inserir o tipo de elemento
                objectoPie.forEach(function (item) {
                    item["tipo"] = self.widgetElemento;

                });


                // Seleciona todos os path
                self.path = self.svg.selectAll("path")
                    // utilizamos o pie para calcular os angulos e atribuimos a data
                    .data(objectoPie)
                  // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
                  .enter().append("path")
                    // Atribuido id a cada "fatia"
                    .attr("id", function (d, i) { return "path" + i; })
                    // Atribuida class slice ao elemento
                    .attr("class", "slice")
                    // Atribuida cor através do método color
                    .attr("fill", function (d, i) { return self.color(i); })
                    // É criado o path utilizando o método arc do d3
                    .attr("d", self.arc)
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);

                // Verifica existência de séries
                self.VerificaSeries();

            }


            /// <summary>
            /// Cria a legenda do gráfico, procura por "desenhos"(gráficos) e para cada um deles cria uma legenda apropriada
            /// </summary>
            PieChart.prototype.ConstroiLegenda = function () {
                var self = this,
                    series = self.dadosEscolhidos.length,
                    legenda;

                //color.domain(d3.keys(self.dados[0]).filter(function (key) { return key !== "date"; }));
                legenda = d3.select("#" + self.id).select(".legenda").insert("svg");

                for (var i = 0; i < series; i++) {
                    legenda.append("circle")
                        .attr("r", 5)
                        .attr("cx", 15)
                        .attr("cy", 15 + 20 * i)
                        .style("fill", self.color(i));

                    legenda.append("text")
                        .attr("x", 30)
                        .attr("y", ((15 + 20 * i) + 5))
                        .text(self.dadosEscolhidos[i].Nome);

                }

                // Cria evento para alternar entre legendas visiveis e invisiveis
                $("#" + self.id).find(".legenda-widget").on("click", function () {

                    // Define o widget
                    var $widget = $("#" + self.id);


                    // Atualiza o estado das legendas
                    self.setLegendas();


                    // Caso esteja visivel
                    if ($widget.find(".legenda").is(":visible")) {
                        // Esconder
                        $widget.find(".legenda").hide();
                        // Aumentar o conteudo gráfico
                        $widget.find(".wrapper").css("width", "100%");
                        self.Atualiza();
                        // Caso esteja escondida
                    } else {
                        // Mostra
                        $widget.find(".legenda").show();
                        // Diminui a largura
                        $widget.find(".wrapper").css("width", "80%");
                        self.Atualiza();
                    }

                });
            }


            /// <summary>
            /// Insere a legenda dinamicamente, de acordo com os dados fornecidos
            /// </summary>
            PieChart.prototype.InsereLegenda = function (dadosPie) {
                var self = this;


                // to-do Legendas
                // unico = id
                $("#" + self.id).append("<div class=\"legenda\" style=\"float:left; max-width:30px;\"></div>")

                // Insere SVG das legendas
                d3.select("#" + self.id).select(".legenda").insert("svg")
                    .attr("class", "svg-legenda")

                // Para cada conjunto de dados
                dadosPie.forEach(function (d, curIndex) {
                    // Seleciona svg legenda
                    d3.select("#" + self.id).select(".legenda").select("svg")
                      // Insere um circulo para cada um dos conjuntos
                      .append("circle")
                        // Nome padrão é circulo legenda + o seu numero
                        .attr("class", "circuloLegenda" + curIndex)
                        .attr("cx", 20)
                        .attr("cy", 20 + (curIndex * 20))
                        .attr("r", 5)
                        // É dado uma cor de acordo com o método color
                        .attr("fill", color(curIndex));
                });

                // Sempre que houver um hover numa das "fatias" principais
                $("#" + self.id).find(".slice").hover(function () {
                    // Selecionamos o circulo do conjunto com o mesmo numero
                    d3.select("#" + self.id).select(".circuloLegenda" + $(this).attr("id").match(/\d+/)).transition()
                        .duration(150)
                        // Aumenta-mos o tamanho
                        .attr("r", 10);
                },
                // Ao deixar de fazer hover
                function () {
                    // Selecionamos o circulo do conjunto com o mesmo numero
                    d3.select("#" + self.id).select(".circuloLegenda" + $(this).attr("id").match(/\d+/)).transition()
                        // Volta ao mesmo tamanho
                        .attr("r", 5);
                }
                );

            }


            /// <summary>
            /// Método que atualiza o gráfico, p.ex a sua escala ou os dados
            /// </summary>
            PieChart.prototype.Atualiza = function () {
                var self = this
                // to-do
                // dadosSelecionados
                // nome
                // teste1 / numero

                // Update/Adição de elementos
                path.enter()
                    .append("path")
                    // arc calcula o path
                    .attr("d", arc)
                    .attr("fill", function (d) {
                        return color(d.data.nome);
                    })

                // Update de elementos
                path
                    .attr("d", arc);

                // Remoção de elementos
                path.exit()
                    .remove();
            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção do gráfico
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            PieChart.prototype.ConstroiGrafico = function (id) {
                var self = this;

                // to-do
                // nome?
                // teste1?

                // to-do Query? Get Query?
                //self.setDados($.parseJSON(getDados(self, "age")));

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("pie");

                //self.ConstroiSVG(id);
                //self.InsereDados();

                // Insere botões
                self.OpcaoModificaVisualizacao();
                self.OpcaoMostraDados();

                // Exporta Dados
                //self.OpcaoExportar();

                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// Método que atualiza os elementos que representam os dados
            /// atualiza os elementos dentro do SVG do widget
            /// </summary>
            PieChart.prototype.Atualiza = function () {
                var self = this;

                //to-do
                var atualizaPath = d3.select("#" + self.id).selectAll(".slices").data(pie(self.dadosNormal));

                // Update de elementos
                self.path
                    .attr("d", self.arc);

                // Remoção de elementos
                atualizaPath.exit()
                    .remove()

            }


            /// <summary>
            /// Set da função para definir se PieChart vai ter o formato "donut"
            /// </summary>
            PieChart.prototype.setDonut = function () {
                var self = this;


                self.donut = !self.donut;

                if (self.donut === true) {

                    self.arc = d3.svg.arc()
                    .innerRadius(self.raio / 2)
                    .outerRadius(self.raio);

                    self.Atualiza();

                } else {

                    self.arc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(self.raio);

                    self.Atualiza();
                }
            }


            /// <summary>
            /// Modifica entre os vários tipos de visualização
            /// </summary
            PieChart.prototype.OpcaoModificaVisualizacao = function () {
                var self = this;


                // Cria botão para sinalizar o modo visualizacao
                $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"modificaVisualizacao-widget\">" + "Modifica Visualizacao" + "</a></li>")


                // Ao pressionar o botão modificaVisualizacao-widget, troca entre visualizações
                $("#" + self.id).on("click", ".modificaVisualizacao-widget", function () {
                    self.setDonut();
                });

            }


            /// Retorna o objecto criado
            return PieChart;

        })();



        /// <summary>
        /// Classe Tabela
        /// Module Pattern
        /// </summary>
        var Tabela = (function () {

            // Vai guardar a referencia da dataTable
            var tabela,
                // opcoes para a tabela
                opcoesEstilo = { columnDefs: [] },
                // Nomes dos dados, to-do
                colunas = ["nome", "teste1", "id"],
                // Titulo das colunas
                tituloColunas = ["nome", "valores", "id"],
                // Também possível utilizar CDN - https://www.datatables.net/plug-ins/i18n/ (Lista de Linguagens)
                linguagem = {
                    "sProcessing": "A processar...",
                    "sLengthMenu": "Mostrar _MENU_ registos",
                    "sZeroRecords": "Não foram encontrados resultados",
                    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registos",
                    "sInfoEmpty": "Mostrando de 0 até 0 de 0 registos",
                    "sInfoFiltered": "(filtrado de _MAX_ registos no total)",
                    "sInfoPostFix": "",
                    "sSearch": "Procurar:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Primeiro",
                        "sPrevious": "Anterior",
                        "sNext": "Seguinte",
                        "sLast": "Último"
                    }
                },
                parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

            /// <summary>
            /// Método construtor para a classe Tabela, chama o construtor do Widget
            /// </summary>
            function Tabela(elemento, titulo, dados) {
                // Construtor de Widget é chamado
                Widget.call(this, elemento, titulo);

                this.widgetTipo = "dados";
                this.widgetElemento = "Tabela";

                this.objectoServidor["widgetTipo"] = "dados";
                this.objectoServidor["widgetElemento"] = "tabela";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["agregacoes"] = [];

                if (dados !== null) {
                    this.dados = dados;

                } else {
                    this.dados = undefined;

                }

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(Tabela, Widget);


            /// <summary>
            /// Adapta os dados e acrescenta-os ao plugin das dataTables
            /// </summary>
            Tabela.prototype.InsereDados = function (id) {
                var objectoValores,
                    self = this,
                    dadosAnalisados = [],
                    opcoesData = { year: 'numeric', month: 'numeric', day: 'numeric' };

                self.dadosAnalisados = [];

                // Passar tudo para opcoes de estilo? to-do
                opcoesEstilo.columnDefs.push({
                    className: "dt-body-center"
                });


                // Para cada valor marcado
                self.dados.dados.Widgets[0].Items.forEach(function (item) {
                    // Limpar o objecto
                    objectoValores = {}

                    // Para cada "serie", chave
                    item.Valores.forEach(function (valor) {
                        var index = _.findIndex(self.seriesUtilizadas, function (serie) { return serie.Campo === valor.Nome }),
                            nomeVerificado = valor.Nome.replace(/\./g, '_');

                        if (index !== -1) {
                            // Guarda valor da "serie" no objecto
                            objectoValores[nomeVerificado] = valor.Valor.toFixed(3);

                        }

                    });


                    // Utiliza plugin moment para transformar a data num formato facil de sortear
                    objectoValores[ValorData] = moment(item.Data).format("YYYY / MM / DD");

                    // Guardar objecto no array
                    self.dadosAnalisados.push(objectoValores);

                });


                // Selecionado o id da table
                self.tabela = $("#" + self.id).find(".widget-table").DataTable({
                    // Apontar para onde estão os dados
                    data: self.dadosAnalisados,
                    // Especificar as colunas to-do
                    columns: self.ConstroiColuna(),
                    //order: [[ 3, "desc" ]],
                    "language": linguagem,
                    // Menu que escolhe o numero de elementos a mostrar
                    "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "Todos"]],
                    // Elementos a mostrar na página inicial
                    "pageLength": 5,
                    // Método para ligar as definições aqui to-do
                    columnDefs: opcoesEstilo.columnDefs
                });



                //self.OpcaoMostraDados();

            }


            /// <summary>
            /// Método InsereDados alternativo para o caso de ser um widget diferente a mostrar uma tabela
            /// </summary>
            Tabela.prototype.InsereDadosAlternativo = function (id, widgetTabela) {
                var objectoValores,
                    self = this,
                    dadosAnalisados = [],
                    opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                // Passar tudo para opcoes de estilo? to-do
                opcoesEstilo.columnDefs.push({
                    //targets: [1, 2],
                    className: "dt-body-center"
                });


                // Adiciona uma tabela base para aplicar as dataTables
                $("#" + self.id).find(".wrapper").append("<table " + "class=\"display widget-table\">" + "</table>")


                // Para cada valor marcado
                self.dados.dados.Widgets[0].Items.forEach(function (item) {
                    // Limpar o objecto
                    objectoValores = {}

                    // Para cada "serie", chave
                    item.Valores.forEach(function (valor) {
                        var nomeVerificado = valor.Nome.replace(/\./g, '_');

                        //// Guarda valor da "serie" no objecto
                        objectoValores[nomeVerificado] = valor.Valor.toFixed(3);
                    });


                    // Utiliza plugin moment para transformar a data num formato facil de sortear
                    objectoValores[ValorData] = moment(item.Data).format("YYYY / MM / DD");


                    // Guardar objecto no array
                    dadosAnalisados.push(objectoValores);

                });

                // Selecionado o id da table
                self.tabela = $("#" + self.id).find(".widget-table").DataTable({
                    // Apontar para onde estão os dados
                    data: dadosAnalisados,
                    // Especificar as colunas to-do
                    columns: widgetTabela.ConstroiColuna(),
                    //order: [[3, "desc"]],
                    "language": linguagem,
                    // Menu que escolhe o numero de elementos a mostrar
                    "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "Todos"]],
                    // Elementos a mostrar na página inicial
                    "pageLength": 5,
                    // Método para ligar as definições aqui to-do
                    columnDefs: opcoesEstilo.columnDefs
                });

            }


            /// <summary>
            /// "Constroi" as colunas para inserir na tabela
            /// </summary>
            Tabela.prototype.ConstroiColuna = function () {
                var self = this,
                    dados = d3.entries(self.dados),
                    // Guarda a informação que vai ser enviada
                    colunasTabela = [];

                console.log(self.seriesUtilizadas);

                // Para cada "serie"/chave de dados
                //d3.values(self.dados.dados.Widgets[0].Items[0].Valores).forEach(function (valorColuna, curIndex) {


                d3.values(self.seriesUtilizadas).forEach(function (valorColuna, curIndex) {
                    console.log(valorColuna);

                    // Valor do indicador alterado para ser posssivel comparar
                    var nomeVerificado = valorColuna.Campo.replace(/\./g, '_');

                    // Adicionar ao array
                    colunasTabela.push({
                        // O valor da key e o titulo a dar
                        data: nomeVerificado, title: valorColuna.Nome
                    })
                })

                // Nome do parametro que contem a data dentro do objecto dados (constante Data)
                colunasTabela.push({
                    data: ValorData, title: "Data"
                })

                console.log(colunasTabela);

                return colunasTabela;

            }


            /// <summary>
            /// Método que atualiza a tabela, p.ex a sua escala ou os dados
            /// </summary>
            Tabela.prototype.Atualiza = function () {
                var self = this

                // to-do

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção da tabela
            /// </summary>
            /// <param name="id"> Id que identifica o widget para motivos de seleção </param>
            Tabela.prototype.ConstroiGrafico = function (id) {
                var self = this;


                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("tabela");

                // to-do fazer a a analise da data sem modificar os dados originais

                // Adiciona uma tabela base para aplicar as dataTables
                $("#" + self.id).find(".wrapper").append("<table " + "class=\"display widget-table\">" + "</table>")

                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// Esconde a coluna selecionada pelo utilizador
            /// </summary>
            Tabela.prototype.EscondeColuna = function (id, coluna) {
                var self = this;


                // to-do
                $(".escondeColuna").on("click", "li", function (e) {

                    // Vai buscar o numero da coluna a remover
                    var column = tabela.column($(this).find(".valor").attr("value"));

                    // Inverte visibilidade
                    column.visible(!column.visible());
                });

            }





            return Tabela;

        })();



        /// <summary>
        /// Classe Filtros
        /// Module Pattern
        /// </summary>
        var Filtros = (function () {

            // Opcoes de filtros a ser guardados
            var opcoes,
                parseDate = d3.time.format("%y-%b-%d").parse,
                filtros;

            /// <summary>
            /// Método construtor para a classe Filtros, chama o construtor do Widget
            /// </summary>
            function Filtros(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);

                this.contexto = [];
                this.opcoes = [];

                this.widgetTipo = "contexto";
                this.widgetElemento = "filtros";

                // Define o tipo e o elemento do widget
                this.objectoServidor["widgetTipo"] = "contexto";
                this.objectoServidor["widgetElemento"] = "filtros";
                this.objectoServidor["contexto"] = [];

                this.filtros = [];

                // String que contém o valor por default da dropdownlist
                this.selecionado = "";

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(Filtros, Widget);


            /// <summary>
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            Filtros.prototype.ConstroiSVG = function () {
                var self = this;

                self.svg = $("#" + self.id).find(".wrapper").append("<span>Filtros: </span><select class=\"filtros-opcoes\"></select>");

                //self.svg = d3.select("#" + self.id).select(".wrapper").insert("svg")
                //    .attr("width", self.largura + self.margem.esquerda + self.margem.direita)
                //    .attr("height", self.altura + self.margem.cima + self.margem.baixo)
                //  .append("g")
                //    .attr("transform", "translate(" + self.margem.esquerda + "," + self.margem.cima + ")");

                //self.svg.call(tip);

            }


            /// <summary>
            /// Acrescenta os diferentes filtros à "dropdown"
            /// </summary>
            Filtros.prototype.InsereDados = function (id) {
                var self = this,
                    selecionado = "";

                $("#" + self.id).find(".filtros-opcoes").find("option").remove();


                self.opcoes.forEach(function (item) {
                    // Caso o item esteja activo, por como default
                    if (item.activo === true) {
                        $("#" + self.id).find(".filtros-opcoes").append('<option selected="selected" value="' + item.valor + '">' + item.label + '</option>');
                        //self.selecionado = item.valor;
                    }
                    else {
                        $("#" + self.id).find(".filtros-opcoes").append("<option value=" + item.valor + ">" + item.label + "</option>");
                    }

                });

                // Valor por defeito passa a ser o "activo"
                //$("#" + self.id).find(".filtros-opcoes").val(self.selecionado);

            }


            //TO-DO
            /// <summary>
            /// Método que atualiza a tabela, p.ex a sua escala ou os dados
            /// </summary>
            Filtros.prototype.Atualiza = function () {
                var self = this

                self.InsereDados();

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção dos Filtros
            /// </summary>
            Filtros.prototype.ConstroiGrafico = function (id) {
                var self = this;

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("filtros");

                // Inserir dados na tabela
                self.ConstroiSVG();
                self.InsereDados();

                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// Retorna o objectoServidor atualizado deste widget
            /// </summary>
            /// <returns> objecto para meios de comunicação, especificamente guardar a informação do widget </returns>
            Filtros.prototype.AtualizaObjectoServidor = function () {
                var self = this,
                    $elemento = $("#" + self.id).parent(),
                    objecto = {};


                // Atualização do widget e o Objecto que comunica com o servidor
                objecto["widgetLargura"] = $elemento.attr("data-gs-height");
                objecto["widgetAltura"] = $elemento.attr("data-gs-width");
                objecto["widgetX"] = $elemento.attr("data-gs-x");
                objecto["widgetY"] = $elemento.attr("data-gs-y");
                objecto["widgetTipo"] = self.widgetTipo;
                objecto["widgetElemento"] = self.widgetElemento;

                objecto["id"] = self.id;
                objecto["visivel"] = self.visivel;
                objecto["mostraLegenda"] = self.mostraLegenda;
                objecto["mostraToolTip"] = self.mostraToolTip;
                objecto["titulo"] = self.titulo;
                objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;

                objecto["contexto"] = self.contexto;
                objecto["contextoFiltro"] = self.contextoFiltro;

                objecto["opcoes"] = self.opcoes;

                return objecto;

            }


            /// <summary>
            /// Método para ordenar e guardar os filtros
            /// </summary>
            Filtros.prototype.GuardaFiltros = function (dados) {
                var self = this;

                // Apaga o campo da checkbox
                delete dados["CheckboxContexto"];
                // Apaga o botão dos dados
                delete dados["BotaoFiltro"];

                // Reset nos filtros
                self.filtros = [];

                // Para cada filtro 
                _.each(dados, function (item, key) {

                    // Caso o filtro não esteja vazio
                    if (item.label !== "" && item.label !== undefined) {

                        // Caso seja o texto selecionado
                        if ($("#" + self.id).find(".filtros-opcoes").find(":selected").text() === item.label) {
                            // Adicionar
                            self.filtros.push({ label: item.label, valor: item.valor, activo: true });
                        } else {
                            // Adicionar
                            self.filtros.push({ label: item.label, valor: item.valor, activo: false });
                        }

                    }

                });



                // Substituir nas opcoes
                self.opcoes = self.filtros;

                // Inserir os novos dados
                self.InsereDados();

                // Guarda objecto atualizado no objectoServidor
                self.objectoServidor = self.AtualizaObjectoServidor();

            }

            /// <summary>
            /// Atualiza as informações de acordo com a propertyGrid
            /// Também atualiza o checkboxMenu
            /// </summary>
            /// <param name="geral"> Objecto devolvido pela PropertyGridGeral </param>
            /// <param name="dados"> Objecto devolvido pela PropertyGridDados </param>
            /// <param name="aparencia"> Objecto devolvido pela PropertyGridAparencia </param>
            Filtros.prototype.AtualizaOpcoesProperty = function (geral, dados, aparencia) {
                var self = this;

                self.setTitulo(geral.Nome);
                self.setDescricao(geral.Descricao);

                self.GuardaFiltros(dados);

            }


            /// <summary>
            /// Getters e Setters dos filtros (opcoes)
            /// </summary>
            Filtros.prototype.getFiltros = function () {
                var self = this;

                return self.opcoes;
            }
            Filtros.prototype.setFiltros = function (filtros) {
                var self = this;

                self.opcoes = filtros;

            }

            /// <summary>
            /// Set filtro activo
            /// </summary>
            Filtros.prototype.setLabelAtivo = function (label) {
                var self = this;


                // Para cada opção
                self.opcoes.forEach(function (item) {
                    // Quando encontrar essa opção
                    if (item.label === label) {
                        item.activo = true;
                    }

                });

            }

            return Filtros;

        })();



        /// <summary>
        /// Classe Datas
        /// Module Pattern
        /// </summary>
        var Data = (function () {
            var datainicial,
                datafinal;
            // Opcoes de datas que vão ser utilizadas
            //var opcoes;


            /// <summary>
            /// Método construtor para a classe Data, chama o construtor do Widget
            /// </summary>
            function Data(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
                // Construtor de Widget é chamado
                Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);

                this.datainicial = "Data Inicial";
                this.datafinal = "Data Final";

                this.contexto = [];
                this.opcoes = {};

                this.widgetTipo = "contexto";
                this.widgetElemento = "datahora_simples";

                // Define o tipo e o elemento do widget
                this.objectoServidor["widgetTipo"] = "contexto";
                this.objectoServidor["widgetElemento"] = "datahora_simples";
                this.objectoServidor["contexto"] = [];
                this.objectoServidor["opcoes"] = {};

                this.dataDescricao = { dataInicio: "Data inicial", dataFim: "Data Final" };

                this.descricao = "widget data";

            };


            /// <summary>
            /// Herança é realizada através do método Herda
            /// </summary>
            Herda(Data, Widget);


            /// <summary>
            /// Remove a class do bootstrap que bloqueia o tamanho do datetimepicker
            /// </summary>
            Data.prototype.RemoveBootstrapClass = function () {
                var self = this;

                $("#" + self.id).find(".container .row").children().removeClass()

            }


            /// <summary>
            /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
            /// </summary>
            /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
            Data.prototype.ConstroiSVG = function () {
                var self = this;

                // Linguagem do browser ( Para motivos de Locale )
                var linguagem = "pt";


                // Acrescenta ao wrapper a primeira escolha
                self.svg = $("#" + self.id).find(".wrapper").append("<span class='datainicial-" + self.id + " '>Data Inicial</span>: <div class=\"container\">"
                    + "<div class=\"row\">"
                    + " <div class=\"col-sm-4\">"
                    + " <div class=\"form-group\">"
                    + " <div class=\"input-group date\" id=\"datetimepicker-" + self.id + "\">"
                      + "  <input type=\"text\" class=\"form-control\" />"
                       + " <span class=\"input-group-addon\">"
                       + " <span class=\"glyphicon glyphicon-calendar\"></span>"
                       + " </span>"
                       + " </div></div></div></div></div>");

                // Ligar o date time picker ao elemento
                $("#" + self.id).find("#datetimepicker-" + self.id).datetimepicker({
                    defaultDate: self.opcoes.dataInicio,
                    locale: linguagem,
                    widgetPositioning: {
                        vertical: "bottom"
                    },
                    widgetParent: $("#" + self.id).parent(),
                    showClose: true
                });



                // Acrescenta ao wrapper a segunda escolha
                self.svg = $("#" + self.id).find(".wrapper").append("<span class='datafinal-" + self.id + " '>Data Final</span>: <div class=\"container\">"
                    + "<div class=\"row\">"
                    + " <div class=\"col-sm-4\">"
                    + " <div class=\"form-group\">"
                    + " <div class=\"input-group date\" id=\"datetimepicker2-" + self.id + "\">"
                      + "  <input type=\"text\" class=\"form-control\" />"
                       + " <span class=\"input-group-addon\">"
                       + " <span class=\"glyphicon glyphicon-calendar\"></span>"
                       + " </span>"
                       + " </div></div></div></div></div>");

                // Ligar o date time picker ao elemento
                $("#" + self.id).find("#datetimepicker2-" + self.id).datetimepicker({
                    defaultDate: self.opcoes.dataFim,
                    locale: linguagem,
                    useCurrent: false,
                    widgetPositioning: {
                        vertical: "bottom"
                    },
                    widgetParent: $("#" + self.id).parent(),
                    showClose: true
                });

                self.svg = $("#" + self.id).find(".wrapper").append("<button type=\"button\" class=\"atualizaWidgetData\">Atualizar</button>")

                self.EventoAtualizaWidgets();

                // Método que impõe os eventos de limite de data aos "pickers"
                self.LimitaDatas();


                self.RemoveBootstrapClass();

            }


            /// <summary>
            /// Liga os eventos de limite de data aos "pickers"
            /// </summary>
            Data.prototype.LimitaDatas = function () {
                var self = this;


                // Caso haja uma mudança no primeiro ( inicial ) DateTimePicker
                $("#" + self.id).find("#datetimepicker-" + self.id).on("dp.change", function (e) {

                    // Não deixa escolher datas maiores que a data final
                    $("#" + self.id).find("#datetimepicker2-" + self.id).data("DateTimePicker").minDate(e.date);
                    self.GuardaDataInicial();

                });

                // Caso haja uma mudança no segundo ( final ) DateTimePicker
                $("#" + self.id).find("#datetimepicker2-" + self.id).on("dp.change", function (e) {

                    // Não deixa escolher datas menores que o máximo anterior
                    $("#" + self.id).find("#datetimepicker-" + self.id).data("DateTimePicker").maxDate(e.date);
                    self.GuardaDataFinal();

                });
            }


            //TO-DO
            /// <summary>
            /// Método que atualiza o widget
            /// </summary>
            Data.prototype.Atualiza = function () {
                var self = this

                self.AtualizaNomes();

                self.objectoServidor["opcoes"] = self.opcoes;

            }


            /// <summary>
            /// Encapsula todos os elementos necessários à construção dos Filtros
            /// </summary>
            Data.prototype.ConstroiGrafico = function (id) {
                var self = this;

                // Adiciona classe do gráfico ao widget
                //$("#" + self.id).addClass("data");

                // Inserir dados na tabela
                self.ConstroiSVG();

                self.setAtivo();
                self.RemoveAtivo();

            }


            /// <summary>
            /// Guarda a data Inicial dos "pickers" no próprio widget
            /// </summary>
            Data.prototype.GuardaDataInicial = function () {
                var self = this,
                    mes;

                if ($("#" + self.id).find("#datetimepicker-" + self.id).data("DateTimePicker").date() !== null) {

                    // Guarda o objecto data no widget ( Data Inicial )
                    self.opcoes.dataInicio = $("#" + self.id).find("#datetimepicker-" + self.id).data("DateTimePicker").date()._d;


                    mes = ("0" + (self.opcoes.dataInicio.getMonth() + 1)).slice(-2);
                    dia = ("0" + self.opcoes.dataInicio.getDate()).slice(-2);


                    // Passa o objecto data para o formato ideal para o widget guardar
                    self.opcoes.dataInicio = self.opcoes.dataInicio.getFullYear() + "-" + mes + "-" + dia;

                    self.Atualiza();
                }

            }


            /// <summary>
            /// Guarda a data Inicial dos "pickers" no próprio widget
            /// </summary
            Data.prototype.GuardaDataFinal = function () {
                var self = this,
                    mes;

                if ($("#" + self.id).find("#datetimepicker2-" + self.id).data("DateTimePicker").date() !== null) {

                    // Guarda o objecto data no widget ( Data Final )
                    self.opcoes.dataFim = $("#" + self.id).find("#datetimepicker2-" + self.id).data("DateTimePicker").date()._d;

                    mes = ("0" + (self.opcoes.dataFim.getMonth() + 1)).slice(-2);
                    dia = ("0" + self.opcoes.dataFim.getDate()).slice(-2);

                    // Passa o objecto data para o formato ideal para o widget guardar
                    self.opcoes.dataFim = self.opcoes.dataFim.getFullYear() + "-" + mes + "-" + dia;
                    self.Atualiza();

                }

            }


            /// <summary>
            /// Retorna as datas guardadas dentro do widget
            /// </summary>
            /// <returns> Objecto com 2 parametros, dataInicio e dataFim </returns>
            Data.prototype.getDatas = function () {
                var self = this;

                return self.opcoes;

            }


            /// <summary>
            /// Retorna o objectoServidor atualizado deste widget
            /// </summary>
            /// <returns> objecto para meios de comunicação, especificamente guardar a informação do widget </returns>
            Data.prototype.AtualizaObjectoServidor = function () {
                var self = this,
                    $elemento = $("#" + self.id).parent(),
                    objecto = {};

                // Atualização do widget e o Objecto que comunica com o servidor
                objecto["widgetLargura"] = $elemento.attr("data-gs-width");
                objecto["widgetAltura"] = $elemento.attr("data-gs-height");
                objecto["widgetX"] = $elemento.attr("data-gs-x");
                objecto["widgetY"] = $elemento.attr("data-gs-y");
                objecto["widgetTipo"] = self.widgetTipo;
                objecto["widgetElemento"] = self.widgetElemento;

                objecto["id"] = self.id;
                objecto["descricao"] = self.descricao;
                objecto["visivel"] = self.visivel;
                objecto["mostraLegenda"] = self.mostraLegenda;
                objecto["mostraToolTip"] = self.mostraToolTip;
                objecto["titulo"] = self.titulo;
                objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;
                objecto["contexto"] = self.contexto;
                objecto["opcoes"] = self.opcoes;

                return objecto;

            }


            /// <summary>
            /// Filtra a informação de acordo com as datas guardadas no widget
            /// </summary>
            /// <param name="widget"> Recebe os dados de um widget </param>
            Data.prototype.FiltraDados = function (widget) {
                var self = this,
                    opcoes;

                // Datas do filtro convertidas para serem comparadas
                dataInicioFiltro = Date.parse(self.opcoes.dataInicio),
                dataFimFiltro = Date.parse(self.opcoes.dataFim);

                // Adiciona ID ao objecto opcoes para o pedido ao primerCORE
                opcoes = self.opcoes;
                opcoes["id"] = self.id;

                if (opcoes.dataInicio === undefined || opcoes.dataFim === undefined) {
                    alert("As datas do widget Contexto são inválidas");
                } else {
                    widget.setDados(opcoes);
                }
                //if (widget.seriesUtilizadas > 0) {

                //}

            }


            /// <summary>
            /// Atualiza todos os widgets data
            /// </summary>
            Data.prototype.EventoAtualizaWidgets = function () {
                var self = this;

                $("#" + self.id).find(".atualizaWidgetData").click(function () {
                    console.log("ATUALIZA WIDGETS");
                    self.contexto.forEach(function (widgetID) {
                        gridPrincipal.RefreshWidget(widgetID);
                    });
                });

            }


            /// <summary>
            /// Getters e setters para os nomes das datas inicias e as data finais
            /// </summary>
            Data.prototype.getNomeDataInicial = function () {
                var self = this;

                return self.datainicial;
            }
            Data.prototype.setNomeDataInicial = function (datainicial) {
                var self = this;

                self.datainicial = datainicial;
            }
            Data.prototype.getNomeDataFinal = function () {
                var self = this;

                return self.datafinal;
            }
            Data.prototype.setNomeDataFinal = function (datafinal) {
                var self = this;

                self.datafinal = datafinal;
            }


            /// <summary>
            /// Getters e setters para a descrição das datas
            /// </summary>
            Data.prototype.getDataInicialDescricao = function () {
                var self = this;

                return self.dataDescricao.dataInicio;
            }
            Data.prototype.setDataInicialDescricao = function (string) {
                var self = this;

                self.dataDescricao.dataInicio = string;
            }
            Data.prototype.getDataFinalDescricao = function () {
                var self = this;

                return self.dataDescricao.dataFim;
            }
            Data.prototype.setDataFinalDescricao = function (string) {
                var self = this;

                self.dataDescricao.dataFim = string;
            }


            /// <summary>
            /// Atualiza as informações de acordo com a propertyGrid
            /// Também atualiza o checkboxMenu
            /// </summary>
            /// <param name="geral"> Objecto devolvido pela PropertyGridGeral </param>
            /// <param name="dados"> Objecto devolvido pela PropertyGridDados </param>
            /// <param name="aparencia"> Objecto devolvido pela PropertyGridAparencia </param>
            Data.prototype.AtualizaOpcoesProperty = function (geral, dados, aparencia) {
                var self = this,
                    objecto;

                self.setNomeDataInicial(dados.DataInicial);
                self.setNomeDataFinal(dados.DataFinal);
                self.setDataInicialDescricao(dados.DataInicialDescricao);
                self.setDataFinalDescricao(dados.DataFinalDescricao);

                self.setDescricao(geral.Descricao);
                self.setTitulo(geral.Nome);

                objecto = self.AtualizaObjectoServidor();

                self.objectoServidor = objecto;

                self.AtualizaNomes();

            }


            /// <summary>
            /// Método que atualiza diretamente os nomes no widget
            /// </summary>
            Data.prototype.AtualizaNomes = function () {
                var self = this;

                // Substitui datas com as datas guardadas no widget
                $(".datainicial-" + self.id).text(self.datainicial);
                $(".datafinal-" + self.id).text(self.datafinal);

            }



            return Data;


        })();



        /// <summary>
        /// Classe que contém as definições e métodos da property Grid (jqPropertyGrid)
        /// Module Pattern
        /// </summary>
        var PropertyGrid = (function () {
            var widget,
                widgetID,
                // Compara se está a saltar de widgets equivalentes ( Especial para Labels)
                flag,
                // Objecto com todos os valores inciais da dashboard ( Indicadores )
                dadosIniciais,
                // Valores que podem ser pesquisados
                indicadores,
                propertyGridElemento, // dashboard, data, dados
                propriedades = {},
                idSerie = 1,
                idFiltro = 1,
                Componente = [],
                CampoSeries = ["Vazio"],
                FuncaoSeries = ["Vazio", "Media", "Somatorio", "Minimo", "Maximo", "Contagem", "ContagemUnica"],
                Estilos = ["Continuo", "Descontinuo", "Pontos"],
                Angulos = [180, 45, 90, 135],
                FixoPeriodo = ["Selecione um periodo", "Ano", "Dia", "Hora", "Mes", "Minuto", "Segundo", "Semana", "Trimestre"];

            function PropertyGrid() {
                this.PropertyGrid = {};
            }

            // Inicializa o objecto de widgets da propertyGrid
            PropertyGrid.widgets = {};

            /// <summary>
            /// Conforme o modo da janela modifica as opções da property grid entre enabled e disabled
            /// </summary>
            PropertyGrid.TogglePermissao = function () {
                var self = this;

                if (modo === "visualizacao") {
                    $(".propriedades-sidebar").find('input, textarea, button, select').attr('disabled', 'disabled');
                    $(".sp-light").addClass("disabled");
                }

            }

            /// <summary>
            /// Retorna um objecto com as séries atuais do menu da propertyGrid
            /// </summary>
            /// <returns> Objecto com as séries dentro do menu dados</returns>
            PropertyGrid.GuardaSeries = function () {
                var objectoSeries = [],
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    index = 0;

                objectoSeries[0] = {};

                // Separar cada série dentro do widget
                _.each(objPropertyGridDados, function (item, key) {
                    var objecto = {},
                        chave;

                    // Como as quebras começam no numero 1, iniciamos o index a -1, e adicionamos no ciclo +2
                    // para ter um array em ordem, a começar do 0
                    if (key === "Quebra-" + (index + 1) || key === "QuebraFiltro-" + (index + 1)) {

                        // Separa chave do numero associado
                        chave = key.split('-');

                        // Se chegar ao ultimo quebra
                        // Adicionar ao objecto a propriedade com a chave correta
                        objectoSeries[index][chave[0]] = objPropertyGridDados[key];

                        // Aumenta o index
                        index++;
                        // Inicializa
                        objectoSeries[index] = {};

                        // Caso nao seja quebra ou alguma das propriedades do menu de periodo, 
                        // é adicionado ao objecto
                    } else if (key !== "Botao" && key !== "Fixo" && key !== "ComponenteContexto" && key !== "BotaoFiltro" && key !== "CheckboxContexto") {
                        // Separa chave do numero associado
                        chave = key.split('-');

                        // Adicionar ao objecto
                        objectoSeries[index][chave[0]] = objPropertyGridDados[key];

                    }

                });

                return objectoSeries;

            }


            /// <summary>
            /// Retorna um objecto com os filtros atuais do menu da propertyGrid
            /// </summary>
            /// <returns> Retorna o objecto com os filtros </returns>
            PropertyGrid.GuardaFiltros = function () {
                var self = this,
                    objectoFiltros = [],
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get");

                // Para cada parametro na propertyGrid
                _.each(objPropertyGridDados, function (item, key) {
                    // Caso não seja filtros
                    if (key !== "Botao" && key !== "Fixo" && key !== "ComponenteContexto" && key !== "BotaoFiltro" && key !== "CheckboxContexto") {
                        // Adicionar o filtro ao objecto
                        objectoFiltros.push(item);

                    }
                });

                return objectoFiltros;

            }


            /// <summary>
            // Getters e setters dos indicadores do widget 
            // o set neste caso é indicativo da classe propertygrid e não so widget
            /// </summary>
            PropertyGrid.setIndicadores = function (widgetID) {
                var self = this,
                    series;

                //// Adquire do servidor todos os tipos de indicadores
                //indicadores = JSON.parse(primerCORE.DashboardDadosIniciais());
                //// Adiciona à string original
                //opcoes.concat(Object.keys(indicadores.dados));


                self.inicializaDados.ComponenteSerie = { name: "Indicador:", group: "Series", type: "options", options: self.indicadores, description: "Widgets que contêm os gráficos", showHelp: false };

            }
            PropertyGrid.getIndicadores = function (widgetID) {
                var self = this,
                    opcoes = ["Selecione Indicador"];

                if (gridPrincipal.getWidget(widgetID).getIndicadores() !== undefined) {
                    gridPrincipal.getWidget(widgetID).getIndicadores().forEach(function (valor) { return opcoes.push(valor); })
                }

                return opcoes;

            }

            /// <summary>
            /// Constroi a propertyGrid
            /// </summary>
            PropertyGrid.ConstroiGrid = function () {
                var self = this,
                    cor = gridPrincipal.aparencia.cor || "",
                    grelha = gridPrincipal.aparencia.grelha;

                // Elimina grid antiga
                self.EliminaPropertyGrid();

                // Preenche com  dados do widget FUNÇÃO TODO
                self.PreencheValores();

                // Constroi as diferentes grids
                $('#propGridGeral').jqPropertyGrid(self.propriedadesGeral, self.inicializaGeral);
                // Caso não seja do tipo dashboard
                if (self.propertyGridElemento !== "dashboard") {
                    // Caso seja um gráfico do tipo dados
                    if (self.propertyGridElemento === "dados") {
                        // Seleciona indicadores para o widget ativo
                        self.setIndicadores($(".widget-ativo").attr("id"));
                    }
                    $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

                }

                if (self.propertyGridElemento === "dashboard") {
                    self.propriedadesAparencia = {
                        Fundo: cor,
                        Grelha: grelha
                    }
                }


                console.log("PROPRIEDADES APARENCIA");
                console.log(self.propriedadesAparencia);
                $('#propGridAparencia').jqPropertyGrid(self.propriedadesAparencia, self.inicializaAparencia);

            }

            /// <summary>
            /// Remove propertyGrid atual e a sua visualização
            /// </summary>
            PropertyGrid.RemoveGrid = function () {
                var self = this;

                // Remove a propertyGrid
                self.EliminaPropertyGrid();

                // Volta a mostrar o aviso de não estar nenhum widget/dashboard selecionado
                $(".opcoes-semPropertyGrid").css("display", "block");

                // Limpa menus excepto titulo e mete titulo vazio
                $(".opcoes-propertyGrid").css("display", "none");
                $(".nomeWidget-propertyGrid").text("");

            };

            /// <summary>
            /// Elimina da DOM as propertyGrids
            /// </summary>
            PropertyGrid.EliminaPropertyGrid = function () {
                $("#propGridGeral").children().remove();
                $("#propGridDados").children().remove();
                $("#propGridAparencia").children().remove();

            }

            /// <summary>
            /// Define o titulo do widget dentro da PROPERTYGRID
            /// Vai ser mostrado na propertyGrid para indicar de forma mais clara
            /// </summary>
            PropertyGrid.SetWidgetPropertyGrid = function (titulo, id, elemento) {
                var self = this;

                self.widgetID = id;

                // Dá um titulo conforme o widget selecionado
                $(".nomeWidget-propertyGrid").text(titulo + " - " + elemento);
            };

            /// <summary>
            /// Toggle do aviso que nenhum dashboard/widget estão ativos
            /// </summary>
            PropertyGrid.TogglePropertyGrid = function () {
                // Remove o div que mostra que nenhum dashboard/widget estão selecionados
                $(".opcoes-semPropertyGrid").css("display", "none");

            };

            /// <summary>
            /// Mostra a propertyGrid
            /// Cria a propertyGrid de acordo com o widget atualmente selecionado
            /// </summary>
            PropertyGrid.MostraPropertyGrid = function (tipoElemento) {
                var self = this;

                // "Reset" da grid para o geral
                self.SetGrid("geral");
                // Volta a mostrar as opções
                $(".opcoes-propertyGrid").css("display", "block");


                // todo Alternativa em caso de erro

                // Cria propertyGrid de acordo com o tipo de elemento
                if (tipoElemento === "datahora_simples") {
                    self.AdicionaGridData();
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
                } else if (tipoElemento === "grid") {
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "none");
                    self.AdicionaGridDashboard();
                } else if (tipoElemento === "filtros") {
                    self.AdicionaGridFiltro();
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
                } else if (tipoElemento === "gauge") {
                    self.AdicionaGridGauge();
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
                } else if (tipoElemento === "Etiqueta") {
                    self.AdicionaGridLabel();
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
                } else {
                    console.log("ADICIONA GRID NORMAL");
                    self.AdicionaGrid();
                    $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
                }

            }

            /// <summary>
            /// Modifica a box de acordo com a opcao enviada
            /// </summary>
            PropertyGrid.SetGrid = function (opcao) {
                var self = this;

                // Boxes
                //if (opcao === "geral" || opcao === "dados" || opcao === "aparencia") {
                //    $(".opcoes-propertyGrid").find(".box-propriedades").removeClass("box-ativo");
                //    $("[value='"+opcao+"']").addClass("box-ativo");
                //} else {
                //    console.log("ERRO - Opcao não existente")
                //}

                // Texto
                if (opcao === "geral" || opcao === "dados" || opcao === "aparencia") {
                    $(".opcoes-propertyGrid").find(".opcoes-ativo").removeClass("opcoes-ativo");
                    $("[value='" + opcao + "']").addClass("opcoes-ativo");
                } else {
                    console.log("ERRO - Opcao não existente")
                }

            }

            /// <summary>
            /// Modifica a propetyGrid para mostrar o tipo de menu recebido como argumento
            /// </summary>
            /// <param name="opcao"> Opcao a mostrar (geral, dados ou aparencia) </param>
            PropertyGrid.SetPropertyGrid = function (opcao) {
                if (opcao === "geral") {
                    $("#propGridGeral").css("display", "block");
                    $("#propGridDados").css("display", "none");
                    $("#propGridAparencia").css("display", "none");
                } else if (opcao === "dados") {
                    $("#propGridGeral").css("display", "none");
                    $("#propGridDados").css("display", "block");
                    $("#propGridAparencia").css("display", "none");
                } else {
                    $("#propGridGeral").css("display", "none");
                    $("#propGridDados").css("display", "none");
                    $("#propGridAparencia").css("display", "block");
                }
            }

            /// <summary>
            /// Atribui as opções possiveis no menu da associação
            /// </summary>
            /// <param name="listaWidgetsDados> Lista de widgets de dados </param>
            /// <param name="listaWidgetsContexto> Lista de widgets de contexto </param>
            PropertyGrid.setWidgets = function (listaWidgetsDados, listaWidgetsContexto) {
                var self = this;

                // Define as listas
                self.listaWidgetsDados = listaWidgetsDados;
                self.listaWidgetsContexto = listaWidgetsContexto;

                // Inicializa as dropdowns da propertygrid de acordo com os widgets que se encontram disponiveis
                self.inicializaDados.ComponenteContexto = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false },
                self.inicializaDados.ComponenteDados = { name: "Componente Dados", group: "Componentes", type: "options", options: self.listaWidgetsDados, description: "Widgets a associar", showHelp: false };

            }

            /// <summary>
            /// Volta a ligar os widgets de associacao
            /// </summary>
            PropertyGrid.ResetWidgets = function () {
                var self = this;

                // Inicializa as dropdowns da propertygrid de acordo com os widgets que se encontram disponiveis
                self.inicializaDados.ComponenteContexto = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false },
                self.inicializaDados.ComponenteDados = { name: "Componente Dados", group: "Componentes", type: "options", options: self.listaWidgetsDados, description: "Widgets a associar", showHelp: false };

            }

            /// <summary>
            /// Verifica se este widget pode ter mais séries
            /// </summary>
            /// <param name="widget"> widget que vai ser verificado </param>
            /// <returns> Retorna true se for possível adicionar novas séries e false se não for </returns>
            PropertyGrid.VerificaPermissaoSeries = function (widget) {
                var self = this,
                    permissao = false;

                // Verifica se é possivel adicionar mais séries
                if (widget.widgetElemento === "GraficoBarras") {
                    if (idSerie <= 3) {
                        permissao = true;
                    }
                }
                if (widget.widgetElemento === "GraficoLinhas" || widget.widgetElemento === "GraficoArea") {
                    if (idSerie <= 5) {
                        permissao = true;
                    }
                }
                if (widget.widgetElemento === "GraficoPie") {
                    permissao = true;
                }
                if (widget.widgetElemento === "Tabela") {
                    permissao = true;
                }

                return permissao
            }

            /// <summary>
            /// Obtem dados da propertyGrid atual
            /// </summary>
            PropertyGrid.getDados = function () {
                return $('#propGrid').jqPropertyGrid('get');
            }

            /// <summary>
            /// Getters para os dados disponiveis nas dropdowns
            /// </summary>
            PropertyGrid.getWidgetsDados = function () {
                return objecto.widgets.WidgetDados;
            }
            PropertyGrid.getWidgetsContexto = function () {
                return objecto.widgets.WidgetContexto;
            }



            /// #Region - Inicialização ----------------------------------

            // Inicialização da PropertyGrid - Inicialização dos atributos possiveis na propertyGrid
            PropertyGrid.Inicializa = function () {
                var self = this,
                    opcoes = ["Selecione Indicador"];

                // Inicializa valores possiveis para escolha
                // Adquire do servidor todos os tipos de indicadores
                self.dadosIniciais = JSON.parse(primerCORE.DashboardDadosIniciais());
                // Adiciona à string original
                self.indicadores = opcoes.concat(Object.keys(self.dadosIniciais.dados));


                // Inicializa todos os objectos necessários para criar as grids
                self.inicializaGeral = {
                    Nome: { name: "Nome:", group: "Geral", description: "Nome do componente", showHelp: false },
                    Descricao: { name: "Descrição:", group: "Geral", description: "Descrição do componente", showHelp: false }
                };
                self.inicializaDados = {
                    // Dados Widget DADOS
                    //NomeDados: { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false },
                    OcultarSerie: { name: "Mostrar/Ocultar:", group: "Series", type: "boolean", description: "Mostrar ou esconder a série no widget", showHelp: false },
                    Eliminar: { name: "Eliminar:", group: "Series", description: "Eliminar Série", showHelp: false },
                    Pesquisa: { name: "Pesquisa:", group: "Series", description: "Query de pesquisa para uma série", showHelp: false },
                    //ComponenteSerie: { name: "Indicador:", group: "Series", type: "options", options: [""], description: "Widgets que contêm os gráficos", showHelp: false },
                    //Campo: { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false },
                    //Funcao: { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false },
                    Botao: { name: " ", group: "Series", type: "botao", description: "../resources/ic_add_white_24dp_1x.png", showHelp: false },
                    Fixo: { name: "Fixo:", group: "Periodo", type: "options", options: FixoPeriodo, description: "Analisar numa data fixa", showHelp: false },
                    ComponenteContexto: { name: "Componente Data", group: "Periodo", type: "options", options: [""], description: "Analisar através de um widget", showHelp: false },
                    Quebra: { name: " ", group: "Series", type: "split", showHelp: false },


                    Campo: { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false },
                    Funcao: { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false },


                    // Dados Widget GAUGE 
                    valorAtual: { name: "Valor Atual", group: "Valores", type: "number", options: { min: 0 } },
                    valorMinimo: { name: "Valor Minimo", group: "Valores", type: "number", options: { min: 0 } },
                    valorMaximo: { name: "Valor Maximo", group: "Valores", type: "number", options: { min: 0 } },
                    valorMeta: { name: "Valor Meta", group: "Valores", type: "number", options: { min: 0 } },

                    // Dados Widget Label 
                    CheckboxValor: { name: "Valor", group: "Tipo Label", type: "boolean", description: "label valor", showHelp: false },
                    CheckboxVariavel: { name: "Variável", group: "Tipo Label", type: "boolean", description: "label variavel", showHelp: false },
                    CheckboxTexto: { name: "Texto", group: "Tipo Label", type: "boolean", description: "label texto", showHelp: false },
                    Texto: { group: "Conteudo Label", name: "Texto: ", description: "", showHelp: false },
                    UltimoValor: { name: "Só ultimo valor", group: "Periodo", type: "boolean", description: "Mostra só ultimo valor", showHelp: false },

                    // CONTEXTO
                    CheckboxContexto: { name: " ", group: "Widgets Ligados", type: "checkboxContexto", description: "Grupo de widgets", showHelp: false },

                    //Dados Widget CONTEXTO (DATA)
                    DataInicial: { name: "Data Inicial:", group: "Dados Iniciais", description: "Data inicial", showHelp: false },
                    DataInicialDescricao: { name: "Descricao:", group: "Dados Iniciais", description: "Descricao da Data inicial", showHelp: false },
                    DataFinal: { name: "Data Final:", group: "Dados Finais", description: "Data final", showHelp: false },
                    DataFinalDescricao: { name: "Descricao:", group: "Dados Finais", description: "Descricao da Data final", showHelp: false },
                    ComponenteDados: { name: "Componente Dados", group: "Componentes", type: "options", options: [""], description: "Widgets a associar", showHelp: false },

                    // Dados Widget CONTEXTO (FILTRO)
                    LabelFiltro: { name: "", group: "Opcoes Disponiveis", type: "filtro", description: "Labels para o widget Filtro", showHelp: false },
                    BotaoFiltro: { name: " ", group: "Opcoes Disponiveis", type: "botaoFiltro", description: "../resources/ic_add_white_24dp_1x.png", showHelp: false },
                    QuebraFiltro: { name: " ", group: "Opcoes Disponiveis", type: "splitFiltro", showHelp: false }

                };
                self.inicializaAparencia = {
                    MargemCima: { name: "Cima", group: "Margem", type: "number", options: { min: 0 } },
                    MargemBaixo: { name: "Baixo", group: "Margem", type: "number", options: { min: 0 } },
                    MargemEsquerda: { name: "Esquerda", group: "Margem", type: "number", options: { min: 0 } },
                    MargemDireita: { name: "Direita", group: "Margem", type: "number", options: { min: 0 } },

                    ContornoCor: { name: "Cor:", group: "Contorno", type: "color", options: { preferredFormat: "hex" }, description: modo, showHelp: false },
                    ContornoEstilo: { name: "Estilo:", group: "Contorno", type: "options", options: Estilos, description: "tipos possiveis para o estilo do contorno", showHelp: false },

                    MostraEixo: { name: "Mostra/Oculta:", group: "Eixos", type: "boolean", description: "label variavel", showHelp: false },
                    LinhasEixo: { name: "Numero Linhas:", group: "Eixos", type: "number", options: { min: 0 } },
                    AnguloEixo: { name: "Angulo:", group: "Eixos", type: "options", options: Estilos, description: "Angulos que a legenda dos eixos podem tomar", showHelp: false },

                    Margem: { name: "Margem:", group: "Aparencia", description: "Margem em volta do gráfico", showHelp: false },
                    MargemIgual: { name: "Aplicar Todos:", group: "Aparencia", description: "Aplicar a mesma margem a todos", showHelp: false },
                    MargemDiferente: { name: "Margens:", group: "Aparencia", description: "Aplicar diferentes margens", showHelp: false },
                    Fundo: { name: "Fundo:", group: "Fundo", type: "color", options: { preferredFormat: "hex" }, description: modo, showHelp: false },
                    Grelha: { name: "Esconder Grelha:", group: "Aparencia", type: "boolean", description: "Revelar ou ocultar a grelha", showHelp: false }
                };

            }

            // Inicialização da PropertyGrid - Inicialização dos atributos possiveis na propertyGrid
            PropertyGrid.InicializaEventos = function () {
                var self = this;

                // Adiciona o evento para adicionar/remover séries
                self.EventoAdicionaSerie();
                self.EventoRemoveSerie();

                self.EventoRemoveFiltro();
                self.EventoAdicionaFiltro();

                self.EventoAlteraBotão();

                self.EventoAdicionaAssociacao();
                self.EventoRemoveAssociacao();

                self.EventoBotaoAtualizar();

                self.EventoModificaMenuLabel();

            }

            // Incializa as séries na propertyGrid
            PropertyGrid.InicializaSeries = function () {
                var self = this,
                    opcoes = ["Selecione Indicador", "valor.valorMax", "valor.valorMed", "valor.valorMin"];

                gridPrincipal.getWidget($(".widget-ativo").attr("id")).seriesUtilizadas.forEach(function (item) {

                    self.inicializaDados["Nome-" + idSerie] = { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false };
                    self.inicializaDados["Pesquisa-" + idSerie] = { name: "Pesquisa", group: "Series", description: "Query", showHelp: false };
                    self.inicializaDados["ComponenteSerie-" + idSerie] = { name: "Indicador:", group: "Series", type: "options", options: self.indicadores/*self.getIndicadores($(".widget-ativo").attr("id"))*/, description: "Widgets que contêm os gráficos", showHelp: false };
                    self.inicializaDados["Campo-" + idSerie] = { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false };
                    self.inicializaDados["Funcao-" + idSerie] = { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false };
                    self.inicializaDados["Quebra-" + idSerie] = { name: " ", type: "split", group: "Series", description: idSerie, showHelp: false }

                    idSerie++;

                });

                self.PreencheSeries();

                self.AdicionaBotao();

            }

            // Incializa as séries na propertyGrid sem utilizar os dados atuais do widget
            // Utilizado para inicializar as series de uma propertyGrid sem o widget ter séries guardadas
            PropertyGrid.InicializaSeriesSemDados = function (seriesUtilizadas) {
                var self = this,
                    index = 1,
                    opcoes = ["Selecione Indicador", "valor.valorMax", "valor.valorMed", "valor.valorMin"];

                console.log(seriesUtilizadas);
                console.log(self.inicializaDados);

                seriesUtilizadas.forEach(function (item, curIndex) {
                    if (curIndex !== seriesUtilizadas.length - 1) {
                        self.inicializaDados["Nome-" + index] = { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false };
                        self.inicializaDados["Pesquisa-" + index] = { name: "Pesquisa", group: "Series", description: "Query", showHelp: false };
                        self.inicializaDados["ComponenteSerie-" + index] = { name: "Indicador:", group: "Series", type: "options", options: self.indicadores/*self.getIndicadores($(".widget-ativo").attr("id"))*/, description: "Widgets que contêm os gráficos", showHelp: false };
                        self.inicializaDados["Campo-" + index] = { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false };
                        self.inicializaDados["Funcao-" + index] = { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false };
                        self.inicializaDados["Quebra-" + index] = { name: " ", group: "Series", type: "split", description: index, showHelp: false }

                        index++;
                    }

                });

                // Reset no index
                index = 1;

                if (seriesUtilizadas !== undefined) {
                    seriesUtilizadas.forEach(function (serie, curIndex) {
                        if (curIndex !== seriesUtilizadas.length - 1) {
                            self.propriedadesDados["Nome-" + index] = serie.Nome || "Serie" + index;
                            self.propriedadesDados["Pesquisa-" + index] = serie.Pesquisa || "";
                            self.propriedadesDados["ComponenteSerie-" + index] = serie.ComponenteSerie;
                            // Preenche o componente do campo
                            self.PreencheCampo(index, serie.ComponenteSerie);

                            self.propriedadesDados["Campo-" + index] = serie.Campo;
                            self.propriedadesDados["Funcao-" + index] = serie.Funcao;
                            self.propriedadesDados["Quebra-" + index] = " ";

                            index++;
                        }
                    });
                }

                // Igual o idSerie ao index para que este não se perca e a próxima série seja sobreposta
                idSerie = index


                // Constroi a grid
                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

                self.SetPropertyGrid("dados");
                self.SetGrid("dados");

                self.AdicionaBotao();

            }



            // Inicializa os filtros/labels na propertyGrid
            PropertyGrid.InicializaFiltros = function () {
                var self = this;

                // Para cada filtro
                gridPrincipal.getWidget($(".widget-ativo").attr("id")).opcoes.forEach(function (filtro) {

                    console.log(filtro.label);
                    self.inicializaDados["Filtro-" + idFiltro] = { name: "", group: "Opcoes Disponiveis", description: filtro.label, type: "filtro", showHelp: false };
                    self.inicializaDados["QuebraFiltro-" + idFiltro] = { name: " ", group: "Opcoes Disponiveis", type: "splitFiltro", description: idFiltro, showHelp: false };

                    idFiltro++;
                });


                self.PreencheFiltros();

                self.RemoveBotaoFiltro();
                self.AdicionaBotaoFiltro();

            }

            // Inicializa os parametros da Gauge 
            PropertyGrid.InicializaGauge = function () {
                var self = this,
                    parametros = {};

                console.log(gridPrincipal.getWidget($(".widget-ativo").attr("id")));

                parametros["valorAtual"] = gridPrincipal.getWidget($(".widget-ativo").attr("id")).valorAtual;
                parametros["valorMaximo"] = gridPrincipal.getWidget($(".widget-ativo").attr("id")).valorMaximo;
                parametros["valorMinimo"] = gridPrincipal.getWidget($(".widget-ativo").attr("id")).valorMinimo;
                parametros["valorMeta"] = gridPrincipal.getWidget($(".widget-ativo").attr("id")).valorMeta;

                self.PreencheGauge(parametros);

            }



            /// #Region



            /// #Region - Preenche ----------------------------------

            // Popula a propertyGrid com valores defeito, adquiridos pelo Widget
            // to-do
            PropertyGrid.PreencheValores = function () {
                var self = this,
                    widgetID = $(".widget-ativo").attr("id");

                if (self.propertyGridElemento === "dados") {
                    var valorInicial = "";


                    // Encontra valor do componente de dados que se encontra ligado
                    gridPrincipal.getWidget(widgetID).contexto.forEach(function (valor) {
                        if (gridPrincipal.getWidget(valor).widgetElemento === "datahora_simples") {
                            valorInicial = gridPrincipal.getWidget(valor).id;
                        }
                    })

                    // Valores a inserir nas propertyGrids
                    self.propriedadesGeral["Nome"] = gridPrincipal.getWidget(widgetID).titulo;
                    self.propriedadesGeral["Descricao"] = gridPrincipal.getWidget(widgetID).descricao;



                    //self.propriedadesDados["Fixo"] = (gridPrincipal.getWidget(self.widgetID).fixo === undefined) ? "" : gridPrincipal.getWidget(self.widgetID).fixo;
                    self.propriedadesDados["ComponenteContexto"] = (valorInicial === "") ? "" : valorInicial;

                }

                if (self.propertyGridElemento === "data") {

                    console.log(gridPrincipal.getWidget(self.widgetID));

                    //Encontra valor do componente a que está ligado
                    gridPrincipal.getWidget(self.widgetID).contexto.forEach(function (valor) {
                        if (gridPrincipal.getWidget(valor).widgetTipo === "dados") {
                            valorInicial = gridPrincipal.getWidget(valor).id;
                        }
                    })

                    self.propriedadesDados["DataInicial"] = gridPrincipal.getWidget(widgetID).getNomeDataInicial();
                    self.propriedadesDados["DataInicialDescricao"] = gridPrincipal.getWidget(widgetID).getDataInicialDescricao();
                    self.propriedadesDados["DataFinal"] = gridPrincipal.getWidget(widgetID).getNomeDataFinal();
                    self.propriedadesDados["DataFinalDescricao"] = gridPrincipal.getWidget(widgetID).getDataFinalDescricao();

                }

                if (self.propertyGridElemento === "dashboard") {
                    self.propriedadesGeral["Nome"] = gridPrincipal.nome;
                    self.propriedadesGeral["Descricao"] = gridPrincipal.descricao;

                    //self.propriedadesAparencia["Fundo"] = "";
                    //self.propriedadesAparencia["Grelha"] = gridPrincipal.grelha true or false

                    self.propriedadesAparencia = {
                        Fundo: "",
                        Grelha: ""
                    }
                }

            }

            // Preenche séries do widget na PropertyGrid
            PropertyGrid.PreencheSeries = function (series) {
                var self = this,
                    index = 1;


                console.log(series);

                if (series !== undefined) {
                    series.forEach(function (serie) {
                        self.propriedadesDados["Nome-" + index] = serie.Nome || "Serie" + index;
                        self.propriedadesDados["Pesquisa-" + index] = serie.Pesquisa || "";
                        self.propriedadesDados["ComponenteSerie-" + index] = serie.ComponenteSerie;
                        // Preenche o campo de acordo com a ComponenteSerie
                        self.PreencheCampo(index, serie.ComponenteSerie);

                        self.propriedadesDados["Campo-" + index] = serie.Campo;
                        self.propriedadesDados["Funcao-" + index] = serie.Funcao;
                        self.propriedadesDados["Quebra-" + index] = " ";

                        index++;

                    });

                } else {
                    gridPrincipal.getWidget($(".widget-ativo").attr("id")).seriesUtilizadas.forEach(function (serie) {
                        self.propriedadesDados["Nome-" + index] = serie.Nome;
                        self.propriedadesDados["Pesquisa-" + index] = serie.Pesquisa;
                        self.propriedadesDados["ComponenteSerie-" + index] = serie.ComponenteSerie;
                        // Preenche o campo de acordo com a ComponenteSerie
                        self.PreencheCampo(index, serie.ComponenteSerie);

                        self.propriedadesDados["Campo-" + index] = serie.Campo;
                        self.propriedadesDados["Funcao-" + index] = serie.Funcao;
                        self.propriedadesDados["Quebra-" + index] = " ";

                        index++;

                    });

                }

            }

            // Preenche filtros do widget na PropertyGrid
            PropertyGrid.PreencheFiltros = function (filtros) {
                var self = this;
                index = 1;

                console.log(filtros);

                if (filtros !== undefined) {
                    if (filtros.length > 0) {
                        filtros.forEach(function (item) {
                            self.propriedadesDados["Filtro-" + index] = item.valor;
                            self.propriedadesDados["QuebraFiltro-" + index] = " ";

                            index++;

                        });

                    }
                } else {
                    // Para cada filtro
                    gridPrincipal.getWidget($(".widget-ativo").attr("id")).opcoes.forEach(function (filtro) {
                        self.propriedadesDados["Filtro-" + index] = filtro.valor;
                        self.propriedadesDados["QuebraFiltro-" + index] = " ";

                        index++;

                    });

                }



            }

            // Preenche parametros da gauge na PropertyGrid
            PropertyGrid.PreencheGauge = function (parametros) {
                var self = this;

                //Para cada parametro
                _.each(parametros, function (index, key, item) {
                    // Adicionar a tabela com o elemento correspondente o seu valor
                    $(".pgTable").find("[element=" + key + "]").val(parametros[key]);
                });

            }

            // Preenche os campos do Label na PropertyGrid
            // <param name="CheckboxEscolhida"> Opcao escolhida pelo utilizador </param>
            PropertyGrid.PreencheLabel = function (CheckboxEscolhida) {
                var self = this,
                    widget = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                // Caso seja o inicio ( Não haja nenhuma checkboxEscolhida )
                if (CheckboxEscolhida === undefined) {
                    CheckboxEscolhida = widget.tipo;
                }

                // Conforme o tipo de label, preenche os dados
                if (CheckboxEscolhida === "texto") {
                    self.propriedadesDados["Texto"] = widget.opcoes.texto;

                } else if (CheckboxEscolhida === "valor") {
                    self.propriedadesDados["valorAtual"] = widget.opcoes.valor;

                } else if (CheckboxEscolhida === "variavel") {
                    // ...
                    self.propriedadesDados["Pesquisa"] = widget.opcoes.variavel;

                }

            }


            // Preenche Campo conforme o Indicador que foi selecionado
            PropertyGrid.PreencheCampo = function (valor, indicador) {
                var self = this,
                    valores = [];

                console.log(self.dadosIniciais.dados[indicador]);

                // Caso o indicador não seja por defeito ou indefinido
                if (indicador !== "Selecione Indicador" && indicador !== undefined) {
                    // Para todos os dados iniciais desse indicador
                    self.dadosIniciais.dados[indicador].forEach(function (item) {
                        valores.push("valor." + item.Nome);
                    });

                    console.log(valores);

                    self.inicializaDados["Campo-" + valor] = { name: "Campo:", group: "Series", type: "options", options: valores, description: "Campos para ordenar os dados", showHelp: false };

                };

            }


            /// #Region



            ///  #Region - Adicionar PropertyGrids ----------------------------------

            // PropertyGrid - Dashboard
            PropertyGrid.AdicionaGridDashboard = function () {
                var self = this,
                    cor = gridPrincipal.aparencia.cor || "",
                    grelha = gridPrincipal.aparencia.grelha;

                self.widgetID = $(".widget-ativo").attr("id");


                console.log(gridPrincipal);

                // Valores a inserir nas propertyGrids
                self.propriedadesGeral = {
                    Nome: gridPrincipal.nome,
                    Descricao: gridPrincipal.descricao
                };

                self.propriedadesAparencia = {
                    Fundo: cor,
                    Grelha: grelha
                }

                console.log("PROPRIEDADES APARENCIA");
                console.log(gridPrincipal);
                console.log(self.propriedadesAparencia);

                self.propertyGridElemento = "dashboard";

                self.ConstroiGrid();
                self.SetGrid("geral");
                self.SetPropertyGrid("geral");

                self.EventoMostraGridAtual();

                self.TogglePermissao();

            }

            // PropertyGrid - Dados
            PropertyGrid.AdicionaGrid = function () {
                var self = this,
                    valorInicial = "";

                self.widgetID = $(".widget-ativo").attr("id");
                widget = gridPrincipal.getWidget(self.widgetID);

                self.Inicializa();
                self.ResetWidgets();
                idSerie = 1;

                // Valor do widget contexto que está ligado ao widget (Data)
                widget.contexto.forEach(function (valor) {
                    if (gridPrincipal.getWidget(valor).widgetElemento === "datahora_simples") {
                        valorInicial = gridPrincipal.getWidget(valor).titulo;
                    }
                })


                // Valores a inserir nas propertyGrids
                self.propriedadesGeral = {
                    Nome: widget.titulo,
                    Descricao: widget.descricao,
                };


                //// Caso tenha series utilizadas inicia sem botão
                //if(gridPrincipal.getWidget($(".widget-ativo").attr("id")).seriesUtilizadas.length > 0 ){
                //    self.propriedadesDados = {
                //        Fixo: "",
                //        ComponenteContexto: (valorInicial === "") ? "" : valorInicial
                //    };
                //} else {
                // Inicia apenas com  o botão
                self.propriedadesDados = {
                    Botao: "",
                    Fixo: "",
                    ComponenteContexto: (valorInicial === "") ? "" : valorInicial

                };
                //}


                self.propriedadesAparencia = {
                    MargemCima: widget.margem.cima,
                    MargemBaixo: widget.margem.baixo,
                    MargemEsquerda: widget.margem.esquerda,
                    MargemDireita: widget.margem.direita,

                    ContornoCor: "",
                    ContornoEstilo: "",

                    Fundo: ""
                }


                // Define o tipo de elemento a representar pela propertyGrid
                self.propertyGridElemento = "dados";

                // Constroi a grid
                self.ConstroiGrid();

                // Inicializar séries
                self.InicializaSeries();

                self.SetGrid("geral");
                self.SetPropertyGrid("geral");
                self.EventoMostraGridAtual();

                // Adquire os indicadores do widget a representar
                self.EventoAtualizaIndicadores($(".widget-ativo").attr("id"));


                self.EventoModificaIndicador();


                self.TogglePermissao();

            }

            // PropertyGrid - Widget Data
            PropertyGrid.AdicionaGridData = function () {
                var self = this;


                self.widgetID = $(".widget-ativo").attr("id");
                // Define as propertyGrids
                //self.Inicializa();

                // Valores a inserir nas propertyGrids
                self.propriedadesGeral = {
                    Nome: gridPrincipal.getWidget(self.widgetID).titulo,
                    Descricao: gridPrincipal.getWidget(self.widgetID).descricao,
                };
                self.propriedadesDados = {
                    CheckboxContexto: "",

                    DataInicial: "",
                    DataInicialDescricao: "",
                    DataFinal: "",
                    DataFinalDescricao: ""

                };
                self.propriedadesAparencia = {
                    Margem: "",
                    MargemIgual: "",
                    MargemDiferente: ""
                }

                self.propertyGridElemento = "data";

                self.ConstroiGrid();

                self.AdicionaCheckboxMenu();

                self.SetGrid("geral");
                self.SetPropertyGrid("geral");

                self.EventoAtualizaDatas();
                self.EventoMostraGridAtual();

                self.TogglePermissao();

            }

            // PropertyGrid - Widget Filtro
            PropertyGrid.AdicionaGridFiltro = function () {
                var self = this;

                self.widgetID = $(".widget-ativo").attr("id");

                self.Inicializa();
                self.ResetWidgets();
                idFiltro = 1;

                self.propriedadesGeral = {
                    Nome: gridPrincipal.getWidget(self.widgetID).titulo,
                    Descricao: gridPrincipal.getWidget(self.widgetID).descricao,
                };
                self.propriedadesDados = {
                    BotaoFiltro: "",
                    CheckboxContexto: ""
                };
                self.propriedadesAparencia = {
                    Margem: "",
                    MargemIgual: "",
                    MargemDiferente: ""
                }

                self.propertyGridElemento = "filtro";

                self.ConstroiGrid();

                // Inicializa os filtros do widget
                self.InicializaFiltros();

                self.AdicionaCheckboxMenu();

                self.SetGrid("geral");
                self.SetPropertyGrid("geral");

                self.EventoMostraGridAtual();

                self.TogglePermissao();

            }

            // PropertyGrid - Widget Gauge
            PropertyGrid.AdicionaGridGauge = function () {
                var self = this;

                self.widgetID = $(".widget-ativo").attr("id");

                self.Inicializa();
                self.ResetWidgets();

                self.propriedadesGeral = {
                    Nome: gridPrincipal.getWidget(self.widgetID).titulo,
                    Descricao: gridPrincipal.getWidget(self.widgetID).descricao,
                };
                self.propriedadesDados = {
                    valorAtual: "",
                    valorMinimo: "",
                    valorMaximo: "",
                    valorMeta: ""
                };
                self.propriedadesAparencia = {
                    Margem: "",
                    MargemIgual: "",
                    MargemDiferente: ""
                }

                self.propertyGridElemento = "gauge";

                self.ConstroiGrid();
                self.InicializaGauge();

                self.SetGrid("geral");
                self.SetPropertyGrid("geral");

                self.EventoMostraGridAtual();

                self.TogglePermissao();

            }

            // PropertyGrid - Widget Label
            PropertyGrid.AdicionaGridLabel = function () {
                var self = this,
                    CheckboxEscolhida;

                self.widgetID = $(".widget-ativo").attr("id");



                self.Inicializa();
                self.ResetWidgets();

                self.propriedadesGeral = {
                    Nome: gridPrincipal.getWidget(self.widgetID).titulo,
                    Descricao: gridPrincipal.getWidget(self.widgetID).descricao,
                };
                self.propriedadesDados = {
                    CheckboxValor: "",
                    CheckboxVariavel: "",
                    CheckboxTexto: ""
                };
                self.propriedadesAparencia = {
                    Margem: "",
                    MargemIgual: "",
                    MargemDiferente: ""
                }


                self.propertyGridElemento = "Etiqueta";

                console.log(gridPrincipal.getWidget(self.widgetID).tipo);

                console.log(flag === self.widgetID);


                // Conforme o seu tipo, definir o menu
                self.DefineMenuLabel(gridPrincipal.getWidget(self.widgetID).tipo)

                if (flag !== undefined) {
                    if (flag === self.widgetID) {
                        // Verificar se Label tem um tipo seleccionado
                        if ($(".propertyGrid").find('[value="CheckboxValor"]').is(":checked")) {
                            console.log("VALOR");
                            self.DefineMenuLabel("valor");
                            // Guarda valor escolhido
                            gridPrincipal.getWidget(self.widgetID).tipo = "valor";

                            // Caso a Checkbox Variavel seja true ou     o tipo seja variavel
                        } else if ($(".propertyGrid").find('[value="CheckboxVariavel"]').is(":checked")) {
                            console.log("VARIAVEL");
                            self.DefineMenuLabel("variavel");
                            // Guarda valor escolhido
                            gridPrincipal.getWidget(self.widgetID).tipo = "variavel";

                            // Caso a Checkbox Texto seja true ou o tipo seja texto
                        } else if ($(".propertyGrid").find('[value="CheckboxTexto"]').is(":checked")) {
                            console.log("TEXTO");
                            self.DefineMenuLabel("texto");
                            // Guarda valor escolhido
                            gridPrincipal.getWidget(self.widgetID).tipo = "texto";

                        }
                    }

                }

                // Constroi e inicializa
                self.PreencheLabel(gridPrincipal.getWidget(self.widgetID).tipo);
                self.ConstroiGrid();

                // Passa para o menu inicial
                self.SetGrid("geral");
                self.SetPropertyGrid("geral");
                self.EventoMostraGridAtual();
                self.TogglePermissao();



                // Preencher Checkbox de opção

                // Verificar se Label tem um tipo seleccionado
                if (CheckboxEscolhida === "valor") {
                    // Faz check ao valor
                    $(" .propertyGrid").find('[value="CheckboxValor"]').prop("checked", true);

                    // Caso a Checkbox Variavel seja true ou o tipo seja variavel
                } else if (CheckboxEscolhida === "variavel") {
                    // Faz check ao valor
                    $(" .propertyGrid").find('[value="CheckboxVariavel"]').prop("checked", true);

                    // Caso a Checkbox Texto seja true ou o tipo seja texto
                } else if (CheckboxEscolhida === "texto") {
                    // Faz check ao valor
                    $(".propertyGrid").find('[value="CheckboxTexto"]').prop("checked", true);

                    // Caso nenhum esteja escolhido, verificar se já há uma opção escolhida anteriormente
                } else {
                    if (gridPrincipal.getWidget(self.widgetID).tipo === "texto") {
                        $(" .propertyGrid").find('[value="CheckboxTexto"]').prop("checked", true);

                    } else if (gridPrincipal.getWidget(self.widgetID).tipo === "valor") {
                        $(" .propertyGrid").find('[value="CheckboxValor"]').prop("checked", true);

                    } else if (gridPrincipal.getWidget(self.widgetID).tipo === "variavel") {
                        $(" .propertyGrid").find('[value="CheckboxVariavel"]').prop("checked", true);

                    }

                }

                // Flag para comparar os widgets no inicio
                flag = self.widgetID;

            }



            // Função para definir o menu extra da Label
            // Dá um valor à variável propriedadesDados, conforme o tipo recebido
            PropertyGrid.DefineMenuLabel = function (tipo) {
                var self = this,
                    widget = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                if (tipo === "valor") {
                    self.propriedadesDados = {
                        CheckboxValor: "",
                        CheckboxVariavel: "",
                        CheckboxTexto: "",

                        valorAtual: ""

                    }

                } else if (tipo === "variavel") {
                    self.propriedadesDados = {
                        CheckboxValor: "",
                        CheckboxVariavel: "",
                        CheckboxTexto: "",
                        Pesquisa: "",
                        ComponenteDados: "",
                        Campo: "",
                        Funcao: "",
                        UltimoValor: "",
                        Fixo: ""


                    }

                } else if (tipo === "texto") {
                    self.propriedadesDados = {
                        CheckboxValor: "",
                        CheckboxVariavel: "",
                        CheckboxTexto: "",

                        Texto: ""

                    }

                }
            }

            // Evento ao mudar o tipo de Label escolhida
            PropertyGrid.EventoMudaCheckBox = function () {
                var self = this;


                $(".propertyGrid").find('[value="CheckboxValor"]').change(function () {
                    gridPrincipal.getWidget($(".widget-ativo").attr(id)).tipo = "valor";
                });
                $(".propertyGrid").find('[value="CheckboxVariavel"]').change(function () {

                    gridPrincipal.getWidget($(".widget-ativo").attr(id)).tipo = "variavel";
                });
                $(".propertyGrid").find('[value="CheckboxTexto"]').change(function () {
                    gridPrincipal.getWidget($(".widget-ativo").attr(id)).tipo = "texto";
                });

                //// Verificar se Label tem um tipo seleccionado
                //if ($(".propertyGrid").find('[value="CheckboxValor"]').is(":checked")) {
                //    console.log("VALOR");
                //    self.DefineMenuLabel("valor");
                //    // Guarda valor escolhido
                //    CheckboxEscolhida = "valor";

                //    // Caso a Checkbox Variavel seja true ou o tipo seja variavel
                //} else if ($(".propertyGrid").find('[value="CheckboxVariavel"]').is(":checked")) {
                //    console.log("VARIAVEL");
                //    self.DefineMenuLabel("variavel");
                //    // Guarda valor escolhido
                //    CheckboxEscolhida = "variavel";

                //    // Caso a Checkbox Texto seja true ou o tipo seja texto
                //} else if ($(".propertyGrid").find('[value="CheckboxTexto"]').is(":checked")) {
                //    console.log("TEXTO");
                //    self.DefineMenuLabel("texto");
                //    // Guarda valor escolhido
                //    CheckboxEscolhida = "texto";

                //}
            }



            /// #Region 



            /// #Region - Atualizações ----------------------------------

            //Associação
            PropertyGrid.AdicionaAssociacao = function () {
                var self = this;

                // Widgets a serem associados
                var widget1,
                    widget2,
                    // ID do componente a ser utilizado como contexto
                    tipoComponente,
                    // Adquire valores da caixa de propriedades em formato Objecto
                    valores = jQuery.parseJSON(JSON.stringify($('#propGridDados').jqPropertyGrid('get'), null, '\t'));

                //console.log("VERIFICA ADICIONA ASSOCIACAO");
                //console.log(widget1.widgetTipo === dados && widget1.contexto < 0);
                //console.log(widget2.widgetTipo === dados && widget2.contexto < 0);

                //if (widget1.widgetTipo === dados && widget1.contexto < 0) {
                //    if (widget2.widgetTipo === dados && widget2.contexto < 0) {

                // Adapta conforme o tipo de componente/propertyGrid 
                if (_.has(valores, "ComponenteContexto")) {
                    tipoComponente = valores.ComponenteContexto;
                } else if (_.has(valores, "ComponenteDados")) {
                    tipoComponente = valores.ComponenteDados;
                } else {
                    alert("Erro no tipoComponente");
                }


                // Caso sejam 2 valores diferentes do valor por defeito
                if (valores.WidgetDados !== "Sem componente" && tipoComponente !== "Sem componente") {

                    // Adquire referencia dos widgets a associar
                    widget1 = gridPrincipal.getWidget(tipoComponente);
                    widget2 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                    // Verificar erro
                    if (widget1 === undefined) {
                        alert("ERRO - (AdicionaAssociacao) Widget indefinido");
                        return;
                    }

                    console.log(widget1);

                    if ((_.findIndex(widget1.contexto, function (contexto) { return gridPrincipal.getWidget(contexto).widgetTipo === "contexto" })) === -1) {

                        // Associa o widget a cada um
                        verifica1 = widget1.AssociaWidget($(".widget-ativo").attr("id"));
                        verifica2 = widget2.AssociaWidget(tipoComponente);


                        // Caso os 2 tenham associado com sucesso
                        if (verifica1 === true & verifica2 === true) {
                            // Apresentar aviso
                            alert(widget2.titulo + " foi associado com sucesso a " + widget1.titulo);
                        }

                        console.log("Associacao - Refresh");

                        // Chama função para filtrar e desenhar os dados

                        if (widget1.widgetElemento !== "datahora_simples") {
                            gridPrincipal.RefreshWidget(widget1.id);

                        }
                        if (widget2.widgetElemento !== "datahora_simples") {
                            gridPrincipal.RefreshWidget(widget2.id);

                        }

                        // Atualiza os indicadores da propertyGrid
                        (widget1.widgetTipo === "contexto") ? self.setIndicadores(widget2.id) : self.setIndicadores(widget1.id);

                        //self.ConstroiGrid();

                    } else {
                        alert("O " + widget2.titulo + " já tem um widget contexto associado");
                    }
                }
                //    }
                //}


            }

            // Dashboard
            PropertyGrid.AtualizaDashboard = function () {
                var self = this,
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get");


                // Atualiza o titulo/descricao do widget com o nome inserido na box da propertyGrid
                gridPrincipal.setNome(objPropertyGridGeral.Nome);
                gridPrincipal.setDescricao(objPropertyGridGeral.Descricao);

                console.log(objPropertyGridAparencia);

                // Aparencia
                gridPrincipal.PintaBackground(objPropertyGridAparencia.Fundo);

            }

            // widget Dados
            PropertyGrid.AtualizaWidget = function () {
                var self = this,
                    widget1,
                    objectoSeries = [],
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    objPropertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get");


                // ID do widget contexto
                widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                // Atualiza os widgets com a sua informação
                gridPrincipal.getWidget(widget1.id).setTitulo(objPropertyGridGeral.Nome);
                gridPrincipal.getWidget(widget1.id).setDescricao(objPropertyGridGeral.Descricao);


                // Guarda as series 
                objectoSeries = self.GuardaSeries();

                // Caso o utilizador tenha posto o contexto "Sem componente"
                if (objPropertyGridDados.ComponenteContexto === "Sem componente") {
                    // Para cada contexto
                    widget1.contexto.forEach(function (item) {
                        // Se for do tipo datahora_simples ( Tipo contexto utilizado ) desassocia o widget
                        if (gridPrincipal.getWidget(item).widgetElemento === "datahora_simples") {
                            widget1.DesassociaWidget(item);
                            self.AdicionaGrid();
                            self.SetGrid("dados");
                            self.SetPropertyGrid("dados");
                        }
                    });

                    // Caso se altere o Contexto (escolhido =\= atual)
                } else if (!(widget1.PertenceContexto(gridPrincipal.getWidget(objPropertyGridDados.ComponenteContexto)))) {
                    // Adicionar nova associação
                    self.AdicionaAssociacao();
                }


                // Atualiza Widget (to-do atualizar dados? // Alerta)
                if (gridPrincipal.getWidget(widget1.id).dados !== undefined) {

                    console.log(objectoSeries);

                    // Adiciona as opcoes das séries ao objecto principal
                    gridPrincipal.getWidget(widget1.id).AdicionaSerieUtilizada(objectoSeries);

                    // Atualiza
                    gridPrincipal.getWidget(widget1.id).objectoServidor = gridPrincipal.getWidget(widget1.id).AtualizaObjectoServidor();
                    //gridPrincipal.getWidget(widget1.id).Atualiza();

                }


                //gridPrincipal.RefreshWidget(widget1.id);


                // Chama método para atualizar objecto servidor no widget
                gridPrincipal.GuardaInformacao();

            }

            // widget Data
            PropertyGrid.AtualizaWidgetData = function () {
                //$("#propGridGeral").change(function () {
                //    var widget1,
                //        objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get");

                //    // ID do widget contexto
                //    widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                //    gridPrincipal.getWidget(widget1.id).AtualizaOpcoesPropertyGeral(objPropertyGridGeral);
                //    gridPrincipal.getWidget(widget1.id).Atualiza();

                //    gridPrincipal.getWidget(widget1.id)

                //});

                //$("#propGridDados").change(function () {
                //    var widget1,
                //        objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get");

                //    // ID do widget contexto
                //    widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                //    // Trata das associações das checkboxes
                //    self.AssociaCheckBox(widget1);
                //    self.DesassociaCheckBox(widget1);

                //    // Chama função para filtrar e desenhar os dados
                //    gridPrincipal.FiltraContexto();

                //    gridPrincipal.getWidget(widget1.id).AtualizaOpcoesPropertyDados(objPropertyGridDados);
                //    gridPrincipal.getWidget(widget1.id).Atualiza();

                //    gridPrincipal.getWidget(widget1.id)

                //});

                //$("#propGridAparencia").change(function () {
                //    var widget1,
                //        objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get");

                //    // todo

                //});

                var self = this,
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get"),
                    // Widgets a serem associados
                    widget1;

                // ID do widget contexto
                widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                // Trata das associações das checkboxes
                self.AssociaCheckBox(widget1);
                self.DesassociaCheckBox(widget1);


                gridPrincipal.getWidget(self.widgetID).AtualizaOpcoesProperty(objPropertyGridGeral, objPropertyGridDados, objPrpertyGridAparencia);
                gridPrincipal.getWidget(self.widgetID).Atualiza();



                // Atualizar titulo dos widgets para o Menu Periodo
                self.listaWidgetsContexto.forEach(function (item, index) {
                    // Caso seja diferente doo primeiro index "Sem Componente"
                    if (index !== 0) {
                        item.text = gridPrincipal.getWidget(item.value).titulo;
                    }

                });

                // Atualizar menu "Componente Data"
                self.setWidgets(self.listaWidgetsDados, self.listaWidgetsContexto);

            }

            // widget Filtro
            PropertyGrid.AtualizaWidgetFiltro = function () {
                var self = this,
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get"),
                    // Widgets a serem associados
                    widget1;

                // ID do widget contexto
                widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                // Trata das associações das checkboxes
                self.AssociaCheckBox(widget1);
                self.DesassociaCheckBox(widget1);

                // Chama função para filtrar e desenhar os dados
                gridPrincipal.RefreshWidget(widget1.id);
                //gridPrincipal.FiltraContexto();


                // Atualizações
                gridPrincipal.getWidget(self.widgetID).AtualizaOpcoesProperty(objPropertyGridGeral, objPropertyGridDados, objPrpertyGridAparencia);
                gridPrincipal.getWidget(self.widgetID).Atualiza();

                console.log(widget1.opcoes.length);
                // Caso só haja um filtro, meter esse filtro como activo
                if (widget1.opcoes.length === 1) {
                    widget1.setLabelAtivo(widget1.opcoes[0].label);
                }
            }

            // widget Gauge
            PropertyGrid.AtualizaWidgetGauge = function () {
                var self = this,
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get"),
                    // Widgets a serem associados
                    widget1;

                if (objPropertyGridDados.valorAtual > objPropertyGridDados.valorMaximo) {
                    alert("Valor atual é superior ao valor máximo");
                } else if (objPropertyGridDados.valorMinimo > objPropertyGridDados.valorMaximo) {
                    alert("Valor minimo é superior ao valor máximo");
                } else if (objPropertyGridDados.valorMinimo > objPropertyGridDados.valorAtual) {
                    alert("Valor minimo é superior ao valor atual");
                } else if (objPropertyGridDados.valorMeta > objPropertyGridDados.valorMáximo) {
                    alert("Valor meta é superior ao valor máximo");
                } else if (objPropertyGridDados.valorMeta < objPropertyGridDados.valorMinimo) {
                    alert("Valor meta é inferior ao valor minimo");
                } else {
                    // ID do widget contexto
                    widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));
                    widget1.AtualizaOpcoesProperty(objPropertyGridDados, objPropertyGridGeral);

                }

            }

            // widget Label (KPI)
            PropertyGrid.AtualizaWidgetLabel = function () {
                var self = this,
                    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
                    objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get"),
                    // Widgets a serem associados
                    widget1;


                // ID do widget contexto
                widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                widget1.AtualizaOpcoesProperty(objPropertyGridDados, objPropertyGridGeral);

            }


            /// Função para associar checkboxes
            /// <param name="widget1"> Objecto widget contexto </param>
            PropertyGrid.AssociaCheckBox = function (widget1) {
                var self = this,
                    widget2;

                // Caso estejam checked
                $(".checkboxContexto").find(":checked").each(function (value, item) {

                    // Adquire referencia do widgets a associar
                    widget2 = gridPrincipal.getWidget(item.value);

                    console.log(widget1);
                    console.log(widget2);

                    // Caso não pertença já ao widget selecionado
                    if (!(widget1.PertenceContexto(widget2))) {
                        // Verificar erro
                        if (widget1 === undefined) {
                            alert("ERRO - (AssociaCheckBox) Widget indefinido");
                            return;
                        }

                        if ((_.findIndex(widget1.contexto, function (contexto) { return gridPrincipal.getWidget(contexto).widgetTipo === "contexto" })) === -1) {

                            // Associa o widget a cada um
                            verifica1 = widget1.AssociaWidget(widget2.id);
                            verifica2 = widget2.AssociaWidget(widget1.id);


                            // Caso os 2 tenham associado com sucesso
                            if (verifica1 === true & verifica2 === true) {
                                // Apresentar aviso
                                alert(widget1.titulo + " foi associado com sucesso a " + widget2.titulo);
                            }


                            // Chama função para filtrar e desenhar os dados
                            //gridPrincipal.FiltraContexto();

                            if (widget1.widgetElemento !== "datahora_simples") {
                                gridPrincipal.RefreshWidget(widget1.id);

                            }
                            if (widget2.widgetElemento !== "datahora_simples") {
                                gridPrincipal.RefreshWidget(widget2.id);

                            }


                            // Atualiza os indicadores da propertyGrid
                            (widget1.widgetTipo === "contexto") ? self.setIndicadores(widget2.id) : self.setIndicadores(widget1.id);

                            //self.ConstroiGrid();

                        } else {
                            alert("O " + widget1.titulo + " já tem um widget contexto associado");
                        }
                    }

                });
            }


            /// Função para desassociar checkboxes
            /// <param name="widget1"> Objecto widget contexto </param>
            PropertyGrid.DesassociaCheckBox = function (widget1) {
                var self = this,
                    widget2;


                // Caso não estejam checked
                $(".checkboxContexto input").not(":checked").each(function (value, item) {

                    // Adquire referencia do widgets a associar
                    widget2 = gridPrincipal.getWidget(item.value);

                    // Caso widget2 pertença a widget1 é possivel fazer a desassociação
                    if (widget1.PertenceContexto(widget2) || widget1.PertenceFiltro(widget2)) {
                        // Desassocia o widget a cada um
                        verifica1 = widget1.DesassociaWidget(widget2.id);
                        verifica2 = widget2.DesassociaWidget(widget1.id);

                        // Caso os 2 tenham desassociado com sucesso
                        if (verifica1 === true & verifica2 === true) {
                            // Apresentar aviso
                            alert(widget1.titulo + " foi desassociado com sucesso a " + widget2.titulo);

                            self.EventoAtualizaIndicadores(widget2.id);

                            self.AdicionaCheckboxMenu();

                        } else {
                            // Apresentar aviso
                            //alert(widget1.titulo + " não está associado com " + widget2.titulo);

                        }

                    }

                });
            }


            // Atualiza a PropertyGrid de acordo com o tipo de widget
            PropertyGrid.AtualizaPropertyGrid = function () {
                var self = this;

                if (self.propertyGridElemento === "dashboard") {
                    self.AtualizaDashboard();
                } else if (self.propertyGridElemento === "dados") {
                    self.AtualizaWidget();
                } else if (self.propertyGridElemento === "data") {
                    self.AtualizaWidgetData();
                } else if (self.propertyGridElemento === "filtro") {
                    self.AtualizaWidgetFiltro();
                } else if (self.propertyGridElemento === "gauge") {
                    self.AtualizaWidgetGauge();
                } else if (self.propertyGridElemento === "Etiqueta") {
                    self.AtualizaWidgetLabel();
                }
            }


            /// #Region



            /// #Region - Eventos ----------------------------------

            // Ao modificar as Checkbox num widget Label, os menus modificam
            PropertyGrid.EventoModificaMenuLabel = function () {
                var self = this;

                // Quando  a checkbox com o valor "CheckboxValor" é modificada
                $(".propertyGrid").on("change", '[value="CheckboxValor"]', function () {
                    // Caso esteja checked
                    if ($(this).is(":checked")) {
                        // Passar os outros para falso
                        $(" .propertyGrid").find('[value="CheckboxTexto"]').prop("checked", false);
                        $(" .propertyGrid").find('[value="CheckboxVariavel"]').prop("checked", false);
                        // Voltar a adicionar a grid
                        self.AdicionaGridLabel();
                        // Passar o Atual para verdadeiro 
                        $(" .propertyGrid").find('[value="CheckboxValor"]').prop("checked", true);
                        // Passar para o menu correto
                        self.SetGrid("dados");
                        self.SetPropertyGrid("dados");

                    } else {
                        // Caso nenhuma esteja checked
                        if (!($(".pgTable").find("[type=checkbox]").is(":checked"))) {
                            // Reset da propertyGrid
                            self.AdicionaGridLabel();
                            self.SetPropertyGrid("dados");
                            self.SetGrid("dados");
                        }
                    }

                });

                // Quando  a checkbox com o valor "CheckboxVariavel" é modificada
                $(".propertyGrid").on("change", '[value="CheckboxVariavel"]', function () {
                    if ($(this).is(":checked")) {
                        // Passar os outros para falso
                        $(" .propertyGrid").find('[value="CheckboxValor"]').prop("checked", false);
                        $(" .propertyGrid").find('[value="CheckboxTexto"]').prop("checked", false);
                        // Voltar a adicionar a grid
                        self.AdicionaGridLabel();
                        $(" .propertyGrid").find('[value="CheckboxVariavel"]').prop("checked", true);
                        // Passar para o menu correto
                        self.SetGrid("dados");
                        self.SetPropertyGrid("dados");

                    } else {
                        // Caso nenhuma esteja checked
                        if (!($(".pgTable").find("[type=checkbox]").is(":checked"))) {
                            // Reset da propertyGrid
                            self.AdicionaGridLabel();
                            self.SetPropertyGrid("dados");
                            self.SetGrid("dados");
                        }
                    }

                });

                // Quando  a checkbox com o valor "CheckboxTexto" é modificada
                $(".propertyGrid").on("change", '[value="CheckboxTexto"]', function () {
                    if ($(this).is(":checked")) {
                        // Passar os outros para falso
                        $(" .propertyGrid").find('[value="CheckboxValor"]').prop("checked", false);
                        $(" .propertyGrid").find('[value="CheckboxVariavel"]').prop("checked", false);
                        // Voltar a adicionar a grid
                        self.AdicionaGridLabel();
                        $(" .propertyGrid").find('[value="CheckboxTexto"]').prop("checked", true);
                        // Passar para o menu correto
                        self.SetGrid("dados");
                        self.SetPropertyGrid("dados");
                    } else {
                        // Caso nenhuma esteja checked
                        if (!($(".pgTable").find("[type=checkbox]").is(":checked"))) {
                            // Reset da propertyGrid
                            self.AdicionaGridLabel();
                            self.SetPropertyGrid("dados");
                            self.SetGrid("dados");
                        }
                    }

                });

            }


            // Altera o estilo dos botões "box" de menu geral/dados/aparencia da propertyGrid
            PropertyGrid.EventoAlteraBotão = function () {

                // box
                //$(".box-propriedades").click(function () {
                //    if (!$(this).hasClass("box-ativo")) {
                //        $(".opcoes-propertyGrid").find(".box-propriedades").removeClass("box-ativo");
                //        $(this).addClass("box-ativo");
                //    }
                //});

                // texto
                $(".opcaoTexto-propertyGrid").click(function () {
                    if (!$(this).hasClass("opcoes-ativo")) {
                        $(".opcoes-propertyGrid").find(".opcaoTexto-propertyGrid").removeClass("opcoes-ativo");
                        $(this).addClass("opcoes-ativo");
                    }
                });

            }

            // Mostra grid equivalente ao valor selecionado
            PropertyGrid.EventoMostraGridAtual = function () {
                // Box
                //$(".box-propriedades").click(function () {
                //    if ($(this).attr("value") === "geral") {
                //        $("#propGridGeral").css("display", "block");
                //        $("#propGridDados").css("display", "none");
                //        $("#propGridAparencia").css("display", "none");
                //    } else if ($(this).attr("value") === "dados") {
                //        $("#propGridGeral").css("display", "none");
                //        $("#propGridDados").css("display", "block");
                //        $("#propGridAparencia").css("display", "none");
                //    } else {
                //        $("#propGridGeral").css("display", "none");
                //        $("#propGridDados").css("display", "none");
                //        $("#propGridAparencia").css("display", "block");
                //    }

                //});

                // Texto
                $(".opcaoTexto-propertyGrid").click(function () {
                    if ($(this).attr("value") === "geral") {
                        $("#propGridGeral").css("display", "block");
                        $("#propGridDados").css("display", "none");
                        $("#propGridAparencia").css("display", "none");
                    } else if ($(this).attr("value") === "dados") {
                        $("#propGridGeral").css("display", "none");
                        $("#propGridDados").css("display", "block");
                        $("#propGridAparencia").css("display", "none");
                    } else {
                        $("#propGridGeral").css("display", "none");
                        $("#propGridDados").css("display", "none");
                        $("#propGridAparencia").css("display", "block");
                    }

                });
            }



            // Adiciona um botão à grid
            PropertyGrid.EventoAdicionaSerie = function () {
                var self = this;

                $(document).on("click", ".adicionaSerie-propertyGrid", function () {
                    var widget = gridPrincipal.getWidget($(".widget-ativo").attr("id")),
                        permissao = false;

                    permissao = self.VerificaPermissaoSeries(widget);

                    // Verifica se o widget tem um contexto Data
                    if (widget.VerificaDataContexto() && permissao === true) {
                        self.RemoveBotao();
                        self.RemoveMenuPeriodo();
                        self.AdicionaSerie();
                        self.AdicionaMenuPeriodo();

                        console.log(self.propriedadesDados);

                    } else {
                        if (permissao === false) {
                            alert("Chegou ao número máximo de séries para este Widget")

                        } else {
                            alert("Este widget não tem um contexto Data");

                        }

                    }

                });
            }

            // Remove uma serie da grid
            PropertyGrid.EventoRemoveSerie = function () {
                var self = this,
                    objectoSeries;


                // Ao clickar no botão para remover propertyGrid
                $(document).on("click", ".removeSerie-propertyGrid", function () {
                    var widget = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                    console.log($(this).attr("value"));
                    console.log(widget.seriesUtilizadas.length);

                    console.log($(this).attr("value") <= widget.seriesUtilizadas.length);

                    // Caso não hajam séries guardadas
                    if (widget.seriesUtilizadas.length === 0 || $(this).attr("value") > widget.seriesUtilizadas.length) {

                        //// TODO ATUAL
                        objectoSeries = self.GuardaSeries();

                        // Remove a posição indicada
                        objectoSeries.splice($(this).attr("value") - 1, 1);


                        // Volta a desenhar a grid
                        self.AdicionaGrid();
                        // Inicializa os dados depois da remoção da série escolhida
                        self.InicializaSeriesSemDados(objectoSeries);


                    } else {
                        if (confirm("Deseja apagar a série - " + widget.seriesUtilizadas[($(this).attr("value")) - 1].Nome + " ?")) {
                            // Remove a série com o valor
                            self.RemoveSerie($(this).attr("value"));

                            // Volta a desenhar a grid
                            self.AdicionaGrid();

                            // Mete no menu original
                            self.SetPropertyGrid("dados");
                            self.SetGrid("dados");

                            // Desenha gráfico
                            gridPrincipal.RefreshWidget(widget.id);
                            //gridPrincipal.FiltraContexto();
                        }

                    }
                });
            }


            // Adiciona um filtro à grid
            PropertyGrid.EventoAdicionaFiltro = function () {
                var self = this;

                $(document).on("click", ".adicionaOpcao-propertyGrid", function () {
                    self.RemoveBotaoFiltro();
                    self.AdicionaFiltro();
                    //self.AdicionaBotaoFiltro();

                });

            }

            // Remove um filtro da grid
            PropertyGrid.EventoRemoveFiltro = function () {
                var self = this;

                $(document).on("click", ".removeFiltro-propertyGrid", function () {
                    var widget = gridPrincipal.getWidget($(".widget-ativo").attr("id")),
                        objectoFiltro = [];

                    // Guarda filtros já preenchidos
                    objectoFiltro = self.propertyGuardaFiltros();

                    if (widget.opcoes[$(this).attr("value") - 1] !== undefined) {
                        if (confirm("Deseja apagar o filtro - " + widget.opcoes[($(this).attr("value")) - 1] + " ?")) {
                            // Remove a série com o valor
                            self.RemoveFiltro($(this).attr("value"));
                        }
                    }

                    objectoFiltro.splice($(this).attr("value") - 1, 1);


                    // Volta a desenhar a grid
                    self.AdicionaGridFiltro();

                    objectoFiltro.forEach(function (filtro) {
                        self.inicializaDados["Filtro-" + idFiltro] = { name: "", group: "Opcoes Disponiveis", description: filtro.label, type: "filtro", showHelp: false };
                        self.inicializaDados["QuebraFiltro-" + idFiltro] = { name: " ", group: "Opcoes Disponiveis", type: "splitFiltro", description: idFiltro, showHelp: false };

                        idFiltro++;

                    })

                    self.PreencheFiltros(objectoFiltro);

                    // Constroi a grid
                    $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

                    // Mete no menu original
                    self.SetPropertyGrid("dados");
                    self.SetGrid("dados");


                    //} else {
                    //    if (confirm("Deseja apagar o filtro - " + widget.opcoes[($(this).attr("value")) - 1] + " ?")) {
                    //        // Remove a série com o valor
                    //        self.RemoveFiltro($(this).attr("value"));

                    //        // Volta a desenhar a grid
                    //        self.AdicionaGridFiltro();

                    //        // Mete no menu original
                    //        self.SetPropertyGrid("dados");
                    //        self.SetGrid("dados");



                    //        // Desenha gráfico
                    //        //gridPrincipal.FiltraContexto();

                    //    }

                    //}
                });

            }


            // Atualiza datas no widget de contexto Datas
            PropertyGrid.EventoAtualizaDatas = function () {
                var self = this;

                gridPrincipal.getWidget(self.widgetID).AtualizaNomes();

            }


            // Associa os widgets através da opção escolhida pela propertyGrid (Dropdownlist)
            PropertyGrid.EventoAdicionaAssociacao = function () {
                var self = this;

                // Ao pressionar adicionar
                $(".adicionarAssociacao").click(function () {
                    self.AdicionaAssociacao();
                    self.ConstroiGrid();
                });

            }

            // Desassocia os widgets indicados pela propertyGrid
            PropertyGrid.EventoRemoveAssociacao = function () {
                // Ao remover associacao
                $(".removerAssociacao").click(function () {
                    // Widgets a serem associados
                    var widget1,
                        widget2,
                        // Define o tipo de componente que do widget
                        tipoComponente,
                        // Adquire valores da caixa de propriedades em formato Objecto
                        valores = jQuery.parseJSON(JSON.stringify($('#propGridDados').jqPropertyGrid('get'), null, '\t'));


                    // Adapta conforme o tipo de componente/propertyGrid
                    if (_.has(valores, "ComponenteContexto")) {
                        tipoComponente = valores.ComponenteContexto;

                    } else if (_.has(valores, "ComponenteDados")) {
                        tipoComponente = valores.ComponenteDados;

                    } else {
                        alert("Erro no tipoComponente");

                    }

                    // Caso sejam 2 valores diferentes do "default"
                    if (valores.WidgetDados !== "Dados" && tipoComponente !== "Sem componente") {

                        // Adquire referencia dos widgets a associar
                        widget1 = gridPrincipal.getWidget(tipoComponente);
                        widget2 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                        // Associa o widget a cada um
                        verifica1 = widget1.DesassociaWidget($(".widget-ativo").attr("id"));
                        verifica2 = widget2.DesassociaWidget(tipoComponente);
                    }


                    // Caso os 2 tenham desassociado com sucesso
                    if (verifica1 === true & verifica2 === true) {
                        // Apresentar aviso
                        alert($(".widget-ativo").attr("id") + " foi desassociado com sucesso a " + tipoComponente);

                        self.EventoAtualizaIndicadores();

                        console.log("Remove Associacao - Refresh");

                        // Chama função para filtrar e desenhar os dados
                        gridPrincipal.RefreshWidget(widget1.id);
                        gridPrincipal.RefreshWidget(widget2.id);
                        //gridPrincipal.FiltraContexto();

                    } else {
                        // Apresentar aviso
                        alert($(".widget-ativo").attr("id") + " não está associado com " + tipoComponente);

                    }


                });

            }


            // Atualiza indicadores ao adicionar Associacao
            /// <param name="widgetID"> ID do widget para atualizar os indicadores </param>  
            PropertyGrid.EventoAtualizaIndicadores = function (widgetID) {
                var self = this;

                self.setIndicadores(widgetID);
                self.ConstroiGrid();

            }

            // Liga os eventos de atualização ao botão na propertyGrid
            PropertyGrid.EventoBotaoAtualizar = function () {
                var self = this;

                // todo melhorar, passar o atualiza para dentro do evento e encapsular

                // Liga o evento de atualização ao botão
                $(".atualiza-propertyGrid").click(function () {
                    self.AtualizaPropertyGrid();

                    if (gridPrincipal.getWidget($(".widget-ativo").attr("id")).widgetElemento !== "datahora_simples") {
                        gridPrincipal.RefreshWidget($(".widget-ativo").attr("id"));

                    }

                    //gridPrincipal.FiltraContexto();
                });

            }

            // Modifica os dados do campo após mudança dos indicadores
            PropertyGrid.EventoModificaIndicador = function () {
                var self = this;

                $(document).on("change", ".dropdownIndicadores", function (item) {
                    // ID do campo a modificar
                    var id = $(this).attr("id").split("-")[1];
                    // Remove opções antigas
                    $("#Campo-" + id).find("option").remove();

                    // Para cada um dos parametros possiveis para o Indicador
                    self.dadosIniciais.dados[$(this).val()].forEach(function (item) {
                        $("#Campo-" + id).append('<option value="valor.' + item.Nome + '">valor.' + item.Nome + '</option>')

                    });

                });

            }

            /// #Region 



            /// #Region - ADICIONA/REMOVE Menus ----------------------------------

            // Adiciona menu de checkbox aos widgets contexto 
            // Menu que mostra todos os widgets disponiveis para ligação, estando já marcados os que estão ligados
            PropertyGrid.AdicionaCheckboxMenu = function () {
                var self = this;

                // Faz reset aos checkbox
                $(".checkboxContexto").children().remove();

                // Para contexto data
                gridPrincipal.listaWidgets.forEach(function (item) {
                    if (item.widgetTipo === "dados") {
                        if (_.findIndex(item.contexto, function (item) { return item === self.widgetID }) !== -1 || _.findIndex(item.contextoFiltro, function (item) { return item === self.widgetID }) !== -1) {
                            $(".checkboxContexto").append("<input type='checkbox' value=" + item.id + " checked>  <span>" + item.titulo + "</span><br>");
                        } else {
                            $(".checkboxContexto").append("<input type='checkbox' value=" + item.id + ">  <span>" + item.titulo + "</span><br>");
                        }

                    }
                });

            }


            // Guarda Filtros da propertyGrid
            PropertyGrid.propertyGuardaFiltros = function () {
                var self = this,
                    objectoFiltros = [],
                    index = 1;


                // Adquire valores na propertyGrid
                objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get");

                // Para cada propriedade no objPropertyGrid
                _.each(objPropertyGridDados, function (item, key) {


                    // Caso seja um filtro, adiciona a um objecto temporário
                    if (key === "Filtro-" + index) {
                        objectoFiltros.push({ "label": item.label, "valor": item.valor });
                        self.inicializaDados["Filtro-" + index].description = item.label;

                        index++;
                    }

                });

                return objectoFiltros;

            }


            // Adiciona um filtro na propertyGrid do widget Filtro
            PropertyGrid.AdicionaFiltro = function () {
                var self = this,
                    objectoFiltros = [];



                // Inicializar novas séries
                self.inicializaDados["Filtro-" + idFiltro] = { name: " ", group: "Opcoes Disponiveis", type: "filtro", description: "", showHelp: false };
                self.inicializaDados["QuebraFiltro-" + idFiltro] = { name: " ", type: "splitFiltro", group: "Opcoes Disponiveis", description: idFiltro, showHelp: false };

                self.propriedadesDados["Filtro-" + idFiltro] = "";
                self.propriedadesDados["QuebraFiltro-" + idFiltro] = "";

                // Guarda valores preenchidos
                objectoFiltros = self.propertyGuardaFiltros();

                // Constroi a grid
                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);


                // Preenche valores e envia objecto com os filtros que já se encontram na propertyGrid
                self.PreencheFiltros(objectoFiltros);

                self.AdicionaBotaoFiltro();
                self.AdicionaCheckboxMenu();

                idFiltro++;

            }

            // Remove um filtro
            PropertyGrid.RemoveFiltro = function (serie) {
                var self = this,
                    widget = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                console.log("REMOVE");
                console.log(serie);

                // Remove a posição indicada
                widget.opcoes.splice(serie - 1, 1);

                console.log(widget.opcoes);

                // Atualiza o widget 
                gridPrincipal.getWidget($(".widget-ativo").attr("id")).GuardaFiltros(widget.opcoes);


            }


            // Adiciona um  menu Series no property grid
            PropertyGrid.AdicionaSerie = function () {
                var self = this,
                    serieAuxiliar,
                    objectoSeries = self.GuardaSeries(),
                    opcoes = ["Selecione Indicador", "valor.valorMax", "valor.valorMed", "valor.valorMin"];


                // Inicializa os componentes de uma nova série
                self.inicializaDados["Nome-" + idSerie] = { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false };
                self.inicializaDados["Pesquisa-" + idSerie] = { name: "Pesquisa:", group: "Series", description: "Query de pesquisa", showHelp: false };
                self.inicializaDados["ComponenteSerie-" + idSerie] = { name: "Indicador:", group: "Series", type: "options", options: self.indicadores/*self.getIndicadores($(".widget-ativo").attr("id"))*/, description: "Widgets que contêm os gráficos", showHelp: false };
                self.inicializaDados["Campo-" + idSerie] = { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false };
                self.inicializaDados["Funcao-" + idSerie] = { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false };
                self.inicializaDados["Quebra-" + idSerie] = { name: " ", type: "split", group: "Series", description: idSerie, showHelp: false };

                // Inicializa propriedades e o botão
                self.AdicionaPropriedades();
                self.AdicionaBotao();

                // Constroi a grid
                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

                console.log(objectoSeries);
                self.PreencheSeries(objectoSeries);

                // Liga o evento de atualização ao botão
                $(".atualizaWidget-propertyGrid").click(function () {
                    self.Atualiza();
                })

                // Incrementa numero de série
                idSerie++;

            }

            // Remove uma série
            PropertyGrid.RemoveSerie = function (serie, SemDados) {
                var self = this,
                    objectoSeries,
                    widget = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                // Remove a posição indicada
                widget.seriesUtilizadas.splice(serie - 1, 1);

                // Atualiza o widget
                gridPrincipal.getWidget($(".widget-ativo").attr("id")).AdicionaSerieUtilizada(widget.seriesUtilizadas);

            }


            // Adiciona ao objecto das propriedades uma nova Série
            PropertyGrid.AdicionaPropriedades = function () {
                var self = this;

                self.propriedadesDados["Nome-" + idSerie] = "Serie" + idSerie;
                self.propriedadesDados["Pesquisa-" + idSerie] = "";
                self.propriedadesDados["ComponenteSerie-" + idSerie] = "";
                self.propriedadesDados["Campo-" + idSerie] = "Campo";
                self.propriedadesDados["Funcao-" + idSerie] = "Funcao";
                self.propriedadesDados["Quebra-" + idSerie] = "";

            }


            // Adiciona Menu Periodo ( Componentes filtro por data ) à propertyGrid
            PropertyGrid.AdicionaMenuPeriodo = function () {
                var self = this,
                    valorInicial = "";


                self.inicializaDados["Fixo"] = { name: "Fixo:", group: "Periodo", type: "options", options: FixoPeriodo, description: "Analisar numa data fixa", showHelp: false };
                self.inicializaDados["ComponenteContexto"] = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false };

                self.propriedadesDados["Fixo"] = "";
                self.propriedadesDados["ComponenteContexto"] = "";

                // Preenche valores por defeito
                self.PreencheValores();

                console.log(self.propriedadesDados);
                console.log(self.inicializaDados);

                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

            }

            // Remove Menu periodo
            PropertyGrid.RemoveMenuPeriodo = function () {
                var self = this,
                    object = self.inicializaDados;

                delete PropertyGrid.propriedadesDados["Fixo"];
                delete PropertyGrid.propriedadesDados["ComponenteContexto"];
                delete object["Fixo"];
                delete object["ComponenteContexto"];
            }


            /// #Region



            /// # Region - Botões ----------------------------------


            // Adiciona um botão à propertyGrid
            PropertyGrid.AdicionaBotao = function () {
                var self = this;

                self.inicializaDados["Botao"] = { name: " ", group: "Series", type: "botao", description: "../resources/ic_add_circle_white_24dp_1x.png", showHelp: false };
                self.propriedadesDados["Botao"] = "";

                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

            }

            // Remove o botão da propertyGrid
            PropertyGrid.RemoveBotao = function () {
                var self = this,
                    object = self.inicializaDados;


                delete PropertyGrid.propriedadesDados["Botao"];
                delete object["Botao"];
            }



            // Adiciona um botão à propertyGrid do widget Filtro
            PropertyGrid.AdicionaBotaoFiltro = function () {
                var self = this;

                self.inicializaDados["BotaoFiltro"] = { name: " ", group: "Opcoes Disponiveis", type: "botaoFiltro", description: "../resources/ic_add_circle_white_24dp_1x.png", showHelp: false };
                self.propriedadesDados["BotaoFiltro"] = " ";

                $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

            }

            // Remove o botão da propertyGrid do widget Filtro
            PropertyGrid.RemoveBotaoFiltro = function () {
                var self = this,
                    object = self.inicializaDados;


                delete PropertyGrid.propriedadesDados["BotaoFiltro"];
                delete object["BotaoFiltro"];
            }


            /// #Region


            return PropertyGrid;

        })();



        /// <summary>
        /// Class Grid, um dashboard, vai conter todos os widgets
        /// Module Pattern
        /// </summary>
        var Grid = (function () {

            var grid,
                nome,
                descricao,
                tipoGrid,
                id,
                opcoes,
                tamanhoMinimo = 3,
                tamanhoMaximo = 3,
                // to-do IMPORTANTE
                idUnico = 0,
                listaWidgets = [],
                // Definição de cada Menu Widget
                widgetsGrafico = ["GraficoArea", "GraficoBarras", "GraficoLinhas", "GraficoPie"],
                widgetsLabel = ["Etiqueta"],
                widgetsOutros = ["gauge", "Tabela"],
                widgetsFiltros = ["datahora_simples", "filtros"];


            /// <summary>
            /// Construtor da class Grid
            /// </summary>
            /// <param name="id"> Identificador da grid </param>
            /// <param name="opcoes"> Objecto com as opcoes para a inicializacao da grid </param>
            function Grid(id, opcoes, tipoGrid) {
                var self = this;

                self.id = id;
                self.opcoes = opcoes;
                self.tipoGrid = tipoGrid;

                self.nome = "Novo Dashboard";
                self.descricao = "Dashboard de indicadores";
                self.idUnico = idUnico++;

                self.aparencia = {
                    grelha: false
                };

                self.Inicializa();
            }


            /// <summary>
            /// Inicializa a "grid" com as opccoes que foram dadas pelo utilizador
            /// </summary>
            Grid.prototype.Inicializa = function () {
                var self = this;

                // Inicializa lista de widgets
                self.listaWidgets = [];

                // Atribuição à variavel grid da referencia para a "grid"
                self.grid = $("#" + self.id);


                // Inicialização da "grid" com as opcoes enviadas no construtor
                self.opcoes["gridObject"] = self;
                self.opcoes["PropertyGrid"] = PropertyGrid;
                self.opcoes["platformObject"] = Utilizador;
                self.grid.gridstack(self.opcoes);

                if (self.id === "main-gridstack") {
                    // Atualiza ao fazer resize
                    self.AtualizaWidgets();
                }

                // Evento para esconder widgets
                self.EscondeWidget();

                // Modifica titulo e remove widget à "grid"
                self.RemoveWidget();


                // Caso se trata de uma barra secundária
                if (self.tipoGrid === "barraSecundaria") {
                    // Ao pressionar no elemento com a class especifica da grid
                    $("#" + self.id).parent().parent().click(function () {
                        // Preencher barra
                        self.PreencheBarraLateral();
                    });

                }

                // Guarda informação no Widget sempre que um é modificado
                // self.GuardaInformacao();

                if (self.id === "main-gridstack") {
                    // Liga o evento ao botão cria dados e ao clickar no botão uma tabela é criada
                    // com os dados desse widget
                    self.VerTabela();
                    self.EventoGridAtiva();
                    self.EventoRemoveGridAtiva();
                    self.EventoToggleGrelha();
                    self.EventoResizeEcra();

                }

            }


            /// <summary>
            /// Preenche cor de background do dashboard
            /// </summary>
            Grid.prototype.PintaBackground = function (cor) {
                var self = this;

                // Caso a cor recebida seja vazia
                if (cor === "empty") {
                    $("#" + self.id).css("background-color", "");
                    // Senão pinta
                } else {
                    $("#" + self.id).css("background-color", cor);

                }

                self.aparencia["cor"] = cor;


            }


            /// #Region - ADICIONAR/CRIAR ELEMENTOS

            /// <summary>
            /// Método para adicionar widgets à "grid"
            /// </summary>
            /// <param name="tipoWidget"> Tipo de widget a ser adicionado a grid </param>
            /// <param name
            Grid.prototype.AdicionaWidget = function (tipoWidget, titulo, dados, width, height, x, y, novo, idAlternativo) {
                var self = this,
                    coordenadaX = x || "0",
                    coordenadaY = y || "0",
                    GUID = (idAlternativo !== undefined) ? GUID = idAlternativo : getGUID(),
                    el,
                    width,
                    height,
                    minWidth,
                    minHeight,
                    maxWidth,
                    maxHeight,
                    autoPosition,
                    ultimo;

                // Dar titulo caso o recebido seja inválido
                if (titulo === undefined) titulo = "titulo";
                if (width === undefined) width = 2;
                if (height === undefined) height = 2;
                if (dados === undefined) dados = null;


                if (novo === true) {
                    el = self.CriaElementInicial(GUID, titulo);

                } else
                    if (self.id === "main-gridstack") {
                        el = self.CriaElemento(idUnico, titulo);
                        (minWidth === undefined) ? minWidth = 3 : minWidth = minWidth;
                        (minHeight === undefined) ? minHeight = 3 : minHeight = minHeight;

                    } else {
                        el = self.CriaElementoSecundario(GUID, titulo, tipoWidget);

                    }

                // Atributo opcional, define uma posição automática para o widget
                // Ao modificar para fora, insere numa posição diferente
                // to-do
                //autoPosition = true;


                // Altura e largura minima para cada widget
                //(minWidth === undefined)? minWidth = 2 : minWidth = minWidth;
                //(minHeight === undefined) ? minHeight = 2 : minHeight = minHeight;


                // Impor limite no eixo do X para widget não sair fora dos limites
                if (coordenadaX > 10) {
                    coordenadaX = 10;
                }

                // Impor limite no eixo do Y
                if (coordenadaY >= 50) {
                    coordenadaY = 50;
                }


                // Adiciona widget, biblioteca gridstack
                // apenas é obrigatório o atributo el
                self.grid.data("gridstack").addWidget(el, coordenadaX, coordenadaY, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id);


                // Define tamanho da listaWidgets
                ultimo = self.listaWidgets.length;



                // Adiciona o widget criado ao dashboard
                self.AdicionaWidgetLista(tipoWidget, GUID, dados);



                // Atribui ao widget a sua class
                self.listaWidgets[ultimo].setWidgetClass(tipoWidget);


                // Caso o dashboard não seja o sidebar
                if (self.id === "main-gridstack") {
                    // Constroi Gráfico no Widget
                    self.listaWidgets[ultimo].ConstroiGrafico(self.listaWidgets[ultimo].id);
                } else {
                    var path = '../resources/' + tipoWidget + ".png";
                    $("#" + self.listaWidgets[ultimo].id).find(".wrapper").append('<img class="imagem-widget" src="' + path + '" />')
                }

                // Incrementar para não haver Ids iguais
                idUnico++;

            }

            /// <summary>
            /// Adiciona o widget criado na lista de widgets da grid
            /// </summary>
            /// <param name="tipoWidget"> Tipo de widget a ser adicionado </param>
            /// <param name="id"> Id do widget a ser adicionado </param>
            /// <param name="dados"> Caso o widget tenha dados vindos de outro widget (Tabela) </param>
            Grid.prototype.AdicionaWidgetLista = function (tipoWidget, id, dados) {
                var self = this;

                // todo Factory de classes
                switch (tipoWidget) {
                    case "GraficoArea":
                        self.listaWidgets.push(new GraficoArea(id, "GraficoArea"));
                        break;
                    case "GraficoBarras":
                        self.listaWidgets.push(new GraficoBarras(id, "GraficoBarras"));
                        break;
                    case "GraficoLinhas":
                        self.listaWidgets.push(new GraficoLinhas(id, "GraficoLinhas"));
                        break;
                    case "gauge":
                        self.listaWidgets.push(new Gauge(id, "Gauge"));
                        break;
                    case "Etiqueta":
                        self.listaWidgets.push(new KPI(id, "Etiqueta"));
                        break;
                    case "Tabela":
                        self.listaWidgets.push(new Tabela(id, "Tabela", dados));
                        break;
                    case "GraficoPie":
                        self.listaWidgets.push(new PieChart(id, "GraficoPie"));
                        break;
                    case "filtros":
                        self.listaWidgets.push(new Filtros(id, "Filtros"));
                        break;
                    case "datahora_simples":
                        self.listaWidgets.push(new Data(id, "Data"));
                        break;
                }
            }

            /// <summary>
            /// Cria um elemento HTM base, para um widget que ainda não esteja criado, por exemplo a carregar widgets
            /// </summary>
            Grid.prototype.CriaElementInicial = function (id, titulo) {

                //id=\"widget" + idUnico + "\"

                var el = "<div class=\"grid-stack-item nao-seleciona\">" +
                         // Div do conteudo do item da grid
                         "<div id=" + id + " class=\"grid-stack-item-content box panel panel-default\">" +
                         // to-do idUnico melhor
                         // Navbar da widget
                         "<div class=\"widget-navbar panel-heading\">" +
                            // Titulo do widget
                            "<span class=\" titulo\">" + titulo + "</span> <img class=\"showHelp\" src=\"../resources/ic_info_outline_black_24dp_1x.png\" data-toggle=\"tooltip\" title=\"Hooray!\" style=\"max-width:15px; position:relative; top:-5px;\" />" +
                            // Dropdown com as opcoes possiveis para o widget
                           "<div class=\"dropdown\" style=\"float:right;\">" +
                           "<button class=\"btn btn-default dropdown-toggle\" style=\"background-image:none; padding:2px;\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">" +
                           "Acções" +
                           "<span class=\"caret\"></span>" + "</button>" +
                               "<ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenu1\">" +
                                   "<li><a class=\"remove-widget\" href=\"#\"> Remove Widget </a></li>" +
                               "</ul>" + "</div>" +
                         "</div>" +
                         "<div class=\"wrapper panel-body\">" +
                         // Conteudo do widget
                         "<div class=\"widget-conteudo\"> " +
                         "</div>" + "</div>" +
                         "<div class=\"legenda\">" +
                         "</div>" + "</div> " + "</div>";

                return el;
            }

            /// <summary>
            /// Método que cria o elemento HTML para um widget já criado
            /// </summary>
            /// <returns> Retorna uma fundação base HTML para o widget </returns>
            Grid.prototype.CriaElemento = function (id, titulo) {

                var el = "<div class=\"widget-navbar panel-heading\">" +
                            // Titulo do widget
                            "<span class=\" titulo\">" + titulo + "</span> <img class=\"showHelp\" src=\"../resources/ic_info_outline_black_24dp_1x.png\" data-toggle=\"tooltip\" title=\"Hooray!\" style=\"max-width:15px; position:relative; top:-5px;\" />" +
                            // Dropdown com as opcoes possiveis para o widget
                           "<div class=\"dropdown\" style=\"float:right;\">" +
                           "<button class=\"btn btn-default dropdown-toggle\" style=\"background-image:none; padding:2px;\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">" +
                           "Acções" +
                           "<span class=\"caret\"></span>" + "</button>" +
                               "<ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenu1\">" +
                                   "<li><a class=\"remove-widget\" href=\"#\"> Remove Widget </a></li>" +
                                   "<li><a class=\"edita-widget\" href=\"#\"> Modifica titulo</a></li>" +
                               "</ul>" + "</div>" +
                         "</div>" +
                         "<div class=\"wrapper panel-body\">" +
                         // Conteudo do widget
                         "<div class=\"widget-conteudo\"> " +
                         "</div>" + "</div>" +
                         "<div class=\"legenda\">" +
                         "</div>";

                //var el = "<div class=\"grid-stack-item nao-seleciona\">" +
                //         // Div do conteudo do item da grid
                //         "<div id=\"widget" + idUnico + "\" class=\"grid-stack-item-content box panel panel-default\">" +
                //         // to-do idUnico melhor
                //         // Navbar da widget
                //         "<div class=\"widget-navbar panel-heading\">" +
                //            // Titulo do widget
                //            "<span class=\" titulo\">" + titulo + "</span>" +
                //            // Dropdown com as opcoes possiveis para o widget
                //           "<div class=\"dropdown\" style=\"float:right;\">" +
                //           "<button class=\"btn btn-default dropdown-toggle\" style=\"background-image:none; padding:2px;\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">" +
                //           "Acções" +
                //           "<span class=\"caret\"></span>" + "</button>" +
                //               "<ul class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenu1\">" +
                //                   "<li><a class=\"remove-widget\" href=\"#\"> Remove Widget </a></li>" +
                //                   "<li><a class=\"edita-widget\" href=\"#\"> Modifica titulo</a></li>" +
                //               "</ul>" + "</div>" +
                //         "</div>" +
                //         "<div class=\"wrapper panel-body\">" +
                //         // Conteudo do widget
                //         "<div class=\"widget-conteudo\"> " +
                //         "</div>" + "</div>" +
                //         "<div class=\"legenda\">" +
                //         "</div>" + "</div> " + "</div>";

                return el;

            }

            /// <summary>
            /// Método que cria o elemento HTML base para o widget, BARRA SECUNDÁRIA
            /// </summary>
            /// <returns> Retorna uma fundação base HTML para o widget </returns>
            Grid.prototype.CriaElementoSecundario = function (id, titulo, tipoWidget) {
                // Criação padrão do HTML do widget
                // Definimos um item da grid

                //id=\"widget" + idUnico + "\"

                var el = "<div class=\"grid-stack-item nao-seleciona widget-barraSecundaria\">" +
                         // Div do conteudo do item da grid
                         "<div id=" + id + "  class=\"grid-stack-item-content\">" +
                         "<div class=\"wrapper no-overflow\">" +
                         // Conteudo do widget
                         "<div class=\"widget-conteudo\"> " + "<span style='text-align:center;'>" + tipoWidget + "</span>" +
                         "</div>" + "</div>" +
                         "<div class=\"legenda\">" +
                         "</div>" + "</div> " + "</div>";

                return el;
            }

            /// <summary>
            /// Preenche a barra lateral com todos os widgets possiveis
            /// </summary>
            Grid.prototype.PreencheBarraLateral = function () {
                var self = this;
                var tipo;

                // MODIFICAR 
                // TODO
                // ATUAL

                //if (tipoGrid === undefined ) {
                tipo = self.getWidgetsGrid();


                // Caso tenha a class
                if ($("#" + self.id).closest("li").hasClass("active")) {
                    // Apaga todos os elementos anteriores
                    $("#" + self.id).data("gridstack").removeAll();

                    // Para cada widget adiciona
                    tipo.forEach(function (item) {
                        self.AdicionaWidget(item, item, undefined, 12, 1);

                    });
                } else {
                    $("#sidebar-gridstack").children().remove()

                }

                // Caso receba um parametro TipoGrid
                //} else {

                //    console.log(tipoGrid);

                //    tipo = tipoGrid + getWidgetsGrid();

                //    tipo = [tipoGrid + "-gridstack"].getWidgetsGrid();

                //    // Caso tenha a class
                //    if ($("#" + tipoGrid + "-gridstack").closest("li").hasClass("active")) {
                //        // Apaga todos os elementos anteriores
                //        $("#" + tipoGrid + "-gridstack").data("gridstack").removeAll();

                //        // Para cada widget adiciona
                //        tipo.forEach(function (item) {
                //            [tipoGrid + "-gridstack"].AdicionaWidget(item, item, undefined, 12, 1);

                //        });
                //    } else {
                //        $("#sidebar-gridstack").children().remove()

                //    }

                //}

            }


            /// #Region



            /// #Region - CARREGAR/GUARDAR Elementos

            /// <summary>
            /// Carrega uma dashboard para a grid atual
            /// </summary>
            /// <param name="dashboard"> Dashboard a carregar </param>
            Grid.prototype.CarregaDashboard = function (dashboard) {
                var self = this,
                    listaWidgets;

                console.log(dashboard);

                if (modo !== "lista") {
                    self.nome = dashboard.Nome;
                    self.descricao = dashboard.Descricao;
                    self.idUnico = dashboard.ID;

                    // Passa os dados de string para formato JSON
                    listaWidgets = JSON.parse(dashboard.Configuracao);

                    if (listaWidgets.length > 0) {
                        // Passa os parametros de aparencia para o dashboard
                        self.aparencia.grelha = listaWidgets[0].grelha;
                        self.aparencia.cor = listaWidgets[0].cor;
                    }

                    // Carrega os restantes widgets
                    self.CarregaWidgets(listaWidgets);

                    console.log(self);
                }
            }

            /// <summary>
            /// Carregar lista de widgets do servidor para o dashboard
            /// Faz o pedido, analisa os dados e desenha os widgets no dashboard
            /// </summary>
            /// <param name="lista"> Lista de widgets recebidos </param>
            Grid.prototype.CarregaWidgets = function (lista) {
                var self = this,
                    widget,
                    pedido,
                    configuracao;

                console.log(lista);

                if (lista !== null && lista instanceof Array) {
                    // Para cada widget na lista
                    // configuracao[0].Dashboard.listaWidgets
                    lista.forEach(function (item, curIndex) {
                        var widgetNovo,
                            idOriginal;



                        // Caso o index esteja a 1, significa que temos que recolher as opções de aparencia do dashboard
                        if (curIndex === 0) {
                            console.log(item);

                            gridPrincipal.aparencia.grelha = item.grelha;
                            gridPrincipal.aparencia.cor = item.cor;

                            // Senão temos que carregar os widgets
                        } else {
                            if (item !== null) {
                                // Guardar o id original
                                idOriginal = item.id;

                                // Adicionar um novo widget na grid
                                self.AdicionaWidget(item.widgetElemento, item.titulo, null, item.widgetLargura, item.widgetAltura, item.widgetX, item.widgetY, true, idOriginal);

                                // WidgetNovo é o ultimo  a ser criado
                                widgetNovo = gridPrincipal.listaWidgets[gridPrincipal.listaWidgets.length - 1];


                                // Para cada propriedade no objecto
                                $.each(item, function (chave, valor) {
                                    // Caso não seja função
                                    if (typeof valor !== "function") {
                                        widgetNovo[chave] = valor;
                                    }

                                });

                                // Caso seja widget do tipo Filtros
                                if (widgetNovo.widgetElemento === "filtros") {
                                    // Atualizar o widget para que este mostre os filtros 
                                    widgetNovo.Atualiza();
                                }

                                // Atualiza o titulo
                                widgetNovo.setTitulo(widgetNovo.titulo);

                                //  Definir as dimensões minimas na grid
                                self.DefineLimitesWidget(widgetNovo.id);

                                // Caso seja um widget do tipo gauge
                                if (widgetNovo.widgetElemento === "gauge") {
                                    widgetNovo.Atualiza();
                                }
                                // Caso seja um widget do tipo Data
                                if (widgetNovo.widgetElemento === "datahora_simples") {
                                    // Atualiza datas nos datetimepickers respectivos
                                    $("#datetimepicker-" + widgetNovo.id).data("DateTimePicker").date(moment(widgetNovo.opcoes.dataInicio));
                                    $("#datetimepicker2-" + widgetNovo.id).data("DateTimePicker").date(moment(widgetNovo.opcoes.dataFim));
                                }
                            }
                        }

                    });



                    // Filtra de acordo com os contextos e desenha os gráficos
                    gridPrincipal.FiltraContexto();

                    // Define widgets na PropertyGrid
                    self.CarregaListaComponentes();

                }

            }

            /// <summary>
            /// Método para guardar a informação atual dos widgets sempre que algum é atualizado
            /// </summary>
            Grid.prototype.GuardaInformacao = function () {
                var self = this;



                self.listaWidgets.forEach(function (item, curIndex) {
                    if (item.visivel === true) {

                        // Atualiza objecto servidor
                        item.objectoServidor = item.AtualizaObjectoServidor();
                        item.AtualizaObjectoWidget();

                    }

                });


            }

            /// <summary>
            /// Constroi widget após ser transferido da barra secundária para a principal
            /// </summary>
            Grid.prototype.ReconstroiWidget = function () {
                var grid = gridPrincipal,
                    id = $("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).attr("id")[$("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).attr("id").length - 1],
                    widget = $("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id);

                // Remove o bloqueio de resize posto na sidebar anterior
                $("#" + grid.id).data("gridstack").resizable($("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).closest(".grid-stack-item"), true);

                // Escolhe o widget e remove a imagem ( Sidebar )
                $("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).find(".imagem-widget").remove();


                // Manipula o widget para que tenha o seu aspeto final
                // Remove elementos adicionados na barra anterior
                widget.children().remove();
                // Adiciona classes de estilo
                widget.addClass("panel");
                widget.addClass("panel-default");
                // Remove class de estilo anterior
                widget.parent().removeClass("widget-barraSecundaria");
                // Adiciona restantes elementos
                widget.append(grid.CriaElemento(id, grid.listaWidgets[grid.listaWidgets.length - 1].titulo));


                // Escolhe o ultimo widget adicionado e constroi, conforme a sua class
                grid.listaWidgets[grid.listaWidgets.length - 1].ConstroiGrafico(grid.listaWidgets[grid.listaWidgets.length - 1].id);

                // Para cada widget atualizar a sua estrutura de dados
                grid.listaWidgets.forEach(function (item) {
                    item.objectoServidor = item.AtualizaObjectoServidor();
                    item.AtualizaObjectoWidget();

                });

                // Caso seja do tipo contexto
                if (widget.tipoWidget === "contexto") {
                    // Aumentamos a width para 100%
                    widget.find(".wrapper").addClass("wrapper-contexto");
                }

                // Dar altura e largura da main grid ao widget que foi transportado
                $("#" + grid.id).data("gridstack").minWidth($($("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).closest(".grid-stack-item")), 3);
                $("#" + grid.id).data("gridstack").minHeight($($("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).closest(".grid-stack-item")), 3);

                // Preencher novamente a grid secundária que está ativa
                //[$("#side-menu > .active").find(".widgets-sidebar").children().attr("id")].PreencheBarraLateral();

            }

            /// <summary>
            /// Atualiza a lista de componentes para meios de Associação/Desassociação
            /// </summary>
            Grid.prototype.CarregaListaComponentes = function () {
                var self = this,
                    widgets,
                    listaWidgetsDados = ["Sem componente"],
                    listaWidgetsContexto = ["Sem componente"];

                // Adquire ultima class do widget ( Class que identifica o tipo de widget )
                //tipoWidget = node.children().attr('class').split(' ').popwi(),
                // Adquire ID do widget
                //idWidget = node.children().attr("id");

                // Para cada item
                self.listaWidgets.forEach(function (item) {
                    // Preenche a sidebar
                    //$(".associaWidget-lista").append("<li class=\"associaWidget-elemento\" valor=" + item.id + ">" + item.titulo + "<ul style=\"display:none;\"></ul></li>");

                    // Adiciona ao array de objectos correcto
                    (item.widgetTipo === "contexto") ? listaWidgetsContexto.push({ text: item.titulo, value: item.id }) : listaWidgetsDados.push({ text: item.titulo, value: item.id });

                });

                // Define widgets na PropertyGrid
                PropertyGrid.setWidgets(listaWidgetsDados, listaWidgetsContexto);
                PropertyGrid.AdicionaCheckboxMenu();

            }


            /// <summary>
            /// Carrega os componentes de aparencia
            /// </summary>
            Grid.prototype.CarregaAparencia = function () {
                var self = this;

                // Caso as opções digam que não existe grelha
                //if (!(self.aparencia.grelha)) {
                //    self.ToggleGrelha();
                //}

                if (self.aparencia.grelha) {
                    $("#main-gridstack").toggleClass("gridstack-background");
                }


                if (self.aparencia.cor !== "empty") {
                    $("#main-gridstack").css("background-color", self.aparencia.cor);
                } else if (self.aparencia.cor === "empty") {
                    $("#main-gridstack").css("background-color", "");
                }

                // Verifica cor?

                // TODO ....

            }

            /// #Region



            /// #Region - REMOVER Elementos

            /// <summary>
            /// Desassocia widgets de um widget em especifico
            /// </summary>
            /// <param name="widget"> Widget que vai ter o seu contexto desassociado </param>
            Grid.prototype.RemoveContexto = function (widget) {
                var self = this;

                // ATUAL MODIFICAR

                // Para cada widget dentro do array Contexto
                self.getWidget(widget).contexto.forEach(function (item) {
                    // Desassocia este widget do widget a ser afectado pelo contexto
                    //self.getWidget(item).DesassociaWidget(widget);

                });

            }

            /// <summary>
            /// Evento que vai remover o widget da grid
            /// </summary>
            Grid.prototype.RemoveWidget = function () {
                var self = this;

                // Ao clickar em qualquer botão de classe remove-widget
                self.grid.on("click", ".remove-widget", function () {

                    // Selecionar o elemento "grid-stack-item" mais próximo do botão, seleção do widget especifico do botão
                    var el = $(this).closest(".grid-stack-item"),
                        // Seleciona o id do widget
                        widget = $(this).closest(".grid-stack-item-content").attr("id");

                    // Caso o widget tenha contexto
                    if (self.getWidget(widget).contexto.length > 0) {
                        // Desassociar o contexto Data do widget
                        self.getWidget(self.getWidget(widget).contexto[0]).DesassociaWidget(widget);
                    }
                    if (self.getWidget(widget).contextoFiltro.length > 0) {
                        // Para cada filtro
                        self.getWidget(widget).contextoFiltro.forEach(function (filtro) {
                            // Desassociar do widget
                            self.getWidget(filtro).DesassociaWidget(widget);
                        });
                    }

                    // Remove o widget da lista
                    self.RemoveWidgetLista(widget);

                    // Chamar a grid e o método da biblioteca do gridstack para remover o widget
                    self.grid.data("gridstack").removeWidget(el);

                    // Remove propertyGrid atual
                    PropertyGrid.RemoveGrid();

                    // Guarda informação
                    self.GuardaInformacao();
                });
            }

            /// <summary>
            /// Remove o widget enviado da lista de widgets da Grid
            /// </summary>
            /// <param name="widget"> STRING com o id do widget a ser removido </param>
            Grid.prototype.RemoveWidgetLista = function (widget) {
                var self = this;

                // Desasssocia todas as ligações deste widget
                self.RemoveContexto(widget);

                // Método do Lodash, remove do array o que retornar "true"
                _.remove(self.listaWidgets, function (item) {
                    // Retorna o elemento que tiver o mesmo id e remove
                    return widget === item.id;
                });

            }

            /// <summary>
            /// Evento para remover as handles extra do elemento widget antes de mudar de grid
            /// para não fazer conflito ao entrar na main-gridstack
            /// </summary>
            Grid.prototype.RemoveHandle = function () {
                var self = this;

                // Remover handles dos widgets que não estão resizable
                $("#" + self.id).on("mousedown", ".grid-stack-item", function () {
                    $("#" + self.id + " .grid-stack-item").children(":hidden").remove();
                });

            }


            /// #Region



            /// #Region - ATUALIZAR

            /// <summary>
            /// Evento que vai atualizar todos os widgets na lista após o resize de algum deles
            /// </summary>
            Grid.prototype.AtualizaWidgets = function () {
                var self = this;

                // Ao parar de fazer resize
                $(self.grid).on("resizestop", function (event, ui) {
                    // Atualiza widget e guarda informação
                    setTimeout(function () {
                        // Para cada Widget
                        self.listaWidgets.forEach(function (widget) {
                            // Verificar se widget tem dados para atualizar
                            if (widget.widgetTipo === "dados") {
                                if (widget.dados !== undefined) {
                                    if (widget.dados.dados.Widgets[0].Items.length !== 0) {
                                        // Atualizar o widget
                                        widget.Atualiza();
                                    }
                                }
                            }

                        });

                        // "Puxa" widget atual para o topo da lista, por motivos de imposição de CSS
                        $(".widget-ativo").parent().appendTo($(".widget-ativo").parent().parent());

                        // Guarda informação
                        self.GuardaInformacao();
                    }, 20);

                });

                // Sempre que moverem um widget
                $(self.grid).on("dragstop", function (event, items) {
                    setTimeout(function () {

                        // "Puxa" widget atual para o topo da lista, por motivos de imposição de CSS
                        $(".widget-ativo").parent().appendTo($(".widget-ativo").parent().parent());

                        // Guarda informação
                        self.GuardaInformacao();
                    }, 20);

                });

                // Sempre que houver mudanças na grid
                $(self.grid).on("added", function (event, items) {
                    setTimeout(function () {

                        // "Puxa" widget atual para o topo da lista, por motivos de imposição de CSS
                        $(".widget-ativo").parent().appendTo($(".widget-ativo").parent().parent());

                        // Guarda informação
                        self.GuardaInformacao();
                    }, 20);
                });

            }

            /// <summary>
            /// Atualiza tooltip da descrição do dashboard
            /// </summary>
            Grid.prototype.AtualizaTooltipDescricao = function () {
                var self = this;

                $(".nav-dashboard").find('[data-toggle="tooltip"]').attr("data-original-title", self.descricao);

            }

            /// <summary>
            /// Método para filtrar os dados de um conjunto de widgets ligado a um contexto 
            /// Filtra através de todos os contextos e atualiza os widgets ( REDESENHAR )
            /// </summary>
            Grid.prototype.FiltraContexto = function () {
                var self = this;

                // Para cada widget
                self.listaWidgets.forEach(function (item) {
                    // Caso seja do tipo contexto
                    if (item.widgetTipo === "contexto") {

                        // Modificar  (Caso seja um widget do tipo filtro)

                        // Para cada widget dentro do seu contexto
                        item.contexto.forEach(function (widget) {
                            var dadosFiltrados,
                                // Procura index do widget no contexto
                                index = _.findIndex(self.listaWidgets, function (d) { return widget === d.id });

                            // Começa o "refresh" e continua o programa
                            setTimeout(function () {
                                // Adquire os dados filtrados (apagar paraemtro widget?) TODO DECIDIR
                                item.FiltraDados(self.listaWidgets[index], widget);
                                //// Redeseha os dados de acordo com os dados adquiridos
                                //self.listaWidgets[index].RedesenhaGrafico(self.listaWidgets[index].id);

                            }, 0);

                        });
                    }

                });

            }


            // Faz refresh a apenas um widget ( ou em caso de ser widget contexto, faz refresh aos que estão ligados também
            Grid.prototype.RefreshWidget = function (widgetID) {
                var self = this,
                    widget = self.getWidget(widgetID);

                // Caso seja widget dados
                if (widget.widgetTipo === "dados") {
                    // Caso o widget tenha contexto
                    if (widget.contexto.length > 0) {
                        // Para cada widget no contexto ( Pode ter Filtro e Data )
                        widget.contexto.forEach(function (item) {
                            // Se for filtro Data
                            if (self.getWidget(item).widgetElemento === "datahora_simples") {
                                self.getWidget(item).FiltraDados(widget);
                            }
                        })
                    }
                    // Caso seja um widget do tipo contexto
                } else if (widget.widgetTipo === "contexto") {

                    widget.contexto.forEach(function (item) {
                        // Procura index do widget no contexto
                        index = _.findIndex(self.listaWidgets, function (d) { return item === d.id });

                        // pie chart? TODO
                        // Começa o "refresh" e continua o programa
                        setTimeout(function () {
                            widget.FiltraDados(self.listaWidgets[index]);
                        }, 0);

                    })
                }

            }


            /// #Region



            /// #Region - EVENTOS

            /// <summary>
            /// Evento para abrir a propertyGrid do "dashboard"/grid
            /// </summary>
            Grid.prototype.EventoGridAtiva = function () {
                var self = this;

                $("#main-gridstack").click(function (event) {
                    // Caso o target do evento seja mesmo a grid
                    if ($(event.target).attr("id") === "main-gridstack") {
                        // Caso a grid ainda não esteja ativa
                        if (!($(this).hasClass("widget-ativo"))) {
                            // Adiciona classe
                            $(this).addClass("widget-ativo");

                            // Remove o aviso de não haver nenhum widget/dashboard selecionado
                            PropertyGrid.TogglePropertyGrid();

                            // Substitui o titulo na propertyGrid
                            PropertyGrid.SetWidgetPropertyGrid(self.nome, self.id, "Dashboard");

                            // Mostra a propertyGrid
                            PropertyGrid.MostraPropertyGrid("grid");
                        }
                    }
                })

            }

            /// <summary>
            /// Evento para remover o ativo da Grid
            /// </summary>
            Grid.prototype.EventoRemoveGridAtiva = function () {
                var self = this;

                // Ao clickar no documento
                $(document).on("click", function (event) {

                    // Caso a grid esteja ativa
                    if ($("#main-gridstack").hasClass("widget-ativo")) {
                        // Se o target do event não for a grid ou a sidebar
                        if (!($(event.target).is($("#" + self.id))) && !($(event.target).is($(".propriedades-sidebar").find("*")))) {
                            // Se o ID do target não foi um botão da propertyGrid
                            if (!($(event.target)[0].id === "pgButton")) {

                                // Remove Class ativa do gridstack
                                $("#" + self.id).removeClass("widget-ativo");

                                // Caso haja widgets ativos, significa que o foco passou da gridstack para o widget, 
                                // logo não devemos remover a propertyGrid
                                if ($(".widget-ativo").length === 0) {
                                    // Remove propertyGrid atual
                                    PropertyGrid.RemoveGrid();

                                    // Faz "Reset" nas boxes de opção da propertyGrid
                                    //$(".opcoes-propertyGrid").find(".box-propriedades").removeClass("box-ativo");
                                    //$("[value='geral']").addClass("box-ativo");

                                }
                            }
                        }
                    }
                });

            }

            /// <summary>
            /// Activa/Desactiva a grelha da gridprincipal
            /// </summary>
            Grid.prototype.EventoToggleGrelha = function () {
                var self = this;

                // Evento para remover/adicionar grelha
                $(".propriedades-sidebar").on("change", "[value='Grelha']", function () {
                    self.ToggleGrelha();

                });
            }

            /// <summary>
            /// Atualiza os widgets após o resize do ecrã
            /// </summary>
            Grid.prototype.EventoResizeEcra = function () {
                var self = this;

                $(window).resize(function () {
                    self.listaWidgets.forEach(function (widget) {
                        widget.RedesenhaGrafico(widget.id);
                    });
                });

            }


            /// #Region



            /// #Region - UTILS


            /// <summary>
            /// Activa/desactiva a grelha
            /// </summary>
            Grid.prototype.ToggleGrelha = function () {
                var self = this;

                $("#main-gridstack").toggleClass("gridstack-background");
                if (self.aparencia.grelha) {
                    gridPrincipal.aparencia.grelha = false;
                } else {
                    gridPrincipal.aparencia.grelha = true;
                }

            }


            /// <summary>
            /// Define tamanhos limite dos widgets nesta Grid
            /// </summary>
            Grid.prototype.DefineLimitesWidget = function (widgetID) {
                var self = this;

                //  Definir as dimensões minimas na grid
                $("#" + self.id).data("gridstack").minWidth($("#" + widgetID).closest(".grid-stack-item"), 3);
                $("#" + self.id).data("gridstack").minHeight($("#" + widgetID).closest(".grid-stack-item"), 3);

            }

            /// <summary>
            /// Evento que esconde o widget ao pressionar no botão que assim o permite
            /// </summary>
            Grid.prototype.EscondeWidget = function () {
                var self = this;

                // Ao clickar em qualquer botão de classe remove-widget
                $(document).on("click", ".esconde-widget", function () {

                    // Selecionar o elemento "grid-stack-item" mais próximo do botão, ou seja,
                    // a "node" do widget para poder eliminar da grid
                    var el = $(this).closest(".grid-stack-item"),
                        // Seleciona o "widget"
                        widget = el.find(".grid-stack-item-content"),
                        index;


                    // Função lodash para achar o primeiro index onde a condição seja "true"
                    // Procura na lista de widgets pelo widget com o id equivalente
                    index = _.findIndex(self.listaWidgets, function (item) { return item.id === widget.attr("id"); });


                    // Muda atributo visivel
                    self.listaWidgets[index].visivel = false;


                    // Chamar a grid e o método da biblioteca do gridstack para remover o widget
                    self.grid.data("gridstack").removeWidget(el);

                });
            }

            /// <summary>
            /// Método para mostrar widget que está "visivel"
            /// TODO
            /// </summary>
            Grid.prototype.MostraWidget = function () {

            }

            /// <summary>
            /// Evento que permite ao utilizador receber na consola informação sobre os widgets
            /// </summary>
            Grid.prototype.MostraInformacaoWidgets = function () {
                var self = this;

                $(".informacaoWidgets").click(function () {
                    self.listaWidgets.forEach(function (item, curIndex) {
                        console.log("Widget " + (curIndex + 1) + " - ID: " + item.id);
                        console.log(item);
                    });

                    console.log("Lista de Widgets - Formato Array:")
                    console.log(self.listaWidgets);

                    console.log("Grid:");
                    console.log(self);

                })
            }

            /// <summary>
            /// Método que devolve o tamanho "total" da página, devido à altura ser dada dinamicamente
            /// </summary>
            /// <returns> Inteiro com a altura máxima da página </returns>
            Grid.prototype.AlturaMaxima = function () {
                var self = this;

                // Compara o tamanho da row e da main gridstack 
                if ($(".row").height() < $("#main-gridstack").height()) {
                    // Caso a grid seja maior que o atributo "row"
                    return ($("#main-gridstack").height() + 157);
                } else {
                    // Caso a row seja maior que a grid
                    return ($(".row").height() + 190);
                }

            }

            /// <summary>
            /// Substitui o gráfico do widget por uma tabela com todos os dados disponiveis,
            /// ou substitui a tabela pelo gráfico do widget
            /// </summary>
            Grid.prototype.VerTabela = function () {
                var self = this;

                $("#main-gridstack").on("click", ".verTabela-widget", function () {

                    // Definir o widget
                    var widget = $(this).closest(".grid-stack-item-content"),
                        index,
                        dados;


                    // Função lodash para achar o primeiro index onde a condição seja "true"
                    // Procura na lista de widgets pelo widget com o id equivalente
                    index = _.findIndex(self.listaWidgets, function (item) { return item.id === widget.attr("id"); });



                    // Modifica estado da tabela
                    self.listaWidgets[index].setEstadoTabela();
                    // Caso esteja em formato widget passa para tabela, senão passa para o modo gráfico
                    (self.listaWidgets[index].estadoTabela) ? self.listaWidgets[index].TransformaWidgetTabela() : self.listaWidgets[index].RedesenhaGrafico(widget.attr("id"));
                    (self.listaWidgets[index].estadoTabela) ? $("#" + widget.attr("id")).find(".verTabela-widget").text("Ver Gráfico") : $("#" + widget.attr("id")).find(".verTabela-widget").text("Ver Tabela");
                    (self.listaWidgets[index].estadoTabela) ? $("#" + self.id).find(".modificaVisualizacao-widget").hide() : $("#" + self.id).find(".modificaVisualizacao-widget").show();

                });

            }

            /// #Region



            /// #Region - GET / SET

            /// <summary>
            /// Método que devolve um widget especifico da lista
            /// </summary>
            /// <param name="widgetId> id do widget a ser devolvido</param>
            /// <returns> Retorna o objecto widget com o mesmo id </returns>
            Grid.prototype.getWidget = function (widgetId) {
                var self = this,
                    index;

                index = _.findIndex(self.listaWidgets, function (item) { return item.id === widgetId; });

                return self.listaWidgets[index];

            }

            /// <summary>
            /// Método que obtém os widgets para a grid especifica
            /// </summary>
            /// <returns> Retorna um array com os nomes dos widgets a serem adicionados </returns>
            Grid.prototype.getWidgetsGrid = function () {
                var self = this;

                switch (self.id) {
                    case "sidebarGraficos-gridstack":
                        return widgetsGrafico;
                        break;
                    case "sidebarLabels-gridstack":
                        return widgetsLabel;
                        break;
                    case "sidebarOutros-gridstack":
                        return widgetsOutros;
                        break;
                    case "sidebarFiltros-gridstack":
                        return widgetsFiltros;
                        break;
                    default:
                        return "Erro";
                        break;

                }

            }

            /// <summary>
            /// Getters e Setters do nome do dashboard
            /// </summary>
            Grid.prototype.setNome = function (nome) {
                var self = this;

                self.nome = nome;
                $(".nav-dashboard-titulo").text(self.nome);

            }
            Grid.prototype.getNome = function () {
                var self = this;

                return self.nome;
            }

            /// <summary>
            /// Getters e Setters da descricao do dashboard
            /// </summary>
            Grid.prototype.setDescricao = function (descricao) {
                var self = this;

                self.descricao = descricao;
                self.AtualizaTooltipDescricao();

            }
            Grid.prototype.getDescricao = function () {
                var self = this;

                return self.descricao;
            }


            /// #Region


            return Grid;

        })();



        /// <summary>
        /// Class Plataforma, guarda a lista dos "dashboards" do utilizador, encapsula as grids dentro de cada dashboard
        /// </summary>
        var Plataforma = (function () {
            var utilizador,
                idUtilizador,
                listaDashboards,
                dashboardAtual;


            function Plataforma(idUtilizador, utilizador) {
                this.utilizador = utilizador;
                this.idUtilizador = idUtilizador;
                this.listaDashboards = [];
                this.dashboardAtual = 0;

            }

            /// <summary>
            /// Inicializa o utilizador na página, e alguns parametros da dashboard (nome, descrição, etc)
            /// </summary>
            Plataforma.prototype.Inicializa = function () {
                var self = this;

                // Atualiza nome de utilizador
                $(".nomeUtilizador-navbar").text(self.utilizador);

                // Atualiza nome do dashboard
                gridPrincipal.setNome(gridPrincipal.nome);
                gridPrincipal.setDescricao(gridPrincipal.descricao);

                // TODO
                gridPrincipal.CarregaAparencia();

            }


            /// <summary>
            /// Inicializa o utilizador na página
            /// </summary>
            Plataforma.prototype.InicializaLogin = function () {
                var self = this;

                // Atualiza nome de utilizador
                $(".nomeUtilizador-navbar").text(self.utilizador);

            }


            /// <summary>
            /// Cria um dashboard vazio
            /// </summary>
            Plataforma.prototype.CriaDashboard = function () {
                var self = this;

                // Opções da gridstack
                options = {
                    verticalMargin: 2,
                    float: true,
                    // Modificado também nas media queries
                    minWidth: 680,
                    draggable: {
                        handle: ".widget-navbar"
                    },
                    acceptWidgets: ".grid-stack-item",
                    resizable: {
                        handles: "sw, se"
                    },
                    swapGridWidth: 3,
                    swapGridHeight: 3,
                    gridType: "main-gridstack"
                };


                // Criação da grid principal
                gridPrincipal = new Grid("main-gridstack", options, "barraPrincipal");
                // Evento que mostra a informação de todos os widgets disponiveis ao clickar um botão
                gridPrincipal.MostraInformacaoWidgets();
                // Adicionar o background à gridstack
                $("#" + gridPrincipal.id).addClass("gridstack-background");

                self.AdicionaBarraSecundaria();


            }


            /// <summary>
            /// Volta a repor a grid lateral
            /// Utiliza função eval() para ir buscar os argumentos 
            /// </summary>
            Plataforma.prototype.RefillGrid = function (tipoGrid) {
                var self = this;

                // REVER !!!!!
                // TODO
                // Conforme o tipo de grid, chamar a grid lateral correspondente e chamar o método
                // PreencheBarraLateral para poder executar 
                eval(tipoGrid + "." + "PreencheBarraLateral" + "()");

            }


            /// <summary>
            /// Cria menu barraSecundária para poder adicionar Widgets ao dashboard
            /// <summary>
            Plataforma.prototype.AdicionaBarraSecundaria = function () {
                var self = this;

                // Opções do menu drag&drop
                optionsBarraLateral = {
                    width: 12,
                    removable: false,
                    cell_height: 100,
                    verticalMargin: 0,
                    disableResize: true,
                    gridType: "barraSecundaria-gridstack"
                }


                if (modo === "edicao") {
                    // Criação da grid secundária
                    gridGraficos = new Grid("sidebarGraficos-gridstack", optionsBarraLateral, "barraSecundaria");
                    gridLabels = new Grid("sidebarLabels-gridstack", optionsBarraLateral, "barraSecundaria");
                    gridOutros = new Grid("sidebarOutros-gridstack", optionsBarraLateral, "barraSecundaria");
                    gridFiltros = new Grid("sidebarFiltros-gridstack", optionsBarraLateral, "barraSecundaria");

                    // Remove handles extra que previnem que seja feito o resize ao mudar da sideGrid para a gridPrincipal
                    gridGraficos.RemoveHandle();
                    gridLabels.RemoveHandle();
                    gridOutros.RemoveHandle();
                    gridFiltros.RemoveHandle();

                }
            }


            /// <summary>
            /// Carrega objecto sodas
            /// </summary>
            Plataforma.prototype.AdicionaDashboardServidor = function (dashboard) {
                var self = this;

                // Envia para o servidor para guardar
                primerCORE.DashboardCria(self.idUtilizador, dashboard, self.idUtilizador);
                // Aviso para indicar que foi salvo

            }


            /// <summary>
            /// Remove o estado de Activo do dashboard atual
            /// </summary>
            Plataforma.prototype.RemoveActivo = function () {
                var self = this;

                self.listaDashboards.forEach(function (dashboard) {
                    if (dashboard.Activo === true) {
                        dashboard.Activo = false;
                        //primerCORE.DashboardAlteraEstado(dashboard.ID);
                    }
                });

            }


            /// <summary>
            /// 
            /// </summary>
            Plataforma.prototype.GuardaDashboardServidor = function (dashboard) {
                var self = this;

                console.log(dashboard);

                primerCORE.DashboardAtualiza(self.idUtilizador, dashboard);
                // TODO - aviso utilziar guardou com sucesso

            }


            /// <summary>
            /// Carrega a lista de dashboards de um utilizador especifico ( Pedido ao servidor )
            /// </summary>
            Plataforma.prototype.CarregaListaDashboards = function () {
                var self = this,
                    pedido;

                pedido = JSON.parse(primerCORE.DashboardsUtilizadorLista(self.idUtilizador));

                // to-do IMPORTANTE 
                // Pedido ao primerCORE para receber a lista de dashboards de um certo utilizador
                if (pedido.resultado.Sucesso === true) {
                    if (pedido.resultado.Dados > 0) {
                        self.listaDashboards = pedido.dados;

                    } else if ($("body").attr("id") === "lista") {
                        alert("Não existem dashboards guardados")
                    }
                } else {
                    alert("ERRO - Pedido de lista dashboards não foi concretizado")
                }

            }


            /// <summary>
            /// Adiciona um dashboard à lista
            /// </summary>
            /// <param name ="dashboard"> Envia um objecto do tipo "Grid" para ser adicionado a lista </param>
            Plataforma.prototype.AdicionaDashboard = function (dashboard, nome) {
                var self = this,
                    objectoDashboard = {},
                    listaWidgetsDashboard = [];


                dashboard.listaWidgets.forEach(function (widget) {
                    listaWidgetsDashboard.push(widget.objectoServidor);
                });

                dashboard.setNome(nome);
                objectoDashboard["Nome"] = nome || dashboard.nome;
                objectoDashboard["Descricao"] = dashboard.descricao;
                objectoDashboard["OpcoesAparencia"] = " ";

                // Passa para um objecto
                objectoDashboard["Configuracao"] = JSON.stringify(listaWidgetsDashboard);

                // Guardar na lista 
                self.listaDashboards.push(objectoDashboard);

                // Guardar no servidor
                self.AdicionaDashboardServidor(objectoDashboard);

            }


            /// <summary>
            /// Guarda dashboard existente
            /// </summary>
            Plataforma.prototype.GuardaDashboard = function () {
                var self = this,
                    index,
                    objectoDashboard = {},
                    listaWidgetsDashboard = [];

                // Encontra index da dashboard na lista
                index = _.findIndex(self.listaDashboards, function (objecto) { return objecto.ID === gridPrincipal.idUnico; });

                if (index !== -1) {

                    objectoDashboard["Nome"] = gridPrincipal.nome;
                    objectoDashboard["ID"] = gridPrincipal.idUnico;
                    objectoDashboard["Descricao"] = gridPrincipal.descricao;
                    objectoDashboard["opcoesAparencia"] = gridPrincipal.aparencia;


                    listaWidgetsDashboard.push(gridPrincipal.aparencia);

                    // Passa os widgets para o formato de configuração 
                    gridPrincipal.listaWidgets.forEach(function (item, curIndex) {
                        listaWidgetsDashboard.push(item.objectoServidor);
                    });



                    // TODO ATUAL, Guardar 
                    //var teste1 = listaWidgetsDashboard.push(gridPrincipal.opcoesAparencia);

                    //console.log(JSON.stringify(listaWidgetsDashboard));

                    // Passa para um objecto
                    objectoDashboard["Configuracao"] = JSON.stringify(listaWidgetsDashboard);


                    // Enviar pedido ao servidor para guardar dashboard com o objecto criado
                    self.GuardaDashboardServidor(objectoDashboard);

                } else {
                    alert("DASHBOARD - Tentativa de guardar sem estar criada");

                }

            }


            /// <summary>
            /// Carrega dashboard para a aplicação
            /// </summary>
            Plataforma.prototype.CarregaDashboard = function (id) {
                var self = this,
                    index;

                // Limpa a dashboard atual
                self.LimpaDashboard();




                // Procura o index do dashboard a carregar
                index = _.findIndex(self.listaDashboards, function (dashboard) { return dashboard.ID === id; });

                // Carrega a dashboard
                gridPrincipal.CarregaDashboard(self.listaDashboards[index]);

                // Inicializa a dashboard ( nomes, descricao, etc )
                self.Inicializa();

            }


            /// <summary>
            /// "Limpa" dashboard atual do ecra, continua guardada na estrutura
            /// </summary>
            Plataforma.prototype.LimpaDashboard = function () {
                var self = this;

                // Remove widgets do gridstack
                $("#main-gridstack").data("gridstack").removeAll();

                // Limpa lista de widgets da gridPrincipal
                gridPrincipal.listaWidgets = [];

            }


            /// <summary>
            /// Remove a dashboard permanentemente
            /// </summary>
            Plataforma.prototype.RemoveDashboard = function () {
                var self = this;

                if (GetURLParameter("dashboard") !== "new") {
                    // Caso o utilizador confirme
                    if (confirm("Pretende apagar permanentemente o seu Dashboard ?")) {

                        // Pedido ao servidor para remover a dashboard selecionada
                        primerCORE.DashboardApaga(Utilizador.dashboardAtual, self.idUtilizador);
                        window.open('db_lista.html', '_self', false);

                        //// Remove widgets do gridstack
                        //$("#main-gridstack").data("gridstack").removeAll();

                        //// Limpa lista de widgets da gridPrincipal
                        //gridPrincipal.listaWidgets = [];
                    }
                } else {
                    alert("Dashboard não foi guardado ainda");
                }
                // Remove da lista de dashboards do utilizador o dashboard atual
                //self.listaDashboards =  _.remove(self.listaDashboards, function (dashboard) { return dashboard.Nome === self.listaDashboards[getDashboardAtual()].Nome; });

            }


            /// <summary>
            /// Devolve a lista de dashboards de um utilizador 
            /// </summary>
            /// <returns> Lista de Dashboards "Grids" de um utilizador
            Plataforma.prototype.getDashboards = function () {
                var self = this;

                return self.listaDashboards;
            }


            /// <summary>
            /// Getters e Setters para a dashboardAtual
            /// </summary>
            Plataforma.prototype.getDashboardAtual = function () {
                var self = this;

                return self.dashboardAtual;

            }
            Plataforma.prototype.setDashboardAtual = function (idUnico) {
                var self = this;

                // Carrega lista de dashboards do Utilizador
                self.CarregaListaDashboards();

                // Carrega a Dashboard para a plataforma
                self.CarregaDashboard(idUnico);

                // Para a lista de dashboards do utilizador
                Utilizador.listaDashboards.forEach(function (dashboard) {
                    // Caso haja algum ativo
                    if (dashboard.Activo) {
                        // Passar a false
                        primerCORE.DashboardAlteraEstado(dashboard.ID, "false");
                    }

                });

                // Envia o pedido para alterar o estado no servidor
                primerCORE.DashboardAlteraEstado(idUnico, "true");


                self.dashboardAtual = idUnico;

            }


            /// #Region - Eventos

            Plataforma.prototype.AtualizaDashboard = function () {
                var self = this;

                // Ao clickar para atualizar (guardar) o dashboard
                $(".atualizaWidget-propertyGrid").click(function () {

                });

            }

            /// #Region

            return Plataforma;

        })();



        /// <summary>
        ///
        /// </summary>
        var Eventos = (function () {

            return Eventos;

        })();



        // LIGAÇÃO COM O UTILIZDOR
        // Cria Dashboards inicial
        var cookie = JSON.parse($.cookie("dashboard"));


        var Utilizador = new Plataforma(cookie.id, cookie.username);
        // Inicializa o login
        Utilizador.InicializaLogin();


        // Cria uma nova dashboard
        Utilizador.CriaDashboard();


        // Incializa tooltips
        $("body").tooltip({
            selector: '[data-toggle="tooltip"]',
            container: "body"
        });


        /// TESTE SIDEBAR - Gestão de elementos para a dropdownlist das "Propriedades"
        // property Grid - TEST
        PropertyGrid.InicializaEventos();
        PropertyGrid.Inicializa();


        ///TESTES - Comunicação
        $(".obterValores").click(function () {
            gridPrincipal.FiltraContexto();
        })




        // TESTE - CLASS Plataforma

        // Carrega todos os dashboards do utilizador
        Utilizador.CarregaListaDashboards();


        // Carrega uma dashboard em especifico, caso esteja em modo Lista
        if (modo !== "lista") {
            // Vai buscar o parametro de URL
            var dashboardID = GetURLParameter("dashboard");

            // Caso exista parametro
            if (dashboardID === "new") {
                // Dá titulo e descrição ào novo dashboard
                gridPrincipal.setNome("Novo Dashboard");
                gridPrincipal.setDescricao("Descricao Dashboard");

            }
            else if (dashboardID !== undefined) {
                // Carrega a dashboard com o ID especificado
                Utilizador.setDashboardAtual(+dashboardID);

            } else if (modo !== "login") {
                // Procura index do dashboard que está ativo
                var index = _.findIndex(Utilizador.getDashboards(), function (dashboard) { return dashboard.Activo === true; });

                if (index !== -1) {
                    Utilizador.setDashboardAtual(+Utilizador.getDashboards()[index].ID);

                }
            }

        }

        // Guarda Dashboard
        $(".dashboard-guarda").click(function () {
            var nome;

            // Verifica se o dashboard já está guardado na base de dados ou não
            if (_.findIndex(Utilizador.getDashboards(), function (objecto) { return objecto.ID === gridPrincipal.idUnico; }) === -1) {
                console.log("nao existe");
                // Caso o nome seja diferente ao nome por defeito
                // TODO
                if (!(gridPrincipal.getNome() === "Novo Dashboard")) {
                    alert("Dashboard guardado com sucesso!");
                    window.open('db_edicao.html', '_self', false);

                    // Caso seja igual
                } else {
                    // Pede ao utilizador o nome que deve ser guardado na dashboard
                    nome = prompt("Guardar como:");
                    console.log(nome);
                    // Caso seja diferente de null
                    if (nome !== null) {
                        Utilizador.AdicionaDashboard(gridPrincipal, nome);
                        alert("Dashboard guardado com sucesso!");
                        window.open('db_edicao.html', '_self', false);

                    }
                }
            } else {
                console.log("existe");
                Utilizador.GuardaDashboard();
                alert("Dashboard guardado com sucesso!")

            };

        });

        // Remove Dashboard?
        $(".dashboard-remove").click(function () {
            Utilizador.RemoveDashboard();
        });

        // Mostra Dashboard
        $(".dashboard-informa").click(function () {
            console.log(gridPrincipal);
            window.open('db_edicao.html', '_self', false);
        });



        $(".adicionaTeste").click(function () {
            gridPrincipal.CarregaWidgets(prompt());
            //gridPrincipal.listaWidgets;
            //primerCORE.

        });





        /// <summary>
        /// Função para inciialziar a lista de dashboards a abrir
        /// </summary>
        function inicializaLista() {

            ///MODO - LISTA
            /// OPCOES LISTA DASHBOARDS

            var dadosTabela,
                dataCriacao,
                dataEdicao,
                objectLista = [],
                dashboards = Utilizador.getDashboards(),
                r = new Array(), j = -1;


            // Opcoes de estilo
            $("#page-wrapper").css("display", "table");
            $("#page-wrapper").css("width", "100%");


            // Carrega lista dashboards para o div
            for (var key = 0, size = dashboards.length; key < size; key++) {
                // Analisa as datas
                dataCriacao = moment(dashboards[key].TimestampCriacao, moment.ISO_8601);
                dataEdicao = moment(dashboards[key].TimestampEdicao, moment.ISO_8601)

                // Puxa um objecto com os dados de cada dashboard
                objectLista.push({ "nome": dashboards[key].Nome, "data": { "id": dashboards[key].ID, "criacao": dataCriacao.format("YYYY-MM-DD  HH:mm:ss"), "edicao": dataEdicao.format("YYYY-MM-DD  HH:mm:ss"), "descricao": dashboards[key].Descricao } });

            }

            // Formata os dados para um formato fácil de implementar na tabela
            dadosTabela = $.flatJSON({ data: objectLista, flat: true });

            // Inicializa a tabela
            $('#listaDashboards').bootstrapTable({
                data: dadosTabela,
                locale: getLinguagem(),
                cache: false,
                search: false,
                showColumns: false,
                showRefresh: false,
                clickToSelect: true,
                showToggle: false,
                cardView: false,
                pagination: false,
                idField: true,
                singleSelect: true,
                classes: "showCursor nao-seleciona table table-hover",
                // Evento ao clickar numa das linhas da tabela 
                onClickCell: function (field, value, row, $element) {

                    // Se o campo não for o de descrição
                    if (field !== "data.descricao") {
                        console.log(row);

                        // Para a lista de dashboards do utilizador
                        Utilizador.listaDashboards.forEach(function (dashboard) {
                            // Caso haja algum ativo
                            if (dashboard.Activo) {
                                // Passar a false
                                primerCORE.DashboardAlteraEstado(dashboard.ID, "false");
                            }

                        });

                        // Passar o dashboard escolhido para activo
                        primerCORE.DashboardAlteraEstado(row["data.id"], "true");

                        //// Abrir nova página com o ID associado à linha que foi feito o click
                        window.open('db_visualizacao.html', '_self', false);

                    }

                    return false;

                },
                // Evento sempre que carrega a tabela
                onPostBody: function () {

                    // Adicionar um botão para remover o dashboard e remover do header inicial
                    $(".listaDashboards-botoes").append('<button type="button" style="float:right;" class="removeDashboard"><img src ="../resources/ic_clear_black_24dp_1x.png"/></button>')
                    $("thead  .listaDashboards-botoes > button").remove();
                },
                columns: [
                    {
                        field: 'nome',
                        title: 'Dashboard',
                        sortable: true,
                        'class': "showPointer"
                    },
                    {
                        field: 'data.criacao',
                        title: 'Criação',
                        sortable: true,
                        'class': "showPointer"
                    },
                    {
                        field: 'data.edicao',
                        title: 'Edição',
                        sortable: true,
                        'class': "showPointer"
                    },
                    {
                        field: 'data.descricao',
                        title: 'Descrição',
                        sortable: true,
                        'class': "listaDashboards-botoes",
                    },
                    {
                        field: 'data.ID',
                        title: 'ID',
                        sortable: false,
                        visible: false
                    }
                ]
            });

        }

        if (modo === "lista") {
            inicializaLista();
        }

        // Ao clickar no botão de remoção de dashboard
        $(document).on("click", ".removeDashboard", function () {

            // Caso o utilizador confirme
            if (confirm("Pretende mesmo apagar o dashboard ?")) {
                // Adquire dados da lista
                var lista = $('#listaDashboards').bootstrapTable("getData"),
                    // Vai buscar a posição que do botão que o utilizador selecionou para remover
                    posicao = $(this).closest("[data-index]").attr("data-index");


                // Pedido ao servidor para remover a dashboard selecionada
                primerCORE.DashboardApaga(lista[posicao]["data.id"]);

                // Remove linha da tabela
                $(this).closest("tr").remove();

                // Atualizar lista de Dashboards
                Utilizador.CarregaListaDashboards();

            }
        });


        // Ao clickar para criar novo Dashboard
        $(".adicionaDashboard-lista").click(function () {

            // Para a lista de dashboards do utilizador
            Utilizador.listaDashboards.forEach(function (dashboard) {
                // Caso haja algum ativo
                if (dashboard.Activo) {
                    // Passar a false
                    primerCORE.DashboardAlteraEstado(dashboard.ID, "false");
                }

            });

            // Abre nova janela com indicação de novo
            window.open('db_edicao.html' + '?dashboard=new', '_self', false);
        });

    // Caso o cookie não exista, redirecionar para a página inicial
    } else {
        window.location.replace(baseurl + "db_login.html");
    }

})
