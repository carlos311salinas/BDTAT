let currentPage = 1;
const itemsPerPage = 8;
let filtrarCorresponsales = []; // Variable para almacenar los corresponsales filtrados

// Función para actualizar la tabla con los corresponsales paginados
window.actualizarTabla = function (corresponsales) {
    filtrarCorresponsales = corresponsales; // Guardar datos filtrados
    currentPage = 1; // Reiniciar a la primera página
    displayCorresponsales();
    actualizarTotalCorresponsales();
};

// Función para formatear fechas a "YYYY-MM-DD"
function formatDate(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0]; // Extrae solo la parte de la fecha
}

// Función para mostrar los corresponsales en la tabla con paginación
function displayCorresponsales() {
    const tbody = document.querySelector("#tablacorresponsales tbody");
    tbody.innerHTML = '';

    if (filtrarCorresponsales.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No se encontraron resultados</td></tr>`;
        actualizarPaginacion();
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const corresponsalesPaginados = filtrarCorresponsales.slice(startIndex, endIndex);

    corresponsalesPaginados.forEach(corresponsal => {
        const fila = document.createElement('tr');

        // Si el modo oscuro está activado, aplica la clase especial a la fila
        if (document.body.classList.contains("dark-mode")) {
            fila.classList.add("fila-dark");
        }

        fila.innerHTML = `
            <td>${corresponsal.nombrecorresponsal || 'N/A'}</td>
            <td>${corresponsal.imeiacercademac || 'N/A'}</td>
            <td>${corresponsal.codigoseta || 'N/A'}</td>
            <td>${corresponsal.tecnologia || 'N/A'}</td>
            <td>${corresponsal.municipio || 'N/A'}</td>
            <td>${corresponsal.lider || 'N/A'}</td>
            <td>${corresponsal.estado || 'N/A'}</td>
            <td>
                <i class="fas fa-edit" style="cursor: pointer;" onclick="editCorresponsal(${corresponsal.id})"></i>
            </td>
        `;
        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

let corresponsalSeleccionadoId = null;

// Función para cargar los datos en el formulario al hacer clic en "Editar"
function editCorresponsal(id) {
    document.getElementById("corresponsalId").value = id;
    const corresponsal = filtrarCorresponsales.find(c => c.id === id);

    if (corresponsal) {
        corresponsalSeleccionadoId = id;

        Object.keys(corresponsal).forEach((campo) => {
            const input = document.getElementById(campo);
            if (input) input.value = corresponsal[campo] || '';
        });

        if (corresponsal.fecha) {
            let fechaFormateada = new Date(corresponsal.fecha).toISOString().split('T')[0];
            const fechaInput = document.getElementById("fecha");
            if (fechaInput) fechaInput.value = fechaFormateada;
        }
    } else {
        console.error("No se encontró el corresponsal con el ID:", id);
    }
}

// Función para actualizar el total de corresponsales
function actualizarTotalCorresponsales() {
    document.getElementById("totalCount").innerText = filtrarCorresponsales.length;
}

// Función para actualizar la paginación
function actualizarPaginacion() {
    const totalPages = Math.ceil(filtrarCorresponsales.length / itemsPerPage);
    document.getElementById("pageNumber").textContent = `Página ${currentPage} de ${totalPages || 1}`;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage >= totalPages;
}

// Función para avanzar a la siguiente página
document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filtrarCorresponsales.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayCorresponsales();
    }
});

// Función para retroceder a la página anterior
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayCorresponsales();
    }
});

// Función para limpiar la tabla y reiniciar la paginación
document.getElementById("btnLimpiar").addEventListener("click", () => {
    const tableBody = document.querySelector("#tablacorresponsales tbody");

    // Reiniciar variables
    currentPage = 1;
    filtrarCorresponsales = [];

    // Limpiar la tabla
    tableBody.innerHTML = "";

    // Actualizar paginación y total de corresponsales
    actualizarPaginacion();
    actualizarTotalCorresponsales();

    // Remover la selección de cualquier fila activa
    const filaSeleccionada = document.querySelector(".fila-seleccionada");
    if (filaSeleccionada) {
        filaSeleccionada.classList.remove("fila-seleccionada");
    }

    // Opcional: Limpiar cualquier ID o dato que se almacene al seleccionar un corresponsal
    document.getElementById("corresponsalId").value = "";
});

// Mantén la tabla vacía al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#tablacorresponsales tbody");
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No se encontraron resultados</td></tr>`;
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnExportExcel")?.addEventListener("click", exportToExcel);
});

async function exportToExcel() {
    if (filtrarCorresponsales.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Sin datos",
            text: "No hay datos para exportar.",
        });
        return;
    }

    const workbook = new ExcelJS.Workbook(); // Usa ExcelJS directamente
    const worksheet = workbook.addWorksheet("Corresponsales");

    const headers = [
        "Nombre Corresponsal", "Fecha de Vinculación", "Líder Corresponsal", "Nombre Completo",
        "Cédula", "Teléfono", "Correo", "IMEI/AcercaDe/MAC", "Código SETA", "Tecnología", "Municipio",
        "Código DANE", "Código Postal", "Estado", "Tipo de Negocio", "Dirección", "Longitud", "Latitud", "Zona", "Categoría",
        "SIM/WIFI/ANTENA", "Modalidad", "Activos Fijos"
    ];

    worksheet.addRow(headers);

    filtrarCorresponsales.forEach(corresponsal => {
        worksheet.addRow([
            corresponsal.nombrecorresponsal || 'N/A',
            formatDate(corresponsal.fecha),
            corresponsal.lider || 'N/A',
            corresponsal.nombrecompleto || 'N/A',
            corresponsal.cedula || 'N/A',
            corresponsal.telefono || 'N/A',
            corresponsal.correo || 'N/A',
            corresponsal.imeiacercademac || 'N/A',
            corresponsal.codigoseta || 'N/A',
            corresponsal.tecnologia || 'N/A',
            corresponsal.municipio || 'N/A',
            corresponsal.codigodane || 'N/A',
            corresponsal.codigopostal || 'N/A',
            corresponsal.estado || 'N/A',
            corresponsal.tiponegocio || 'N/A',
            corresponsal.direccion || 'N/A',
            corresponsal.longitud || 'N/A',
            corresponsal.latitud || 'N/A',
            corresponsal.zona || 'N/A',
            corresponsal.categoria || 'N/A',
            corresponsal.siminternet || 'N/A',
            corresponsal.modalidad || 'N/A',
            corresponsal.activosfijos || 'N/A'
        ]);
    });

    // Aplicar estilos a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "DCE6F1" }, // Azul claro
        };
        cell.font = { bold: true };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            // Centrar texto y habilitar ajuste de texto
            cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    
            // Aplicar bordes a cada celda
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });
    });    

    // Ajustar automáticamente el ancho de las columnas
    worksheet.columns.forEach((column, index) => {
        column.width = headers[index].length + 5;
    });

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Corresponsales.xlsx";
    link.click();
}