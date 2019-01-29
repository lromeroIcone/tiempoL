if(localStorage.getItem("user")!=null){
	$.mobile.navigate( "#inicio", {transition:"pop" });
}
if(localStorage.getItem("school")!=null){
	getCategories();
}

var user="";
var school="";
var ban = false;
function getCredit(){
	var user = localStorage.getItem("user");
	$.ajax({
		url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
		type: "POST",
		data: {correo: user},
		success: function(data){
		  $.mobile.loading( "hide" );

	  	var jsonObj = jQuery.parseJSON(data);

	  	credit = jsonObj[0];
	    localStorage.setItem("credit",credit);
	    $(".credit").text("$"+localStorage.getItem("credit"));
		}

  });
}

function getSchoolsC(){
	$.ajax({
		url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
		type: "POST",
		data: {gs: 0},

		success: function(data){

	    $(".schoolS").empty();
			var jsonObj = jQuery.parseJSON(data);

			for(var i=0;i<jsonObj.length;i++){
				if(localStorage.getItem("school")==jsonObj[i][0]){
					$(".schoolS").append('<option selected value="'+jsonObj[i][0]+'"  >'+jsonObj[i][1]+'</option>');
				}else{
					$(".schoolS").append('<option value="'+jsonObj[i][0]+'"  >'+jsonObj[i][1]+'</option>');
				}
			}

  	}
  });
}

function login(){
	var form = new FormData($("#logForm")[0]);

	form.append("regID",localStorage.getItem('registrationId'));
	$.ajax({
		url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
		type: "POST",
		data: form,
		contentType: false,
		cache: false,
		processData:false,
		success: function(data){
			console.log(data);
		 	$.mobile.loading( "hide" );
			if(data.toString()!=="0"){
				var datos = data.toString().split(";");
				user = datos[0];
				school = datos[1];
				credit = datos[2];
				nombre = datos[3];
				localStorage.setItem("user",user);
				localStorage.setItem("nombre",nombre);
				localStorage.setItem("school",school);
				localStorage.setItem("credit",credit);
				$(".usuario").text(localStorage.getItem("nombre"));
				getCategories();
				getCredit();
				$.mobile.navigate( "#inicio", { transition : "slide",info: "info about the #foo hash" });
			} else{
				$("#mess").text("Usuario o contraseña incorrectos");
				$("#mess").show();
			}
			$("#enter").prop("disabled",false);
    	}

  	});
}
	
function getCategories(){
	var esc = localStorage.getItem("school");
	console.log(esc);
	$.ajax({
      	url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
      	type: "POST",
      	data: {cats: esc},
        success: function(data){
			$("#categories").empty();
	        var jsonObj = jQuery.parseJSON(data);
	        for(var i=0;i<jsonObj.length;i++){
				if(i==0){
					$("#categories").append('<a  data-catg="'+jsonObj[i][0]+'" class="elm-cent gtsec"  ><img width="100%" src="img/'+jsonObj[i][1]+'" /></a>');
	           	} else{
					$("#categories").append('<a  data-catg="'+jsonObj[i][0]+'" class="elm-cent menusecs gtsec"  ><img width="100%" src="img/'+jsonObj[i][1]+'" /></a>');
	           	}
	        }
        }
	});
}

function register(){
	var form = new FormData($("#regForm")[0]);
	$.ajax({
      	url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
      	type: "POST",
      	data: form,
      	contentType: false,
      	cache: false,
      	processData:false,
      	success: function(data){
			$.mobile.loading( "hide" );
      	    if(data.toString()=="0"){
				var datos = data.toString().split(",");

				swal("Listo","Tu usuario ha sido registrado exitosamente.","success");
      	    	$.mobile.navigate( "#login", { transition : "slide",info: "info about the #foo hash" });

      	    } else if(data.toString()=="1"){
				swal("Error","Este usuario ya fue registrado.","error");
            }else{
				swal("Error",data.toString(),"error");
      	    }
      	    $("#rega").prop("disabled",false);
		}
	});
}

function forgetP(){
	var form = new FormData($("#forForm")[0]);
	$.ajax({
      	url: "https://www.icone-solutions.com/tlunch/forget.php",
      	type: "POST",
      	data: form,
      	contentType: false,
      	cache: false,
      	processData:false,
      	success: function(data){
			$.mobile.loading( "hide" );
      	    if(data.toString()=="0"){
				swal("Listo","Se ha enviado un mensaje a tu cuenta de correo con la información de tu contraseña.","success");
      	    	$.mobile.navigate( "#login", { transition : "slideup",info: "info about the #foo hash" });
      	    }else{
				swal("Error",data.toString(),"error");
      	    }
      	    $("#forg").prop("disabled",false);
		}

	});
}

function getSchools(){
	$.ajax({
		url: "https://www.icone-solutions.com/tlunch/sqlOP.php",
		type: "POST",
		data: {school: 1},

		success: function(data){

			var jsonObj = jQuery.parseJSON(data);
			var id = jsonObj[0].split(",");
			var nombres = jsonObj[1].split(",");
			if(nombres[0]!=""){
			for(var i=0;i<nombres.length;i++){
				$("#schoolList").append('<option value="'+id[i]+'">'+nombres[i]+'</option>');
			}
			}
		}

	});
}

$(document).ready(function(){
	//getSchoolsC();
	console.log("Hello");
   	$( '#inicio' ).on( 'pagebeforeshow',function(event){
         getSchoolsC();
	});
    $(".schoolS").change(function(){
    	localStorage.setItem("school",$(this).val());
    	getCategories();
    });
    $("#logForm").submit(function(e){
    	e.preventDefault();
		$("#mess").hide();
		var form = this;
		$("#enter").prop("disabled",true);
		html = $(this).jqmData( "html" ) || "";
		$.mobile.loading( "show", {
			text: "Cargando",
			textVisible: true,
			theme: "b",
			textonly: false,
			html: html
		});

		login();
	});

   	$("#regForm").submit(function(e){
		e.preventDefault();
		var con = $('#pass').val();
		var tra = $('#pass1').val();
		var empty = $(this).find("input").filter(function() {
        	return this.value === "";
  	 	});
  	 	if(!empty.length) {
			if(con == tra){
				$("#mess").hide();
				html = $(this).jqmData( "html" ) || "";
				$("#rega").prop("disabled",true);
				$.mobile.loading( "show", {
					text: "Cargando",
					textVisible: true,
					theme: "b",
					textonly: false,
					html: html
				});
				register();
			} else {
				swal("Error de contraseñas","Las contraseñas no coinciden");
			}
     	} else{
    		swal("Campos vacios","Debes completar todos los campos");
    	}
   	});
	   
	$("#forForm").submit(function(e){
    	e.preventDefault();
    	var empty = $(this).find("input").filter(function() {
        	return this.value === "";
    	});
    	if(!empty.length) {
	   		html = $(this).jqmData( "html" ) || "";
	   		$("#forg").prop("disabled",true);
	   		$.mobile.loading( "show", {
				text: "Cargando",
				textVisible: true,
				theme: "b",
				textonly: false,
				html: html
            });
	  		forgetP();
    	} else{
    		swal("Campos vacios","Debes completar todos los campos");
    	}
   	});


      // STARTS and Resets the loop if any
    $(".menub").click(function(){
    	getCredit();
    });

	/* */


	getSchools();

});
