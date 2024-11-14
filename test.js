var valor = 13;
var resto = valor % 10
if(resto == 0){
    console.log("ES PAR")
}else{
    console.log("ES INPAR")
}

console.log(valor%2==0)

return;
function lanzarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

// insertar datos
// guardar datos
var apuesta = "casa"


//  0-6 menor
//  7 casa
//  8-12 mayor

var detener = false;
while(detener==false){
    var dado1 = lanzarDado();
    var dado2 = lanzarDado();
    var suma = dado1+dado2
    var resultado="";
    if(suma<7 && apuesta=="menor" ){
        resultado = "ganaste"
    }else if(suma >7  && apuesta == "mayor"){
        resultado="ganaste"
    }else if(suma ==7  && apuesta == "casa"){
        resultado="ganaste"
    }else{
        resultado = "perdio"
    }

    if(resultado=="ganaste"){
        detener=true;
    }
    console.log(resultado, "el resultado es:",dado1, dado2, "=",suma) 

    
}
