$("document").ready(function () {

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
    /// Classe Tabela
    /// Module Pattern
    /// </summary>
    var Tabela = (function () {

        // Vai guardar a referencia da dataTable
        var tabela,
            // opcoes para a tabela
            opcoesEstilo = { columnDefs:[] },
            // Nomes dos dados, to-do
            colunas = ["nome", "teste1", "id"],
            // Titulo das colunas
            tituloColunas = ["nome", "valores", "id"],
            // Também possível utilizar CDN - https://www.datatables.net/plug-ins/i18n/ (Lista de Linguagens)
            linguagem = {
                "sProcessing":   "A processar...",
                "sLengthMenu":   "Mostrar _MENU_ registos",
                "sZeroRecords":  "Não foram encontrados resultados",
                "sInfo":         "Mostrando de _START_ até _END_ de _TOTAL_ registos",
                "sInfoEmpty":    "Mostrando de 0 até 0 de 0 registos",
                "sInfoFiltered": "(filtrado de _MAX_ registos no total)",
                "sInfoPostFix":  "",
                "sSearch":       "Procurar:",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext":     "Seguinte",
                    "sLast":     "Último"
                }
            }

        /// <summary>
        /// Método construtor para a classe Tabela, chama o construtor do Widget 
        /// </summary>
        function Tabela(titulo, widgetAltura, widgetLargura, widgetX, widgetY) {
            // Construtor de Widget é chamado
            Widget.call(this, titulo, widgetAltura, widgetLargura, widgetX, widgetY);
        };


        /// <summary>
        /// Herança é realizada através do método Herda
        /// </summary>
        Herda(Tabela, Widget);


        /// <summary>
        /// Adapta os dados e acrescenta-os ao plugin das dataTables
        /// </summary>
        Tabela.prototype.InsereDados = function (id) {
            var self = this;

            // Passar tudo para opcoes de estilo? to-do
            opcoesEstilo.columnDefs.push({
                targets: [1, 2],
                className: "dt-body-center"
            });

            // Selecionado o id da table
            tabela = $("#" + id).DataTable({
                // Apontar para onde estão os dados
                data: dadosSelecionados,
                // Especificar as colunas to-do
                columns: self.ConstroiColuna(),
                "language": linguagem,
                // Método para ligar as definições aqui to-do
                columnDefs : opcoesEstilo.columnDefs
            });

        }


        /// <summary>
        /// "Constroi" as colunas para inserir na tabela
        /// </summary>
        Tabela.prototype.ConstroiColuna = function() {
            // to-do enviar titulo da coluna?

            // Guarda a informação que vai ser enviada
            var colunasTabela=[];

            // Caso o numero de colunas seja igual ao numero de titulos disponiveis
            if(colunas.length === tituloColunas.length) {
                // Para cada valor dentro do array coluna
                colunas.forEach (function (valorColuna, curIndex) {
                    // Acrescentar a especificação
                    colunasTabela.push({
                        data: valorColuna, title: tituloColunas[curIndex]
                    })
                });
            // Senão não utiliza titulos
            } else {
                // Para cada valor dentro do array coluna
                colunas.forEach (function (valorColuna, curIndex) {
                    // Acrescentar a especificação para a tabela
                    colunasTabela.push({
                        data: valorColuna
                    })
                });
            }


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

            // Inserir dados na tabela
            self.InsereDados(id);

        }


        /// <summary>
        /// Esconde a coluna selecionada pelo utilizador
        /// </summary>
        Tabela.prototype.EscondeColuna = function (id, coluna) {
            var self = this;

            $(".escondeColuna").on( "click","li", function (e) {

                // Vai buscar o numero da coluna a remover
                var column = tabela.column($(this).find(".valor").attr("value"));
 
                // Inverte visibilidade
                column.visible( ! column.visible() );
            } );

        }


        return Tabela;

    })();

    teste2 = new Tabela("oi", "ola", 20, 20, 400, 400);
    teste2.ConstroiGrafico("table_id");
    teste2.EscondeColuna("table_id");
});