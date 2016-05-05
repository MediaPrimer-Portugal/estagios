$("document").ready(function () {

    var opcoes,
        // to-do
        idUnico = 0;


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
            titulo,
            id,
            largura,
            altura,
            svg,
            mostraToolTip,
            mostraLegenda,
            ultimaAtualizacao,
            margem = { cima: 20, baixo: 50, esquerda: 50, direita: 50 };

        /// <summary>
        /// Construtor da class Widget
        /// </summary>
        function Widget(el, titulo, widgetAltura, widgetLargura, widgetX, widgetY) {


            // Atribuição de altura e largura conforme o elemento em que se encontra
            // to-do
            this.largura = 500 ///$(el).width();
            this.altura = 400 ///$(el).height();
            this.el = el;

            // Inicialização do construtor
            (titulo !== undefined) ? this.titulo = titulo : this.titulo = "titulo";
            this.widgetAltura = widgetAltura;
            this.widgetLargura = widgetLargura;
            this.widgetX = widgetX;
            this.widgetY = widgetY;

            // to-do Criação de um ID unico
            this.id = "idUnico";

            // Inicialização dos dados default
            this.mostraLegenda = false,
            this.mostraToolTip = false,
            this.ultimaAtualizacao = "4/11/16"
            this.margem = margem;

            this.ModificaTitulo();
        }


        /// <summary>
        /// Cria um svg e acrescenta-o à DOM, atribui o selector à variável svg
        /// </summary>
        /// <param name="id"> Id do widget, utilizado para selecção do mesmo </param>
        Widget.prototype.ConstroiSVG = function (id, self) {

            self.svg = d3.select("." + id).select(".wrapper").insert("svg")
                .attr("width", self.largura + self.margem.esquerda + margem.direita)
                .attr("height", self.altura + margem.cima + margem.baixo)
              .append("g")
                .attr("transform", "translate(" + margem.esquerda + "," + margem.cima + ")");
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
        Widget.prototype.AtualizaDimensoes = function (self) {

            // to-do self?
            width = self.width();

            // Se for maior for que a sua altura original, volta ao seu Max
            if (largura > self.width() - margem.esquerda - margem.direita) {
                largura = self.width() - margem.direita - margem.left;
            }

            altura = self.height();

            // Retirados 20 pixeis por causa do nome que ocupa mais espaço devido ao seu angulo
            if (altura > self.height() - margem.cima - margem.baixo - 20) {
                altura = self.height() - margem.cima - margem.baixo - 20;
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
        /// Evento que vai modifica ro nome caso o utilizador o queira
        /// </summary>
        Widget.prototype.ModificaTitulo = function () {
            var self = this;

            // Ligamos o evento ao botão do widget
            $("." + self.el).on("click", ".update-widget", function () {
                // Ao clicar chama o método setTitulo
                self.setTitulo(prompt("Digite o titulo que pretende"));
            });

        }


        /// <summary>
        /// Get e set para o objecto dados
        /// </summary>
        Widget.prototype.setDados = function (dados) {
            this.dados = dados;
        }
        Widget.prototype.getDados = function () {
            return this.dados;
        }

        /// <summary>
        /// Evento que vai modificar o titulo do Widget
        /// </summary>
        Widget.prototype.setTitulo = function (titulo) {
            var self = this;
            
            // Atribui o titulo
            self.titulo = titulo;
            // Substitui na DOM
            $("." + self.el).find(".titulo").text(self.titulo);
        }


        /// Retorna o objeto criado
        return Widget;

    })();

        

    /// <summary>
    /// Class Grid, "tabela" que vai conter todos os widgets
    /// Module Pattern
    /// </summary>
    var Grid = (function () {

        var listaWidgets = [],
            grid,
            id,
            identificador,
            opcoes;

        /// <summary>
        /// Construtor da class Grid
        /// </summary>
        /// <param name="id"> Identificador da grid </param>
        /// <param name="opcoes"> Objecto com as opcoes para a inicializacao da grid </param>
        function Grid(id, opcoes) {
            var self = this;

            self.id = id;
            self.opcoes = opcoes;


            self.Inicializa();
        }

        /// <summary>
        /// Inicializa a "grid" com as opccoes que foram dadas pelo utilizador
        /// </summary>
        Grid.prototype.Inicializa = function () {

            console.log("teste");

            var self = this;

            // Atribuição à variavel grid da referencia para a "grid"
            self.grid = $("#" + self.id);

            // Inicialização da "grid" com as opcoes enviadas no construtor
            self.grid.gridstack(self.opcoes);

            // Liga os eventos de modificar titulo e remove widget à "grid"
            self.RemoveWidget();
        }


        /// <summary>
        /// Método para adicionar widgets à "grid"
        /// </summary>
        /// <param name="elemento"> Objeto com as caracteristicas do widget </param>
        Grid.prototype.AdicionaWidget = function(titulo, x, y, width, height, autoPosition, minWidth, maxWidth,
        minHeight, maxHeight, id) {
            var self = this;

            // Dar titulo caso o recebido seja inválido
            if (titulo === undefined) titulo = "titulo";


            // Criação padrão do HTML do widget
            // Definimos um item da grid
            var el = "<div class=\"grid-stack-item \">" +
                     // Div do conteudo do item da grid
                     "<div class=\"grid-stack-item-content box "+ "widget" + idUnico +"\">" +
                     // Wrapper para manter o conteudo 
                     // to-do idUnico melhor
                     "<div class=\"wrapper\">" +
                     // Navbar da widget
                     "<div class=\"widget-navbar\">" +
                        // Titulo do widget
                        "<span class=\"titulo\">" + titulo + "</span>" +
                        // Botões do widget
                        "<button type=\"button\" class=\"update-widget\"><i class=\"glyphicon glyphicon-refresh\"></i></button>" +
                        "<button type=\"button\" class=\"remove-widget\"><i class=\"glyphicon glyphicon-remove\"></i></button>" +
                     "</div>" +
                     // Conteudo do widget
                     "<div class=\"widget-conteudo\"> " +
                        "Master Frodo" +
                     "</div>" + "</div>" + "</div> " + "</div>";


            // Atributo opcional, define uma posição automática para o widget
            // Ao modificar para fora, insere numa posição diferente
            // to-do
            //autoPosition = true;

            // Adiciona widget, biblioteca gridstack
            // apenas é obrigatório o atributo el
            self.grid.data("gridstack").addWidget(el, x, y, width, height, autoPosition, minWidth, maxWidth, minHeight, maxHeight, id);

            // Adicionamos o novo widget à lista de widgets atuais
            listaWidgets.push(new Widget("widget"+idUnico, titulo));

            // Incrementar para não haver Ids iguais
            idUnico++;

        }


        /// <summary>
        /// Evento que vai remover o widget da grid
        /// </summary>
        Grid.prototype.RemoveWidget = function (el) {
            var self = this;

            // Ao clickar em qualquer botão de classe remove-widget
            $(document).on("click", ".remove-widget", function () {

                // Selecionar o elemento "grid-stack-item" mais próximo do botão, seleção do widget especifico do botão
                var el = $(this).closest(".grid-stack-item");

                // Chamar a grid e o método da biblioteca do gridstack para remover o widget
                self.grid.data("gridstack").removeWidget(el);
            });
        }

        return Grid;

    })();

    $(".adicionaWidget").click(function () {
        teste2.AdicionaWidget();
    })

    options = {
        /* removable: ".trash",  A testar */
        verticalMargin: 2,
        float: true,
        // Modificado também nas media queries
        minWidth: 680,
        acceptWidgets: ".grid-stack-item",
        resizable: {
            handles: "sw, se"
        }
    };

    teste2 = new Grid("main-gridstack", options);

});
