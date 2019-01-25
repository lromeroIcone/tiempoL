function getFood(cat){
  var sc =	localStorage.getItem("school");
  $.ajax({
    url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
    type: "POST",
    data: {foodc: cat, sc:sc},

    success: function(data){
      $("#comlist").empty();
      var jsonObj = jQuery.parseJSON(data);
      var nombres = jsonObj[0].split("_");
      var precios = jsonObj[1].split("_");
      var ids = jsonObj[2].split("_");
      if(nombres[0]!=""){
        for(var i=0;i<nombres.length;i++){
          var extra = "";
          if(nombres[i].length >20){
            var extra = "...";
          }
          //$("#comlist").append('<li><p class="pname">'+nombres[i]+' <a class="aplus" href=""><i class="fa fa-plus "></i></a><span class="cants">0</span><a class="aminus" href=""><i class="fa fa-minus"></i></a><span class="price">$'+precios[i]+'</span></p> </li>');
          $("#comlist").append('<li><p class="pname"><span class="iname">'+nombres[i].substr(0,20)+extra+'</span> <a class="showi" data-prod="'+ids[i]+'" href="" ><img width="20px" src="img/lista.png" /></a><span class="price">$'+precios[i]+'</span></p> </li>');
        }
      }
      $.mobile.navigate( "#comida", {transition:"slide" });
    }
  });
}

function getCategories(){
  var esc = localStorage.getItem("school");
  $.ajax({
    url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
    type: "POST",
    data: {cats: esc},

    success: function(data){

      $("#categories").empty();
      var jsonObj = jQuery.parseJSON(data);

      for(var i=0;i<jsonObj.length;i++){
        if(i==0){
          $("#categories").append('<a  data-catg="'+jsonObj[i][0]+'" class="elm-cent"  ><img width="100%" src="img/'+jsonObj[i][1]+'" /></a>');
        }else{
        $("#categories").append('<a  data-catg="'+jsonObj[i][0]+'" class="elm-cent menusecs"  ><img width="100%" src="img/'+jsonObj[i][1]+'" /></a>');
        }
      }

    },
    error: function(data){
      swal("Error","Revisa tu conexión y vuelve a intentarlo","error")
    }
  });
}

function getOrders(){
  $("#orderlist").html("");
  var client = localStorage.getItem("user");
  $.ajax({
    url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
    type: "POST",
    data: {orders: 1,client: client},

    success: function(data){

      var jsonObj = jQuery.parseJSON(data);
      var productos = jsonObj[1].split("-");
      var tiempo = jsonObj[0].split(",");
      var total = jsonObj[2].split(",");
      var id = jsonObj[3].split(",");
      if(productos[0]!=""){
        $("#orderlist").append('<li><p class="tname">Productos <span class="pricet">Tiempo estimado</span> <span class="pricet">Total</span></p></li>');
        for(var i=0;i<tiempo.length;i++){
          $("#orderlist").append('<li><p class="pname"><span class="iname">'+productos[i]+'</span> <a id="'+id[i]+'" class="atimes" href=""><i class="fa fa-times "></i></a><span class="price">'+tiempo[i]+'</span> <span class="price">$'+total[i]+'</span></p></li>');
        }
      }
    },
    error: function(data){
        swal("Error","Revisa tu conexión y vuelve a intentarlo","error")
    }
  });
}

