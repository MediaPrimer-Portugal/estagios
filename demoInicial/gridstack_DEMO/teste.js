$("document").ready(function(){
  var classTeste;

  var Widget = function(widgetWidth, widgetHeight, widgetX, widgetY, id){
    var width, height, svg, dados, opcoes, x, xAxis, svg;

    function modificaWidth(){
      this.width = 500;
    }

    Widget.prototype.buildWidth = function() {
      return modificaWidth.call(this);
    }
  };

  Widget.prototype.getId = function() {
    return "o meu id = " + this.id;
  };

  Widget.prototype.modifica = function() {
    this.width = 100;
  };

  Widget.prototype.updateScale = function() {
    this.x = [1,2,3];
    this.xAxis = [50,3];
  };

  classTeste = new Widget(10,20,30,40,"ola");

  classTeste.buildWidth();
  classTeste.modifica();


  




});
