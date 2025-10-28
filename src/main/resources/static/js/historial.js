/**
 * Script para la gestión de productos
 * Archivo: src/main/resources/static/js/productos.js
 */

$(document).ready(function () {
    let dataTable;
    let productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
    let viewModal = new bootstrap.Modal(document.getElementById('viewProductoModal'));
    let isEditing = false;

    // API
    const API_BASE = '/productos/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
        toggleStatus: (id) => `${API_BASE}/cambiar-estado/${id}`,
    };

    // Inicializar DataTable
    dataTable = $('#tablaProductos').DataTable({
        responsive: true,
        processing: true,
        ajax: {
            url: ENDPOINTS.list,
            dataSrc: 'data'
        },
        columns: [
            { data: 'id' },
            {
                data: 'imagen',
                render: function (data) {
                    return `<img src="${data || '/img/default.png'}" 
                                 class="img-thumbnail" width="50" height="50">`;
                }
            },
            { data: 'nombre' },
            { data: 'categoria' },
            { data: 'descripcion' },
            {
                data: 'precio',
                render: function (data) {
                    return `S/ ${parseFloat(data).toFixed(2)}`;
                }
            },
            { data: 'stock' },
            {
                data: 'estado',
                render: function (data) {
                    return data
                        ? '<span class="badge text-bg-success">Activo</span>'
                        : '<span class="badge text-bg-danger">Inactivo</span>';
                }
            },
            {
                data: null,
                orderable: false,
                render: function (row) {
                    return `
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-primary action-edit" data-id="${row.id}" title="Editar">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn btn-sm btn-success action-view" data-id="${row.id}" title="Ver">
                                <i class="bi bi-eye-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-warning action-status" data-id="${row.id}" title="Cambiar estado">
                                <i class="bi bi-power"></i>
                            </button>
                            <button class="btn btn-sm btn-danger action-delete" data-id="${row.id}" title="Eliminar">
                                <i class="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        },
        pageLength: 10
    });

    // Abrir modal nuevo
    $('#btnNuevoProducto').on('click', function () {
        isEditing = false;
        $('#formProducto')[0].reset();
        $('#id').val('');
        $('#modalTitle').text('Agregar Producto');
        productoModal.show();
    });

    // Guardar producto
    $('#formProducto').on('submit', function (e) {
        e.preventDefault();
        let formData = {
            id: $('#id').val(),
            nombre: $('#nombre').val(),
            categoria: $('#categoria').val(),
            descripcion: $('#descripcion').val(),
            precio: $('#precio').val(),
            stock: $('#stock').val(),
            imagen: $('#imagen').val() // si guardas la ruta en DB
        };

        fetch(ENDPOINTS.save, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Éxito', data.message, 'success');
                    productoModal.hide();
                    dataTable.ajax.reload();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'No se pudo guardar el producto', 'error');
            });
    });

    // Editar producto
    $('#tablaProductos tbody').on('click', '.action-edit', function () {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let p = data.data;
                    $('#id').val(p.id);
                    $('#nombre').val(p.nombre);
                    $('#categoria').val(p.categoria);
                    $('#descripcion').val(p.descripcion);
                    $('#precio').val(p.precio);
                    $('#stock').val(p.stock);
                    $('#imagen').val(p.imagen || '');
                    $('#modalTitle').text('Editar Producto');
                    productoModal.show();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });

    // Ver producto
    $('#tablaProductos tbody').on('click', '.action-view', function () {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let p = data.data;
                    $('#viewNombre').text(p.nombre);
                    $('#viewCategoria').text(p.categoria);
                    $('#viewDescripcion').text(p.descripcion);
                    $('#viewPrecio').text(`S/ ${parseFloat(p.precio).toFixed(2)}`);
                    $('#viewStock').text(p.stock);
                    $('#viewImagen').attr('src', p.imagen || '/img/default.png');
                    viewModal.show();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });

    // Cambiar estado
    $('#tablaProductos tbody').on('click', '.action-status', function () {
        const id = $(this).data('id');
        fetch(ENDPOINTS.toggleStatus(id), { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Éxito', data.message, 'success');
                    dataTable.ajax.reload();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });

    // Editar producto
    $('#tablaProductos tbody').on('click', '.action-edit', function () {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let p = data.data;
                    $('#id').val(p.id);
                    $('#nombre').val(p.nombre);
                    $('#categoria').val(p.categoria);
                    $('#descripcion').val(p.descripcion);
                    $('#precio').val(p.precio);
                    $('#stock').val(p.stock);
                    $('#modalTitle').text('Editar Producto');
                    productoModal.show();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });
});