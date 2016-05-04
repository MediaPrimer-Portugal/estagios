$("document").ready(function(){


  // $(document).on("click", ".update-widget", function() {
  //   setTimeout(pieChart.update($(this).parent()), 50);
  // });

var pieChart = (function() {

  var width,
      height,
      radius = Math.min(width, height) / 2,
      margin = {top: 20, right: 50, bottom: 50, left: 50},
      dataSelected, arc, path, pie, svg;

  dataSelected = [
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

  var color = d3.scale.category10();

  function gerador() {
    pie = d3.layout.pie()
    .value(function(d) { return d.numero; })
    .sort(null);

    arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(radius);
  }

  function buildSVG(div) {
    svg = d3.select(div).select(".wrapper").insert("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('viewBox','0 0 '+ radius + ' ' + radius)
      .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");
  }

  function inserirDados() {
    path = svg.datum(dataSelected).selectAll("path")
    .data(pie)
    .enter().append("path")
    .attr("class", "slice")
    .attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .each(function(d) { this._current = d; }); // store the initial angles
  }

  function buildGraph(div) {
    width = $(div).width(),
    height = $(div).height()

    gerador();
    buildSVG(div);
    inserirDados();
  }

  function update() {
    // Constroi uma funcao pie
    var pie = d3.layout.pie()
        .value(function(d) { return d.numero; })

    // Calcula as "fatias" para o pie chart
    var slices = pie(dataSelected),
        selector = "[name="+div.parent().attr("name")+"]",
        path = d3.select("#main-gridstack").select(selector).select(".wrapper").selectAll("path")
                .data(slices);

    // Inserção de elementos
    path.enter()
        .append("path")
          .attr("d", arc)
          .attr("fill", function(d){
            return color(d.data.nome);
          })

    // Update de elementos
    path.transition()
        .attr("d", arc);

    // Remoção de elementos
    path.exit()
        .remove()
        .transition();
  }

  function remove(div) {
    dataSelected.pop();
    //update(div);
  }

  function increase(div) {
    dataSelected[1].numero += 2;
    //update(div);
  }

  /**
   * Store the displayed angles in _current.
   * Then, interpolate from _current to the new angles.
   * During the transition, _current is updated in-place by d3.interpolate.
   */
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    }
  }

  return{
    buildGraph : buildGraph,
    update : update,
    remove : remove,
    increase : increase
  }
    })();

  // // Botão para desenhar o gráfico no widget escolhido
  // $(".desenha-grafico").click(function() {
  //   pieChart.buildGraph("[name="+ $(".dropdown-widget").find(":selected").text()+"]");
  // });

  // Botões para testar update()
  $(".increase").click(function(){
    pieChart.increase("[name="+$(".dropdown-widget").find(":selected").text()+"]");
  });

  $(".remove").click(function(){
    pieChart.remove("[name="+$(".dropdown-widget").find(":selected").text()+"]");
  });

});
