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
    var Herda = function(Filho, Pai) {
        Filho.prototype = Object.create(Pai.prototype);
        Filho.prototype.constructor = Filho;
    }



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

            self.svg = d3.select("."+id).select(".wrapper").insert("svg")
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
        Widget.prototype.Atualiza = function() {
            // to-do
            console.log("widget prototype atualiza");
        }

        /// <summary>
        /// Método para atualizar as dimensões atuais de um certo widget de acordo com o seu wrapper
        /// </summary>
        Widget.prototype.AtualizaDimensoes = function(self) {

            // to-do self?
            width = self.width();

            // Se for maior for que a sua altura original, volta ao seu Max
            if(largura > self.width() - margem.esquerda - margem.direita) {
                largura = self.width() - margem.direita - margem.left;
            }

            altura = self.height();

            // Retirados 20 pixeis por causa do nome que ocupa mais espaço devido ao seu angulo
            if(altura > self.height() - margem.cima - margem.baixo - 20) {
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
    /// Classe Gráfico de Área 
    /// Module Pattern
    /// </summary>
    var GraficoArea = (function () {
        var TamanhoLimite = 350, /// to-do?
            /// to-do dataNest? series?
            dataNest,
            series,
            color,
            /// to-do ---------
            escalaY,
            escalaX,
            transformaX,
            transformaY,
            area,
            nomeEixoX = "Eixo X",
            nomeEixoY = "Eixo Y",
            modoVisualizacao = "Normal",
            suavizarLinhas = false;

        /// <summary>
        /// Método construtor para a classe GraficoArea, chama o construtor do Widget 
        /// </summary>
        function GraficoArea(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
        };


        /// <summary>
        /// Herança é realizada através do método Herda
        /// </summary>
        Herda(GraficoArea, Widget);


        /// <summary>
        /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
        /// </summary>
        GraficoArea.prototype.InsereDados = function () {
            var self = this;
            // to-do id?

            // Agrupa os dados conforme a key selecionada
            dataNest = d3.nest()
                // Seleciona key para agrupar
                .key(function (d) { return d.id; })
                // Escolhe onde vai buscar os dados a agrupar
                .entries(dadosSelecionados);

            // Componente D3 que disponibiliza um leque de cores
            color = d3.scale.category10()
                // Dominio das cores são filtradas por cada Key existente, neste  caso cada key é um ID
                .domain(d3.keys(dadosSelecionados[0]).filter(function (key) { return key === "id"; }));

            // Seleciona todas as series
            series = self.svg.selectAll(".series")
               // Liga os elementos aos dados dataNest
              .data(dataNest)
            // Acrescenta séries, caso não hajam suficientes para representar dataNest
            .enter().append("g")
              .attr("class", "series");

            // Acrescenta um path para cada série
            series.append("path")
              .attr("class", "area")
              // Componente D3(area) devolve o path calculado de acordo com os valores
              .attr("d", function (d) { return area(d.values); })
                // Uma cor é automaticamente escolhida de acordo com o componente color, para cada key
                .style("fill", function (d) { return color(d.key); })
        }


        /// <summary>
        /// Método que atualiza o gráfico, p.ex a sua escala ou os dados
        /// </summary>
        GraficoArea.prototype.Atualiza = function () {
            var self = this
            // to-do
            console.log("grafico area atualiza");
        }


        /// <summary>
        /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
        /// </summary>
        GraficoArea.prototype.ConstroiEixos = function () {

            var self = this;

            // to-do 
            // dadosSelecionados?
            // nome? data
            // teste1? valores

            // Atribui valores a Y conforme a sua escala
            transformaX = d3.scale.ordinal()
                // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
                .domain(dadosSelecionados.map(function (d) { return d.nome; }))
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .rangeRoundBands([0, self.largura], 0.1);

            // Construtor do Eixo dos X
            escalaX = d3.svg.axis()
              .scale(transformaX)
              // Orientação da escala
              .orient("bottom");

            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
              .domain([0, d3.max(dadosSelecionados, function (d) { return d.teste1; })])
              .range([self.altura, 0]);

            // Construtor do Eixo dos Y
            escalaY = d3.svg.axis()
              .scale(transformaY)
              .orient("left")
              .ticks(10);
        }


        /// <summary>
        /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
        /// </summary>
        GraficoArea.prototype.AtualizaEixos = function () {

            // Atribui valores a Y conforme a sua escala
            transformaX = d3.scale.ordinal()
                // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
                .domain(dadosSelecionados.map(function (d) { return d.nome; }))
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .rangeRoundBands([0, self.largura], 0.1);

            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
                .domain([0, d3.max(dadosSelecionados, function (d) { return d.teste1; })])
                .range([self.altura, 0]);

            // Atualização da escala dos Eixos
            escalaX.scale(transformaX);
            escalaY.scale(transformaY);

            // Update nos paths do gráfico
            // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
            area = d3.svg.area()
                // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                .x(function (d) { return x(d.nome); })
                // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                .y0(altura)
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y1(function (d) { return y(d.teste1); });

        }


        /// <summary>
        /// Inserção dos eixos no SVG do widget
        /// </summary>
        GraficoArea.prototype.InsereEixos = function () {
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

            self.svg.append("g")
              .append("text")
                .attr("x", self.largura - 20)
                .attr("y", self.altura + self.margem.cima)
                .attr("dx", ".71em")
                  .text(nomeEixoX);

            // Acrescentar no g a escala Y e o seu nome to-do
            self.svg.append("g")
              .attr("class", "y axis")
              .call(escalaY)
            .append("text")
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
        GraficoArea.prototype.ConstroiGrafico = function (id) {
            var self = this;

            // to-do
            // nome?
            // teste1?

            self.ConstroiEixos();

            // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
            area = d3.svg.area()
                // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                .x(function (d) { return transformaX(d.nome); })
                // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                .y0(self.altura)
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y1(function (d) { return transformaY(d.teste1); });

            self.ConstroiSVG(id, self);
            self.InsereDados();
            self.InsereEixos();
        }


        /// <summary>
        /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados 
        /// </summary>
        GraficoArea.prototype.Renderiza = function () {
            var self = this;

            // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
            svg = d3.select("[name="+self.parent().attr("name")+"]").select(".wrapper");

            // Atualizar dimensões conforme a "widget"
            self.AtualizaDimensoes(self);

            // Atualizar escala - para dentro do atualiza to-do
            self.AtualizaEixos();

            //update svg elements to new dimensions
            d3.select("#main-gridstack").select("[name="+self.parent().attr("name")+"]").select(".wrapper svg")
              .attr("width", largura + margem.esquerda + margem.direita)
              .attr("height", altura + margem.cima + margem.baixo);

            // Numero de representações nos eixos de acordo com o tamanho do widget
            if(altura > TamanhoLimite){
                escalaY.ticks(10);
            }
            if(altura <= TamanhoLimite){
                escalaY.ticks(5);
            }
            if(altura <= (TamanhoLimite - 100)){
                escalaY.ticks(2);
            }

            // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
            if(largura > TamanhoLimite){
                escalaX.tickValues(x.domain());
            }
            // Caso seja menor ou igual, apenas dispões os numeros pares
            if (largura <= TamanhoLimite) {
                escalaX.tickValues(x.domain().filter(function (d, i) { return !(i % 2); }));
            }
            // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
            if (largura < (TamanhoLimite - 100)) {
               
                escalaX.tickValues(x.domain().filter(function (d, i) { return !(i % 5); }));
            }

            // Atualização do eixo dos X
            svg.select(".x.axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("dx", "-2em")
              .attr("dy", ".5em")
              .attr("transform", "rotate(-35)" );

            // Atualização do eixo dos Y
            svg.select(".y.axis")
              .call(yAxis);

            // Atualização dos dados
            self.Atualiza();
        }


        /// <summary>
        /// Método que atualiza os elementos que representam os dados
        /// atualiza os elementos dentro do SVG do widget
        /// </summary>
        GraficoArea.prototype.Atualiza = function () {
            var self = this;

            // Seleciona todos os elementos com class .area e liga-os aos dados
            svg.selectAll(".area").data(dataNest)
                // Para cada d, é calculado um novo path através da variável "area" que contém o método d3.svg.area
                .attr("d", function (d) { return area(d.values); })
        }


        /// <summary>
        /// Atribui ao gráfico o seu modo de visualização e chama o método update
        /// </summary>
        GraficoArea.prototype.setModoVisualizacao = function (modo) {
            var self = this;

            self.modoVisualizacao = modo;
        }


        /// Retorna o objecto criado
        return GraficoArea;
    })();



    /// <summary>
    /// Classe Gráfico de Barras
    /// Module Pattern
    /// </summary>
    var GraficoBarras = (function () {
        var TamanhoLimite = 350, /// to-do?
            /// to-do dataNest? series?
            dataNest,
            series,
            color,
            /// to-do ---------
            escalaY,
            escalaX,
            transformaX,
            transformaY,
            area,
            nomeEixoX = "Eixo X",
            nomeEixoY = "Eixo Y",
            modoVisualizacao = "Normal";


        /// <summary>
        /// Método construtor para a classe GraficoArea, chama o construtor do Widget 
        /// </summary>
        function GraficoBarras(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
        };


        /// <summary>
        /// Herança é realizada através do método Herda
        /// </summary>
        Herda(GraficoBarras, Widget);


        /// <summary>
        /// Adapta os dados e acrescenta-os ao DOM, mais especificamente na secção do SVG
        /// </summary>
        GraficoBarras.prototype.InsereDados = function () {
            var self = this;
            // to-do id?
            // dadosSelecionados
            // nome
            // teste1 / nome

            svg.selectAll(".bar")
                .data(dadosSelecionados)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return transformX(d.nome); })
                .attr("y", function (d) { return transformY(d.numero); })
                .attr("height", function (d) { return altura - transformY(d.numero); })
                .attr("width", transformaX.rangeBand());

        }


        /// <summary>
        /// Método que atualiza o gráfico, p.ex a sua escala ou os dados
        /// </summary>
        GraficoBarras.prototype.Atualiza = function () {
            var self = this
            // to-do
            // dadosSelecionados
            // nome
            // teste1 / numero

            // Seleciona todas as barras
            svg.selectAll(".bar")
                // Liga as barras aos dados selecionados
                .data(dadosSelecionados)
              // Caso não hajam suficientes elementos para ligar aos dados são adicionados mais
              .enter().append("rect")
                .attr("class", "bar")
                // para cada elemento um atributo X é dado através do método transformaX
                .attr("x", function (d) { return transformaX(d.nome); })
                // para cada elemento um atributo Y é dado através do método transformaX
                .attr("y", function (d) { return transformaY(d.numero); })
                // A altura é igual a to-do
                .attr("height", function (d) { return altura - transformaY(d.numero); })
                // Largura é constante com o rangeBand definido
                .attr("width", transformaX.rangeBand());

            // Update de todas as barras
            svg.selectAll(".bar")
              .attr("x", function (d) { return transformaX(d.nome); })
              .attr("y", function (d) { return transformaY(d.numero); })
              .attr("height", function (d) { return altura - transformaY(d.numero); })
              .attr("width", transformaX.rangeBand());

            
            svg.selectAll(".bar").data(dadosSelecionados)
                // Caso hajam elementos a mais comparados com os dados
                .exit()
                // Remover
                .remove();
        }


        /// <summary>
        /// Constroi e atribui a variáveis os construtores de eixos e as respetivas escalas
        /// </summary>
        GraficoArea.prototype.ConstroiEixos = function () {

            var self = this;

            // to-do 
            // dadosSelecionados?
            // nome? data
            // teste1? valores

            // Atribui valores a Y conforme a sua escala
            transformaX = d3.scale.ordinal()
                // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
                .domain(dadosSelecionados.map(function (d) { return d.nome; }))
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .rangeRoundBands([0, self.largura], 0.1);

            // Construtor do Eixo dos X
            escalaX = d3.svg.axis()
              .scale(transformaX)
              // Orientação da escala
              .orient("bottom");

            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
              .domain([0, d3.max(dadosSelecionados, function (d) { return d.teste1; })])
              .range([self.altura, 0]);

            // Construtor do Eixo dos Y
            escalaY = d3.svg.axis()
              .scale(transformaY)
              .orient("left")
              .ticks(10);
        }


        /// <summary>
        /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
        /// </summary>
        GraficoArea.prototype.AtualizaEixos = function () {

            // Atribui valores a Y conforme a sua escala
            transformaX = d3.scale.ordinal()
                // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
                .domain(dadosSelecionados.map(function (d) { return d.nome; }))
                // Intervalo de valores que podem ser atribuidos, conforme o dominio
                .rangeRoundBands([0, self.largura], 0.1);

            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
                .domain([0, d3.max(dadosSelecionados, function (d) { return d.teste1; })])
                .range([self.altura, 0]);

            // Atualização da escala dos Eixos
            escalaX.scale(transformaX);
            escalaY.scale(transformaY);

            // Update nos paths do gráfico
            // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
            area = d3.svg.area()
                // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
                .x(function (d) { return x(d.nome); })
                // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                .y0(altura)
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y1(function (d) { return y(d.teste1); });

        }


        /// <summary>
        /// Inserção dos eixos no SVG do widget
        /// </summary>
        GraficoArea.prototype.InsereEixos = function () {
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

            // Insere nome do eixo do X
            self.svg.append("g")
              .append("text")
                .attr("x", self.largura - 20)
                .attr("y", self.altura + self.margem.cima)
                .attr("dx", ".71em")
                  .text(nomeEixoX);

            // Acrescentar no g a escala Y e o seu nome to-do
            self.svg.append("g")
              .attr("class", "y axis")
              .call(escalaY)
            // Insere nome do eixo do Y
            .append("text")
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
        GraficoArea.prototype.ConstroiGrafico = function (id) {
            var self = this;

            // to-do
            // nome?
            // teste1?

            self.ConstroiEixos();
            self.ConstroiSVG(id, self);
            self.InsereDados();
            self.InsereEixos();
        }


        /// <summary>
        /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados 
        /// </summary>
        GraficoArea.prototype.Renderiza = function () {
            var self = this;

            // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
            svg = d3.select("[name=" + self.parent().attr("name") + "]").select(".wrapper");

            // Atualizar dimensões conforme a "widget"
            self.AtualizaDimensoes(self);

            // Atualizar escala - para dentro do atualiza to-do
            self.AtualizaEixos();

            //update svg elements to new dimensions
            d3.select("#main-gridstack").select("[name=" + self.parent().attr("name") + "]").select(".wrapper svg")
              .attr("width", largura + margem.esquerda + margem.direita)
              .attr("height", altura + margem.cima + margem.baixo);

            // Numero de representações nos eixos de acordo com o tamanho do widget
            if (altura > TamanhoLimite) {
                escalaY.ticks(10);
            }
            if (altura <= TamanhoLimite) {
                escalaY.ticks(5);
            }
            if (altura <= (TamanhoLimite - 100)) {
                escalaY.ticks(2);
            }

            // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
            if (largura > TamanhoLimite) {
                escalaX.tickValues(x.domain());
            }
            // Caso seja menor ou igual, apenas dispões os numeros pares
            if (largura <= TamanhoLimite) {
                escalaX.tickValues(x.domain().filter(function (d, i) { return !(i % 2); }));
            }
            // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
            if (largura < (TamanhoLimite - 100)) {

                escalaX.tickValues(x.domain().filter(function (d, i) { return !(i % 5); }));
            }

            // Atualização do eixo dos X
            svg.select(".x.axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("dx", "-2em")
              .attr("dy", ".5em")
              .attr("transform", "rotate(-35)");

            // Atualização do eixo dos Y
            svg.select(".y.axis")
              .call(yAxis);

            // Atualização dos dados
            self.Atualiza();
        }


        /// <summary>
        /// Método que atualiza os elementos que representam os dados
        /// atualiza os elementos dentro do SVG do widget
        /// </summary>
        GraficoArea.prototype.Atualiza = function () {
            var self = this;

            // Seleciona todos os elementos com class .area e liga-os aos dados
            svg.selectAll(".area").data(dataNest)
                // Para cada d, é calculado um novo path através da variável "area" que contém o método d3.svg.area
                .attr("d", function (d) { return area(d.values); })
        }

        /// Retorna o objecto criado
        return GraficoArea;
    })();


    //teste2 = new GraficoBarras("oi", "ola", 20, 20, 400, 400);

});