$(document).ready(function(){
  //console.log("Hola");
  var prods =new Array();
  var prices =new Array();
  var cants =new Array();
  var esps =new Array();
  var adic= new Array();
  var tiempo = new Date();
  var hora = tiempo.getHours();
  var minu = tiempo.getMinutes();
  var tos = hora+":"+ minu;
  $('#hora').val(tos);
  $('#elguarn').hide();
  //$('#elguarn').remove();

  if(localStorage.getItem("prods")!=null){
    $("#payOrder").prop("disabled",false);
  }
    
  $(document).on( "pagechange", function( event ) {
    prices =new Array();
    prods =new Array();
    cants =new Array();
    esps =new Array();
    adic= new Array();
    if($.mobile.activePage.attr('id')=="pedidos"){
      getOrders();
    }

    $(".fixAdd").children().children().text("$0.00");
  });
    
  document.addEventListener("backbutton", function(e){
    if($.mobile.activePage.is('#inicio')){

    } else {
      navigator.app.backHistory()
    }
  }, false);

  $(".promo").on('click',  function(e) {
    var cat = "promos"
    getFood(cat);
  });

  $("#categories").on('click', '.gtsec', function(e) {
    var cat = $(this).data("catg");
    getFood(cat);
  });

  $("#comlist").on('click', '.showi', function(e) {
    e.preventDefault();
    var idp = $(this).data("prod");
    $.ajax({
      url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
      type: "POST",
      data: {idp: idp},

      success: function(data){
        console.log(data);  
        var jsonObj = jQuery.parseJSON(data);          
        var l = jsonObj.length;
        if(l == 6){
          var options = jsonObj[3];
          var nuevos = jsonObj[4];
          console.log(nuevos);
          $("#igds").html("");
          $("#igds").append('<option>Elije tus ingredientes</option>');
          if(options.length>0){
            $("#igds-button").show();

            for(var i =0;i<options.length;i++){
              $("#igds").append('<option value="'+options[i][0]+'">'+options[i][1]+'</option>');
            }
          } else{
            $("#igds-button").hide();
          }
          $('#elguarn').show();
          /*if(nuevos.lenght>0){
            $('.descpr').after("<div class=\"ui-field-contain\" style=\"display: none; \" id=\"elguarn\">"+
              "<select name = \"guarnicion\" class=\"iselect\" id=\"guarns\" data-native-menu=\"false\" style=\"display: none;\" >"+
                "<option>Elije tu guarnición</option>"+
              "</select >"+
            "</div >");
          }*/
          if(nuevos[0] !=""){
            //if(nuevos != ""){
            $("#guarns").html("");
            $("#guarns").append('<option>Elige tus guarniciones</option>');
            $("#guarns-button").show();

            for(var j =0;j<nuevos.length;j++){
              console.log(nuevos[j]);
              $("#guarns").append('<option value="'+nuevos[j]+'">'+nuevos[j]+'</option>');
            }
          } else{
            $("#guarns-button").hide();
          }
          $("#igds").selectmenu("refresh");
          $("#guarns").selectmenu("refresh");
          $(".innerDiv").find(".namepr").text(jsonObj[0]);
          $(".innerDiv").find(".descpr").text("Descripción:");

          $(".innerDiv").find(".descpr").append("<br/>"+jsonObj[2]);
          $(".innerDiv").find(".price").text("$"+jsonObj[1]);
        } else {
          var options = jsonObj[3];
          var nuevos = jsonObj[4];
          console.log(nuevos.length);
          $("#igds").html("");
          $("#igds").append('<option>Elije tus ingredientes</option>');
          if(options.length>0){
            $("#igds-button").show();

            for(var i =0;i<options.length;i++){
              $("#igds").append('<option value="'+options[i][0]+'">'+options[i][1]+'</option>');
            }
          } else{
            $("#igds-button").hide();
          }
          /*if(nuevos.length > 0){
            $('.descpr').after("<div class=\"ui-field-contain\" style=\"display: none; \" id=\"elguarn\">" +
              "<select name = \"guarnicion\" class=\"iselect\" id=\"guarns\" data-native-menu=\"false\" style=\"display: none;\" >" +
              "<option>Elije tu guarnición</option>" +
              "</select >" +
              "</div >");
          }*/
          $('#elguarn').show();
          /*$("#guarns").html("");
          $("#guarns").append('<option>Elige tus guarniciones</option>');
          //if(nuevos.length>0){
          if(nuevos.length != null){
            $("#guarns-button").show();

            for(var j =0;j<nuevos.length;j++){
              $("#guarns").append('<option value="'+nuevos[j]+'">'+nuevos[j]+'</option>');
            }
          } else{
            $("#guarns-button").hide();
          }*/
          $("#igds").selectmenu("refresh");
          //$("#guarns").selectmenu("refresh");
          $(".innerDiv").find(".namepr").text(jsonObj[0]);
          $(".innerDiv").find(".descpr").text("Descripción:");

          $(".innerDiv").find(".descpr").append("<br/>"+jsonObj[2]);
          $(".innerDiv").find(".price").text("$"+jsonObj[1]);
        }
      },
      error: function(data){
        swal("Error","Revisa tu conexión y vuelve a intentarlo","error")
      }
    });
    $.mobile.navigate( "#prodi", { transition : "slideup",info: "info about the #foo hash" });
  });

  $(".addButton").click(function(){
    //$("#pedidoL").append('<li><p class="pname">'+text[0]+' <span class="price">$'+text[1]+'</span></p> </li>');
    if($(this).children("span").text()!=="$0.00"){
      if(localStorage.getItem("prods")==null){
        localStorage.setItem("prices",JSON.stringify(prices));
        localStorage.setItem("prods",JSON.stringify(prods));
        localStorage.setItem("cants",JSON.stringify(cants));
        localStorage.setItem("espf",JSON.stringify(esps));
        localStorage.setItem("adio",JSON.stringify(adic));
      }else{
        var prices1 = JSON.parse(localStorage.getItem("prices"));
        var prods1 = JSON.parse(localStorage.getItem("prods"));
        var cants1 = JSON.parse(localStorage.getItem("cants"));
        var esps1 = JSON.parse(localStorage.getItem("espf"));
        var adic1 = JSON.parse(localStorage.getItem("adio"));
        for(var i=0;i<prices.length;i++){
          if(prods1.indexOf(prods[i])==-1){
            prods1.push(prods[i]);
            prices1.push(prices[i]);
            cants1.push(cants[i]);
            esps1.push(esps[i]);
            adic1.push(adic[i]);
          } else{
            prices1[prods1.indexOf(prods[i])] = parseFloat(prices1[prods1.indexOf(prods[i])])+parseFloat(prices[i]);
            cants1[prods1.indexOf(prods[i])] +=1;
            esps1[prods1.indexOf(prods[i])] = esps[i];
            adic1[prods1.indexOf(prods[i])] = adic[i];
          }
        }

        localStorage.setItem("prices",JSON.stringify(prices1));
        localStorage.setItem("prods",JSON.stringify(prods1));
        localStorage.setItem("cants",JSON.stringify(cants1));
        localStorage.setItem("espf",JSON.stringify(esps1));
        localStorage.setItem("adio",JSON.stringify(adic1));
      }
      $(".cants").text("0");
      $(this).children().text("$0.00");
      swal("Listo","Se agrego tu orden al carrito","success");
      $("#pedidoL").html("");
      $("#payOrder").prop("disabled",false);

      addToCart();
    } else{
      swal("Sin productos","Escoge la cantidad del producto que deseas agregar a tu orden","info");
    }
  });

  $.fn.ignore = function(sel){
    return this.clone().children(sel||">*").remove().end();
  };

  $(".innerDiv").on('change', '.iselect', function(e) {
    var name= $(this).parent().parent().parent().find(".namepr").text();
    var text2= $(this).parent().parent().parent().find(".pname").find(".price").text().split("$");
    var val = $(this).val();
    var ex = $(this).val();
    val = val.toString();
    ex = val.toString();
    if(prods.indexOf(name)==-1){
      prods.push(name);
      esps.push(val);
      prices.push(text2[1]);
      cants.push(0);
      adic.push(ex);
    }else{
      esps[prods.indexOf(name)] = val;
      adic[prods.indexOf(name)] = ex;
    }
  });

  $(".innerDiv").on('click', '.aplus', function(e) {
    var name= $(this).parent().parent().find(".namepr").text();

    var text2= $(this).parent().text().split("$");
    var $cant= $(this).parent().find(".cants");

    var ctext = parseInt($cant.text())+1;
    $cant.text(ctext);
    var $add = $(this).parent().parent().parent().parent().parent().parent().find(".fixAdd");

    if(prods.indexOf(name)==-1){
      prods.push(name);
      esps.push("0");
      adic.push("0");
      prices.push(text2[1]);
      cants.push(1);
    } else{
      cants[prods.indexOf(name)] +=1;
    }

    var total = 0;
    for(var i=0; i<prices.length;i++){
      total +=  parseFloat(prices[i])*cants[i];
    }
    $add.children().children().text("$"+total.toFixed(2));

  });

  $(".innerDiv").on('click', '.aminus', function(e) {
    var name= $(this).parent().parent().find(".namepr").text();
    var text2= $(this).parent().text().split("$");
    var $add = $(this).parent().parent().parent().parent().parent().parent().find(".fixAdd");
    var $cant= $(this).parent().find(".cants");
    if(parseInt($cant.text())>0){

    	var ctext = parseInt($cant.text())-1;
    	$cant.text(ctext);
    	var total = 0;

    	if(prods.indexOf(name)!=-1){
        cants[prods.indexOf(name)] -=1;
    	}
    	for(var i=0; i<prices.length;i++){
    		total +=  parseFloat(prices[i])*cants[i];
    	}

    	$add.children().children().text("$"+total.toFixed(2));
    }
  });
  
  $("#orderlist").on('click', '.atimes', function(e) {
    var elm = $(this).attr("id");
    swal({
      title: "¿Está seguro de cancelar este pedido?",
      text: "Recuerde que puede haber multas por cancelación de pedido.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      closeOnConfirm: false,
      cancelButtonText: "Cancelar",
    },
    function(isConfirm){
	    if(isConfirm){
 	      canOrder(elm);
      }
    });

  });
  
  $("#pedidoL").on('click', '.citem', function(e) {
    var elm = $(this).data("item");
    swal({
      title: "¿Está seguro que desea eliminar este producto de su orden?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      closeOnConfirm: false,
      cancelButtonText: "Cancelar",
    },
    function(isConfirm){
	    if(isConfirm){
 	      removeItem(elm);
      }
    });

  });
  
  if(localStorage.getItem("prods")!=null){
    addToCart();
  } else{
    $("#payOrder").prop("disabled",true);
  }
  
  function addToCart(){
    $("#payOrder").prop("disabled",false);
    $("#total").html("");
    $("#pedidoL").html("");
    var total = 0;
    var tc = 0;
    var prices1 =JSON.parse( localStorage.getItem("prices"));
    var prods1 =JSON.parse( localStorage.getItem("prods"));
    var cants1 =JSON.parse( localStorage.getItem("cants"));
    var esps1 =JSON.parse( localStorage.getItem("espf"));
    var adic1 =JSON.parse( localStorage.getItem("adio"));
    if(prods1.length==0){
      $("#payOrder").prop("disabled",true);
    }
    $("#pedidoL").append('<li><p class="pname">Resumen de orden <span id="totalT" class="price"></span></p> </li>');
    for(var i=0;i<prices1.length;i++){
      tc  = tc+parseInt(cants1[i]);
      total = total + parseInt(prices1[i]*cants1[i]);
      $("#pedidoL").append('<li><p class="pname"><span class="iname">'+prods1[i]+' ('+cants1[i]+')</span><span class="price">$'+parseFloat(prices1[i]).toFixed(2)+'&nbsp;<a data-item="'+i+'" class="citem" href=""><i class="fa fa-times "></i></a></span></p> </li>');
    }
    //var h = getHours();
    //var x = $("#hora").min = h;
    $("#total").append('<p>Total de orden ('+tc+' artículo(s))</p><h1 >$'+total+'</h1>');
  }
    
  function canOrder(elm){
    $.ajax({
      url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
	    type: "POST",
	    data: {cancel:elm},

	    success: function(data){

        if(data.toString()!=="error"){
          getOrders();
          swal("Listo","Tu orden ha sido cancelada. Tu penalización fue de: $"+data.toString(),"success");
        } else{
          swal("Error","Ocurrió un error al cancelar tu orden, porfavor intentalo de nuevo.","error");
        }
      },
	    error: function(data){
		    swal("Error","Revisa tu conexión y vuelve a intentarlo","error")
	    }
    });
  }
  
  function removeItem(elm){
    var prices1 =JSON.parse( localStorage.getItem("prices"));
    var prods1 =JSON.parse( localStorage.getItem("prods"));
    var cants1 =JSON.parse( localStorage.getItem("cants"));
    var esps1 =JSON.parse( localStorage.getItem("espf"));
    var adic1 =JSON.parse( localStorage.getItem("adio"));
    prices1.splice(elm, 1);
    prods1.splice(elm, 1);
    cants1.splice(elm, 1);
    esps1.splice(elm, 1);
    edic1.splice(elm, 1);
    localStorage.setItem("prices",JSON.stringify(prices1));
    localStorage.setItem("prods",JSON.stringify(prods1));
    localStorage.setItem("cants",JSON.stringify(cants1));
    localStorage.setItem("espf",JSON.stringify(esps1));
    localStorage.setItem("adio",JSON.stringify(adic1));
    addToCart();
    if(prods.length==0){
    	$("#payOrder").prop("disabled",true);
    }
    swal.close();
  }

  function payOrder( ){
  	var $form = $("#payForm");

  	var content = new FormData($("#payForm")[0]);
  	content.append("user",localStorage.getItem("user"));
  	content.append("prods",localStorage.getItem("prods"));
  	content.append("precios",localStorage.getItem("prices"));
  	content.append("cants",localStorage.getItem("cants"));
  	content.append("espf",localStorage.getItem("espf"));
  	content.append("escuela",localStorage.getItem("school"));
    content.append("adic",localStorage.getItem("adio"));
  	content.append("coments",$("#comentarios").val());
    content.append("horas",$("#hora").val());
    $.ajax({
	    url: "https://www.icone-solutions.com/tlunch/conekta.php",
	    type: "POST",
	    contentType: false,
	    cache: false,
	    processData:false,
	    data: content,

	    success: function(data){
	      if(data.toString()=="0"){
	        getOrders();
    	    swal("Listo","Tu pago ha sido realizado con éxito y tu orden comenzará a prepararse","success");
          localStorage.removeItem("prods");
          localStorage.removeItem("prices");
          localStorage.removeItem("cants");
          localStorage.removeItem("adio");
          $("#comentarios").val("");
          $("#hora").val("");
          $("#pedidoL").html("");
          $("#pedidoL").append('<li><p class="pname">Resumen de orden <span id="totalT" class="price"></span></p> </li>');
          $("#total").html("");
          $("#payOrder").prop("disabled",true);
          $.mobile.navigate( "#inicio", { transition : "slide",info: "info about the #foo hash" });
	      } else{
	    	  swal("Error",data.toString(),"error");
	      }
	    },
	    error: function(data){
		    swal("Error","Revisa tu conexión y vuelve a intentarlo","error")
	    }
    });
    //Inserta el token_id en la forma para que se envíe al servidor
    //
  };

  $("#conOrder").click(function(){

  	$.mobile.navigate( "#pagos", {transition:"turn" });
  	//Conekta.Token.create($form, conektaSuccessResponseHandler, conektaErrorResponseHandler);
  });
  
  $("#payOrder").click(function(){
  	$form = $("#payForm");
  	swal({
      title: "¿Estas seguro que deseas realizar esta compra?",
      text: "Una vez que hayas aceptado se usara el dinero de tu cuenta.",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      closeOnConfirm: false,
      cancelButtonText: "Cancelar",
    },
    function(isConfirm){
	    if(isConfirm){
 	      payOrder();
      }
    });
  });
  var date = new Date();
  var year = parseInt(date.getFullYear());

  $("#expyear").inputmask("y", {yearrange: { minyear: year+1}});
  $("#expmonth").inputmask("m");
  $("#card").inputmask("9999 9999 9999 9999", {"placeholder": "0000 0000 0000 0000"});
  $("#cvv").inputmask("999", {"placeholder": "000"});

  // STARTS and Resets the loop if any
  function getAllF(){
 	  $("#orderlist").html("");
 	  getOrders();
  }
 
  getAllF();

});
