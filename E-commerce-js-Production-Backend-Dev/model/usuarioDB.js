import { supabase } from "./DB.js";  

export async function crearUserDB(info) { 
    try {
     
        
        const { data, error } = await supabase
            .from('usuarios') // Nombre de tu tabla
            .insert([info]);  // Insertar el objeto `info` como un array
        
        if (error) {
            throw new Error(error.message);
        }
        
    
        
        return data[0]; // Retorna el primer objeto insertado si existe
        
    } catch (err) {
        console.error('Error en la creación de usuarios:', err.message);
        return { success: false, message: 'Error creando los usuarios', error: err.message };
    }
}


export async function obtenerUsuarioDB(user, email,dni) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('usuario, email,dni')
            .or(`usuario.eq.${user},email.eq.${email},dni.eq.${dni}`);

        if (error) throw error;

        if (data.length > 0) {
            return { success: true, data };
        }

        return { success: false, message: 'No hay usuarios registrados.' };
    } catch (err) {
        console.error('Error al verificar existencia:', err.message);
        return {
            success: false,
            message: 'Error al verificar existencia.',
            error: err.message
        };
    }
}

 export async function obtenerUsuarios() {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*'); // Selecciona todos los campos de la tabla 'usuarios'

        if (error) {
            throw error;
        }
        console.log('esta es la data',data)
        return data; // Retorna todos los usuarios
    } catch (err) {
        console.error('Error al obtener usuarios:', err.message);
        return { success: false, message: 'Error al obtener usuarios.', error: err.message };
    }	

}


export async function updateUsuarioDB(user,pass,mail) {
    try {
      const { data, error } = await supabase
      .from('usuarios')
      .update({ usuario: user, contrasena: pass })
      .eq('email',mail)
      .select()
        if (error) {
            console.error('Error actualizando el usuario:', error.message);
            return { success: false, message: error.message };
        }

        if (data.length === 0) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Error al actualizar el usuario:', err.message);
        return { success: false, message: err.message };
    }

} 










