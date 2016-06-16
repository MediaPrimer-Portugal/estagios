﻿//UTIL = {


//    loadEvents: function () {

//        var bodyID = document.body.id;

//        UTIL.fire()
//    }
//}

//plataforma = {
//    widgets: {

//    },
//    grid: {

//    },
//    propertyGrid: {

//    },
//    conteudo: {

//    }
//}



$("document").ready(function () {

    /// Constantes
    /// Valor que simboliza a data no objecto de dados recebido do servidor
    var ValorData = "Data";


    /// Métodos Auxiliares ----------------------------------------------------------------------------------------------------

    var idUnico = 0;


    // to-do?
    // Modificar tooltips
    // Caso os dados a receber sejam diferentes, arranjar maneira de analisar e
    // alterar para que possam encaixar todos num método
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return "<p>Dados: <span style='color:green'>" + d.name + "</span></p>" +
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
    /// Fabrica de classes de widgets
    /// </summary>
    /// <param name="tipoClasse"> Tipo de classe a ser criada </param>
    /// <returns> Retorna um objecto da nova classe </returns>
    var FabricaClasses = function (id, tipoClasse, dados) {

        // todo Factory de classes
        switch (tipoClasse) {
            case "GraficoArea":
                return(new GraficoArea(id, "GraficoArea"));
                break;
            case "GraficoBarras":
                return (new GraficoBarras(id, "GraficoBarras"));
                break;
            case "GraficoLinhas":
                return (new GraficoLinhas(id, "GraficoLinhas"));
                break;
            case "Gauge":
                return (new Gauge(id, "Gauge"));
                break;
            case "KPI":
                return (new KPI(id, "KPI"));
                break;
            case "Tabela":
                return(new Tabela(id, "Tabela", dados));
                break;
            case "PieChart":
                return (new PieChart(id, "PieChart"));
                break;
            case "Filtros":
                return (new Filtros(id, "Filtros"));
                break;
            case "Data":
                return (new Data(id, "Data"));
                break;
        }

    }

    /// Classes ----------------------------------------------------------------------------------------------------


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
            TamanhoLimite = 350,
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

            this.agregacoes = [];
            this.seriesUtilizadas = [];

        }


        /// <summary>
        /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
        /// </summary>
        /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
        Widget.prototype.ConstroiSVG = function (id, self) {
            var selector;

            self.svg = d3.select("#"+id).select(".wrapper").insert("svg")
                .attr("width", self.largura + margem.esquerda + margem.direita)
                .attr("height", self.altura + margem.cima + margem.baixo)
              .append("g")
                .attr("transform", "translate(" + self.margem.esquerda + "," + self.margem.cima/2 + ")");


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
        /// Associa widget e regista no atributo apropriado
        /// </summary>
        /// <param name="widget"> STRING com o id do widget </param>
        /// <returns> Booleano que retorna true caso associe com sucesso</returns>
        Widget.prototype.AssociaWidget = function (widget) {
            var self = this,
                // Verificar que contexto do widget tem apenas um item do tipo dados, para não redesenhar por cima
                index = _.findIndex(self.contexto, function (valor) { return valor === widget; });


            if (index === -1) {
                self.contexto.push(widget);

                return true;
            }

            return false;

        }


        /// <summary>
        /// Remove associacao dos widgets
        /// </summary>
        /// <param name="widget"> STRING do Id de widget a ser desassociado </param>
        /// <returns> Booleano que retorna true caso desaassocie com sucesso</returns>
        Widget.prototype.DesassociaWidget = function (widget) {
            var self = this,
                tamanho = self.contexto.length;

            // Método lodash, qualquer item que seja equivalente dentro do self.contexto é removido
            _.remove(self.contexto, function (item) {
                return widget === item;
            })

            // Caso não tenha nenhum contexto
            if (self.widgetTipo === "dados" && self.contexto.length === 0) {
                // Dados passam a 0
                self.dados = {};
                // Apaga gráfico, pois não tem nenhuma fonte de dados
                self.RedesenhaGrafico(self.id);
            }

            // Caso o tamanho do contexto seja diferente que o inicial foi desassociado
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
            objecto["descricao"] = self.getDescricao();
            objecto["modoVisualizacao"] = self.modoVisualizacao;
            objecto["visivel"] = self.visivel;
            objecto["mostraLegenda"] = self.mostraLegenda;
            objecto["mostraToolTip"] = self.mostraToolTip;
            objecto["titulo"] = self.titulo;
            objecto["ultimaAtualizacao"] = self.ultimaAtualizacao;
            objecto["contexto"] = self.contexto;
            objecto["agregacoes"] = self.agregacoes;

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
        /// Apaga o conteudo do widget e desenha uma tabela com os dados que o widget contém
        /// </summary>
        Widget.prototype.TransformaWidgetTabela = function () {
            var self = this,
                construtorTabela = new Tabela("", "Tabela", self.dados);

            // Remove todos os elementos excepto a navbar
            $("#" + self.id).children().not(".widget-navbar").children().remove();

            // Constroi tabela dentro do Widget selecionado
            construtorTabela.InsereDadosAlternativo.call(this, self.id, construtorTabela);

        }


        /// <summary>
        /// Expande o widget para ocupar o ecra inteiro
        /// </summary>
        Widget.prototype.ExpandirWidget = function () {
            var self = this,
                widgetExpandido;

            // Cria novo div para dispor o widget ampliado
            $("body").prepend("<div id='ecraExpandido-widget'> <span style='float:right; margin-right: 10px;' class='glyphicon glyphicon-remove removeExpandir' aria-hidden='true'></span> <div class='wrapper'></div> <div class='legenda'></div> </div>")
            $("body").prepend("<div id='ecraFadeout-widget'></div>");


            // Adicionar o tamanho conforme o tamanho da main-gridstack mais a diferença das barras de navegação
            $("#ecraFadeout-widget").css("height", gridPrincipal.AlturaMaxima());

            // Evento para o botão de rmemoção
            self.RemoveExpandir();

            // Cria um objecto para construir o widget em formato ampliado
            widgetExpandido = FabricaClasses("ecraExpandido-widget", self.widgetElemento);

            // Copia os dados do original para objecto criado
            widgetExpandido.dados = self.dados;
            widgetExpandido.seriesUtilizadas = self.seriesUtilizadas;

            // Desenha o gráfico no widget criado
            widgetExpandido.RedesenhaGrafico("ecraExpandido-widget");

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
        Widget.prototype.RedesenhaGrafico = function (id) {
            var self = this;

            // TODO

            // Remove todos os elementos excepto a navbar
            $("#" + self.id).children().not(".widget-navbar").children().remove();


            // caso os dados estejam vazios
            if (self.dados.dados !== undefined) {
                // caso tenha items para desenhar
                if (self.dados.dados.Widgets[0].Items.length != 0) {

                    if (self.widgetElemento === "GraficoPie") {

                        self.ConstroiSVG.call(this, id);
                        self.InsereDados.call(this);

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
                    }

                } else {
                    self.svg.append("text")
                        .style("text", "não há dados possiveis");

                }
            }

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
        /// <param name="opcoes"> "Query" enviada ao servidor para pedir os dados</param>
        Widget.prototype.setDados = function (opcoes) {
            var self = this;

            self.dados = ((primerCORE.DashboardDevolveWidget(self, opcoes, gridPrincipal.idUnico, Utilizador.idUtilizador)));
            self.dados = $.parseJSON(self.dados);

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

            // Atualiza
            self.AtualizaObjectoServidor();

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
        Widget.prototype.getDescricao = function() {
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
        /// Adicionar uma série
        /// </summary>
        Widget.prototype.AdicionaSerieUtilizada = function (series) {
            var self = this;

            self.seriesUtilizadas = [];

            if (self.dados !== undefined && self.dados !== null) {
                series.forEach(function (item) {
                    // Caso o indicador exista
                    if (_.findIndex(self.dados.dados.Widgets[0].Items[0].Valores, function (valor) { return valor.Nome === item.ComponenteSerie }) !== -1) {
                        // Caso não seja repetido
                        if (_.findIndex(self.seriesUtilizadas, function (valor) { return item.ComponenteSerie === valor.ComponenteSerie }) === -1) {
                            self.seriesUtilizadas.push(item);
                        }
                    }
                })
            } else {
                alert("ERRO - Não existem dados")
            }

        }
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
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"esconde-widget\">"+"Esconde Widget"+"</a></li>");
        }

        /// <summary>
        /// Cria o botão para mostrar os dados de um widget
        /// </summary>
        Widget.prototype.OpcaoMostraDados = function () {
            var self = this;

            // Criar botão para simbolizar o update
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"verTabela-widget\">"+"Ver Tabela"+"</a></li>")
        }

        /// <summary>
        /// Cria o botão e liga o evento de mudança de formato
        /// </summary>
        Widget.prototype.OpcaoUpdate = function () {
            var self = this;

            // Criar botão para simbolizar o update
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"update-widget\">" + "Update Widget" + "</a></li>")

            // Atualizar gráfico ao clickar o botão
            $("#" + self.id).on("click", ".update-widget", function () {
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


        /// #Region ---------------------------------



        /// #Region -  Eventos


        /// <summary>
        /// Evento que vai modifica ro nome caso o utilizador o queira
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

                //$(".opcoes-propriedades").css("display", "block");

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


        /// #Region ---------------------------------


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
            color = d3.scale.category20(),
            nomeEixoX = "Eixo X",
            nomeEixoY = "Eixo Y",
            modoVisualizacao = "normal",  // stacked
            suavizarLinhas = false,
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

            this.chave = [];
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
            larguraRect = (self.largura / self.dados.dados.Widgets[0].Items.length);


            if (self.modoVisualizacao === "stacked") {
                stack = d3.layout.stack()
                    .values(function (d) { return d.values; });
            }


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
            } else {
                //to-do
            }


            // Inicia controlo de cores padrão to-do
            // Controla as keys (Series) que vão estar contidas no gráfico
            color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));


            // Caso esteja em modo Stacked
            if (self.modoVisualizacao === "stacked") {

                // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
                // Recorre ao método stack do d3
                dadosStacked = stack(color.domain().map(function (name) {
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
                                date: parseDate(d.Data)
                            };
                        })
                    }
                }));


                // Acrescentar ao SVG
                dados = self.svg.selectAll(".dados")
                                .data(dadosStacked)
                              .enter().append("g")
                                .attr("class", "dados")
                                // Compensar margem da esquerda
                                .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");


                // Acrescenta o desenho do gráfico
                dados.append("path")
                    .attr("class", "area")
                    .attr("title", "")
                    // Chamar area() para desenhar de acordo o "path" com os valores
                    .attr("d", function (d) { return self.area(d.values); })
                    // Adiciona tooltips
                    .style("fill", function (d) { return color(d.name); });


                // Grupo das tooltips
                self.pontos = self.svg.append("g")
                    .attr("class", "pontos");


                // Circulo que apresenta o "foco" do utilizador
                self.pontos.append("circle")
                    .attr("class", "circuloFoco")
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", "2")
                    .attr("r", 4)
                        .style("display", "none");

                // Atualizar eixo depois de dados inseridos
                self.transformaX.domain(d3.extent(self.dados, function (d) { return d.date; }));

                // Para cada objecto ( Ponto )
                dadosStacked.forEach(function (item, curIndex) {
                    // Para cada "variável"
                    self.pontos.selectAll(".ponto" + curIndex)
                        // Ligar o valor dos pontos
                        .data(item.values)
                      // Inserir rectangulo
                      .enter().append("rect")
                        .attr("class", "ponto" + curIndex)
                        .attr("x", function (d) { return self.transformaX(d.date); })
                        .attr("y", function (d) { return self.transformaY(d.y0 + d.y); })
                        .attr("width", larguraRect)
                        .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                        .style("opacity", "0");

                });

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
                                date: parseDate(d.Data)
                            };
                        })
                    }
                });


                // Adquirir valor máximo de cada uma das chaves(keys)
                self.dadosNormal.forEach(function (item) {
                    self.chave.push(d3.max(item.values, function (d) { return d.y; }));
                });


                // to-do var close
                self.transformaY.domain([0, d3.max(self.chave)]);

                // Atualizar eixo depois de dados inseridos
                self.transformaX.domain(d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));


                // Passar os dados para dentro de um objecto para serem facilmente lidos pelos métodos d3
                valores = [{ values: self.dadosNormal }];


                // Acrescentar ao SVG
                dados = self.svg.selectAll(".dados")
                                .data(self.dadosNormal)
                              .enter().append("g")
                                .attr("class", "dados")
                                // Compensar margem da esquerda
                                .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");


                // Acrescenta o desenho do gráfico
                dados.append("path")
                    .attr("class", "area")
                    .attr("title", "")
                    // Chamar area() para desenhar de acordo o "path" com os valores
                    .attr("d", function (d) { return self.area(d.values); })
                    // Adiciona tooltips
                    .style("fill", function (d) { return color(d.name); });


                // Grupo das tooltips
                self.pontos = self.svg.append("g")
                    .attr("class", "pontos");


                // Circulo que apresenta o "foco" do utilizador
                self.pontos.append("circle")
                    .attr("class", "circuloFoco")
                    .style("fill", "none")
                    .style("stroke", "red")
                    .style("stroke-width", "2")
                    .attr("r", 4)
                        .style("display", "none");


                // Para cada objecto ( Ponto )
                self.dadosNormal.forEach(function (item, curIndex) {
                    // Para cada "variável"
                    self.pontos.selectAll(".ponto" + curIndex)
                        // Ligar o valor dos pontos
                        .data(item.values)
                      // Inserir rectangulo
                      .enter().append("rect")
                        .attr("class", "ponto" + curIndex)
                        .attr("x", function (d) { return self.transformaX(d.date); })
                        .attr("y", function (d) { return self.transformaY(d.y); })
                        .attr("width", larguraRect)
                        .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                        .style("opacity", "0");

                });
            }

        }


        /// <summary>
        /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
        /// </summary>
        GraficoArea.prototype.ConstroiEixos = function () {

            var self = this;

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
              .orient("bottom");

            // Atribui valores a Y conforme a sua escala
            self.transformaY = d3.scale.linear()
              //.domain([0, d3.max(self.dados, function (d) { return d.teste1; })])
              .range([self.altura, 0]);

            // Construtor do Eixo dos Y
            self.escalaY = d3.svg.axis()
              .scale(self.transformaY)
              .orient("left");

            // Adiciona escala em formato percentagem
            if (self.modoVisualizacao === "stacked") {
                self.escalaY
                    .tickFormat(formatPercent);
            }
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
                    //.domain([0, d3.max(self.dados, function (d) { return d.teste1; })])
                    .range([self.altura, 0]);

            } else {
                self.transformaY = d3.scale.linear()
                    .domain([0, d3.max(self.chave)])
                    .range([self.altura, 0]);

            }

            //// Atualização da escala dos Eixos
            self.escalaX.scale(self.transformaX);
            self.escalaY.scale(self.transformaY);


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
                //ATUAL----
                //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
            }
            // Caso seja menor ou igual, apenas dispões os numeros pares
            if (self.largura <= self.TamanhoLimite) {
                // escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
            }
            // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
            if (self.largura < (self.TamanhoLimite - 100)) {
                //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
            }

            // Atualização do eixo dos X
            self.svg.select(".x.axis")
                .attr("class", "x axis")
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
        GraficoArea.prototype.InsereEixos = function () {
            var self = this;


            if (self.modoVisualizacao === "stacked") {
                // Insere eixo dos X (Stacked)
                self.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + self.margem.esquerda + "," + self.altura + ")")
                    .call(self.escalaX);

                // Insere eixo dos Y (Stacked)
                self.svg.append("g")
                    .attr("class", "y axis")
                    .call(self.escalaY);

            } else {
                self.svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + self.altura + ")")
                    .call(self.escalaX);

                self.svg.append("g")
                    .attr("class", "y axis")
                    .call(self.escalaY)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")

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
            self.EventoLegenda();
            self.OpcaoTooltip();
            self.OpcaoMostraDados();

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
                legenda;


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
                    .text(color.domain()[i]);

            }

        }


        /// <summary>
        /// Evento que mostra/esconde as legendas do widget
        /// </summary>
        GraficoArea.prototype.EventoLegenda = function () {
            var self = this;
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
        /// Método que atualiza os elementos que representam os dados
        /// atualiza os elementos dentro do SVG do widget
        /// </summary>
        GraficoArea.prototype.Atualiza = function () {
            var self = this,

            // Largura de cada rectangulo, de acordo com o tamanho de dados do widget
            larguraRect = (self.largura / self.dados.dados.Widgets[0].Items.length);

            // Pintar gráfico
            self.Renderiza();

            // Atualizar os dados
            // Seleciona todos os elementos com class .area e liga-os aos dados
            self.svg.selectAll(".area")
                .attr("d", function (d) { return self.area(d.values); })
                .style("fill", function (d) { return color(d.name); });

            // Caso esteja modo visualização stacked
            if (self.modoVisualizacao === "stacked") {

                // Para cada objecto ( Ponto )
                dadosStacked.forEach(function (item, curIndex) {

                    // Largura de cada rectangulo, de acordo com o tamanho do widget

                    // Para cada "variável"
                    self.pontos.selectAll(".ponto" + curIndex)
                        // Ligar o valor dos pontos
                        .data(item.values)
                      // Inserir rectangulo
                        .attr("x", function (d) { return self.transformaX(d.date); })
                        .attr("y", function (d) { return self.transformaY(d.y0 + d.y); })
                        .attr("width", larguraRect)
                        .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                            .style("opacity", "0")
                        // Compensar margem para eixo dos Y
                        .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");


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
                self.dadosNormal.forEach(function (item, curIndex) {
                    // Para cada "variável"
                    self.pontos.selectAll(".ponto" + curIndex)
                        // Ligar o valor dos pontos
                        .data(item.values)
                      // Inserir rectangulo
                        .attr("x", function (d) { return self.transformaX(d.date); })
                        .attr("y", function (d) { return self.transformaY(d.y); })
                        .attr("width", larguraRect)
                        .attr("height", function (d) { return self.altura - self.transformaY(d.y); })
                            .style("opacity", "0")
                        // Compensar margem para eixo dos Y
                        .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");

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
        GraficoArea.prototype.SuavizarLinhas = function (suaviza) {
            var self = this;

            if (suaviza === true) {
                // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                self.area = d3.svg.area()
                    // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                    .x(function (d) { return self.transformaX(d.nome); })
                    // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                    .y0(self.altura)
                    // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                    .y1(function (d) { return self.transformaY(d.teste1); })
                     //Faz a interpolação para suavizar as linhas
                    .interpolate("basis");
            } else {
                // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
                self.area = d3.svg.area()
                    // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                    .x(function (d) { return self.transformaX(d.nome); })
                    // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                    .y0(self.altura)
                    // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                    .y1(function (d) { return self.transformaY(d.teste1); });
            }

            // Atualiza gráfico
            self.Atualiza();
        }


        /// <summary>
        /// Modifica entre os vários tipos de visualização
        /// </summary
        GraficoArea.prototype.ModificaVisualizacao = function () {
            var self = this;

            // Cria botão para sinalizar o modo visualizacao
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"update-widget\">" + "Modifica Visualizacao" + "</a></li>")

            // Ao pressionar o botão update-widget, troca entre visualizações
            $("#" + self.id).on("click", ".update-widget", function () {

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
            this.objectoServidor["widgetElemento"] = "graficoBarras";
            this.objectoServidor["contexto"] = [];
            this.objectoServidor["agregacoes"] = [];

            this.chave = []
        };


        /// <summary>
        /// Herança é realizada através do método Herda
        /// </summary>
        Herda(GraficoBarras, Widget);


        /// <summary>
        /// Passa o gráfico para modo Grouped ( Agrupado )
        /// desenha todas as barras novamente e calcula o máximo, para os eixos depois serem ajustados
        /// </summary>
        GraficoBarras.prototype.Agrupa = function () {
            var self = this;

            self.AtualizaEixos();

            self.dadosAnalisados.forEach(function (item, curIndex) {

                self.selecao.selectAll(".barra" + curIndex)
                    // to-do modificar nome State para um genérico - Contar numero de keys e substituir pelo inteiro
                    .attr("x", function (d, curIndex) { return escalaSecundaria(d.name); })
                .transition("grouped")
                    .attr("y", function (d) { return transformaY(d.y); })
                    .attr("width", escalaSecundaria.rangeBand())
                    .attr("height", function (d) { return self.altura - transformaY(d.y); })
                    // Translação da data, mais o pequeno desvio do eixo (margem)
                    .attr("transform", function (d) { return "translate(" + (escalaOriginal(d.date) + self.margem.esquerda / 2) + ",0)"; });

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

            self.AtualizaEixos();


            self.dadosAnalisados.forEach(function (item, curIndex) {
                // Para todas as barras com numero curIndex
                self.selecao.selectAll(".barra" + curIndex)
                    // "Remover" atributo X, caso tenha sido atribuido quando estava em modo Grouped
                    .attr("x", null)
                //.transition("grouped")
                    .attr("y", function (d, valorAtual) { return transformaY(d.y + d.yStacked); })
                    .attr("width", escalaOriginal.rangeBand())
                    .attr("height", function (d, valorAtual) { return self.altura - transformaY(d.y); })
                    // Translação da data, mais o pequeno desvio do eixo (margem)
                    .attr("transform", function (d) { return "translate(" + (escalaOriginal(d.date) + self.margem.esquerda / 2) + ",0)"; });

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
        /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
        /// </summary>
        GraficoBarras.prototype.InsereDados = function () {
            var self = this,
                objectoAuxiliar,
                listaSeries = [];
            

            // Controla as keys (Series) que vão estar contidas no gráfico
            color.domain(d3.values(self.dados.dados.Widgets[0].Items[0].Valores).map(function (d) { return d.Nome; }));

            // Criar novo array de objectos para guardar a informação de uma forma mais fácil de utilizar
            self.dadosAnalisados = color.domain().map(function (name, curIndex) {
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
                            yStacked: 0,
                            date: parseDate(d.Data)
                        };
                    })
                }
            });


            // Atribui o valor "yStacked" que é a soma de todas as barras anteriores para que seja possivel
            // a concretização do tipo e gráfico stacked
            // Para cada data
            for (var index = 0; self.dadosAnalisados[0].values.length > index; index++) {
                // Para cada série
                for (var indexSeries = 1; self.dadosAnalisados.length > indexSeries ; indexSeries++) {
                    // Adicionar ao yStacked a soma entre o y e o yStacked anteriores
                    self.dadosAnalisados[indexSeries].values[index].yStacked = self.dadosAnalisados[indexSeries - 1].values[index].y + self.dadosAnalisados[indexSeries - 1].values[index].yStacked;
                }
            }

            // Adquirir valor máximo de cada uma das séries (chave)
            self.dadosAnalisados.forEach(function (item) {
                self.chave.push(d3.max(item.values, function (d) { return d.y; }))
            });


            // Ajustar escalas de acordo com o máximo
            transformaY.domain([0, d3.max(self.chave)]);


            // Guarda o nome de cada série para "filtrar"
            self.dadosAnalisados.forEach(function (item) {
                listaSeries.push(item.name);
            });


            // Atualizar eixo X
            escalaOriginal
                .rangeRoundBands([0, self.largura], 0.1)
                .domain(self.dadosAnalisados[0].values.map(function (d) { return d.date; }));

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
                self.dadosAnalisados.forEach(function ( item, curIndex) {
                    // Adicionar "barras" ao gráfico
                    self.selecao.selectAll("rect")
                        .data(item.values)
                    .enter().append("rect")
                        .attr("class", "barra"+curIndex)
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
                self.dadosAnalisados.forEach(function (item, curIndex) {
                    self.selecao.selectAll(".barra"+curIndex)
                        .data(item.values)
                    .enter().append("rect")
                        .attr("class", "barra"+curIndex)
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

        }


        /// <summary>
        /// Método que atualiza o gráfico, p.ex a sua escala ou os dados
        /// </summary>
        GraficoBarras.prototype.Atualiza = function () {
            var self = this
            
            // Pintar gráfico
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
            escalaX = d3.svg.axis()
              .scale(escalaOriginal)
              // Orientação da escala
              .orient("bottom");


            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
              // to-do numero?
              //.domain([0, d3.max(self.dados, function (d) { return d.numero; })])
              .range([self.altura, 0]);


            // Construtor do Eixo dos Y
            escalaY = d3.svg.axis()
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
                intervaloData = (d3.extent(self.dadosAnalisados[0].values, function (d) { return d.date; })),
                listaSeries = [];

            // Guarda os nomes de todas as séries
            self.dadosAnalisados.forEach(function (item) {
                listaSeries.push(item.name);
            });

            // Atualizar escala original
            escalaOriginal
                .rangeRoundBands(([0, $("#" + self.id).find(".wrapper").width() - self.margem.esquerda]), 0.1)
                .domain(self.dadosAnalisados[0].values.map(function(d) { return d.date;}));

            // Atualizar escala secundária
            escalaSecundaria
                .domain(listaSeries).rangeRoundBands([0, escalaOriginal.rangeBand()]);
                

            // Caso o modo seja stacked ( Empilhado )
            if (self.modoVisualizacao === "stacked") {

                // Cria lista de total de somas para cada Data
                var soma = 0,
                    listaTotal = [];

                for (var indexValores = 0; indexValores < self.dadosAnalisados[0].values.length; indexValores++) {
                    for (var index = 0; index < self.dadosAnalisados.length; index++) {
                        soma += self.dadosAnalisados[index].values[indexValores].y;
                    }
                    listaTotal.push(soma);
                    soma = 0;
                }


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
            escalaX.scale(escalaOriginal);
            escalaY.scale(transformaY);


            // Atualizar coordenadas do Eixo do X de acordo com o tamanho do widget
            d3.select("#" + self.id).select(".nomeEixoX")
                .attr("x", self.largura - 8)
                .attr("y", self.altura + self.margem.cima);


            // Se a altura do widget for menor
            if (self.altura <= 250) {
                // Remover nomeEixo
                // melhorar a visualização
                d3.select("#" + self.id).select(".nomeEixoY")
                    .text("");
            } else {
                // Senão, voltar a adicionar o nome
                d3.select("#" + self.id).select(".nomeEixoY")
                    .text(nomeEixoY);
            }


            // Numero de representações nos eixos de acordo com o tamanho do widget
            if (self.altura > self.TamanhoLimite) {
                escalaY.ticks(10);
            }
            if (self.altura <= self.TamanhoLimite) {
                escalaY.ticks(5);
            }
            if (self.altura <= (self.TamanhoLimite - 100)) {
                escalaY.ticks(2);
            }

            // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
            if (self.largura > self.TamanhoLimite) {
                //escalaX.tickValues(transformaX.domain());
            }
            // Caso seja menor ou igual, apenas dispões os numeros pares
            if (self.largura <= self.TamanhoLimite) {
                //escalaX.tickValues(transformaX.domain().filter(function (d, i) { return !(i % 2); }));
            }
            // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
            if (self.largura < (self.TamanhoLimite - 100)) {
                //escalaX.tickValues(transformaX.domain().filter(function (d, i) { return !(i % 5); }));
            }

            // TODO
            escalaX.tickFormat(function (d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); })

            // Atualização do eixo dos X
            self.svg.select(".x.axis")
                .attr("class", "x axis")
               // Translacção menos 5 pixeis para haver espaço para as letras no eixo do X
              .attr("transform", "translate(" + self.margem.esquerda / 2 + " ," + self.altura + ")")
              .call(escalaX)
            .selectAll("text")
              .attr("dx", "-2em")
              .attr("dy", ".5em")
              .attr("transform", "rotate(-35)");

            // Atualização do eixo dos Y
            self.svg.select(".y.axis")
                .attr("class", "y axis")
                .attr("transform", "translate(" + self.margem.esquerda / 2 + " , 0)")
              .call(escalaY);

        }


        /// <summary>
        /// Inserção dos eixos no SVG do widget
        /// </summary>
        GraficoBarras.prototype.InsereEixos = function () {
            var self = this;


            // Acrescentar no g a escala X  e o seu nome
            self.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + self.altura + ")")
              .call(escalaX)
                .selectAll("text")
                .attr("dx", "-2em")
                .attr("dy", ".5em")
                .attr("transform", "rotate(-35)");

            //// Insere nome do eixo do X
            //self.svg.append("g")
            //  .append("text")
            //    .attr("class", "nomeEixoX")
            //    .attr("x", self.largura - 20)
            //    .attr("y", self.altura + self.margem.cima)
            //    .attr("dx", ".71em");
            //      .text(nomeEixoX);

            // Acrescentar no g a escala Y e o seu nome to-do
            self.svg.append("g")
              .attr("class", "y axis")
              .call(escalaY)
            // Insere nome do eixo do Y
            .append("text")
              .attr("class", "nomeEixoY")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(nomeEixoY);

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
                series = self.dadosAnalisados.length,
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
                    .text(self.dadosAnalisados[i].name);

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
        /// Modifica entre os vários tipos de visualização
        /// </summary
        GraficoBarras.prototype.OpcaoModificaVisualizacao = function () {
            var self = this;

            // Cria botão para sinalizar o modo visualizacao
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"update-widget\">" + "Modifica Visualizacao" + "</a></li>")

            // Ao pressionar o botão update-widget, troca entre visualizações
            $("#" + self.id).on("click", ".update-widget", function () {

                // Caso esteja em modo grouped ( Agrupado )
                if (self.modoVisualizacao !== "grouped") {
                    self.modoVisualizacao = "grouped";
                    self.Agrupa();
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
            suavizarLinhas = "false",
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


            // TODO
            this.chave = [];
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
            // to-do id?


            // Update nos paths do gráfico
            // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
            linha = d3.svg.line()
                // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                .x(function (d) { return transformaX(d.date); })
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y(function (d) { return transformaY(d.y); });


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
                            name: name,
                            y: +d.Valores[index].Valor,
                            date: parseDate(d.Data)
                        };
                    })
                }
            });


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

            self.DesenhaSerie();


        }


        /// <summary>
        /// Desenha as séries que foram selecionadas pelo utilizador (seriesUtilizadas)
        /// </summary>
        GraficoLinhas.prototype.DesenhaSerie = function () {
            var self = this,
                index,
                id = 0;
                dadosEscolhidos = [];


            // Remove as séries anteriores
            $("#" + self.id).find(".series").remove();


            // Para cada serie utilizada
            self.seriesUtilizadas.forEach(function (item) {
                // Descobrir quais as que têm o valor de indicador correto
                index = _.findIndex(self.dadosNormal, function (serie) { return serie.name === item.ComponenteSerie })
                if (index !== -1) {

                    // Adiciona um numero a cada série para ser facilmente identificada
                    self.dadosNormal[index]["Numero"] = id++;
                    self.dadosNormal[index]["Nome"] = item.Nome;

                    dadosEscolhidos.push(self.dadosNormal[index]);
                }
            });
            
            
            // Seleciona todas as series
            series = self.svg.selectAll(".series")
               // Liga os elementos aos dados dataNest
              .data(dadosEscolhidos)
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
              .attr("d", function (d) { return linha(d.values); })
                // Uma cor é automaticamente escolhida de acordo com o componente color, para cada key
                .style("stroke", function (d) { return color(d.Nome); })
                .style("stroke-width", "2px")
                .style("fill", "none");

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
            transformaX = d3.time.scale()
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .range([0, self.largura])
                // Mapeia o dominio conforme a a data disponivel nos dad

            // Construtor do Eixo dos X
            escalaX = d3.svg.axis()
              .scale(transformaX)
              // Orientação da escala
              .orient("bottom");

            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
              // to-do numero?
              //.domain([0, d3.max(self.dados, function (d) { console.log(d); return d.y; })])
              .range([self.altura, 0]);

            // Construtor do Eixo dos Y
            escalaY = d3.svg.axis()
              .scale(transformaY)
              .orient("left");
            //.ticks(10);

        }


        /// <summary>
        /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
        /// </summary>
        GraficoLinhas.prototype.AtualizaEixos = function () {
            var self = this;

            // Atribui valores a Y conforme a sua escala
            transformaX = d3.time.scale()
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .range([0, $("#" + self.id).find(".wrapper").width() - self.margem.esquerda])
                // Mapeia o dominio conforme a a data disponivel nos dad
                .domain(d3.extent(self.dadosNormal[0].values, function (d) { return d.date; }));


            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
                .domain([0, d3.max(self.chave)])
                .range([self.altura, 0]);

            // Atualização da escala dos Eixos
            escalaX.scale(transformaX);
            escalaY.scale(transformaY);

            // Update nos paths do gráfico
            // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
            linha = d3.svg.line()
                // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                .x(function (d) { return transformaX(d.date); })
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y(function (d) { return transformaY(d.y); });

            // TODO
            // Atualizar coordenadas do Eixo do X de acordo com o tamanho do widget
            //d3.select("#" + self.id).select(".nomeEixoX")
            //    .attr("x", self.largura - self.margem.esquerda - self.margem.direita - 50)
            //    .attr("y", self.altura + self.margem.cima);

            // Se a altura do widget for menor
            if (self.altura <= 250) {
                // Remover nomeEixo
                // melhorar a visualização
                d3.select("#" + self.id).select(".nomeEixoY")
                    .text("");
            } else {
                // Senão, voltar a adicionar o nome
                d3.select("#" + self.id).select(".nomeEixoY")
                    .text(nomeEixoY);
            }


            // Numero de representações nos eixos de acordo com o tamanho do widget
            if (self.altura > self.TamanhoLimite) {
                escalaY.ticks(10);
            }
            if (self.altura <= self.TamanhoLimite) {
                escalaY.ticks(6);
            }
            if (self.altura <= (self.TamanhoLimite - 100)) {
                escalaY.ticks(4);
            }

            // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
            if (self.largura > self.TamanhoLimite) {
                //escalaX.tickValues(transformaX.domain());
            }
            // Caso seja menor ou igual, apenas dispões os numeros pares
            if (self.largura <= self.TamanhoLimite) {
                //escalaX.tickValues(transformaX.domain().filter(function (d, i) { return !(i % 2); }));
            }
            // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
            if (self.largura < (self.TamanhoLimite - 100)) {
                //escalaX.tickValues(transformaX.domain().filter(function (d, i) { return !(i % 5); }));
            }

            // Atualização do eixo dos X
            self.svg.select(".x.axis")
              // Translacção menos 5 pixeis para haver espaço para as letras no eixo do X
              .attr("transform", "translate(0," + (self.altura) + ")")
              .call(escalaX)
            .selectAll("text")
              .attr("dx", "-2em")
              .attr("dy", ".5em")
              .attr("transform", "rotate(-35)");

            // Atualização do eixo dos Y
            self.svg.select(".y.axis")
              .call(escalaY);

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
              .call(escalaX)
                // Roda os elementos do eixo dos X
                .selectAll("text")
                .attr("dx", "-2em")
                .attr("dy", ".5em")
                .attr("transform", "rotate(-35)");

            // TODO
            // Insere nome do eixo do X
            //self.svg.append("g")
            //  .append("text")
            //    .attr("class", "nomeEixoX")
            //    .attr("x", )
            //    .attr("y", self.altura + self.margem.cima)
            //    .attr("dx", ".71em")
            //      .text(nomeEixoX);

            // Acrescentar no g a escala Y e o seu nome to-do
            self.svg.append("g")
              .attr("class", "y axis")
              .call(escalaY)
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
            self.OpcaoUpdate();
            self.OpcaoMostraDados();
            self.OpcaoLegenda();

            // Liga evento para modificar titulo
            self.ModificaTitulo();

            self.setAtivo();
            self.RemoveAtivo();

        }


        /// <summary>
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
            var self = this;

            self.Renderiza();


            // Seleciona todos os elementos da class .line e liga-os aos dados
            self.svg.selectAll(".linha")
                // Para cada d, é calculado um novo path através da variável "linha"
                .attr("d", function (d) { return linha(d.values); })

        }


        /// <summary>
        /// Suaviza as linhas do gráfico através da interpolação
        /// </summary>
        GraficoLinhas.prototype.SuavizarLinhas = function (suaviza) {
            var self = this;

            if (suaviza === true) {
                // Aplica o método svg.line do d3 à variável linha
                linha = d3.svg.line()
                    // Dá um valor X conforme a sua escala
                    .x(function (d) { return transformaX(d.nome); })
                    // Dá um valor Y conforme a sua escala
                    .y(function (d) { return transformaY(d.teste1); })
                    // Faz a interpolação para suavizar as linhas
                    .interpolate("basis");
            } else {
                // Aplica o método svg.line do d3 à variável linha
                linha = d3.svg.line()
                    // Dá um valor X conforme a sua escala
                    .x(function (d) { return transformaX(d.nome); })
                    // Dá um valor Y conforme a sua escala
                    .y(function (d) { return transformaY(d.teste1); });
            }

            self.Atualiza();
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

            // Constroi Gráfico Arco
            if (modoVisualizacao === "arco") {
                self.ConstroiSVGArco();
                self.DesenhaGauge(0);
                setInterval(self.Atualiza(), 1500);
                setInterval(function () {
                    self.Atualiza();
                }, 1500);

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
            arcEndRad = arcStartRad + PercentagemParaRadianos(percentagem / 2);
            // Path do arco pintado calculado
            arcPintado.startAngle(arcStartRad).endAngle(arcEndRad);


            /// Definimos o angulo final, neste caso meia circunferencia
            arcEndRad = PercentagemParaRadianos(0.5 + 0.75);
            // Path do arco vazio calculado
            arcVazio.startAngle(arcStartRad).endAngle(arcEndRad);


            //Meta divido por 2, por ser um arco e não uma circunferencia
            arcStartRad = PercentagemParaRadianos(meta / 2);
            // Adicionamos um valor minimo no angulo final para ser explicito
            arcEndRad = PercentagemParaRadianos((meta / 2 + 0.005));
            // Path do arco meta calculado
            arcMeta.startAngle(arcStartRad).endAngle(arcEndRad);

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
                d.endAngle = arcEndRad

                // Constroi um novo conjunto de dados a começar no ultimo angulo conhecido até ao novo angulo
                // O valor do angulo é dividido devido ao desenho ser apenas meia circunferencia
                // É somado o valor 0.75 para este começar a partir da posição correcta de acordo com a visualização
                var interpolate = d3.interpolate(d.endAngle, PercentagemParaRadianos(anguloNovo / 2 + 0.75));
                return function (t) {
                    // Para cada valor de T, é utilizado a interpolação e dado um valor ao endAngle
                    d.endAngle = interpolate(t);
                    arcPintado.endAngle(d.endAngle);
                    // Guardado o ultimo valor caso haja outra tween
                    arcEndRad = d.endAngle;
                    // Retornamos o novo path
                    return arcPintado(d);
                };
            });

        }


        /// <summary>
        /// Desenha a meta no gráfico de acordo com os valores introduzidos
        /// </summary>
        Gauge.prototype.DesenhaMeta = function () {

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

                valorAtual = random;
                valorMaximo = 100;
                valorMinimo = 0;
                meta = 50;

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

                // Calculada percentagem atual de acordo com os valores
                percentagem = (((valorAtual - valorMinimo) * 100) / (valorMaximo - valorMinimo)) / 100;
                // Calculada meta atual de acordo com os valores
                meta = (((meta - valorMinimo) * 100) / (valorMaximo - valorMinimo)) / 100;


                // Selecionar gráfico pintado
                d3.select("#" + self.id).select(".grafico-pintado")
                    .transition()
                    .delay(50)
                    .duration(300)
                    // Chama a transição personalizada arcTween para desenhar a transição do arco
                    .call(self.arcTween, percentagem);

                textTween = function () {
                    // Cria nova interpolação desta vez, entre a atual percentagem, até ao valor final da percentagem
                    // Multiplicação por 100 devido ao angulo estar entre 0 e 1
                    var textInterpolate = d3.interpolate(parseInt(this.textContent), percentagem * 100);
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


        ///
        ///
        /// to-do
        Gauge.prototype.MostraOpcoes = function () {
            var self = this;

            $("body").append("<div id=\"myModal\" class=\"modal fade\">" +
                "<div class=\"modal-dialog\">" +
                "<div class=\"modal-content\">" +
                "<div class=\"modal-header\">" +
                "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">" + "&times;" + "</button>" +
                "<h4 class=\"modal-title\">" + "Opcoes da Gauge" + "</h4>" +
            "</div>" +
            "<div class=\"modal-body\">" +
                "<p>Selecione as suas opcoes</p>" +
                "<div class=\"gauge-selecionaOpcoes\">" +
                "</div>" +
            "</div>" +
            "<div class=\"modal-footer\">" +
                "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">" + "Cancelar" + "</button>" +
                "<button type=\"button\" class=\"btn btn-primary\">" + "Escolher" + "</button>" +
            "</div>" + "</div>" + "</div>" + "</div>");

            $(".gauge-selecionaOpcoes").load("gauge-tabelaOpcoes.html .gauge-tabelaOpcoes");

            // Ligamos um botão para a "navbar" do widget
            $("#" + self.id).find(".widget-navbar").append("<button type=\"button\"" + "class=\"gauge-opces\">" +
                                                           "<i class=\"glyphicon glyphicon-refresh\">" + "</i>" + "</button");

            // Ao pressionar modifica entre donut e não donut
            $("#" + self.id).on("click", ".gauge-opces", function () {
                $("#myModal").modal("show");
            });
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
            valor = 0,
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

            this.objectoServidor["widgetTipo"] = "dados";
            this.objectoServidor["widgetElemento"] = "KPI";
            this.objectoServidor["contexto"] = [];
            this.objectoServidor["agregacoes"] = [];
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

            // Começa o ciclo para atualizar os dados
            setInterval(function () {

                valorTextTween = random;

                // Seleciona o elemento to-do
                self.svg.select(".valorAtual")
                    .transition()
                    .duration(500)
                    // Chama a transição personalizada
                    .tween("text", self.TextTween);

                // to-do?
                self.setValor(random);
                self.VerificaValor();

            }, 1500);
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
        /// sinalizar o utilizar de melhor forma
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


            // Seleciona o wrapper para inserir o svg
            self.svg = d3.select("#" + self.id).select(".wrapper").insert("svg")
                // 80% para deixar algum espaço para as tooltip/legenda
                .attr("width", "100%")
                .attr("height", "100%")
                // Atribuida uma viewBox de acordo com o valor minimo de entro a sua altura ou largura
                .attr('viewBox', '0 0 ' + (Math.min(self.largura, self.altura)) + ' ' + (Math.min(self.largura, self.altura)))
                // Mantém a proporção de imagem independentemente do tamanho, e tenta sempre posiciona-la a meio
                .attr("preserveAspectRatio", "xMidYMid")
              .append("g")
                // Translação do raio minimo para estar dentro do svg de forma adequada
                .attr("transform", "translate(" + (Math.min(self.largura, self.altura) / 2) + "," + (Math.min(self.largura, self.altura) / 2) + ")");

        }

        /// <summary>
        /// Constroi o HTML necessário para mostrar a informação ao utilizador
        /// </summary>
        KPI.prototype.ConstroiHTML = function (id) {
            var self = this;

            // Redefinimos a translação dos elementos para se enquadrarem no meio do SVG
            //self.svg.attr("transform", "translate(" + (self.largura / 2) + "," + (self.altura / 2) + ")");

            // Atribui class ao SVG
            d3.select("." + id).select(".wrapper").select("svg")
                .attr("class", "labelValor");

            // Insere texto que indica o nome do valor observado
            self.svg.insert("text")
                // Atribuir class
                .attr("class", "valorSelecionado")
                .attr("dy", "-2em")
                  .style("font-size", "1.5em")
                  .style("text-anchor", "middle")
                  //  Nome da variável
                  .text("Valor ID: ");

            // Insere texto que guarda valor atual
            self.svg.insert("text")
                .attr("class", "valorAtual")
                  .style("font-size", "3em")
                  .style("text-anchor", "middle")
                  // to-do?
                  .text(valor);

            // Insere texto que guarda valor Limite
            self.svg.insert("text")
                .attr("class", "valorLimite")
                .attr("dy", "3em")
                  .style("font-size", "1em")
                  .style("text-anchor", "middle")
                  .text("Valor Limite: " + self.valorLimite);

            // Insere circulo para melhor sinalizar estado dos dados
            self.svg.insert("circle")
                .attr("class", "valorCompara")
                .attr("cx", "3em")
                .attr("cy", "-1em")
                .attr("r", "10")
                  .style("fill", "grey");

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
            dataNest,
            series,
            arc,
            pie,
            path,
            raio,
            donut = false,
            color = d3.scale.category20(),
            parseDate = d3.time.format("%y-%b-%d").parse;

        var fatias;


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
            this.objectoServidor["widgetElemento"] = "pieChart";
            this.objectoServidor["contexto"] = [];
            this.objectoServidor["agregacoes"] = [];

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


            // Seleciona o wrapper para inserir o svg
            self.svg = d3.select("#" + id).select(".wrapper").insert("svg")
                // 80% para deixar algum espaço para as tooltip/legenda
                .attr("width", "100%")
                .attr("height", "100%")
                // Atribuida uma viewBox de acordo com o valor minimo de entro a sua altura ou largura
                .attr('viewBox', '0 0 ' + (Math.min(self.largura, self.altura)) + ' ' + (Math.min(self.largura, self.altura)))
                // Mantém a proporção de imagem independentemente do tamanho, e tenta sempre posiciona-la a meio
                .attr("preserveAspectRatio", "xMidYMid")
              .append("g")
                // Translação do raio minimo para estar dentro do svg de forma adequada
                .attr("transform", "translate(" + (Math.min(self.largura, self.altura) / 2 ) + "," + (Math.min(self.largura, self.altura) / 2) + ")");
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
            self.dadosAnalisados = color.domain().map(function (name, curIndex) {
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

            // Ciclo para descobrir a soma de todos os valores de uma "Serie"
            // Para cada "Serie"
            color.domain().forEach(function (nome, curIndex) {
                // Definir cada entrada no array a zero
                ArraySoma[curIndex] = 0;
                // Fazer soma para essa "Serie"
                self.dadosAnalisados[curIndex].values.forEach(function (valor) {
                        ArraySoma[curIndex] += valor.y;
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


            // Seleciona todos os path
            self.path = self.svg.selectAll("path")
                // utilizamos o pie para calcular os angulos e atribuimos a data
                .data(pie(self.dadosAnalisados))
              // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
              .enter().append("path")
                // Atribuido id a cada "fatia"
                .attr("id", function (d, i) { return "path" + i; })
                // Atribuida class slice ao elemento
                .attr("class", "slice")
                // Atribuida cor através do método color
                .attr("fill", function (d, i) { return color(i); })
                // É criado o path utilizando o método arc do d3
                .attr("d", self.arc);

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
            var atualizaPath = d3.select("#" + self.id).selectAll(".slices").data(pie(self.dadosAnalisados));

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
            $("#" + self.id).find(".dropdown-menu").append("<li><a class=\"update-widget\">" + "Modifica Visualizacao" + "</a></li>")


            // Ao pressionar o botão update-widget, troca entre visualizações
            $("#" + self.id).on("click", ".update-widget", function () {
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
            this.dados = dados;
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
                opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            // Passar tudo para opcoes de estilo? to-do
            opcoesEstilo.columnDefs.push({
                targets: [1, 2],
                className: "dt-body-center"
            });


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

                // Manipular data com o moment
                //console.log(moment(item.Data).format("YYYY-M-D"));

                // Insere o valor recebido "Chave" (Unix timestamp) e através do moment 
                // formata para o resultado desejado
                objectoValores[ValorData] = parseDate(item.Data).toLocaleDateString(getLinguagem());

                // Guardar objecto no array
                dadosAnalisados.push(objectoValores);

            });

            // Selecionado o id da table
            self.tabela = $("#" + self.id).find(".widget-table").DataTable({
                // Apontar para onde estão os dados
                data: dadosAnalisados,
                // Especificar as colunas to-do
                columns: self.ConstroiColuna(),
                order: [[ 3, "desc" ]],
                "language": linguagem,
                // Menu que escolhe o numero de elementos a mostrar
                "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "Todos"]],
                // Elementos a mostrar na página inicial
                "pageLength": 5,
                // Método para ligar as definições aqui to-do
                columnDefs: opcoesEstilo.columnDefs
            });

            self.OpcaoMostraDados();

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
                targets: [1, 2],
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

                // Manipular data com o moment
                //console.log(moment(item.Data).format("YYYY-M-D"));

                // Insere o valor recebido "Chave" (Unix timestamp) e através do moment 
                // formata para o resultado desejado
                objectoValores[ValorData] = parseDate(item.Data).toLocaleDateString(getLinguagem());

                // Guardar objecto no array
                dadosAnalisados.push(objectoValores);

            });


            // Selecionado o id da table
            self.tabela = $("#" + self.id).find(".widget-table").DataTable({
                // Apontar para onde estão os dados
                data: dadosAnalisados,
                // Especificar as colunas to-do
                columns: widgetTabela.ConstroiColuna(),
                order: [[3, "desc"]],
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

            // Para cada "serie"/chave de dados
            d3.values(self.dados.dados.Widgets[0].Items[0].Valores).forEach(function (valorColuna, curIndex) {

                var nomeVerificado = valorColuna.Nome.replace(/\./g, '_');

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

            // Caso não existam já dados ( Tabela de informação )
            if (self.dados === undefined) {
                // to-do Query? Get Query?
                //self.setDados($.parseJSON(getDados(self, "valor")));
            }

            // Adiciona classe do gráfico ao widget
            //$("#" + self.id).addClass("tabela");

            // to-do fazer a a analise da data sem modificar os dados originais

            // Adiciona uma tabela base para aplicar as dataTables
            $("#" + self.id).find(".wrapper").append("<table " + "class=\"display widget-table\">" + "</table>")

            // Inserir dados na tabela
            //self.InsereDados(id);
            self.OpcaoMostraDados();

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
        var opcoes =
            [
                { Nome: "Opção A", Valor: "index:indicadores AND type:dadomedido AND tagID: 773" },
                { Nome: "Opção B", Valor: "index:indicadores AND type:dadomedido AND tagID: 774" },
                { Nome: "Opção C", Valor: "index:indicadores AND type:dadomedido AND tagID: 775" }
            ],
            parseDate = d3.time.format("%y-%b-%d").parse,
            filtros;

        /// <summary>
        /// Método construtor para a classe Filtros, chama o construtor do Widget
        /// </summary>
        function Filtros(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);

            this.contexto = [];
            this.opcoes = opcoes;

            this.widgetTipo = "contexto";
            this.widgetElemento = "query";

            // Define o tipo e o elemento do widget
            this.objectoServidor["widgetTipo"] = "contexto";
            this.objectoServidor["widgetElemento"] = "query";
            this.objectoServidor["contexto"] = [];

            this.filtros = [];

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
            var self = this;

            $("#" + self.id).find(".filtros-opcoes").find("option").remove();

            self.opcoes.forEach(function (item) {
                $("#" + self.id).find(".filtros-opcoes").append("<option value=" + item.Valor + ">" + item.Nome + "</option>");
            })

        }


        //TO-DO
        /// <summary>
        /// Método que atualiza a tabela, p.ex a sua escala ou os dados
        /// </summary>
        Filtros.prototype.Atualiza = function () {
            var self = this

            // to-do

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

            console.log(dados);

            // Para cada filtro 
            _.each(dados, function (item, key) {
                
                // Caso o filtro não esteja vazio
                if (item.label !== "") {
                    // Adicionar
                    self.filtros.push({ Nome: item.label, Valor: item.valor });
                }
            
            });

            // Substituir nas opcoes
            self.opcoes = self.filtros;

            // Inserir os novos dados
            self.InsereDados();

        }

        /// <summary>
        /// Atualiza as informações de acordo com a propertyGrid
        /// Também atualiza o checkboxMenu
        /// </summary>
        /// <param name="geral"> Objecto devolvido pela PropertyGridGeral </param>
        /// <param name="dados"> Objecto devolvido pela PropertyGridDados </param>
        /// <param name="aparencia"> Objecto devolvido pela PropertyGridAparencia </param>
        Filtros.prototype.AtualizaOpcoesPropertyGeral = function (geral) {
            var self = this;

            self.setTitulo(geral.Nome);
            self.setDescricao(geral.Descricao);

            

        }
        Filtros.prototype.AtualizaOpcoesPropertyDados = function (dados) {
            var self = this;

            self.GuardaFiltros(dados);

        }
        Filtros.prototype.AtualizaOpcoesPropertyAparencia = function (aparencia) {
            var self = this;

            //todo

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
            this.opcoes = {
                "dataInicio": "2015-01-01",
                "dataFim": "2015-01-20"
            };

            this.widgetTipo = "contexto";
            this.widgetElemento = "datahora_simples";

            // Define o tipo e o elemento do widget
            this.objectoServidor["widgetTipo"] = "contexto";
            this.objectoServidor["widgetElemento"] = "datahora_simples";
            this.objectoServidor["contexto"] = [];
            this.objectoServidor["opcoes"] = this.opcoes;

            this.dataDescricao = { dataInicio: "Data inicial", dataFim: "Data Final" };

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
                locale: linguagem,
                widgetPositioning: {
                    vertical: "bottom"
                },
                widgetParent: $("#" + self.id).parent(),
                showClose: true
            });



            // Acrescenta ao wrapper a segunda escolha
            self.svg = $("#" + self.id).find(".wrapper").append("<span class='datafinal-"+self.id+" '>Data Final</span>: <div class=\"container\">"
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
                locale: linguagem,
                useCurrent: false,
                widgetPositioning: {
                    vertical: "bottom"
                },
                widgetParent: $("#" + self.id).parent(),
                showClose: true
            });


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
        /// Método que atualiza a tabela, p.ex a sua escala ou os dados
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

            // Guarda o objecto data no widget ( Data Inicial )
            self.opcoes.dataInicio = $("#" + self.id).find("#datetimepicker-" + self.id).data("DateTimePicker").date()._d;


            mes = ("0" + (self.opcoes.dataInicio.getMonth() + 1)).slice(-2);
            dia = ("0" + self.opcoes.dataInicio.getDate()).slice(-2);

            // Passa o objecto data para o formato ideal para o widget guardar
            self.opcoes.dataInicio = self.opcoes.dataInicio.getFullYear() + "-" + mes + "-" + self.opcoes.dataInicio.getDate();

            self.Atualiza();

        }


        /// <summary>
        /// Guarda a data Inicial dos "pickers" no próprio widget
        /// </summary
        Data.prototype.GuardaDataFinal = function () {
            var self = this,
                mes;

            // Guarda o objecto data no widget ( Data Final )
            self.opcoes.dataFim = $("#" + self.id).find("#datetimepicker2-" + self.id).data("DateTimePicker").date()._d;

            mes = ("0" + (self.opcoes.dataFim.getMonth() + 1)).slice(-2);
            dia = ("0" + self.opcoes.dataFim.getDate()).slice(-2);
            // Passa o objecto data para o formato ideal para o widget guardar
            self.opcoes.dataFim = self.opcoes.dataFim.getFullYear() + "-" + mes + "-" + self.opcoes.dataFim.getDate();

            self.Atualiza();
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
            objecto["opcoes"] = self.opcoes;

            return objecto;
        }


        /// <summary>
        /// Filtra a informação de acordo com as datas guardadas no widget
        /// </summary>
        /// <param name="widget"> Recebe os dados de um widget </param>
        Data.prototype.FiltraDados = function (widget) {
            var self = this,
            
            // Datas do filtro convertidas para serem comparadas
            dataInicioFiltro = Date.parse(self.opcoes.dataInicio),
            dataFimFiltro = Date.parse(self.opcoes.dataFim);

            widget.setDados(self.opcoes);

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
        Data.prototype.AtualizaOpcoesPropertyGeral = function (geral) {
            var self = this;

            self.setTitulo(geral.Nome);
            self.setDescricao(geral.Descricao);
            
        }
        Data.prototype.AtualizaOpcoesPropertyDados = function (dados) {
            var self = this;

            self.setNomeDataInicial(dados.DataInicial);
            self.setNomeDataFinal(dados.DataFinal);
            self.setDataInicialDescricao(dados.DataInicialDescricao);
            self.setDataFinalDescricao(dados.DataFinalDescricao);

            self.AtualizaNomes();

        }
        Data.prototype.AtualizaOpcoesPropertyAparencia = function (aparencia) {
            var self = this;

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
    var PropertyGrid = (function(){
        var widget,
            widgetID,
            propertyGridElemento, // dashboard, data, dados
            propriedades = {},
            idSerie = 1,
            idFiltro = 1,
            Componente = [],
            CampoSeries = ["Vazio", "Média", "Minimo", "Maximo", "ContagemUnica"],
            FuncaoSeries = ["Vazio", "Somatorio", "Mediana", "Contagem", "Percentis"],
            FixoPeriodo = ["Selecione um periodo", "Ano", "Dia", "Hora", "Mes", "Minuto", "Segundo", "Semana", "Trimestre"];

        function PropertyGrid() {
            this.PropertyGrid = {};
        }


        PropertyGrid.widgets = {};


        // Por dentro do Widget??
        // Guarda dados das séries dentro de um array
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
                if (key === "Quebra-" + (index + 1)) {

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
                } else if (key !== "Botao" && key !== "Fixo" && key !== "ComponenteContexto") {
                    // Separa chave do numero associado
                    chave = key.split('-');

                    // Adicionar ao objecto
                    objectoSeries[index][chave[0]] = objPropertyGridDados[key];

                }

            });

            return objectoSeries;

        }


        // Getters e setters dos indicadores do widget 
        // o set neste caso é indicativo da classe propertygrid e não so widget
        PropertyGrid.setIndicadores = function (widgetID) {
            var self = this,
                opcoes = ["Selecione Indicador"],
                series;
                
            if (gridPrincipal.getWidget(widgetID).getIndicadores() !== undefined) {
                gridPrincipal.getWidget(widgetID).getIndicadores().forEach(function (valor) { return opcoes.push(valor); })
            }

            self.inicializaDados.ComponenteSerie = { name: "Indicador:", group: "Series", type: "options", options: opcoes, description: "Widgets que contêm os gráficos", showHelp: false };

        }
        PropertyGrid.getIndicadores = function (widgetID) {
            var self = this,
                opcoes = ["Selecione Indicador"];

            if (gridPrincipal.getWidget(widgetID).getIndicadores() !== undefined) {
                gridPrincipal.getWidget(widgetID).getIndicadores().forEach(function (valor) { return opcoes.push(valor); })
            }

            return opcoes;

        }

        // Constroi a grid
        // <param name="tipo"> tipo de componente para qual a grid vai ser construida
        PropertyGrid.ConstroiGrid = function () {
            var self = this;

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

            $('#propGridAparencia').jqPropertyGrid(self.propriedadesAparencia, self.inicializaAparencia);

        }

        // Remove propertyGrid atual e a sua visualização
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

        // Elimina da DOM as propertyGrids
        PropertyGrid.EliminaPropertyGrid = function() {
            $("#propGridGeral").children().remove();
            $("#propGridDados").children().remove();
            $("#propGridAparencia").children().remove();

        }

        // Define o titulo do widget
        // vai ser mostrado na propertyGrid para indicar mais claramente
        // o widget escolhido pelo utilizador
        PropertyGrid.SetWidgetPropertyGrid = function (titulo, id, elemento) {
            var self = this;

            self.widgetID = id;

            // Dá um titulo conforme o widget selecionado
            $(".nomeWidget-propertyGrid").text(titulo + " - " + elemento);
        };

        // Toggle do aviso que nenhum dashboard/widget estão ativos
        PropertyGrid.TogglePropertyGrid = function () {
            // Remove o div que mostra que nenhum dashboard/widget estão selecionados
            $(".opcoes-semPropertyGrid").css("display", "none");

        };

        // Mostra a propertyGrid
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
            } else if (tipoElemento === "query"){
                self.AdicionaGridFiltro();
                $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
            } else{
                self.AdicionaGrid();
                $(".opcoes-propertyGrid").find("[value='dados']").css("display", "");
            }

        }

        // Modifica a box de acordo com a opcao enviada
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

        // Modifica a propetyGrid para mostrar o tipo de menu recebido como argumento
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


        // Atribui as opções possiveis no menu da associação
        PropertyGrid.setWidgets = function (listaWidgetsDados, listaWidgetsContexto) {
            var self = this;

            // Define as listas
            self.listaWidgetsDados = listaWidgetsDados;
            self.listaWidgetsContexto = listaWidgetsContexto;

            // Inicializa as dropdowns da propertygrid de acordo com os widgets que se encontram disponiveis
            self.inicializaDados.ComponenteContexto = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false },
            self.inicializaDados.ComponenteDados = { name: "Componente Dados", group: "Componentes", type: "options", options: self.listaWidgetsDados, description: "Widgets a associar", showHelp: false };

        }

        // Volta a ligar os widgets de associacao
        PropertyGrid.ResetWidgets = function () {
            var self = this;

            // Inicializa as dropdowns da propertygrid de acordo com os widgets que se encontram disponiveis
            self.inicializaDados.ComponenteContexto = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false },
            self.inicializaDados.ComponenteDados = { name: "Componente Dados", group: "Componentes", type: "options", options: self.listaWidgetsDados, description: "Widgets a associar", showHelp: false };

        }

        // Obtem dados da propertyGrid atual
        PropertyGrid.getDados = function () {
            return $('#propGrid').jqPropertyGrid('get');
        }

        // Getters para os dados disponiveis nas dropdowns
        PropertyGrid.getWidgetsDados = function () {
            return objecto.widgets.WidgetDados;
        }
        PropertyGrid.getWidgetsContexto = function () {
            return objecto.widgets.WidgetContexto;
        }



        /// #Region - Inicialização ----------------------------------

        // Inicialização da PropertyGrid - Inicialização dos atributos possiveis na propertyGrid
        PropertyGrid.Inicializa = function () {
            var self = this;

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
                BotaoFiltro: { name: " ", group: "Opcoes Disponiveis", type: "botaoFiltro", description: "../resources/ic_add_white_24dp_1x.png", showHelp: false }
            };
            self.inicializaAparencia = {
                Margem: { name: "Margem:", group: "Aparencia", description: "Margem em volta do gráfico", showHelp: false },
                MargemIgual: { name: "Aplicar Todos:", group: "Aparencia", description: "Aplicar a mesma margem a todos", showHelp: false },
                MargemDiferente: { name: "Margens:", group: "Aparencia", description: "Aplicar diferentes margens", showHelp: false },
                Fundo: { name: "Fundo:", group: "Aparencia", type: "color", options: { preferredFormat: "hex" }, showHelp: false },
                Grelha: { name: "Esconder Grelha:", group: "Aparencia", type: "boolean", description: "Revelar ou ocultar a grelha", showHelp: false }
            };

        }

        // Inicialização da PropertyGrid - Inicialização dos atributos possiveis na propertyGrid
        PropertyGrid.InicializaEventos = function () {
            var self = this;

            // Adiciona o evento para adicionar séries
            self.EventoAdicionaSerie();

            self.EventoAdicionaFiltro();

            self.EventoAlteraBotão();
            self.EventoAdicionaAssociacao();
            self.EventoRemoveAssociacao();

            self.EventoBotaoAtualizar();
        }

        // Incializa as séries na propertyGrid
        PropertyGrid.InicializaSeries = function () {
            var self = this;


            gridPrincipal.getWidget($(".widget-ativo").attr("id")).seriesUtilizadas.forEach(function (item) {

                self.inicializaDados["Nome-" + idSerie] = { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false };
                self.inicializaDados["Pesquisa-" + idSerie] = { name: "Pesquisa", group: "Series", description: "Query", showHelp: false };
                self.inicializaDados["ComponenteSerie-" + idSerie] = { name: "Indicador:", group: "Series", type: "options", options: self.getIndicadores($(".widget-ativo").attr("id")), description: "Widgets que contêm os gráficos", showHelp: false };
                self.inicializaDados["Campo-" + idSerie] = { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false };
                self.inicializaDados["Funcao-" + idSerie] = { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false };
                self.inicializaDados["Quebra-" + idSerie] = { name: " ", type: "split", group: "Series", showHelp: false }

                idSerie++;

            });

            self.PreencheSeries();

            self.AdicionaBotao();

        }

        // Inicializa os filtros/labels na propertyGrid
        PropertyGrid.InicializaFiltros = function () {
            var self = this;

            gridPrincipal.getWidget($(".widget-ativo").attr("id")).filtros.forEach(function (filtro) {
                self.inicializaDados["Filtro-" + idFiltro] = { name: "", group: "Opcoes Disponiveis", description: filtro.Nome, type: "filtro", showHelp: false };

                idFiltro++;
            });


            self.PreencheFiltros();
            self.RemoveBotaoFiltro();
            self.AdicionaBotaoFiltro();

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
                    

                // Encontra valor do componente de dados ques e encontra ligado
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

                //todo
                //self.propriedadesAparencia = {
                //    Margem: "" ,
                //    MargemIgual: "" ,
                //    MargemDiferente: ""
                //}

            }

            if (self.propertyGridElemento === "data") {

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
        PropertyGrid.PreencheSeries = function () {
            var self = this,
                index = 1;

            gridPrincipal.getWidget($(".widget-ativo").attr("id")).seriesUtilizadas.forEach(function (serie) {
                self.propriedadesDados["Nome-" + index] = serie.Nome;
                self.propriedadesDados["Pesquisa-" + index] = serie.Pesquisa;
                self.propriedadesDados["ComponenteSerie-" + index] = serie.ComponenteSerie;
                self.propriedadesDados["Campo-" + index] = serie.Campo;
                self.propriedadesDados["Funcao-" + index] = serie.Funcao;
                self.propriedadesDados["Quebra-" + index] = " ";

                index++;

            });


        }

        // Preenche filtros do widget na PropertyGrid
        PropertyGrid.PreencheFiltros = function () {
            var self = this;
            index = 1;


            gridPrincipal.getWidget($(".widget-ativo").attr("id")).filtros.forEach(function (filtro) {
                self.propriedadesDados["Filtro-" + index] = filtro.Valor;

                index++;
            })
        }

        /// #Region



        ///  #Region - Adicionar PropertyGrids ----------------------------------

        // PropertyGrid - Dashboard
        PropertyGrid.AdicionaGridDashboard = function () {
            var self = this;

            self.widgetID = $(".widget-ativo").attr("id");

            // Valores a inserir nas propertyGrids
            self.propriedadesGeral = {
                Nome: gridPrincipal.nome,
                Descricao: gridPrincipal.descricao
            };
            self.propriedadesAparencia = {
                Fundo: "",
                Grelha: ""
            }

            self.propertyGridElemento = "dashboard";

            self.ConstroiGrid();
            self.SetGrid("geral");
            self.SetPropertyGrid("geral");

            self.EventoMostraGridAtual();

        }

        // PropertyGrid - Dados
        PropertyGrid.AdicionaGrid = function() {
            var self = this,
                valorInicial = "";

            self.widgetID = $(".widget-ativo").attr("id");

            self.Inicializa();
            self.ResetWidgets();
            idSerie = 1;

            // Valor do widget contexto que está ligado ao widget (Data)
            gridPrincipal.getWidget(self.widgetID).contexto.forEach(function (valor) {
                if (gridPrincipal.getWidget(valor).widgetElemento === "datahora_simples") {
                    valorInicial = gridPrincipal.getWidget(valor).titulo;
                }
            })


            // Valores a inserir nas propertyGrids
            self.propriedadesGeral = {
                Nome: gridPrincipal.getWidget(self.widgetID).titulo,
                Descricao: gridPrincipal.getWidget(self.widgetID).descricao,
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
                    ComponenteContexto: (valorInicial === "")? "" :  valorInicial 
                };
            //}


            self.propriedadesAparencia = {
                Margem: "",
                MargemIgual: "",
                MargemDiferente: ""
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

            console.log(self.propriedadesDados);

            self.AdicionaCheckboxMenu();

            self.SetGrid("geral");
            self.SetPropertyGrid("geral");

            self.EventoAtualizaDatas();
            self.EventoMostraGridAtual();

            self.AtualizaWidgetData();

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
        }


        /// #Region 



        /// #Region - Atualizações ----------------------------------
         
        // Dashboard
        PropertyGrid.AtualizaDashboard = function () {
            var self = this,
                objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
                objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get");


            // Atualiza o titulo/descricao do widget com o nome inserido na box da propertyGrid
            gridPrincipal.setNome(objPropertyGridGeral.Nome);
            gridPrincipal.setDescricao(objPropertyGridGeral.Descricao);

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

            gridPrincipal.getWidget(widget1.id).setTitulo(objPropertyGridGeral.Nome);
            gridPrincipal.getWidget(widget1.id).setDescricao(objPropertyGridGeral.Descricao);


            objectoSeries = self.GuardaSeries();

            // Atualiza Widget (to-do atualizar dados? // Alerta)
            if (gridPrincipal.getWidget(widget1.id).dados !== undefined) {

                // Adiciona as opcoes das séries ao objecto principal
                gridPrincipal.getWidget(widget1.id).AdicionaSerieUtilizada(objectoSeries);

                gridPrincipal.getWidget(widget1.id).Atualiza();

            }

            // Chamar método para atualizar objecto servidor no widget
            gridPrincipal.GuardaInformacao();

            gridPrincipal.FiltraContexto();

        }

        // widget Data
        PropertyGrid.AtualizaWidgetData = function () {
            var self = this;

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

            //var self = this,
            //    objPropertyGridGeral = $("#propGridGeral").jqPropertyGrid("get"),
            //    objPropertyGridDados = $("#propGridDados").jqPropertyGrid("get"),
            //    objPrpertyGridAparencia = $("#propGridAparencia").jqPropertyGrid("get"),
            //    // Widgets a serem associados
            //    widget1;




            //// ID do widget contexto
            //widget1 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

            //// Trata das associações das checkboxes
            //self.AssociaCheckBox(widget1);
            //self.DesassociaCheckBox(widget1);

            //// Chama função para filtrar e desenhar os dados
            //gridPrincipal.FiltraContexto();

            //gridPrincipal.getWidget(self.widgetID).AtualizaOpcoesProperty(objPropertyGridGeral, objPropertyGridDados, objPrpertyGridAparencia);
            //gridPrincipal.getWidget(self.widgetID).Atualiza();


        }

        // widget Filtro
        PropertyGrid.AtualizaWidgetFiltro = function () {
            var self = this
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
            gridPrincipal.FiltraContexto();

            gridPrincipal.getWidget(self.widgetID).AtualizaOpcoesProperty(objPropertyGridGeral, objPropertyGridDados, objPrpertyGridAparencia);
            gridPrincipal.getWidget(self.widgetID).Atualiza();

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


                // Verificar erro
                if (widget1 === undefined) {
                    alert("ERRO - Widget indefinido");
                    return;
                }

                if ((_.findIndex(widget1.contexto, function (contexto) { return gridPrincipal.getWidget(contexto).widgetTipo === "contexto" })) === -1) {

                    // Associa o widget a cada um
                    verifica1 = widget1.AssociaWidget(widget2.id);;
                    verifica2 = widget2.AssociaWidget(widget1.id);


                    // Caso os 2 tenham associado com sucesso
                    if (verifica1 === true & verifica2 === true) {
                        // Apresentar aviso
                        alert(widget1.titulo + " foi associado com sucesso a " + widget2.titulo);
                    }


                    // Atualiza os indicadores da propertyGrid
                    (widget1.widgetTipo === "contexto") ? self.setIndicadores(widget2.id) : self.setIndicadores(widget1.id);

                } else {
                    alert("O " + widget1.titulo + " já tem um widget contexto associado");
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

                // Associa o widget a cada um
                verifica1 = widget1.DesassociaWidget(widget2.id);
                verifica2 = widget2.DesassociaWidget(widget1.id);


                // Caso os 2 tenham desassociado com sucesso
                if (verifica1 === true & verifica2 === true) {
                    // Apresentar aviso
                    alert(widget1.titulo + " foi desassociado com sucesso a " + widget1.titulo);

                    self.EventoAtualizaIndicadores(widget2.id);
                    console.log(self.getIndicadores(widget2.id));

                } else {
                    // Apresentar aviso
                    //alert(widget1.titulo + " não está associado com " + widget2.titulo);

                }

            });
        }


        /// #Region



        /// #Region - Eventos ----------------------------------

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
                self.RemoveBotao();
                self.RemoveMenuPeriodo();
                self.AdicionaSerie();
                self.AdicionaMenuPeriodo();

            });
        }

        // Adiciona um filtro à grid
        PropertyGrid.EventoAdicionaFiltro = function () {
            var self = this;

            $(document).on("click", ".adicionaOpcao-propertyGrid", function () {
                self.RemoveBotaoFiltro();
                self.AdicionaFiltro();
                //self.AdicionaBotaoFiltro();

            })
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
                // Widgets a serem associados
                var widget1,
                    widget2,
                    // Define o tipo do componente do widget
                    tipoComponente,
                    // Adquire valores da caixa de propriedades em formato Objecto
                    valores = jQuery.parseJSON(JSON.stringify($('#propGridDados').jqPropertyGrid('get'), null, '\t'));

                console.log(valores);

                // Adapta conforme o tipo de componente/propertyGrid 
                if (_.has(valores, "ComponenteContexto")) {
                    tipoComponente = valores.ComponenteContexto;
                } else if (_.has(valores, "ComponenteDados")) {
                    tipoComponente = valores.ComponenteDados;
                } else {
                    alert("Erro no tipoComponente");
                }



                // Caso sejam 2 valores diferentes do "default"
                if (valores.WidgetDados !== "Sem componente" && tipoComponente !== "Sem componente") {

                    // Adquire referencia dos widgets a associar
                    widget1 = gridPrincipal.getWidget(tipoComponente);
                    widget2 = gridPrincipal.getWidget($(".widget-ativo").attr("id"));

                    // Verificar erro
                    if (widget1 === undefined) {
                        alert("ERRO - Widget indefinido");
                        return;
                    }

                    if ((_.findIndex(widget1.contexto, function (contexto) { return gridPrincipal.getWidget(contexto).widgetTipo === "contexto" })) === -1) {

                        // Associa o widget a cada um
                        verifica1 = widget1.AssociaWidget($(".widget-ativo").attr("id"));
                        verifica2 = widget2.AssociaWidget(tipoComponente);


                        // Caso os 2 tenham associado com sucesso
                        if (verifica1 === true & verifica2 === true) {
                            // Apresentar aviso
                            alert(widget2.titulo + " foi associado com sucesso a " + tipoComponente);
                        }

                        // Chama função para filtrar e desenhar os dados
                        gridPrincipal.FiltraContexto();

                        // Atualiza os indicadores da propertyGrid
                        (widget1.widgetTipo === "contexto") ? self.setIndicadores(widget2.id) : self.setIndicadores(widget1.id);

                        self.ConstroiGrid();

                    } else {
                        alert("O " + widget2.titulo + " já tem um widget contexto associado");
                    }
                }

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

                    // Chama função para filtrar e desenhar os dados
                    gridPrincipal.FiltraContexto();

                } else {
                    // Apresentar aviso
                    alert($(".widget-ativo").attr("id") + " não está associado com " + tipoComponente);

                }


            });

        }

        // Atualiza indicadores ao adicionar Associacao
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

                if (self.propertyGridElemento === "dashboard") {
                    self.AtualizaDashboard();
                } else if (self.propertyGridElemento === "dados") {
                    self.AtualizaWidget();
                } else if (self.propertyGridElemento === "data") {
                    self.AtualizaWidgetData();
                } else if (self.propertyGridElemento === "filtro") {
                    self.AtualizaWidgetFiltro();
                }

            });

        }


        /// #Region 



        /// #Region - Adiciona Menus ----------------------------------

        // Adiciona menu de checkbox aos widgets contexto 
        // Menu que mostra todos os widgets disponiveis para ligação, estando já marcados os que estão ligados
        PropertyGrid.AdicionaCheckboxMenu = function () {
            var self = this;

            // Faz reset aos checkbox
            $(".checkboxContexto").children().remove();


            gridPrincipal.listaWidgets.forEach(function (item) {
                if (item.widgetTipo === "dados") {
                    if (_.findIndex(item.contexto, function (item) { return item === self.widgetID }) !== -1) {
                        $(".checkboxContexto").append("<input type='checkbox' value="+ item.id +" checked>  <span>"+ item.titulo + "</span><br>");
                    } else {
                        $(".checkboxContexto").append("<input type='checkbox' value=" + item.id + ">  <span>" + item.titulo + "</span><br>");
                    }
                }
            });
        }

        // Adiciona um filtro na propertyGrid do widget Filtro
        PropertyGrid.AdicionaFiltro = function () {
            var self = this;

            self.inicializaDados["Filtro-" + idFiltro] = { name: "          ", group: "Opcoes Disponiveis", type: "filtro", description: " ", showHelp: false };
            //self.inicializaDados["Quebra-" + idFiltro] = { name: " ", type: "split", group: "Opcoes Disponiveis", showHelp: false };

            self.propriedadesDados["Filtro-" + idFiltro] = "";
            //self.propriedadesDados["Quebra-" + idFiltro] = " ";

            console.log(self.propriedadesDados);

            // Constroi a grid
            $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

            self.AdicionaBotaoFiltro();
            self.AdicionaCheckboxMenu();

            idFiltro++;

        }

        // Adiciona um  menu Series no property grid
        PropertyGrid.AdicionaSerie = function () {
            var self = this,
                serieAuxiliar;

            // Inicializa os componentes de uma nova série
            self.inicializaDados["Nome-" + idSerie] = { name: "Nome:", group: "Series", description: "Nome da série", showHelp: false };
            self.inicializaDados["Pesquisa-" + idSerie] = { name: "Pesquisa:", group: "Series", description: "Query de pesquisa", showHelp: false};
            self.inicializaDados["ComponenteSerie-" + idSerie] = { name: "Indicador:", group: "Series", type: "options", options: self.getIndicadores($(".widget-ativo").attr("id")), description: "Widgets que contêm os gráficos", showHelp: false };
            self.inicializaDados["Campo-" + idSerie] = { name: "Campo:", group: "Series", type: "options", options: CampoSeries, description: "Campos para ordenar os dados", showHelp: false };
            self.inicializaDados["Funcao-" + idSerie] = { name: "Função:", group: "Series", type: "options", options: FuncaoSeries, description: "Funções ordenar os dados", showHelp: false };
            self.inicializaDados["Quebra-" + idSerie] = { name: " ", type: "split", group: "Series", showHelp: false };

            // Inicializa propriedades e o botão
            self.AdicionaPropriedades();
            self.AdicionaBotao();

            // Constroi a grid
            $('#propGridDados').jqPropertyGrid(self.propriedadesDados, self.inicializaDados);

            // Liga o evento de atualização ao botão
            $(".atualizaWidget-propertyGrid").click(function () {
                self.Atualiza();
            })

            // Incrementa numero de série
            idSerie++;

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


        // Adiciona Menu Periodo à propertyGrid
        PropertyGrid.AdicionaMenuPeriodo = function () {
            var self = this,
                valorInicial = "";

            self.inicializaDados["Fixo"] = { name: "Fixo:", group: "Periodo", type: "options", options: FixoPeriodo, description: "Analisar numa data fixa", showHelp: false };
            self.inicializaDados["ComponenteContexto"] = { name: "Componente Data", group: "Periodo", type: "options", options: self.listaWidgetsContexto, description: "Analisar através de um widget", showHelp: false };

            self.propriedadesDados["Fixo"] = "";
            self.propriedadesDados["ComponenteContexto"] = "";

            // Preenche valores por defeito
            self.PreencheValores();

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

            self.inicializaDados["Botao"] = { name: " ", group: "Series", type: "botao", description: "../resources/ic_add_white_24dp_1x.png", showHelp: false };
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

            self.inicializaDados["BotaoFiltro"] = { name: " ", group: "Opcoes Disponiveis", type: "botaoFiltro", description: "../resources/ic_add_white_24dp_1x.png", showHelp: false };
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
    /// Class Grid, "tabela" que vai conter todos os widgets
    /// Module Pattern
    /// </summary>
    var Grid = (function () {

        var grid,
            nome,
            descricao,
            tipoGrid,
            id,
            // to-do IMPORTANTE
            idUnico = 0,
            opcoes,
            listaWidgets = [],
            // Definição de cada Menu Widget
            widgetsGrafico = ["area", "barras", "GraficoLinhas", "pie"],
            widgetsLabel = [],
            widgetsOutros = ["gauge", "kpi", "tabela"],
            widgetsFiltros = ["datahora_simples", "filtros"];


        /// <summary>
        /// Construtor da class Grid
        /// </summary>
        /// <param name="id"> Identificador da grid </param>
        /// <param name="opcoes"> Objecto com as opcoes para a inicializacao da grid </param>
        function Grid(id, opcoes, tipoGrid) {
            var self = this;

            console.log(opcoes);

            self.id = id;
            self.opcoes = opcoes;
            self.tipoGrid = tipoGrid;

            self.nome = "Dashboard";
            self.descricao = "Dashboard de indicadores";
            self.idUnico = idUnico++;

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
                $("#"+ self.id).parent().parent().click(function () {
                    // Preencher barra
                    self.PreencheBarraLateral();

                });
            }

            // Guarda informação no Widget sempre que um é modificado
            //self.GuardaInformacao();

            if (self.id === "main-gridstack") {
                // Liga o evento ao botão cria dados e ao clickar no botão uma tabela é criada
                // com os dados desse widget
                self.VerTabela();
                self.EventoGridAtiva();
                self.EventoRemoveGridAtiva();
            }

        }


        /// <summary>
        /// Constroi widget após ser transferido da barra secundária para a principal
        /// </summary>
        Grid.prototype.ReconstroiWidget = function () {
            var grid = gridPrincipal,
                id = $("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).attr("id")[$("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).attr("id").length - 1],
                widget = $("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id);

            console.log(grid.listaWidgets);

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
            

            $("#" + grid.id).data("gridstack").minWidth($($("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).closest(".grid-stack-item")), 3);
            $("#" + grid.id).data("gridstack").minHeight($($("#" + grid.listaWidgets[grid.listaWidgets.length - 1].id).closest(".grid-stack-item")), 3);

        }


        /// <summary>
        /// Carregar lista de widgets
        /// </summary>
        Grid.prototype.CarregaWidgets = function (id) {
            var self = this,
                widget;


            // para cada item na lista de widgets
            // adicionaWidget
            // Passar objectoServidor do item atual para o ultimo widget criado na lista de widgets
            // Redesenhar widget
            // loop

            widget1 = '{"largura":192,"altura":184,"titulo":"Data","widgetAltura":"3","widgetLargura":"3","widgetX":"0","widgetY":"0","id":"19a3ceee-9491-4d21-9159-dbba8188625d","descricao":"Descricao do widget","mostraLegenda":true,"mostraToolTip":true,"estadoTabela":false,"ultimaAtualizacao":"2016/06/15","margem":{"cima":20,"baixo":50,"esquerda":40,"direita":40},"TamanhoLimite":350,"visivel":true,"objectoServidor":{"widgetLargura":"3","widgetAltura":"3","widgetX":"0","widgetY":"0","widgetTipo":"contexto","widgetElemento":"datahora_simples","id":"19a3ceee-9491-4d21-9159-dbba8188625d","visivel":true,"mostraLegenda":true,"mostraToolTip":true,"titulo":"Data","ultimaAtualizacao":"2016/06/15","contexto":["b0219e41-5a7f-48d3-af38-b6b2f8c7b724"],"opcoes":{"dataInicio":"2015-01-01","dataFim":"2015-01-20"}},"contexto":["b0219e41-5a7f-48d3-af38-b6b2f8c7b724"],"agregacoes":[],"seriesUtilizadas":[],"datainicial":"Inicio","datafinal":"Fim","opcoes":{"dataInicio":"2015-01-01","dataFim":"2015-01-20"},"widgetTipo":"contexto","widgetElemento":"datahora_simples","dataDescricao":{"dataInicio":"Data de inicio","dataFim":"Data do fim"},"svg":{"0":{},"length":1,"prevObject":{"0":{"jQuery111204561703890876043":227},"length":1,"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#19a3ceee-9491-4d21-9159-dbba8188625d"},"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#19a3ceee-9491-4d21-9159-dbba8188625d .wrapper"}}';
            widget2 = '{"largura":320,"altura":246,"titulo":"GraficoLinhas","widgetAltura":"4","widgetLargura":"5","widgetX":"3","widgetY":"0","id":"b0219e41-5a7f-48d3-af38-b6b2f8c7b724","descricao":"Descricao do widget","mostraLegenda":true,"mostraToolTip":true,"estadoTabela":false,"ultimaAtualizacao":"2016/06/15","margem":{"cima":20,"baixo":50,"esquerda":40,"direita":40},"TamanhoLimite":350,"visivel":true,"objectoServidor":{"widgetLargura":"5","widgetAltura":"4","widgetX":"3","widgetY":"0","widgetTipo":"dados","widgetElemento":"GraficoLinhas","id":"b0219e41-5a7f-48d3-af38-b6b2f8c7b724","descricao":"Descricao do widget","modoVisualizacao":"normal","visivel":true,"mostraLegenda":true,"mostraToolTip":true,"titulo":"GraficoLinhas","ultimaAtualizacao":"2016/06/15","contexto":["19a3ceee-9491-4d21-9159-dbba8188625d"],"agregacoes":[],"seriesUtilizadas":[{"Nome":"Min","ComponenteSerie":"valor.valorMin","Campo":"Vazio","Funcao":"Vazio","Quebra":{"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#pg22Quebra-1"}},{"Nome":"Max","ComponenteSerie":"valor.valorMax","Campo":"Vazio","Funcao":"Vazio","Quebra":{"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#pg22Quebra-2"}}]},"contexto":["19a3ceee-9491-4d21-9159-dbba8188625d"],"agregacoes":[],"seriesUtilizadas":[{"Nome":"Min","ComponenteSerie":"valor.valorMin","Campo":"Vazio","Funcao":"Vazio","Quebra":{"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#pg22Quebra-1"}},{"Nome":"Max","ComponenteSerie":"valor.valorMax","Campo":"Vazio","Funcao":"Vazio","Quebra":{"context":{"location":{"href":"http://localhost:63450/pages/db_edicao.html#","origin":"http://localhost:63450","protocol":"http:","host":"localhost:63450","hostname":"localhost","port":"63450","pathname":"/pages/db_edicao.html","search":"","hash":""},"jQuery111204561703890876043":1},"selector":"#pg22Quebra-2"}}],"modoVisualizacao":"normal","widgetTipo":"dados","widgetElemento":"GraficoLinhas","chave":[7.05,6.32083333333333,6.7142263986014,7.05,6.32083333333333,6.7142263986014],"spinner":{"opts":{"lines":14,"length":0,"width":20,"radius":46,"scale":0.75,"corners":1,"rotate":81,"direction":1,"color":"#fff","speed":1,"trail":47,"opacity":0,"shadow":false,"hwaccel":false,"className":"spinner","zIndex":2000000000,"top":"50%","left":"50%","fps":20,"position":"absolute"}},"dados":{"resultado":{"Dados":true,"Sucesso":true},"dados":{"DashboardID":8,"TempoResposta":112,"Erro":false,"Widgets":[{"WidgetID":"b0219e41-5a7f-48d3-af38-b6b2f8c7b724","TotalItems":19,"Resultado":null,"Items":[{"ChaveTexto":"01-01-2015 00:00:00","Data":"2015-01-01T00:00:00","Chave":"1420070400000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":6.57083333333333},{"Nome":"valor.valorMin","Valor":5.94166666666667},{"Nome":"valor.valorMed","Valor":6.34071759259259}]},{"ChaveTexto":"02-01-2015 00:00:00","Data":"2015-01-02T00:00:00","Chave":"1420156800000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":5.47083333333333},{"Nome":"valor.valorMin","Valor":5.3125},{"Nome":"valor.valorMed","Valor":5.39606481481481}]},{"ChaveTexto":"03-01-2015 00:00:00","Data":"2015-01-03T00:00:00","Chave":"1420243200000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":6.57083333333333},{"Nome":"valor.valorMin","Valor":5.8625},{"Nome":"valor.valorMed","Valor":6.24503367003367}]},{"ChaveTexto":"04-01-2015 00:00:00","Data":"2015-01-04T00:00:00","Chave":"1420329600000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":7.05},{"Nome":"valor.valorMin","Valor":6.32083333333333},{"Nome":"valor.valorMed","Valor":6.7142263986014}]},{"ChaveTexto":"05-01-2015 00:00:00","Data":"2015-01-05T00:00:00","Chave":"1420416000000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":6.50416666666667},{"Nome":"valor.valorMin","Valor":5.62083333333333},{"Nome":"valor.valorMed","Valor":6.05561747280497}]},{"ChaveTexto":"06-01-2015 00:00:00","Data":"2015-01-06T00:00:00","Chave":"1420502400000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":5.20416666666667},{"Nome":"valor.valorMin","Valor":5.06666666666667},{"Nome":"valor.valorMed","Valor":5.14337121212121}]},{"ChaveTexto":"07-01-2015 00:00:00","Data":"2015-01-07T00:00:00","Chave":"1420588800000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.44583333333333},{"Nome":"valor.valorMin","Valor":3.05},{"Nome":"valor.valorMed","Valor":3.25969065656566}]},{"ChaveTexto":"08-01-2015 00:00:00","Data":"2015-01-08T00:00:00","Chave":"1420675200000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.47916666666667},{"Nome":"valor.valorMin","Valor":3.15416666666667},{"Nome":"valor.valorMed","Valor":3.28661616161616}]},{"ChaveTexto":"09-01-2015 00:00:00","Data":"2015-01-09T00:00:00","Chave":"1420761600000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.50833333333333},{"Nome":"valor.valorMin","Valor":3.39166666666667},{"Nome":"valor.valorMed","Valor":3.43857323232323}]},{"ChaveTexto":"10-01-2015 00:00:00","Data":"2015-01-10T00:00:00","Chave":"1420848000000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.41666666666667},{"Nome":"valor.valorMin","Valor":3.33333333333333},{"Nome":"valor.valorMed","Valor":3.37607323232323}]},{"ChaveTexto":"11-01-2015 00:00:00","Data":"2015-01-11T00:00:00","Chave":"1420934400000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.79166666666667},{"Nome":"valor.valorMin","Valor":3.3875},{"Nome":"valor.valorMed","Valor":3.61229797979798}]},{"ChaveTexto":"12-01-2015 00:00:00","Data":"2015-01-12T00:00:00","Chave":"1421020800000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":4.1375},{"Nome":"valor.valorMin","Valor":3.65833333333333},{"Nome":"valor.valorMed","Valor":3.89128787878788}]},{"ChaveTexto":"13-01-2015 00:00:00","Data":"2015-01-13T00:00:00","Chave":"1421107200000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.34166666666667},{"Nome":"valor.valorMin","Valor":3.09583333333333},{"Nome":"valor.valorMed","Valor":3.21657196969697}]},{"ChaveTexto":"14-01-2015 00:00:00","Data":"2015-01-14T00:00:00","Chave":"1421193600000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.52916666666667},{"Nome":"valor.valorMin","Valor":3.4},{"Nome":"valor.valorMed","Valor":3.44742213804714}]},{"ChaveTexto":"15-01-2015 00:00:00","Data":"2015-01-15T00:00:00","Chave":"1421280000000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":4.15},{"Nome":"valor.valorMin","Valor":3.7875},{"Nome":"valor.valorMed","Valor":4.01097853535353}]},{"ChaveTexto":"16-01-2015 00:00:00","Data":"2015-01-16T00:00:00","Chave":"1421366400000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.14583333333333},{"Nome":"valor.valorMin","Valor":2.92083333333333},{"Nome":"valor.valorMed","Valor":3.0479797979798}]},{"ChaveTexto":"17-01-2015 00:00:00","Data":"2015-01-17T00:00:00","Chave":"1421452800000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.59166666666667},{"Nome":"valor.valorMin","Valor":3.45416666666667},{"Nome":"valor.valorMed","Valor":3.53544823232323}]},{"ChaveTexto":"18-01-2015 00:00:00","Data":"2015-01-18T00:00:00","Chave":"1421539200000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":4.38333333333333},{"Nome":"valor.valorMin","Valor":4.24583333333333},{"Nome":"valor.valorMed","Valor":4.30149410774411}]},{"ChaveTexto":"19-01-2015 00:00:00","Data":"2015-01-19T00:00:00","Chave":"1421625600000","NumDocumentos":24,"Valores":[{"Nome":"valor.valorMax","Valor":3.09166666666667},{"Nome":"valor.valorMin","Valor":2.86666666666667},{"Nome":"valor.valorMed","Valor":2.97604797979798}]}]}]}},"svg":[[{}]],"dadosNormal":[{"name":"valor.valorMax","values":[{"name":"valor.valorMax","y":6.57083333333333,"date":"2015-01-01T00:00:00.000Z"},{"name":"valor.valorMax","y":5.47083333333333,"date":"2015-01-02T00:00:00.000Z"},{"name":"valor.valorMax","y":6.57083333333333,"date":"2015-01-03T00:00:00.000Z"},{"name":"valor.valorMax","y":7.05,"date":"2015-01-04T00:00:00.000Z"},{"name":"valor.valorMax","y":6.50416666666667,"date":"2015-01-05T00:00:00.000Z"},{"name":"valor.valorMax","y":5.20416666666667,"date":"2015-01-06T00:00:00.000Z"},{"name":"valor.valorMax","y":3.44583333333333,"date":"2015-01-07T00:00:00.000Z"},{"name":"valor.valorMax","y":3.47916666666667,"date":"2015-01-08T00:00:00.000Z"},{"name":"valor.valorMax","y":3.50833333333333,"date":"2015-01-09T00:00:00.000Z"},{"name":"valor.valorMax","y":3.41666666666667,"date":"2015-01-10T00:00:00.000Z"},{"name":"valor.valorMax","y":3.79166666666667,"date":"2015-01-11T00:00:00.000Z"},{"name":"valor.valorMax","y":4.1375,"date":"2015-01-12T00:00:00.000Z"},{"name":"valor.valorMax","y":3.34166666666667,"date":"2015-01-13T00:00:00.000Z"},{"name":"valor.valorMax","y":3.52916666666667,"date":"2015-01-14T00:00:00.000Z"},{"name":"valor.valorMax","y":4.15,"date":"2015-01-15T00:00:00.000Z"},{"name":"valor.valorMax","y":3.14583333333333,"date":"2015-01-16T00:00:00.000Z"},{"name":"valor.valorMax","y":3.59166666666667,"date":"2015-01-17T00:00:00.000Z"},{"name":"valor.valorMax","y":4.38333333333333,"date":"2015-01-18T00:00:00.000Z"},{"name":"valor.valorMax","y":3.09166666666667,"date":"2015-01-19T00:00:00.000Z"}],"Numero":1,"Nome":"Max"},{"name":"valor.valorMin","values":[{"name":"valor.valorMin","y":5.94166666666667,"date":"2015-01-01T00:00:00.000Z"},{"name":"valor.valorMin","y":5.3125,"date":"2015-01-02T00:00:00.000Z"},{"name":"valor.valorMin","y":5.8625,"date":"2015-01-03T00:00:00.000Z"},{"name":"valor.valorMin","y":6.32083333333333,"date":"2015-01-04T00:00:00.000Z"},{"name":"valor.valorMin","y":5.62083333333333,"date":"2015-01-05T00:00:00.000Z"},{"name":"valor.valorMin","y":5.06666666666667,"date":"2015-01-06T00:00:00.000Z"},{"name":"valor.valorMin","y":3.05,"date":"2015-01-07T00:00:00.000Z"},{"name":"valor.valorMin","y":3.15416666666667,"date":"2015-01-08T00:00:00.000Z"},{"name":"valor.valorMin","y":3.39166666666667,"date":"2015-01-09T00:00:00.000Z"},{"name":"valor.valorMin","y":3.33333333333333,"date":"2015-01-10T00:00:00.000Z"},{"name":"valor.valorMin","y":3.3875,"date":"2015-01-11T00:00:00.000Z"},{"name":"valor.valorMin","y":3.65833333333333,"date":"2015-01-12T00:00:00.000Z"},{"name":"valor.valorMin","y":3.09583333333333,"date":"2015-01-13T00:00:00.000Z"},{"name":"valor.valorMin","y":3.4,"date":"2015-01-14T00:00:00.000Z"},{"name":"valor.valorMin","y":3.7875,"date":"2015-01-15T00:00:00.000Z"},{"name":"valor.valorMin","y":2.92083333333333,"date":"2015-01-16T00:00:00.000Z"},{"name":"valor.valorMin","y":3.45416666666667,"date":"2015-01-17T00:00:00.000Z"},{"name":"valor.valorMin","y":4.24583333333333,"date":"2015-01-18T00:00:00.000Z"},{"name":"valor.valorMin","y":2.86666666666667,"date":"2015-01-19T00:00:00.000Z"}],"Numero":0,"Nome":"Min"},{"name":"valor.valorMed","values":[{"name":"valor.valorMed","y":6.34071759259259,"date":"2015-01-01T00:00:00.000Z"},{"name":"valor.valorMed","y":5.39606481481481,"date":"2015-01-02T00:00:00.000Z"},{"name":"valor.valorMed","y":6.24503367003367,"date":"2015-01-03T00:00:00.000Z"},{"name":"valor.valorMed","y":6.7142263986014,"date":"2015-01-04T00:00:00.000Z"},{"name":"valor.valorMed","y":6.05561747280497,"date":"2015-01-05T00:00:00.000Z"},{"name":"valor.valorMed","y":5.14337121212121,"date":"2015-01-06T00:00:00.000Z"},{"name":"valor.valorMed","y":3.25969065656566,"date":"2015-01-07T00:00:00.000Z"},{"name":"valor.valorMed","y":3.28661616161616,"date":"2015-01-08T00:00:00.000Z"},{"name":"valor.valorMed","y":3.43857323232323,"date":"2015-01-09T00:00:00.000Z"},{"name":"valor.valorMed","y":3.37607323232323,"date":"2015-01-10T00:00:00.000Z"},{"name":"valor.valorMed","y":3.61229797979798,"date":"2015-01-11T00:00:00.000Z"},{"name":"valor.valorMed","y":3.89128787878788,"date":"2015-01-12T00:00:00.000Z"},{"name":"valor.valorMed","y":3.21657196969697,"date":"2015-01-13T00:00:00.000Z"},{"name":"valor.valorMed","y":3.44742213804714,"date":"2015-01-14T00:00:00.000Z"},{"name":"valor.valorMed","y":4.01097853535353,"date":"2015-01-15T00:00:00.000Z"},{"name":"valor.valorMed","y":3.0479797979798,"date":"2015-01-16T00:00:00.000Z"},{"name":"valor.valorMed","y":3.53544823232323,"date":"2015-01-17T00:00:00.000Z"},{"name":"valor.valorMed","y":4.30149410774411,"date":"2015-01-18T00:00:00.000Z"},{"name":"valor.valorMed","y":2.97604797979798,"date":"2015-01-19T00:00:00.000Z"}]}]}';

            widgets = [JSON.parse(widget1), JSON.parse(widget2)];

            widgets.forEach(function (item) {
                var widgetNovo,
                    idOriginal;

                idOriginal = item.id;

                // Adicionar um novo widget na grid
                self.AdicionaWidget(item.widgetElemento, item.titulo, null, item.widgetLargura, item.widgetAltura, item.widgetX, item.widgetY, true, idOriginal);

                // WidgetNovo é o ultimo  a ser criado
                widgetNovo = gridPrincipal.listaWidgets[gridPrincipal.listaWidgets.length - 1];


                // Para cada propriedade no objecto
                $.each(item.objectoServidor, function (chave, valor) {
                    // Caso não seja função
                    if (typeof valor !== "function") {
                        widgetNovo[chave] = valor;
                    }

                });

                
                // Caso seja um widget do tipo dados
                if (widgetNovo.widgetTipo === "dados") {
                    //  Filtrar o widget e desenhar
                    gridPrincipal.FiltraContexto();
                    widgetNovo.RedesenhaGrafico(widgetNovo.id);
                }


                $("#" + gridPrincipal.id).data("gridstack").minWidth($("#" + widgetNovo.id).closest(".grid-stack-item"), 3);
                $("#" + gridPrincipal.id).data("gridstack").minHeight($("#" + widgetNovo.id).closest(".grid-stack-item"), 3);


            });

            // Define widgets na PropertyGrid
            self.CarregaListaComponentes();


            //// Para cada item na lista de widgets
            //gridPrincipal.listaWidgets.forEach(function (item) {
            //    var widgetNovo,
            //        idAntigo,
            //        copia;



            //    // Adiciona widget
            //    self.AdicionaWidget(item.widgetElemento, item.titulo, null, item.widgetLargura, item.widgetAltura, item.widgetX, item.widgetY, true);

            //    // WidgetNovo é o ultimo  a ser criado
            //    widgetNovo = gridPrincipal.listaWidgets[gridPrincipal.listaWidgets.length - 1];

            //    // REMOVER - apenas utilizar enquanto está a efetuar cópias
            //    idAntigo = widgetNovo.id;

            //    // Para cada propriedade no objecto
            //    $.each(item.objectoServidor, function (chave, valor) {
            //        // Caso não seja função
            //        if(typeof valor !== "function"){
            //            widgetNovo[chave] = valor;
            //        }    
            //    });

            //    // Modificar, apenas usar idAntigo quando está a efetuar cópias
            //    widgetNovo.id = idAntigo;

            //    if (widgetNovo.widgetTipo === "dados") {
            //        gridPrincipal.FiltraContexto();
            //        widgetNovo.RedesenhaGrafico(idAntigo);
            //    }

            //});

        }


        /// <summary>
        /// Carrega a lista de componentes para ligação depois de carregados os widgets
        /// </summary>
        Grid.prototype.CarregaListaComponentes = function () {
            var self = this,
                widgets,
                listaWidgetsDados = [" Sem componente "],
                listaWidgetsContexto = [" Sem componente "];
                // Adquire ultima class do widget ( Class que identifica o tipo de widget )
                //tipoWidget = node.children().attr('class').split(' ').pop(),
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
        /// Evento para abrir a propertyGrid do "dashboard"/grid
        /// </summary>
        Grid.prototype.EventoGridAtiva = function () {
            var self = this;

            $("#main-gridstack").click(function (event) {
                // Caso o target do evento seja mesmo a grid
                if ($(event.target).attr("id") === "main-gridstack") {
                    // Adiciona classe
                    $(this).addClass("widget-ativo");

                    // Remove o aviso de não haver nenhum widget/dashboard selecionado
                    PropertyGrid.TogglePropertyGrid();

                    // Substitui o titulo na propertyGrid
                    PropertyGrid.SetWidgetPropertyGrid(self.nome, self.id, "Dashboard");

                    // Mostra a propertyGrid
                    PropertyGrid.MostraPropertyGrid("grid");
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
                            if ($(".widget-ativo").length === 0)
                            {
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

                    // Guarda informação
                    self.GuardaInformacao();
                }, 20);

            });

            // Sempre que moverem um widget
            $(self.grid).on("dragstop", function (event, items) {
                setTimeout(function () {
                    // Guarda informação
                    self.GuardaInformacao();
                }, 20);

            });

            // Sempre que houver mudanças na grid
            $(self.grid).on("added", function (event, items) {
                setTimeout(function () {
                    // Guarda informação
                    self.GuardaInformacao();
                }, 20);
            });

        }


        /// <summary>
        /// Método para adicionar widgets à "grid"
        /// </summary>
        /// <param name="tipoWidget"> Tipo de widget a ser adicionado a grid </param>
        /// <param name
        Grid.prototype.AdicionaWidget = function (tipoWidget, titulo, dados, width, height, x, y, novo, idAlternativo) {
            var self = this,
                coordenadaX = x || "0",
                coordenadaY = y || "0",
                GUID = (idAlternativo !== undefined)? GUID = idAlternativo : getGUID(),
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
                (minWidth === undefined)? minWidth = 3 : minWidth = minWidth;
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

            console.log(self);
            console.log(GUID);
            console.log($("#" + GUID));

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
                var path = '../resources/' + tipoWidget+".png";
                $("#" + self.listaWidgets[ultimo].id).find(".wrapper").append('<img class="imagem-widget" src="'+ path +'" />')
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
                case "area":
                    self.listaWidgets.push(new GraficoArea(id, "GraficoArea"));
                    break;
                case "barras":
                    self.listaWidgets.push(new GraficoBarras(id, "GraficoBarras"));
                    break;
                case "GraficoLinhas":
                    self.listaWidgets.push(new GraficoLinhas(id, "GraficoLinhas"));
                    break;
                case "gauge":
                    self.listaWidgets.push(new Gauge(id, "Gauge"));
                    break;
                case "kpi":
                    self.listaWidgets.push(new KPI(id, "KPI"));
                    break;
                case "tabela":
                    self.listaWidgets.push(new Tabela(id, "Tabela", dados));
                    break;
                case "pie":
                    self.listaWidgets.push(new PieChart(id, "PieChart"));
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
                               "<li><a class=\"edita-widget\" href=\"#\"> Modifica titulo</a></li>" +
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

            console.log(id);

            var el = "<div class=\"grid-stack-item nao-seleciona widget-barraSecundaria\">" +
                     // Div do conteudo do item da grid
                     "<div id="+ id +"  class=\"grid-stack-item-content\">" +
                     "<div class=\"wrapper\">" +
                     // Conteudo do widget
                     "<div class=\"widget-conteudo\"> " + "<span style='text-align:center;'>"+ tipoWidget +"</span>" + 
                     "</div>" + "</div>" +
                     "<div class=\"legenda\">" +
                     "</div>" + "</div> " + "</div>";

            return el;
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
                return ($("#main-gridstack").height()+157);
            } else {
                // Caso a row seja maior que a grid
                return ($(".row").height() + 190);
            }

        }


        /// <summary>
        /// Método para filtrar os dados de um conjunto de widgets ligado a um contexto
        /// </summary>
        Grid.prototype.FiltraContexto = function () {
            var self = this;

            // Para cada widget
            self.listaWidgets.forEach(function (item) {
                // Caso seja do tipo contexto
                if (item.widgetTipo === "contexto") {

                    // Para cada widget dentro do seu contexto
                    item.contexto.forEach(function (widget) {
                        var dadosFiltrados,
                            // Procura index do widget no contexto
                            index = _.findIndex(self.listaWidgets, function (d) { return widget === d.id });

                        // Adquire os dados filtrados (apagar paraemtro widget?)
                        item.FiltraDados(self.listaWidgets[index], widget);

                        // Redeseha os dados de acordo com os dados adquiridos
                        self.listaWidgets[index].RedesenhaGrafico(self.listaWidgets[index].id);

                    });
                }

            });

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
        /// </summary>
        Grid.prototype.MostraWidget = function () {

        }


        /// <summary>
        /// Cria tabela com os dados de um certo widget escolhido pelo utilizador
        /// </summary>
        Grid.prototype.VerTabela = function () {
            var self = this;

            // getQuery? Query? Para ir buscar os mesmos dados que o widget
            $("#main-gridstack").on("click", ".verTabela-widget", function () {

                // Definir o widget
                var widget = $(this).closest(".grid-stack-item-content"),
                    index,
                    dados;

                // Função lodash para achar o primeiro index onde a condição seja "true"
                // Procura na lista de widgets pelo widget com o id equivalente
                index = _.findIndex(self.listaWidgets, function (item) { return item.id === widget.attr("id"); });


                self.listaWidgets[index].setEstadoTabela();
                (self.listaWidgets[index].estadoTabela)? self.listaWidgets[index].TransformaWidgetTabela() : self.listaWidgets[index].RedesenhaGrafico(self.id); 

            });

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
        /// Evento que permite ao utilizador receber na consola informação sobre os widgets
        /// </summary>
        Grid.prototype.MostraInformacaoWidgets = function () {
            var self = this;

            $(".informacaoWidgets").click(function () {
                self.listaWidgets.forEach(function (item, curIndex) {
                    console.log("Widget " + (curIndex + 1) + " - ID: " + item.id);
                    console.log(item);
                    console.log(JSON.stringify(item.objectoServidor));
                });

                console.log("Lista de Widgets - Formato Array:")
                console.log(self.listaWidgets);
            })
        }


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
        /// Desassocia widgets de um widget em especifico
        /// </summary>
        /// <param name="widget"> Widget que vai ter o seu contexto desassociado </param>
        Grid.prototype.RemoveContexto = function (widget) {
            var self = this;

            // Para cada widget dentro do array Contexto
            self.getWidget(widget).contexto.forEach(function (item) {
                // Desassocia este widget do widget a ser afectado pelo contexto
                self.getWidget(item).DesassociaWidget(widget);
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
        /// Preenche a barra lateral com todos os widgets possiveis
        /// </summary>
        Grid.prototype.PreencheBarraLateral = function () {
            var self = this,
                tipo = self.getWidgetsGrid();


            // Caso tenha a class
            if ($("#"+self.id).closest("li").hasClass("active"))
            {
                // Apaga todos os elementos anteriores
                $("#" + self.id).data("gridstack").removeAll();

                // Para cada widget adiciona
                tipo.forEach(function (item) {
                    self.AdicionaWidget(item, item, undefined, 12, 1);
                });
            } else {
                $("#sidebar-gridstack").children().remove()
            }

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
        /// Evento para remover as handles extra antes de mudar de grid
        /// </summary>
        Grid.prototype.RemoveHandle = function () {
            var self = this;

            // Remover handles dos widgets que não estão resizable
            $("#" + self.id).on("mousedown", ".grid-stack-item", function () {
                $("#"+self.id+" .grid-stack-item").children(":hidden").remove();
            });

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


        /// <summary>
        /// Atualiza tooltip da descrição do dashboard
        /// </summary>
        Grid.prototype.AtualizaTooltipDescricao = function () {
            var self = this;

            console.log("modifica");

            $(".nav-dashboard").find('[data-toggle="tooltip"]').attr("data-original-title", self.descricao);

        }


        return Grid;

    })();



    /// <summary>
    /// Class Conteudo, guarda a lista dos "dashboards" do utilizador, encapsula as grids dentro de cada dashboard
    /// </summary>
    var Conteudo = (function () {
        var utilizador,
            idUtilizador,
            listaDashboards,
            dashboardAtual;


        function Conteudo(idUtilizador, utilizador) {
            this.utilizador = utilizador;
            this.idUtilizador = idUtilizador;
            this.listaDashboards = [];
            this.dashboardAtual = 0;

        }

        /// <summary>
        /// Carrega a lista de dashboards de um utilizador especifico ( Pedido ao servidor )
        /// </summary>
        Conteudo.prototype.CarregaListaDashboards = function () {
            var self = this;

            // to-do IMPORTANTE 
            // Pedido ao primerCORE para receber a lista de dashboards de um certo utilizador

        }
        

        /// <summary>
        /// Guarda a lista de dashboards no servidor
        /// </summary>
        Conteudo.prototype.GuardaListaDashboards = function () {
            var self = this;

            // to-do
            // Envio de pedido ao servidor primerCORE
        }


        /// <summary>
        /// Adiciona um dashboard à lista
        /// </summary>
        /// <param name ="dashboard"> Envia um objecto do tipo "Grid" para ser adicionado a lista </param>
        Conteudo.prototype.AdicionaDashboard = function (objectoDashboard, nome) {
            var self = this,
                dashboard = {},
                listaWidgets = [];

            objectoDashboard.listaWidgets.forEach(function (widget) {
                listaWidgets.push(widget.objectoServidor);
            });

            console.log(listaWidgets);

            //dashboard.setNome(nome);
            dashboard["nome"] = objectoDashboard.nome;
            dashboard["descricao"] = objectoDashboard.descricao;
            dashboard["id"] = objectoDashboard.id;
            dashboard["idUnico"] = objectoDashboard.idUnico;
            dashboard["listaWidgets"] = listaWidgets;
            dashboard["opcoesAparencia"] = " ";

            self.listaDashboards.push({Dashboard: dashboard});
        }


        /// <summary>
        /// Guarda dashboard existente
        /// </summary>
        Conteudo.prototype.GuardaDashboard = function(){
            var self = this,
                index;


            // Encontra index da dashboard na lista
            index = _.findIndex(self.listaDashboards, function (objecto) { return objecto.Dashboard.nome === gridPrincipal.nome; });

            if (index !== -1) {
                self.listaDashboards[index].Dashboard = gridPrincipal.objectoServidor;
            } else {
                alert ("DASHBOARD - Tentativa de guardar sem estar criada");
            }

        }


        /// <summary>
        /// Carrega dashboard para a aplicação
        /// </summary>
        Conteudo.prototype.CarregaDashboard = function(idUnico){
            var self = this;

            // to-do IMPORTANTE
            //self.listaDashboards[identificador]

            self.LimpaDashboard();
            
        }


        /// <summary>
        /// "Limpa" dashboard atual do ecra, continua guardada na estrutura
        /// </summary>
        Conteudo.prototype.LimpaDashboard = function () {
            var self = this;

            // Remove widgets do gridstack
            $("#main-gridstack").data("gridstack").removeAll();

            // Limpa lista de widgets da gridPrincipal
            gridPrincipal.listaWidgets = [];

        }


        /// <summary>
        /// Remove a dashboard permanentemente
        /// </summary>
        Conteudo.prototype.RemoveDashboard = function () {
            var self = this;

            // Remove widgets do gridstack
            $("#main-gridstack").data("gridstack").removeAll();

            // Limpa lista de widgets da gridPrincipal
            gridPrincipal.listaWidgets = [];

            // Remove da lista de dashboards do utilizador o dashboard atual
            self.listaDashboards =  _.remove(self.listaDashboards, function (dashboard) { return dashboard.Nome === self.listaDashboards[getDashboardAtual()].Nome; });

        }


        /// <summary>
        /// Devolve a lista de dashboards de um utilizador 
        /// </summary>
        /// <returns> Lista de Dashboards "Grids" de um utilizador
        Conteudo.prototype.getDashboards = function () {
            var self = this;

            return self.listaDashboards;
        }


        /// <summary>
        /// Getters e Setters para a dashboardAtual
        /// </summary>
        Conteudo.prototype.getDashboardAtual = function () {
            var self = this;

            return self.dashboardAtual;

        }
        Conteudo.prototype.setDashboardAtual = function (idUnico) {
            var self = this;

            self.CarregaDashboard(idUnico);

            self.dashboardAtual = idUnico;

        }


        /// #Region - Eventos

        Conteudo.prototype.AtualizaDashboard = function () {
            var self = this;

            // Ao clickar para atualizar (guardar) o dashboard
            $(".atualizaWidget-propertyGrid").click(function () {

            });

        }

        /// #Region

        return Conteudo;

    })();



    /// <summary>
    ///
    /// </summary>
    var Eventos = (function () {

        return Eventos;

    })();



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
        swapGridHeight: 3
    };

    // Opções do menu drag&drop
    optionsBarraLateral = {
        width: 12,
        removable: false,
        cell_height: 100,
        verticalMargin: 0,
        disableResize: true
    }


    // Criação da grid principal
    gridPrincipal = new Grid("main-gridstack", options, "barraPrincipal");
    // Evento que mostra a informação de todos os widgets disponiveis ao clickar um botão
    gridPrincipal.MostraInformacaoWidgets();
    // Adicionar o background à gridstack
    $("#"+gridPrincipal.id).addClass("gridstack-background");


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


    // Ao fazer "keyup" verifica se o valor é valido na coordenada X
    $(".widgetCoordenadaX").keyup(function () {
        var valorX = $(".widgetCoordenadaX").val() || "0";

        // Verifica se valorX é inteiro
        if (confirmaInteiro(valorX) === true) {
            $(".widgetLabelX").text("");
        } else {
            $(".widgetLabelX").text("Erro, digite um número inteiro");
        }

    });

    // Ao fazer "keyup" verifica se o valor é valido na coordenada Y
    $(".widgetCoordenadaY").keyup(function () {
        var valorY = $(".widgetCoordenadaY").val() || "0";

        // Verifica se valorY é inteiro
        if (confirmaInteiro(valorY) === true) {
            $(".widgetLabelY").text("");
        } else {
            $(".widgetLabelY").text("Erro, digite um número inteiro");
        }

    });

    // Botão de adicionar widget
    $(".adicionaWidget").click(function () {
        var valorX = $(".widgetCoordenadaX").val() || "0",
            valorY = $(".widgetCoordenadaY").val() || "0";

        // Se ambos os valores forem inteiro
        if (confirmaInteiro(valorX) === true && confirmaInteiro(valorY) === true) {
            // Adicionar widget de acordo com opção na dropdown
            gridPrincipal.AdicionaWidget($(".adicionaWidget-tipo").find(":selected").val());
        }

    });




    /// TESTE SIDEBAR - Gestão de elementos para a dropdownlist das "Propriedades"


    // property Grid - TEST
    PropertyGrid.InicializaEventos();
    PropertyGrid.Inicializa();




    // Mudanças da propertyGrid conforme a seleção do widget
    $(document).click(function () {
        var widget,
            widgetID = $(".widget-ativo").attr("id");

        // Caso exista um widget com o mesmo ID
        if (widgetID !== undefined) {

            // Remove o div que não há um dashboard/widget selecionado
            $(".opcoes-semPropertyGrid").css("display", "none");

            // Obtem dados do widget
            widget = gridPrincipal.getWidget(widgetID);

            // Dá um titulo conforme o widget selecionado
            //$(".nomeWidget-propertyGrid").text(widget.titulo + " - " + widget.widgetElemento);

            // Adiciona ao Menu as escolhas conforme o tipo de widget/dashboard
            //PropertyGrid.MostraPropertyGrid();

        }

    });

    
    // PropertyGrid (Boxes de opção)
    $(".box-propriedades").click(function () {
        if(!$(this).hasClass("box-ativo")) {
            $(".opcoes-propertyGrid").find(".box-propriedades").removeClass("box-ativo");
            //$(this).addClass("box-ativo");
        }
    })




    ///TESTES - Comunicação


    $(".obterValores").click(function () {
        gridPrincipal.FiltraContexto();

    })

    // Query para a lista de widgets
    // Atualizada
    var queryWidget = '{ "sessaoID": "sessaoDebug", "dashboardID": "8","utilizadorID": "2502", "widgetsDados": [ { "id": "widget0", "tipo": "dados", "elemento": "GraficoLinhas", "contexto": [ "widget3", "widget8" ], "series": [ {"funcao": "Media", "campo": "valor.valorMax", "index": "indicadores", "type": ""}, { "funcao": "Media", "campo": "valor.valorMed", "index": "indicadores", "type": "" }, { "funcao": "Media", "campo": "valor.valorMin", "index": "indicadores", "type": "" } ], "buckets": [ {"tipo": "histogramadata", "campo": "data", "intervalo": "dia" } ]} ], "widgetsContexto": { "contextoPesquisa": [ { "id": "widget3", "tipo": "contexto",  "filtro": "valor.tagID: 3072" }, { "id": "widget4", "tipo": "contexto", "filtro": "valor.tagID: 3073"} ],  "contextoData": [  {  "id": "widget8",  "campo": "data", "dataInicio": "2015-06-07",  "dataFim": "2015-06-10"} ] } }';

    // Query para o DashboardCria
    var query = {
        "UtilizadorID": 2508,
        "Nome": "teste_dois",
        "Descricao": "teste_dois desc",
        "Configuracao": "{\"id\":\"widget0\",\"largura\":271,\"altura\":120,\"titulo\":\"ola\",\"widgetAltura\":20,\"widgetLargura\":20,\"widgetX\":400,\"widgetTipo\":\"dados\",\"widgetElemento\":\"graficoBarras|graficoLinhas|graficoPie|etiqueta|tabela\",\"mostraLegenda\":false,\"mostraToolTip\":false,\"visivel\":true,\"ultimaAtualizacao\":\"4/11/16\",\"contexto\":[\"widget1\",\"widget2\"],\"agregacoes\":[{\"funcao\":\"avg\",\"campo\":\"valor.valorMax\"},{\"funcao\":\"avg\",\"campo\":\"valor.valorMed\"},{\"funcao\":\"avg\",\"campo\":\"valor.valorMin\"}]}",
        "Activo": false
    };



    // TESTE - CLASS CONTEUDO

    // Cria Dashboards inicial
    var Utilizador = new Conteudo("2514", "Joel");


    $(".dashboard-guarda").click(function () {
        if (_.findIndex(Utilizador.getDashboards(), function (objecto) { return objecto.Dashboard.nome === gridPrincipal.nome; }) === -1) {
            Utilizador.AdicionaDashboard(gridPrincipal, gridPrincipal.nome);
        } else {
            Utilizador.GuardaDashboard();
        };

    });


    $(".dashboard-remove").click(function () {
        Utilizador.RemoveDashboard();
    });


    $(".dashboard-informa").click(function () {
        console.log(Utilizador);
        console.log(Utilizador.getDashboards());
        console.log(JSON.stringify(Utilizador.getDashboards()))

    });



    // Evento para remover/adicionar grelha
    $(".propriedades-sidebar").on("change", "[value='Grelha']", function(){

        $("#main-gridstack").toggleClass("gridstack-background");

    });


    console.log($('[data-toggle="tooltip"]').attr("title"));
    

    $("body").tooltip({
        selector: '[data-toggle="tooltip"]',
        container: "body"
    });

    
    $(".adicionaTeste").click(function () {
        gridPrincipal.CarregaWidgets(prompt());
        gridPrincipal.listaWidgets;
    });

})
