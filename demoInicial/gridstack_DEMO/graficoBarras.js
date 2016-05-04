$("document").ready(function(){

 // d3.selectAll("div")? console.log("d3 Loaded") : console.log("d3 not found");

 // Método de renderizar sempre que houver um "resize" ou deslocação, ou um mouse up
 // $(document.body).on('click', '.update-widget' ,function(event){
 //   // Timeout para dar tempo, caso a janela tenha que fazer resize para o original
 //   setTimeout(graficoBarras.render, 50);
 // });

 $(document).on("click", ".update-widget", function() {
   setTimeout(graficoBarras.render($(this).parent()), 50);
 });

 /* --------------------------------------------------------- */

 var graficoBarras = (function() {

  var corAuxiliar = "brown",
      corPrincipal = "red",
      breakpoint = 350,
      margin = {top: 20, right: 50, bottom: 50, left: 50},
      colors = d3.scale.category20(),
      width = $(".wrapper").width() - margin.left - margin.right,
      height = $(".wrapper").height() - margin.top - margin.bottom,
      y, x, dataSelected, data1, data2, bar, barWidth, xAxis, yAxis, svg;

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

    data2 = [
        {nome: "a", numero: 1034 },
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

  function buildScaleX() {
    x = d3.scale.ordinal()
      .domain(dataSelected.map(function(d) { return d.nome; }))
      .rangeRoundBands([0, width], 0.1);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  }

  function buildScaleY() {
    y = d3.scale.linear()
      .domain([0, d3.max(dataSelected, function(d){ return d.numero; })])
      .range([height, 0]);

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);
  }

  function buildSVG(div) {
    // Insere area de SVG
    svg = d3.select(div).select(".wrapper").insert("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  function inserirEixoX() {
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("dx", "-2em")
      .attr("dy", ".5em")
      .attr("transform", "rotate(-35)" );
  }

  function inserirEixoY() {
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate(55, 0)")
      .attr("y", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
  }

  function inserirDados() {
    svg.selectAll(".bar")
      .data(dataSelected)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.nome); })
      .attr("y", function(d) { return y(d.numero); })
      .attr("height", function(d) { return height - y(d.numero); })
      .attr("width", x.rangeBand());
  }

  function buildGraph(div) {
    buildScaleY();
    buildScaleX();
    buildSVG(div);
    inserirDados();
    inserirEixoY();
    inserirEixoX();
  }

  function render(self) {
    // Volta a redefinir o SVG com o widget que foi selecionado para ser updated
    svg = d3.select("[name="+self.parent().attr("name")+"]").select(".wrapper");

    // Atualizar dimensões conforme a "widget"
    updateDimensions(self);

    // Atualizar escala
    updateScale();

    // Remove as barras caso não haja elementos suficientes para preencher


    //update svg elements to new dimensions
    d3.select("#main-gridstack").select("[name="+self.parent().attr("name")+"]").select(".wrapper svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Numero de representações nos eixos de acordo com o tamanho do widget
    if(height > 300){
      yAxis.ticks(10);
    }
    if(height <= 300){
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

    svg.select(".x.axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("dx", "-2em")
      .attr("dy", ".5em")
      .attr("transform", "rotate(-35)" );

    svg.select(".y.axis")
      .call(yAxis);

      // Para fazer update ao grafico de linha
      // svg.select(".line")
      //   .attr('d', valueline(data));
      update();
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

  function updateDimensions(self) {
    // width = (winWidth) - margin.left - margin.right;
    width = self.width();

    // Se for maior for que a sua altura original, volta ao seu Max
    if(width > self.width() - margin.left - margin.right) {
      width = self.width() - margin.right - margin.left;
    }

    height = self.height();

    if(height > self.height() - margin.top - margin.bottom - 20) {
      /* Retiramos 30 pixeis da margem por causa dos nomes estarem num angulo diferente, logo ocupam mais espaço*/
      height = self.height() - margin.top - margin.bottom - 20;
    }
  }

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

    svg.selectAll(".bar").data(dataSelected)
      .exit()
      .remove();
  }

  return{
    buildGraph : buildGraph,
    render : render
  };
 })();

 //Botão para desenhar o gráfico no widget escolhido
 $(".desenha-grafico").click(function() {
   graficoBarras.buildGraph("[name="+$(".dropdown-widget").find(":selected").text()+"]");
   console.log();
   $("[name="+$(".dropdown-widget").find(":selected").text()+"]").find("g").children('rect').attr("title", "teste 1 teste 1 teste 1 teste 1 teste 1 teste 1 ");
   $("[name="+$(".dropdown-widget").find(":selected").text()+"]").find("g").children('rect').tooltip({html:true, container:'body'});
 });

});
