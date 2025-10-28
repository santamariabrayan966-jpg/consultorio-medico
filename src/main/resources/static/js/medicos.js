$(document).ready(function() {
    // Evento para abrir el modal para agregar un nuevo m�dico
    $('#btnNuevoMedico').on('click', function() {
        $('#medicoModal').modal('show');
        $('#formMedico')[0].reset(); // Limpiar el formulario
        $('#id').val(''); // Reiniciar el campo de ID
    });

    // Manejo del formulario para guardar un nuevo m�dico o editar uno existente
    $('#formMedico').on('submit', function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto de enviar el formulario

        var formData = $(this).serialize();  // Obtener los datos del formulario

        // Aqu� puedes hacer una solicitud AJAX para guardar los datos (ya sea nuevo o editado)
        $.ajax({
            url: '/medicos/guardar',  // Cambia esta URL si usas una ruta diferente
            type: 'POST',
            data: formData,
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'M�dico Guardado',
                    text: 'El m�dico ha sido guardado exitosamente.',
                }).then(function() {
                    $('#medicoModal').modal('hide');  // Cerrar el modal
                    location.reload();  // Recargar la p�gina para mostrar los cambios
                });
            },
            error: function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al guardar los datos del m�dico.',
                });
            }
        });
    });

    // Ejemplo de eliminar un m�dico
    $(document).on('click', '.eliminarMedico', function() {
        var idMedico = $(this).data('id');  // Obtener el ID del m�dico

        Swal.fire({
            title: '�Est�s seguro?',
            text: "No podr�s revertir esta acci�n",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'S�, eliminar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Realizar la eliminaci�n del m�dico mediante AJAX
                $.ajax({
                    url: '/medicos/eliminar/' + idMedico,  // Cambiar la URL si es necesario
                    type: 'DELETE',
                    success: function(response) {
                        Swal.fire(
                            'Eliminado!',
                            'El m�dico ha sido eliminado.',
                            'success'
                        );
                        location.reload();  // Recargar la p�gina para reflejar la eliminaci�n
                    },
                    error: function(error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al eliminar el m�dico.',
                        });
                    }
                });
            }
        });
    });
});
