$("document").ready(function () {

    // Web.config modificado para permitir ficheiros JSON

    //$.getJSON("http://localhost:57574/Website/JSON/ficheiro.JSON", function (json) {
    //    console.log(json);
    //});

    $.ajax({
        url: "http://localhost:57574/Website/JSON/ficheiro.JSON",
        success: function (resultado) {
            console.log(resultado.dadosSelecionados);
            $.each(resultado.dadosSelecionados, function (i, objecto) {
                console.log(objecto);
                $(".teste").append(objecto.nome + "-" + objecto.teste1 +"<br>");
            });
        }
    });
});