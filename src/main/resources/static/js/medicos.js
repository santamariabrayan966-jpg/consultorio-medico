$(document).ready(function() {
    // Evento para abrir el modal para agregar un nuevo médico
    $('#btnNuevoMedico').on('click', function() {
        $('#medicoModal').modal('show');
        $('#formMedico')[0].reset(); // Limpiar el formulario
        $('#id').val(''); // Reiniciar el campo de ID
    });

    // Manejo del formulario para guardar un nuevo médico o editar uno existente
    $('#formMedico').on('submit', function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto de enviar el formulario

        var formData = $(this).serialize();  // Obtener los datos del formulario

        // Aquí puedes hacer una solicitud AJAX para guardar los datos (ya sea nuevo o editado)
        $.ajax({
            url: '/medicos/guardar',  // Cambia esta URL si usas una ruta diferente
            type: 'POST',
            data: formData,
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Médico Guardado',
                    text: 'El médico ha sido guardado exitosamente.',
                }).then(function() {
                    $('#medicoModal').modal('hide');  // Cerrar el modal
                    location.reload();  // Recargar la página para mostrar los cambios
                });
            },
            error: function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al guardar los datos del médico.',
                });
            }
        });
    });

    // Ejemplo de eliminar un médico
    $(document).on('click', '.eliminarMedico', function() {
        var idMedico = $(this).data('id');  // Obtener el ID del médico

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Realizar la eliminación del médico mediante AJAX
                $.ajax({
                    url: '/medicos/eliminar/' + idMedico,  // Cambiar la URL si es necesario
                    type: 'DELETE',
                    success: function(response) {
                        Swal.fire(
                            'Eliminado!',
                            'El médico ha sido eliminado.',
                            'success'
                        );
                        location.reload();  // Recargar la página para reflejar la eliminación
                    },
                    error: function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al eliminar el médico.',
                        });
                    }
                });
            }
        });
    });
});
