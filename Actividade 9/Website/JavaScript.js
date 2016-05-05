/// <summary>
/// Classe Gráfico de Área 
/// Module Pattern
/// </summary>
var GraficoArea = (function () {
    var TamanhoLimite = 350, /// to-do?
        /// to-do dataNest? series?
        dataNest,
        series,
        /// to-do ---------
        escalaY,
        escalaX,
        transformaX,
        transformaY,
        area,
        nomeEixoX = "Eixo X",
        nomeEixoY = "Eixo Y",
        modoVisualizacao = "normal",  // stacked
        suavizarLinhas = false;

    // Stacked
    var parseDate = d3.time.format("%d-%b-%y").parse,
        formatPercent = d3.format(".0%"),
        stack,
        dadosNormal,
        dadosStacked,
        color = d3.scale.category20(),
        chave = [],
        valores,
        ponto,
        pontos;

    /// <summary>
    /// Método construtor para a classe GraficoArea, chama o construtor do Widget 
    /// </summary>
    function GraficoArea(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
        // Construtor de Widget é chamado
        Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY)
        this.modoVisualizacao = "normal";
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

        // Largura de cada rectangulo, de acordo com o tamanho do widget
        larguraRect = (self.largura / self.dados.length);


        if (self.modoVisualizacao === "stacked") {
            stack = d3.layout.stack()
                .values(function (d) { return d.values; });
        }


        // Update nos paths do gráfico
        // método d3 que cria um "path" equivalente a uma area de acordo com os dados fornecidos
        area = d3.svg.area()
            // Devolve o "X" de cada valor "nome" no objecto Dados de acordo com a escala X
            .x(function (d) { return transformaX(d.date); })
         // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                .y0(function (d) { return self.altura; })
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y1(function (d) { return transformaY(d.y); });


        if (self.modoVisualizacao === "stacked") {
            area
                // y0 é igual a altura pois no d3 a escala é feita de forma contrária
                .y0(function (d) { return transformaY(d.y0); })
                // Devolve o "Y" de cada valor "teste1" no objecto Dados de acordo com a escala Y
                .y1(function (d) { return transformaY(d.y0 + d.y); });
        } else {
            //to-do
        }


        // Inicia controlo de cores padrão to-do
        // Controla as keys (Series) que vão estar contidas no gráfico
        color.domain(d3.keys(self.dados[0]).filter(function (key) { return key !== "date"; }));


        // Para cada objecto vamos analisar a data
        self.dados.forEach(function (d) {
            d.date = parseDate(d.date);
        })


        if (self.modoVisualizacao === "stacked") {

            // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
            // Recorre ao método stack do d3
            dadosStacked = stack(color.domain().map(function (name) {

                return {
                    // Atribuir nome da chave
                    name: name,
                    // Atribuir valores
                    values: self.dados.map(function (d) {
                        // Data e valor a dividir por 100, pois escala está no padrão [0,1]
                        return { name: name, date: d.date, y: +d[name] / 100 };
                    })
                }
            }));


            // Atualizar eixo depois de dados inseridos
            transformaX.domain(d3.extent(self.dados, function (d) { return d.date; }));


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
                .attr("d", function (d) { return area(d.values); })
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
            dadosStacked.forEach(function (item, curIndex) {
                // Para cada "variável"
                self.pontos.selectAll(".ponto" + curIndex)
                    // Ligar o valor dos pontos
                    .data(item.values)
                  // Inserir rectangulo
                  .enter().append("rect")
                    .attr("class", "ponto" + curIndex)
                    .attr("x", function (d) { return transformaX(d.date); })
                    .attr("y", function (d) { return transformaY(d.y0 + d.y); })
                    .attr("width", "2")
                    .attr("height", function (d) { return self.altura - transformaY(d.y); })
                    .style("opacity", "0")
                    // Adicionar tooltip
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            });


        } else {


            // Criar novo array de objectos para guardar a informação de forma fácil de utilizar
            dadosNormal = color.domain().map(function (name) {
                return {
                    // Atribuir nome da chave
                    name: name,
                    // Atribuir valores
                    values: self.dados.map(function (d) {
                        // Data e valor a dividir por 100, pois escala está no padrão [0,1]
                        return { name: name, date: d.date, y: d[name] };
                    })
                }
            });


            // Adquirir valor máximo de cada uma das chaves
            dadosNormal.forEach(function (item, i) {
                chave.push(d3.max(item.values, function (d) { return d.y; }));
            });


            // Atribuir dominios aos métodos de transformação
            transformaX.domain(d3.extent(self.dados, function (d) { return d.date; }));
            // to-do var close
            transformaY.domain([0, d3.max(chave)]);


            // Passar os dados para dentro de um objecto para serem facilmente lidos pelos métodos d3
            valores = [{ values: dadosNormal }];

            // Acrescentar ao SVG
            dados = self.svg.selectAll(".dados")
                            .data(dadosNormal)
                          .enter().append("g")
                            .attr("class", "dados")
                            // Compensar margem da esquerda
                            .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)");

            // Acrescenta o desenho do gráfico
            dados.append("path")
                .attr("class", "area")
                .attr("title", "")
                // Chamar area() para desenhar de acordo o "path" com os valores
                .attr("d", function (d) { return area(d.values); })
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
            dadosNormal.forEach(function (item, curIndex) {
                // Para cada "variável"
                self.pontos.selectAll(".ponto" + curIndex)
                    // Ligar o valor dos pontos
                    .data(item.values)
                  // Inserir rectangulo
                  .enter().append("rect")
                    .attr("class", "ponto" + curIndex)
                    .attr("x", function (d) { return transformaX(d.date); })
                    .attr("y", function (d) { return transformaY(d.y); })
                    .attr("width", "2")
                    .attr("height", function (d) { return self.altura - transformaY(d.y); })
                    .style("opacity", "0")
                    // Adicionar tooltip
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            });
        }

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
        transformaX = d3.time.scale()
            // Mapeia o dominio conforme a dadosSelecionados, e o "nome" to-do
            //.domain(self.dados.map(function (d) { return d.nome; }))
            // Intervalo de valores que podem ser atribuidos, conforme o dominio
            .domain(d3.extent(self.dados, function (d) { return d.date; }))
            .range([0, self.largura]);

        // Construtor do Eixo dos X
        escalaX = d3.svg.axis()
          .scale(transformaX)
          // Orientação da escala
          .orient("bottom");

        // Atribui valores a Y conforme a sua escala
        transformaY = d3.scale.linear()
          //.domain([0, d3.max(self.dados, function (d) { return d.teste1; })])
          .range([self.altura, 0]);

        // Construtor do Eixo dos Y
        escalaY = d3.svg.axis()
          .scale(transformaY)
          .orient("left");

        // Adiciona escala em formato percentagem 
        if (self.modoVisualizacao === "stacked") {
            escalaY
                .tickFormat(formatPercent);
        } else {

        }
    }


    /// <summary>
    /// Atualização dos eixos através da construção de escalas novas, incluindo o método da àrea
    /// </summary>
    GraficoArea.prototype.AtualizaEixos = function () {
        var valores,
            self = this,
            intervaloData = (d3.extent(self.dados, function (d) { return d.date; }));


        // Atribui valores a Y conforme a sua escala
        transformaX = d3.time.scale()
            // Intervalo de valores que podem ser atribuidos, conforme o dominio
            .range([0, $("." + self.id).find(".wrapper").width() - self.margem.esquerda - self.margem.direita])
            // Mapeia o dominio conforme a a data disponivel nos dad
            .domain(d3.extent(self.dados, function (d) { return d.date; }));


        if (self.modoVisualizacao === "stacked") {
            // Atribui valores a Y conforme a sua escala
            transformaY = d3.scale.linear()
                // Para stack não é preciso domain
                //.domain([0, d3.max(self.dados, function (d) { return d.teste1; })])
                .range([self.altura, 0]);

        } else {
            transformaY = d3.scale.linear()
                 // to-do close
                 .domain([0, d3.max(chave)])
                 .range([self.altura, 0]);
        }

        //// Atualização da escala dos Eixos
        escalaX.scale(transformaX);
        escalaY.scale(transformaY);


        // Numero de representações nos eixos de acordo com o tamanho do widget
        if (self.altura > TamanhoLimite) {
            escalaY.ticks(10);
        }
        if (self.altura <= TamanhoLimite) {
            escalaY.ticks(5);
        }
        if (self.altura <= (TamanhoLimite - 100)) {
            escalaY.ticks(2);
        }


        // Se largura for maior ou igual ao tamanho limite a escala X vai dispor todos os valores do dominio X
        if (self.largura > TamanhoLimite) {
            //ATUAL----
            //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
        }
        // Caso seja menor ou igual, apenas dispões os numeros pares
        if (self.largura <= TamanhoLimite) {
            // escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
        }
        // Caso seja apenas menor que o TamanhoLimite - 100 vai apenas dispor os numeros divisiveis por 5
        if (self.largura < (TamanhoLimite - 100)) {
            //escalaX.tickValues(d3.time.months(intervaloData[0], intervaloData[1]));
        }

        // Atualização do eixo dos X
        self.svg.select(".x.axis")
            .attr("class", "x axis")
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
    GraficoArea.prototype.InsereEixos = function () {
        var self = this;


        if (self.modoVisualizacao === "stacked") {
            // Insere eixo dos X (Stacked)
            self.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + self.margem.esquerda + "," + self.altura + ")")
                .call(escalaX);

            // Insere eixo dos Y (Stacked)
            self.svg.append("g")
                .attr("class", "y axis")
                .call(escalaY);

        } else {
            self.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + self.altura + ")")
                .call(escalaX);

            self.svg.append("g")
                .attr("class", "y axis")
                .call(escalaY)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
            //.text("nomeEixoY");
        }

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

        // Chama a função getDados
        // Transforma o texto de JSON para objecto, seleciona o objecto devolvido
        // Chama a função setDados para guardar o objecto
        //self.setDados($.parseJSON(getDados(self, "ficheiro")).dadosSelecionados);

        // Adiciona classe do gráfico ao widget
        $("." + self.id).addClass("graficoArea");

        // Atualiza dimensoes atuais
        self.AtualizaDimensoes();
        self.ConstroiSVG(id, self);
        self.ConstroiEixos();
        self.InsereDados();

        //self.Renderiza();

        self.InsereEixos();
        self.Atualiza();
        // Insere Botão de update na navbar
        self.OpcaoUpdate();

        self.ConstroiLegenda();
    }


    /// <summary>
    /// "Desenha" no ecra após as atualizações necessárias, de dimensão ou dados 
    /// </summary>
    GraficoArea.prototype.Renderiza = function () {
        var self = this;


        // Atualizar dimensões conforme a "widget"
        self.AtualizaDimensoes();

        // Atualiza SVG
        d3.select("." + self.id).select(".wrapper svg")
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
            series = $("." + self.id).find(".wrapper").find(".dados").length,
            legenda;

        //color.domain(d3.keys(self.dados[0]).filter(function (key) { return key !== "date"; }));
        legenda = d3.select("." + self.id).select(".legenda").insert("svg");

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
    /// Método que atualiza os elementos que representam os dados
    /// atualiza os elementos dentro do SVG do widget
    /// </summary>
    GraficoArea.prototype.Atualiza = function () {
        var self = this;

        // Pintar gráfico
        self.Renderiza();

        // Atualizar os dados
        // Seleciona todos os elementos com class .area e liga-os aos dados
        self.svg.selectAll(".area")
            .attr("d", function (d) { return area(d.values); })
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
                    .attr("x", function (d) { return transformaX(d.date); })
                    .attr("y", function (d) { return transformaY(d.y0 + d.y); })
                    .attr("width", "2")
                    .attr("height", function (d) { return self.altura - transformaY(d.y); })
                        .style("opacity", "0")
                    // Compensar margem para eixo dos Y
                    .attr("transform", "translate(" + self.margem.esquerda + " ,0)")
                    // Adicionar tooltip
                        .on("mouseover", tip.show)
                            //{
                            //// to-do  !!!
                            //// Mostra circulo/ponto onde o utilziar está focado
                            //d3.select("."+self.id).select(".circuloFoco").style("display", null)
                            //    // Adicionar metade da largura de um rectangulo para centrar o ponto
                            //    .attr("transform", "translate(" + ((parseInt($(this).attr("x")) + larguraRect / 2) + self.margem.esquerda) + "," + $(this).attr("y") + ")");

                            //// Cria uma marca auxiliar no gráfico
                            //d3.select(this.parentNode).append("rect")
                            //    .attr("class", "marcaAuxiliar")
                            //    .attr("x", (parseInt($(this).attr("x")) + self.margem.esquerda))
                            //    .attr("y", $(this).attr("y"))
                            //    .attr("width", "2")
                            //    .attr("height", (self.altura - $(this).attr("y")))
                            //    .style("fill", "red");

                  //      })
                        .on("mouseout", tip.hide);
                // {

                // Esconde circulo/ponto
                d3.select("." + self.id).select(".circuloFoco").style("display", "none");

                // Remove marca auxiliar
                //d3.select(".marcaAuxiliar").remove();

                //});

            });

        } else {

            // Para cada objecto ( Ponto )
            dadosNormal.forEach(function (item, curIndex) {

                console.log(item.values);

                // Para cada "variável"
                self.pontos.selectAll(".ponto" + curIndex)
                    // Ligar o valor dos pontos
                    .data(item.values)
                  // Inserir rectangulo
                    .attr("x", function (d) { return transformaX(d.date); })
                    .attr("y", function (d) { return transformaY(d.y); })
                    .attr("width", "2")
                    .attr("height", function (d) { return self.altura - transformaY(d.y); })
                        .style("opacity", "0")
                    // Compensar margem para eixo dos Y
                    .attr("transform", "translate(" + self.margem.esquerda / 2 + " ,0)")
                        // Adicionar tooltip
                        .on('mouseover', tip.show)
                        // Mostra tooltip
                        //tip.show();

                    //    // Mostra rectangulo
                    //    d3.select(this).style("fill", "red").style("opacity", "0.8");
                    //    // Mostra circulo/ponto onde o utilziar está focado
                    //    d3.select("." + self.id).select(".circuloFoco").style("display", null)
                    //        // Adicionar metade da largura de um rectangulo para centrar o ponto
                    //        .attr("transform", "translate(" + (parseInt($(this).attr("x")) + larguraRect /2) + "," + $(this).attr("y") + ")");

                    //})
                        .on('mouseout', tip.hide);
                //  {
                // Esconde tooltip
                //        tip.hide();

                // Esconde rectangulo
                //      d3.select(this).style("fill", "red").style("opacity", "0");
                // Esconde circulo/ponto
                //    d3.select("." + self.id).select(".circuloFoco").style("display", "none");
                //    });
                // Esconder

            });
        }
    }



    /// Retorna o objecto criado
    return GraficoArea;

})();