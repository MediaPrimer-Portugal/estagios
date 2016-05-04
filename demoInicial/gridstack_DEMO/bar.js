// Usar load para dar tempo ao D3 de executar
$("document").ready(function(){
  (window.jQuery)? console.log("jQuery Loaded") : console.log("jQuery not found");
  d3.selectAll("div")? console.log("d3 Loaded") : console.log("d3 not found");

  // Listener para voltar a desenhar a janela caso esta seja resized pelo utilizador
  window.addEventListener('resize', function(){
    render();
  });

  // Método de renderizar sempre que houver um "resize" ou deslocação, ou um mouse up
  $(document.body).on('mouseup', '#main-gridstack > .grid-stack-item' ,function(event){
    // Timeout para dar tempo, caso a janela tenha que fazer resize para o original
    setTimeout(render, 100);
  });

  var sort = false,
      corAuxiliar = "brown",
      corPrincipal = "red",
      breakpoint = 350,
      margin = {top: 20, right: 50, bottom: 50, left: 50},
      width = $(".wrapper").width() - margin.left - margin.right,
      height = $(".wrapper").height() - margin.top - margin.bottom,
      colors = d3.scale.category20(),
      y, x, dataSelected, data1, data2, chart, chartWrapper, bar, barWidth;

  dataSelected = data1 = [
            {nome: "janeiro", numero: 10 },
            {nome: "fev", numero: 5 },
            {nome: "março", numero: 25 },
            {nome: "abril", numero: 50 },
            {nome: "maio", numero: 6 },
            {nome: "junho", numero: 37 },
            {nome: "julho", numero: 16 },
            {nome: "agosto", numero: 24},
            {nome: "setembro", numero: 19},
            {nome: "outubro", numero: 13},
            {nome: "novembro", numero: 17},
            {nome: "dezembro", numero: 31},
         ];

  data2 = [ {nome: "a", numero: 1034 },
            {nome: "e", numero: 5445 },
            {nome: "q", numero: 2532 },
            {nome: "f", numero: 5054 },
            {nome: "b", numero: 6987 },
            {nome: "n", numero: 3723 },
            {nome: "i", numero: 16345 },
            {nome: "o", numero: 2412 },
            {nome: "p", numero: 19222 },
            {nome: "m", numero: 13353 },
            {nome: "h", numero: 1734 },
            {nome: "w", numero: 6433 },
          ];

  x = d3.scale.ordinal()
    .domain(dataSelected.map(function(d) { return d.nome; }))
    .rangeRoundBands([0, width], 0.1);

  y = d3.scale.linear()
    .domain([0, d3.max(dataSelected, function(d){ return d.numero; })])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  // Insere area de SVG
  var svg = d3.selectAll(".wrapper").insert("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Insere Eixo dos xx
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("dx", "-2em")
    .attr("dy", ".5em")
    .attr("transform", "rotate(-35)" );

  // Insere Eixo dos yy
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "translate(55, 0)")
    .attr("y", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

  // Insere Barras conforme a data fornecida
  svg.selectAll(".bar")
    .data(dataSelected)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.nome); })
    .attr("y", function(d) { return y(d.numero); })
    .attr("height", function(d) { return height - y(d.numero); })
    .attr("width", x.rangeBand());

    /*
     *    LINE CHART -------------------------------------------------------
     */
    // var valueline = d3.svg.line()
    //     .x(function(d) { return x(d.nome); })
    //     .y(function(d) { return y(d.numero); });
    //
    // svg.append("path")
    //     .attr("class", "line")
    //     .attr("d", valueline(data));

    // Ponto = circulo
    // svg.selectAll(".bar")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("r", 3.5)
    //     .attr("cx", function(d) { return x(d.nome); })
    //     .attr("cy", function(d) { return y(d.numero); });

    // Ponto = Quadrado
    // svg.selectAll(".bar")
    //         .data(data)
    //       .enter().append("rect")
    //           .attr("class", "bar")
    //           .attr("x", function(d) { return x(d.nome) -5; })
    //           .attr("y", function(d) { return y(d.numero) -5; })
    //           .attr("height", 10)
    //           .attr("width", 10);

    /*------------------------------------------------------------------------*/

  /*
   * FUNÇÃO PARA INDICAR QUAL BARRA ESTÁ A SER INDICADA NO ECRA ( HOVER )
   */
  $(".bar").hover(function(){
    d3.select(this)
      .transition()
      .duration(500);

    svg.append("line")
      .attr({
        "class" : "linha",
        "y1" : (parseInt($(this).attr("y"))+2),
        "y2" : (parseInt($(this).attr("y"))+2),
        "x1" : 0,
        "x2" : (parseInt($(this).attr("x"))-2),
        "stroke" : corAuxiliar,
        "stroke-width" : "1"
      });

    var pontos  =  (parseInt($(this).attr("x")) - 6) + "," + (parseInt($(this).attr("y")) + 6) + " ";
        pontos +=  (parseInt($(this).attr("x"))+1) + "," + (parseInt($(this).attr("y")) + 2 ) + " ";
        pontos +=  (parseInt($(this).attr("x")) - 6) + "," + (parseInt($(this).attr("y")) - 3) + " ";

    svg.append("polygon")
      .attr({
        "class" : "triangulo",
        "fill" : corAuxiliar,
        "points" : pontos
      });
  },
    function(){
      /* Remove Seta */
      svg.select(".linha")
        .remove();

      svg.select(".triangulo")
        .remove();
      }
  );

  /*
   * FUNÇÃRO PARA ORDENAR AS BARRAS
   */
  $(".sort").click(function(){
    if(!sort){
      sort = !sort;

      var x0 = x.domain(dataSelected.sort(function(a, b) { return b.numero - a.numero; } )
      .map(function(d) { return d.nome; }));

      svg.selectAll(".bar")
        .transition("order")
        .duration(600)
        .attr("fill", function(d, i){ return colors(i); })
        .attr("x", function(d) { return x0(d.nome); });

        //render();
      }
      else{
        sort = !sort;
        var x0 = x.domain(dataSelected.sort(function(a, b) { return d3.ascending(a.nome, b.nome); } )
        .map(function(d) { return d.nome; }));

        svg.selectAll(".bar")
          .transition("order")
          .duration(800)
          .attr("fill", function(d, i){ return colors(i); })
          .attr("x", function(d) { return x0(d.nome);
        });

        //render();
      }
  });


  /*
   * FUNÇÕES DE UPDATE (gráfico/escala) ----------------------------------------
   */
   function update(){
     svg.selectAll(".bar")
       .data(dataSelected)
     .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.nome); })
       .attr("y", function(d) { return y(d.numero); })
       .attr("height", function(d) { return height - y(d.numero); })
       .attr("width", x.rangeBand());

     svg.selectAll(".bar")
       .attr("x", function(d) { return x(d.nome); })
       .attr("y", function(d) { return y(d.numero); })
       .attr("height", function(d) { return height - y(d.numero); })
       .attr("width", x.rangeBand());
   };

   function updateScale(){
     x = d3.scale.ordinal()
     .domain(dataSelected.map(function(d) { return d.nome; }))
     .rangeRoundBands([0, width], 0.1);

     y = d3.scale.linear()
      .domain([0, d3.max(dataSelected, function(d){ return d.numero; })])
      .range([height, 0]);

      //update x and y scales to new dimensions
      x.rangeRoundBands([0, width], 0.1);
      y.range([height, 0]);

     //update the axis and line
     yAxis.scale(y);
     xAxis.scale(x);
   }

    /*
     * FUNÇÃO PARA RENDERIZAR O GRAFICO
     */
    var render = function() {
      console.log("A renderizar");
      //get dimensions based on window size
      updateDimensions($(".wrapper").width());

      updateScale();

      // Remove as barras caso não haja elementos suficientes para preencher
      svg.selectAll(".bar").data(dataSelected)
        .exit()
        .remove();

      //update svg elements to new dimensions
      d3.select("body").select(".wrapper svg")
        .attr("width", width + margin.left+margin.right)
        .attr("height", height + margin.top+margin.bottom);

      // Numero de representações nos eixos de acordo com o tamanho do widget
      if(height > 250){
        yAxis.ticks(10);
      }
      if(height < 300){
        yAxis.ticks(5);
      }
      if(height <= 150){
        yAxis.ticks(2);
      }

      if(width >= breakpoint){
        xAxis.tickValues(x.domain());
      }
      if(width <= breakpoint){
        xAxis.tickValues(x.domain().filter( function(d, i) { return !(i % 2); }));
      }
      if(width < (breakpoint - 100)){
        xAxis.tickValues(x.domain().filter( function(d, i) { return !(i % 5); }));
      }

      // Para fazer update ao grafico de linha
      // svg.select(".line")
      //   .attr('d', valueline(data));
      update();

      svg.select(".x.axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .attr("dx", "-2em")
        .attr("dy", ".5em")
        .attr("transform", "rotate(-35)" );

      svg.select(".y.axis")
        .call(yAxis);
    };

    function updateDimensions(winWidth) {
      // width = (winWidth) - margin.left - margin.right;
      width = winWidth;

      // Se for maior for que a sua altura original, volta ao seu Max
      if(width > $(".wrapper").parent().width() - margin.left - margin.right) {
        width = $(".wrapper").parent().width() - margin.right - margin.left;
      }

      height = $(".wrapper").parent().height();

      if(height > $(".wrapper").parent().height() - margin.top - margin.bottom - 20) {

        /* Retiramos 30 pixeis da margem por causa dos nomes estarem num angulo diferente, logo ocupam mais espaço*/
        height = $(".wrapper").parent().height() - margin.top - margin.bottom - 20;
      }
    };


    /*
     *   MUDANÇA DE COR ------------------------------------------------------
     */

    /* Criação do color picker */
    $(".spectrum").spectrum({
      color:"#f00",
      chooseText: "Escolher",
      change: function(color) {
        corPrincipal = color.toHexString();
        $(".bar").css("fill", color.toHexString());
      }
    });

    $(".spectrum2").spectrum({
      color:"#f00",
      chooseText: "Escolher",
      change: function(color) {
        corAuxiliar = color.toHexString();
      }
    });

    // Tratamento do Hover
    $(".bar").hover(function(){
      $(this).css("fill", corAuxiliar);
    },
    function(){
      $(this).css("fill", corPrincipal);
    });

    // Refresh
    // setInterval(function() {
    //   render();
    // },500);


    /*
     *  Manipulação de dados
     */

     $(".add-dados").click(function(){
       dataSelected[0].numero = $(".dados-janeiro").val();
     });

     $(".apaga-dados").click(function(){
       dataSelected.splice(0,1);
     });

     $(".dropdown-dados").on("change", function(){
       if($(".dropdown-dados").find(":selected").val() === "data2"){
         dataSelected = data2;
       }else {
         dataSelected = data1;
       }
     });
});
