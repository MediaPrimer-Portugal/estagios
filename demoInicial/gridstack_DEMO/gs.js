  // IIFE - Immediately Invoked Function Expression
  (function(yourcode) {
    // The global jQuery object is passed as a parameter
  	yourcode(window.jQuery, window, document);

  }(function($, window, document) {

   // The $ is now locally scoped

   // Listen for the jQuery ready event on the document
   $(function() {
     // The DOM is ready!
   });

  (window.jQuery)? console.log("jquery loaded") : console.log("jquery not found");
  var bs = $().modal;
  typeof bs === "function"? console.log("bootstrap ready") : console.log("bootstrap not ready")

  // DADOS PARA CONSTRUCAO DE TABELA DE GRAFICOS
  var dados = function(){
    var serialized,
        tabela = "",
        graficos = [ "pieChart", "table", "values", "sparkline", "valorComPar",
    "values", "graficoHorizontal", "win/loss chart", "donutChart" ];

    var createTable = function(){
        tabela = "<div id=\"graphTable\"></div>"
    }

    var fillTable = function(grid){
      var i = 0,
          el,
          table;

      while( i < graficos.length){
        el = "<div class=\"grid-stack-item\" name=\""+ graficos[i]+"\" data-gs-auto-position=\"true\" data-gs-width=\"1\" nome=\"sidebar-widget\" data-gs-locked=\"true\" data-gs-height=\"1\">"+
        "<div class=\"grid-stack-item-content box\" >"+ graficos[i] + "<div class=\"wrapper\"></div><button type=\"button\" class=\"update-widget\"><i class=\"glyphicon glyphicon-refresh\"></i></button>" +
        "<button type=\"button\" class=\"close-button\"><i class=\"glyphicon glyphicon-remove\"></i></button>" +
        "</div></div>";
        grid.addWidget(el, 0, 0, 1, 1, true);

        i++;
      }
    }

    var getTable = function(){
      tabela = "<div id=\"popover-gridstack\" class=\"grid-stack\"></div>"
      return tabela;
    }

    var setSerialized = function(dashboard){
      serialized = dashboard;
    }

    var getSerialized = function(){
      return serialized;
    }

    var getGraficos = function(){
      return graficos;
    };
    return{
      getGraficos : getGraficos,
      getSerialized : getSerialized,
      createTable : createTable,
      fillTable : fillTable,
      getTable : getTable,
      setSerialized : setSerialized
    };
  }();
  dados.createTable();


  // Remover handles dos widgets que não estão resizable
  $("#sidebar-gridstack").on("mousedown", ".grid-stack-item", function(){
    $("#sidebar-gridstack .grid-stack-item").children(":hidden").remove();
  });

  /*
   *  BARRA DE FEEDBACK
   */

   // Inicializar barra sem display
   $(".barra-feedback").toggle();

   // Aparece barra de Aviso
   $(".barra-erro").click(function(){
     $(".barra-feedback").slideDown('400');
   });

   // Remover a barra de aviso
   $(".barra-feedback .close-button").click(function(){
     $(this).parent().slideUp("400");
   });


  /*
   *  SIDEBAR
   */

   // Display da sidebar ao premir o trigger da nav
   $(".nav-trigger").click(function(){
     if($(this).is(":checked")){
       $(".sidebar").css("display", "block");
     }
     else {
       $(".sidebar").css("display", "none");
     }
   });

  // Efeito de texto nos widgets
  $(".grafico-descricao").toggle();

   $(".grafico-trigger").hover(function(){
     $(this).children(".grafico-descricao").toggle();
   },
   function(){
     $(this).children(".grafico-descricao").toggle();
   });


  /*
   *  GRIDSTACK
   */

  // Criação da grid
  $(function () {
      var options = {
          /* removable: ".trash",  A testar */
          verticalMargin: 2,
          float: true,
          minWidth: 680,
          acceptWidgets: ".grid-stack-item",
          resizable: {
            handles: "sw, se"
          },
          swapGridWidth: 2,
          swapGridHeight: 2
         },
         optionsSidebar = {
           width: 1,
           removable: false,
           cellHeight: 100,
           verticalMargin: 2,
           disableResize: true,
         };

      $("#main-gridstack").gridstack(options);
      $("#sidebar-gridstack").gridstack(optionsSidebar);

      $("#sidebar-gridstack").data("gridstack").locked(".grid-stack-item", false);
  });

  // Navbar Button - Adicionar um Widget
  $(".add-teste").on("click", function(){
    var i = 0,
        contador = 3,
        tabela,
        graficos = dados.getGraficos(),
        nome = "widget-table";

    tabela = "<div class="+"graphTable table-responsive"+"><table class="+nome+"><tr>";

    while(i < graficos.length){
      if(contador%3 === 0 && contador!== 3){
        tabela+="</tr><tr>";
      }
      tabela+="<td><a href=" + "#" + ">" + graficos[i] + "</a></td>";

      contador++;
      i++;
    }
    tabela+="</tr></table></div>";

    $("#myModal").modal('show');
    $(".tabelaGraficos").append(tabela);
  });

  // Remove um widget
  $(document).on("click", ".close-button", function() {
    var grid = $('.grid-stack').data('gridstack');
    el = $(this).closest('.grid-stack-item')

    if(confirm("Quer mesmo apagar?")){
      grid.removeWidget(el);
      $(".barra-feedback").slideDown('400');
      $(".barra-feedback .feedback-aviso").text("Widget "+ el.text() +" removido com sucesso");
      setTimeout(function(){
        $(".barra-feedback").slideUp("600");
      }, 1800);
    }
  });

  // Navbar Button - Mostra/Esconde a gridstack
  $(".gridstack-show").click(function(){
    $(".grid-stack").toggle();
    //$(".grid-stack").data("gridstack").setGridWidth(5, false);
  });

  // Navbar Button - Apagar todos os Widgets dentro da grid-stack
  $(".widgets-delete").click(function(){
    $(".grid-stack").data("gridstack").removeAll();
  });

  // Trash a aparecer no mousedown
  $(".grid-stack-item").on("mousedown", function(){
    //console.log("teste");
    //$(".site-wrap").prepend("<div class=\"trash ui-droppable\"></div>")
    $(".trash").toggle();
  });


  /*
   * POPOVER
   *
   * Popover Widgets - Tabela Dinamica, atraves dos recursos de graficos, definido no inicio
   * do documento  to-do
    //  */
    //
    // $(".widgets-popover").popover({
    //   html : true,
    //   trigger: "click",
    //   animation: false,
    //   content: function(){
    //     var tabela;
    //
    //     tabela = "<div id=\"graphTable\" class=\"grid-stack\"></div>";
    //     return tabela;
    //   }
    // }).on("mouseenter", function () {
    //     var i = 0,
    //         _this = this,
    //         grid,
    //         options = {
    //           cellHeight: 80,
    //           verticalMargin: 2,
    //           width: 8
    //         };
    //
    //     /*
    //      * Cria tabela na popover
    //      */
    //     $(this).popover("show");
    //
    //     $(".nav #graphTable").gridstack(options);
    //     var grid = $("#graphTable").data("gridstack");
    //
    //     while(i < dados.getGraficos().length){
    //       var el = "<div class=\"grid-stack-item box\">"+"</div>";
    //       grid.addWidget(el, 0, 0, 1, 1, true);
    //
    //       i++;
    //     }
    //     grid.enable();
    //
    //     $(".popover").on("mouseleave", function() {
    //         $(_this).popover('hide');
    //     });
    //
    //   }).on("mouseleave", function() {
    //     var _this = this;
    //
    //     setTimeout(function () {
    //       if (!$(".popover:hover").length) {
    //           $(_this).popover("hide");
    //       }
    //     }, 100);
    // });


  /*
   * Criação e Destruição da tabela na sidebar
   */

  $(".nav-trigger").change(function(){
    if($(this).is(":checked")){
      dados.fillTable($("#sidebar-gridstack").data("gridstack"));
    }
  });

    // Gera as opções para a dropdownlist
    $("#main-gridstack > .grid-stack-item").each(function(){
      $(".dropdown-widget").append("<option value="+ $(this).attr("name") +">"+ $(this).attr("name") +"</option>");
    });

}));
