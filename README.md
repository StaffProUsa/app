# app
app


- subir roles_permisos
dfsf
npm run web
Mirar curso de react
y tipecreep






```JavaScript

// function nombreDeLaFuncion1(parametro1, aux, parametro2) {
//   console.log(parametro1, parametro2);
// }
// const nombreDeLaFuncion4 = (parametro1, parametro2) => {
//   console.log(parametro1, parametro2);
// };



// function nombreDeLaFuncion2({ perrito, parametro1, parametro2, param, texxt, lavbel, }) {
//   console.log(parametro1, parametro2);
// }
// const nombreDeLaFuncion5 = ({ parametro1, parametro2 }) => {
//   console.log(parametro1, parametro2);
// };



// function nombreDeLaFuncion3(props) {
//   console.log(props.parametro1, props.parametro2);
// }

// const nombreDeLaFuncion6 = (props) => {
//   console.log(props.parametro1, props.parametro2);
// }


// const nombreDeLaFuncion7 = (props: { parametro1: strin, parametro2: string }) => {
//   console.log(props.parametro1, props.parametro2);
// }






// nombreDeLaFuncion1("Hola", "Mundo");
// nombreDeLaFuncion2({ parametro1: "Hola", parametro2: "Mundo" });
// nombreDeLaFuncion3({ parametro1: "Hola", parametro2: "Mundo" });
// nombreDeLaFuncion4("Hola", "Mundo");
// nombreDeLaFuncion5({ parametro1: "Hola", parametro2: "Mundo" });
// nombreDeLaFuncion6({ parametro1: "Hola", parametro2: "Mundo" });



class SeresVivos {
  estapa: "nacer" | "crecer" | "reproducir" | "morir";
  cantidad_de_hijos = 0;

  constructor() {
    this.estapa = "nacer";
    console.log("Naciendo");
  }

  crecer() {
    this.estapa = "crecer";
    console.log("Creciendo");
  }
  reproducir() {
    if (this.estapa == "nacer") {
      console.log("Eres demasiado joven para reproducirte");
      return;
    }
    this.estapa = "reproducir";
    this.cantidad_de_hijos++;
    console.log("Reproduciendo");
  }
  morir() {
    this.estapa = "morir";
    console.log("Muriendo");
  }

}

class Animal extends SeresVivos {
  patas;
  constructor() {
    super();
    console.log("Soy un animal");
  }
}

class Planta extends SeresVivos {
  hojas;
  constructor() {
    super();
    console.log("Soy una planta");
  }
}

const perro = new Animal({ title: "Pedidos de Hoy", hidden: true });
perro.patas = 4;
const flor = new Planta();
flor.hojas = 0;



class Humano extends Animal {

  constructor() {
    super();
    this.patas = 2;
  }
  hablar() {

  }
}

const ser = new Humano();
ser.hablar();



// const ser = new SeresVivos();
// ser.reproducir();
// ser.reproducir();
// ser.reproducir();
// ser.reproducir();
// ser.crecer();
// ser.reproducir();
// ser.reproducir();
// ser.reproducir();
// ser.reproducir();
// ser.morir();

console.log(ser.estapa, "cantidad de hijos", ser.cantidad_de_hijos);



class Ficha {
  nombre

  constructor(nombre) {
    this.nombre = nombre;
  }

  pintarse({ valor }) {
    console.log("Me llamo " + this.nombre);
    return this.nombre;
  }
}


const intanciaDeLaFicha = new Ficha("A");

intanciaDeLaFicha.pintarse({})



const texto = "Hola";
for (let i = texto.length - 1; i >= 0; i--) {
  console.log(texto[i]);
}

var a = [];
a.push(new Ficha())
a.push(new Ficha("B"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))
a.push(new Ficha("C"))




for (let i = 0; i < a.length; i++) {
  a[i].pintarse();
  if (i == 2) {
    return;
  }
  console.log("Me llamo " + a[i].nombre);
  console.log("Me llamo " + a[i].nombre);
  console.log("Me llamo " + a[i].nombre);
  console.log("Me llamo " + a[i].nombre);
  console.log("Me llamo " + a[i].nombre);
  console.log("Me llamo " + a[i].nombre);
}

let i = 0;
while (i < a.length) {
  a[i].pintarse();
  i++;
}



const arr = a.map((obj, i) => {

  return obj.pintarse();
})

console.log(arr);
```