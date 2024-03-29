let menus=[];

let carrito = [];

const contenedorProductos = document.getElementById('contenedorProductos');

const precioTotal = document.getElementById('precioTotal');

const contenedorCarrito = document.querySelector("#lista-carrito tbody");

const contadorCarrito = document.getElementById('contCarrito');

const vaciar = document.getElementById('vaciar');

const finalizarCompra = document.getElementById('pagar');

const cerrarCarrito = document.querySelector('label[for="btn-menu"]');



document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];
    actualizarCarrito();
  };
});


vaciar.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.clear();
 
  Swal.fire({
    title: 'Carrito vacio',
    background: '#fff',
    color: '#222',
  });
});

//fetch desde json local e imprimir menus en el DOM
fetch("./menus.json")
  .then(resp => resp.json())
  .then(data =>{
    menus = [...data];
    //recorro datos del json mediante un forEach para mostrar productos/menus en el DOM  
    menus.forEach(menu => {
      const div = document.createElement('div');
      div.classList.add('producto');
      div.innerHTML += `
          <div class="tarjetas" style="width: 300px">
            <img class="imgProductos" src=${menu.imagen} alt=${menu.nombre}>
            <h2>${menu.nombre}</h2>
            <p class="precio"><b>$ ${menu.precio} </b></p>
            <p><button class="boton" id="agregar${menu.id}">Agregar al Carrito</button></p>
          </div>
          `;
      contenedorProductos.appendChild(div);

      const boton = document.getElementById(`agregar${menu.id}`);
     
      boton.addEventListener('click', () => {
        agregarAlCarrito(menu.id);
        //Agrego libreria Toastify para mensaje de agregar items
        Toastify({
          text: "Producto agregado",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#e5be01;",
            fontSize: "14px",
          },
        }).showToast();
      });
    });
  });

//Agregar intems a nuestro carrito
//Verificar si existen o no algun items similar en el carrito y sumarlo 
const agregarAlCarrito = (menuId) => {
  const existe = carrito.some(menu => menu.id === menuId)
  if(existe){
    const menu = carrito.map (menu => {
      if (menu.id === menuId){
        menu.cantidad++
      };
    });
  }else{
    const item = menus.find((menu) =>  menu.id === menuId)
    item.cantidad = 1;
    carrito.push(item)
  };
    actualizarCarrito();
};

//Eliminar items del carrito

const eliminarDelCarrito = (menuId) => {
  const item = carrito.find((menu) => menu.id === menuId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
   //Agrego libreria Toastify para mensaje de eliminar items
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    gravity: "top",
    position: "left",
    style: {
      background: "#yellow;",
      fontSize: "14px",
    },
  }).showToast();

};

//Mostrar y agregar items dentro del carrito y actulizacion de localStorage 
const actualizarCarrito = () => {
  contenedorCarrito.innerHTML =""; 
  
  carrito.forEach((menu) => {
    const etiqueta = document.createElement('tr');
    etiqueta.innerHTML +=`
      <td class="imagenCarrito"><img src="${menu.imagen}" width="60px"></td>
      <td class="nombreCarrito">${menu.nombre}</td>
      <td class="precioCarrito">$ ${menu.precio}</td>
      <td class="cantidadCarrito"><span id="cantidad">${menu.cantidad} </span></td>
      <td class="precioTotalCarrito">$ ${menu.precio * menu.cantidad}</td>
      <td><button  onclick= "eliminarDelCarrito(${menu.id})" class="boton-eliminar"><img src="./img/close.png" class="eliminarImagen"></button><td>
    `
    contenedorCarrito.appendChild(etiqueta);

    localStorage.setItem('carrito', JSON.stringify(carrito));

  });
    //contador de items distintos del carrito   
    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = carrito.reduce((acc, menu)=> acc + menu.precio * menu.cantidad, 0);
};


//finalizo compra, actualizo el carrito y localStorage envio mensajes mediante alertas
finalizarCompra.addEventListener('click', () => {
  if(carrito.length >= 1) {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.clear();
  contenedorCarrito.innerHTML =""; 
  precioTotal.innerText = 0;
  //Agrego libreria sweetalert2 para mensaje de finalizar compra

  Swal.fire({
    title: 'SE CONFIRMO TU PEDIDO',
    text: 'BurgerLand llegará volando a tu puerta',
    imageUrl: './img/homero.png',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Custom image',
    background: '#fff',
    color: '#222',
   })
   setTimeout(()=>{
    cerrarCarrito.onclick
    window.location.reload()
    cerrarCarrito.click()
   }, 2000)
  }else{
  //Agrego libreria sweetalert2 para mensaje de carrito vacio
  Swal.fire({
  title: 'El carrito esta vacio',
  background: '#fff;',
  color: '#222',
  });
  };
});