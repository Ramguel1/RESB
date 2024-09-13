var btnGM = document.getElementById('btnGM');
var propina = 0; subtotal = 0; total = 0; porcentaje = 10;
btnGM.onclick = async () => {
    let descripcion = document.getElementById('descripcion').value;
    let costo = parseFloat(document.getElementById('costo').value);
    if (descripcion.trim() == "" || isNaN(costo) || costo <= 0) {
        Swal.fire({
            title: "ERROR", text: "Campos vacios", icon: "error"
        });
        return;
    }

    let datos = new FormData();
    datos.append("descr", descripcion);
    datos.append("costo", costo);
    datos.append("action", "add");
    let respuesta = await fetch("metodo.php", { method: 'POST', body: datos });
    let json = await respuesta.json();
    console.log(json);
    if (json.success == true) {
        Swal.fire({
            title: "registrado", text: json.mensaje, icon: "success"
        });
        cargarMenu();
    } else {
        Swal.fire({
            title: "ERROR", text: json.mensaje, icon: "error"
        });
    }
}
const cargarMenu = async () => {
    const datos2 = new FormData();
    datos2.append("action", "cargarM");
    let respuesta = await fetch("metodo.php", { method: 'POST', body: datos2 });
    let json = await respuesta.json();

    let tablaHTML = ``;
    let index = 1;
    json.data.forEach(item => {
        tablaHTML += `
        <div class="list-group">
            <button type="button" onclick="add(${index})" class="list-group-item list-group-listen-action d-flex justify-content-between align-items-center">
                ${item.descr}
                <span class="badge text-bg-light rounded-pill">$${parseFloat(item.costo).toFixed(2)}</span>
            </button>
        </div>
        `;
        index++;
    });
    document.getElementById("listaMenu").innerHTML = tablaHTML;
    cargarOrden();
}
const cargarOrden = async (porcentaje = 0) => {
    const datos2 = new FormData();
    datos2.append("action", "cargarM");
    const datos3 = new FormData();
    datos3.append("action", "cargarO");

    let cargM = await fetch("metodo.php", { method: 'POST', body: datos2 });
    let json = await cargM.json();
    let cargO = await fetch("metodo.php", { method: 'POST', body: datos3 });
    let json1 = await cargO.json();

    let listaOrden = document.getElementById("listaOrden");
    subtotal = 0;
    let ordenL = ``;

    if (json1.data.length == 0) {
        listaOrden.innerHTML = '<h2 class="text-center">No Hay Ordenes</h2>';
        document.getElementById("sub").innerHTML = '$0.00';
        document.getElementById("Prop").innerHTML = '$0.00';
        document.getElementById("total").innerHTML = '$0.00';
    } else {
        json1.data.forEach(o => {
            const itemM = json.data.find(item => item.idm == o.idm);
            if (itemM) {
                ordenL += `
                <div class="list-group-item list-group-item-action border my-2">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="align-middle">${itemM.descr}</h4>
                    </div>
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="align-bottom">Cantidad: <b>${o.cant}</b></h4>
                        <h4 class="align-middle">Total: <b>$ ${(parseFloat(itemM.costo) * parseFloat(o.cant)).toFixed(2)}</b></h4>
                        <button class="btn btn-outline-danger my-1" onclick="eliminarO(${o.ido})"><i class="bi bi-trash"></i></i></button>
                   </div>
                </div>
                `;
                subtotal += parseFloat(itemM.costo) * parseFloat(o.cant);
            }
        });
        listaOrden.innerHTML = ordenL;
        calcularpropina()
        let propina = (porcentaje / 100) * subtotal;
        let total = subtotal + propina;

        document.getElementById("sub").innerHTML = `$${subtotal.toFixed(2)}`;
        document.getElementById("Prop").innerHTML = `$${propina.toFixed(2)}`;
        document.getElementById("total").innerHTML = `$${total.toFixed(2)}`;
    }
};

const add = async (index) => {
    let datos = new FormData();
    datos.append("idm", index);
    datos.append("action", "addO");
    let cargM = await fetch("metodo.php", { method: 'POST', body: datos });
    const result = await cargM.json();
    cargarOrden();
    if (result.success) {
        cargarOrden();
    } else {
        console.error("Error ", result.error);
    }
}

const eliminarM = async (index) => {
    Swal.fire({
        title: "Estás seguro de eliminar?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = new FormData();
            datos.append("idm", index);
            datos.append("action", "dellO");
            let cargM = await fetch("metodo.php", { method: 'POST', body: datos });
            const result = await cargM.json();
            if (result.success) {
                cargarMenu();
                cargarOrden();
            } else {
                console.error("Error:", result.error);
            }
        }
    });
}
const eliminarO = async (ido) => {
    Swal.fire({
        title: "Estás seguro de eliminar?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = new FormData();
            datos.append("idm", ido);
            datos.append("action", "dellO");
            let respuesta = await fetch("metodo.php", { method: 'POST', body: datos });
            let result = await respuesta.json();
            if (result.success) {
                cargarOrden();
            } else {
                console.error("Error ", result.error);
            }
        }
    });
}

const calcularpropina = async () => {
    let bpropina = document.querySelector('input[name="propinaa"]:checked');
    let porcentaje = 0;
    if (bpropina) {
        porcentaje = parseFloat(bpropina.value);
    }

    cargarOrden(porcentaje);
};

const terminar = () => {
    Swal.fire({
        title: "Estás Seguro de terminar la Orden?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then(async (result) => {
        if (result.isConfirmed) {

            let datos = new FormData();
            datos.append("action", "terO");
            let cargM = await fetch("metodo.php", { method: 'POST', body: datos });
            const result = await cargM.json();
            let respuesta = await fetch("metodo.php", {
                method: 'POST',
                body: datos
            });
            let json = await respuesta.json();
            if (json.success) {
                subtotal = 0; propina = 0; total = 0;
                cargarOrden();
                Swal.fire("Orden final", "", "success");
            } else {
                Swal.fire("Error", json.error || "ERROR", "error");
            }
            cargarMenu();
        }
    });
};

