$("document").ready(function () {

    var random = Math.random();

    setInterval(function () {
        random = Number(Math.random()*100).toFixed(0);
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
            this.largura = 400 ///$(el).width();
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
            var self = this;

            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
            // Inicializar o raio
            self.raio = Math.min(self.largura, self.altura) / 2;
            // Inicializar toolTip a true
            self.mostraToolTip = true;

            self.valor = valor;
            self.valorLimite = valorLimite;
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


            if (self.valor >= self.valorLimite) {
                self.svg.select(".valorCompara")
                    .transition()
                    .attr("r", "15")
                      .style("fill", "green");
            } else {
                self.svg.select(".valorCompara")
                    .transition()
                    .attr("r", "5")
                      .style("fill", "red");
            }
        }


        /// <summary>
        /// Constroi o HTML necessário para mostrar a informação ao utilizador
        /// </summary>
        KPI.prototype.ConstroiHTML = function (id) {
            var self = this;

            // Redefinimos a translação dos elementos para se enquadrarem no meio do SVG
            self.svg.attr("transform", "translate(" + (self.largura/2) + "," + (self.altura/2) + ")");

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
                .attr("dy", "4em")
                  .style("font-size", "1em")
                  .style("text-anchor", "middle")
                  .text("Valor Limite: "+self.valorLimite);

            // Insere circulo para melhor sinalizar estado dos dados
            self.svg.insert("circle")
                .attr("class", "valorCompara")
                .attr("cx", "3.5em")
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

            // Constroi SVG
            self.ConstroiSVG(id, self);
            // Constroi elementos necessários do HTML
            self.ConstroiHTML(id);
            // Começa o ciclo de busca de dados
            self.InsereDados();
            // Atualiza o valorLimite
            self.Atualiza();
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

    teste2 = new KPI("oi", "ola", 20, 20, 400, 400);
    teste2.ConstroiGrafico("unico");

})