$("document").ready(function () {

    var teste, teste2;

    var dadosSelecionados = [
        { nome: "janeiro", teste1: 12, id: 1 },
        { nome: "fev", teste1: 41, id: 1 },
        { nome: "março", teste1: 25, id: 1 },
        { nome: "abril", teste1: 24, id: 1 },
        { nome: "maio", teste1: 32, id: 1 },
        { nome: "junho", teste1: 13, id: 1 },
        { nome: "julho", teste1: 22, id: 1 },
        { nome: "agosto", teste1: 51, id: 1 },
        { nome: "setembro", teste1: 21, id: 1 },
        { nome: "outubro", teste1: 23, id: 1 },
        { nome: "novembro", teste1: 17, id: 1 },
        { nome: "dezembro", teste1: 11, id: 1 },
        { nome: "janeiro", teste1: 25, id: 2 },
        { nome: "fev", teste1: 16, id: 2 },
        { nome: "março", teste1: 23, id: 2 },
        { nome: "abril", teste1: 16, id: 2 },
        { nome: "maio", teste1: 19, id: 2 },
        { nome: "junho", teste1: 8, id: 2 },
        { nome: "julho", teste1: 9, id: 2 },
        { nome: "agosto", teste1: 11, id: 2 },
        { nome: "setembro", teste1: 17, id: 2 },
        { nome: "outubro", teste1: 16, id: 2 },
        { nome: "novembro", teste1: 20, id: 2 },
        { nome: "dezembro", teste1: 25, id: 2 },
        { nome: "janeiro", teste1: 31, id: 3 },
        { nome: "fev", teste1: 12, id: 3 },
        { nome: "março", teste1: 13, id: 3 },
        { nome: "abril", teste1: 31, id: 3 },
        { nome: "maio", teste1: 16, id: 3 },
        { nome: "junho", teste1: 9, id: 3 },
        { nome: "julho", teste1: 19, id: 3 },
        { nome: "agosto", teste1: 20, id: 3 },
        { nome: "setembro", teste1: 29, id: 3 },
        { nome: "outubro", teste1: 11, id: 3 },
        { nome: "novembro", teste1: 21, id: 3 },
        { nome: "dezembro", teste1: 17, id: 3 }
    ];


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
    /// Método para ativar o Bootstrap Tooltip
    /// </summary>
    $('[data-toggle="tooltip"]').tooltip();

    /// <summary>
    /// Revealing Module Pattern para o Widget, esta class encapsula a maior parte de toda a 
    /// informação sobre qualquer Widget
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

            // Inicialização do construtor
            this.titulo = titulo;
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
        /// Get e set para o objecto dados
        /// </summary>
        Widget.prototype.setDados = function (dados) {
            this.dados = dados;
        }
        Widget.prototype.getDados = function () {
            return this.dados;
        }

        /// Retorna o objeto criado
        return Widget;

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
            color,
            /// to-do ---------
            arc,
            pie,
            path,
            raio,
            donut = true;


        /// <summary>
        /// Método construtor para a classe PieChart, chama o construtor do Widget 
        /// </summary>
        function PieChart(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
            var self = this;

            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
            // Inicializar o raio
            self.raio = Math.min(self.largura, self.altura) / 2;
            // Inicializar toolTip a true
            self.mostraToolTip = true;

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
            self.svg = d3.select("."+id).select(".wrapper").insert("svg")
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
        }


        /// <summary>
        /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
        /// </summary>
        PieChart.prototype.InsereDados = function () {
            var self = this,
                soma = 0,
                somaAtual = 0,
                dadosPie = [0],
                percentagemSlice = [0];

            // to-do id?
            // dadosSelecionados
            // nome
            // teste1 / nome
            // Soma de todos os IDs

            // Agrupa os dados conforme a key selecionada
            dataNest = d3.nest()
                // Seleciona key para agrupar
                .key(function (d) { return d.id; })
                // Escolhe onde vai buscar os dados a agrupar
                .entries(dadosSelecionados);

            /// <summary>
            /// Este bloco é usado para descobrir a soma total de valores ( Soma )
            /// e para descobrir a soma de cada um dos conjuntos ( dadosPie[] )
            /// para no final podermos calcular a percentagem e então passar ao método
            /// arc para este calcular os angulos e finalmente desenhar o gráfico
            /// </summary>
            for (var a = 0; a < dataNest.length; a++) { // simple logic to calculate percentage data for the pie
                somaAtual = 0;
                // Percorre o conjunto de valores dentro do dataNest
                for (var b = 0; b < dataNest[a].values.length; b++) {
                    // Faz a soma do atual conjunto
                    somaAtual += dataNest[a].values[b].teste1;
                }
                // Soma total = a soma do atual
                soma += somaAtual;
                // A soma de um conjunto é guardado na percentagem
                dadosPie[a] = somaAtual;
            }

            // Para cada uma da soma dos conjuntos
            dadosPie.forEach(function (valorSlice, curIndex) {
                // Calculamos a percentagem e guardamos
                percentagemSlice[curIndex] = (valorSlice / soma) *100;
            });

            // Método d3 que constroi uma função pie
            pie = d3.layout.pie()
                // Inserimos os valores de percentagem para proceder a construção
                .value(function (d, i) { return percentagemSlice[i]; })
                .sort(null);

            // Método d3 que constroi um arco
            arc = d3.svg.arc()
                // Raio interior ( 0 = circunferência completa )
                .innerRadius(0)
                // Raio exterior
                .outerRadius(self.raio);

            // Método d3 para definir as cores
            color = d3.scale.category10()
                // atribuimos a cada "key" uma cor
                .domain(d3.keys(dadosSelecionados[0]).filter(function (key) { return key === "id"; }));
        

            // Seleciona todos os path
            path = self.svg.selectAll("path")
                // utilizamos o pie para calcular os angulos e atribuimos a data
                .data(pie(dataNest))
              // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
              .enter().append("path")
                // Atribuido id a cada "fatia"
                .attr("id", function (d, i) { return "path" + i;})
                // Atribuida class slice ao elemento
                .attr("class", "slice")
                // Atribuida cor através do método color
                .attr("fill", function (d, i) { return color(i); })
                // É criado o path utilizando o método arc do d3
                .attr("d", arc);

            // Caso legendas esteja a true
            self.InsereLegenda(percentagemSlice);

        }

        /// <summary>
        /// Insere a legenda dinamicamente, de acordo com os dados fornecidos
        /// </summary>
        PieChart.prototype.InsereLegenda = function (dadosPie) {

            // to-do Legendas
            // unico = id 
            $(".unico").append("<div class=\"legenda\" style=\"float:left; max-width:300px;\"></div>")

            // Insere SVG das legendas
            d3.select(".legenda").insert("svg")
                .attr("class", "svg-legenda")

            // Para cada conjunto de dados
            dadosPie.forEach(function (d, curIndex) {
                // Seleciona svg legenda
                d3.select(".legenda").select("svg")
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
            $(".slice").hover(function () {
                // Selecionamos o circulo do conjunto com o mesmo numero
                d3.select(".circuloLegenda" + $(this).attr("id").match(/\d+/)).transition()
                    .duration(150)
                    // Aumenta-mos o tamanho
                    .attr("r", 12);
            },
            // Ao deixar de fazer hover
            function () {
                // Selecionamos o circulo do conjunto com o mesmo numero
                d3.select(".circuloLegenda" + $(this).attr("id").match(/\d+/)).transition()
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
            path.transition()
                .attr("d", arc);

            // Remoção de elementos
            path.exit()
                .transition()
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

            self.ConstroiSVG(id);
            self.InsereDados();

        }


        /// <summary>
        /// Método que atualiza os elementos que representam os dados
        /// atualiza os elementos dentro do SVG do widget
        /// </summary>
        PieChart.prototype.Atualiza = function () {
            var self = this;

            var atualizaPath = d3.selectAll(".slices").data(pie(dataNest));

            // to-do é necessário para quando dados são modificados?
            //// Constroi uma funcao pie
            //var pie = d3.layout.pie()
            //    .value(function (d) { return d.numero; })

            //// Calcula as "fatias" para o pie chart
            //var slices = pie(dataSelected),
            //    selector = "[name=" + div.parent().attr("name") + "]",
            //    path = d3.select("#main-gridstack").select(selector).select(".wrapper").selectAll("path")
            //            .data(slices);

            // Inserção de elementos
            atualizaPath.enter(function (self) {
                return self.InsereDados();
            });


            // Update de elementos
            path.transition()
                .attr("d", arc);

            // Remoção de elementos
            atualizaPath.exit()
                .remove()
                .transition();
        }

        /// <summary>
        /// Set da função para definir se PieChart vai ter o formato "donut"
        /// </summary>
        PieChart.prototype.setDonut = function (modoDonut){
            var self = this;

            if (modoDonut === true) {
                self.donut = donut;

                arc = d3.svg.arc()
                .innerRadius(self.raio/2)
                .outerRadius(self.raio);

                self.Atualiza();
            } else {
                self.donut = donut;

                arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(self.raio);

                self.Atualiza();
            }
        }


        /// Retorna o objecto criado
        return PieChart;

    })();

    // Modifica entre donut e não donut
    $(".check-donut").on("click", function () {
        if ($(".check-donut").is(":checked")) {
            teste2.setDonut(true);
        } else {
            teste2.setDonut(false);
        }
    });
    
    teste2 = new PieChart("oi", "ola", 20, 20, 400, 400);
    teste2.ConstroiGrafico("unico");

});