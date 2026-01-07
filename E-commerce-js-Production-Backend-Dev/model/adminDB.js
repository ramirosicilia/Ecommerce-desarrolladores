import { supabase } from "./DB.js"; 



export async function administradorLogeoDB(usuarios) {
    try {
      // `usuarios` debe ser un array de objetos con las propiedades: nombre_usuario, email, contrasena, permisos
      const { data, error } = await supabase
        .from('administrador') // Nombre de la tabla
        .insert([usuarios]) // Inserta el array de objetos
        .select(); // Selecciona todas las columnas o especifica las que necesites
  
      console.log(data[0]);
  
      if (error) {
        console.error('Error registrando los usuarios:', error.message);
        return { success: false, message: 'Error registrando los usuarios', error: error.message };
      }
  
      return { success: true, data };
    } catch (err) {
      console.error('Error al registrar los usuarios:', err.message);
      return { success: false, message: 'Error al registrar los usuarios', error: err.message };
    }
  } 


    export async function administradorModel(){ 
       try {
      const { data, error } = await supabase
        .from('administrador')
        .select('*'); // equivalente a SELECT *
      
      if (error) {
        console.error('Error al obtener todos los administradores:', error.message);
        return { success: false, message: error.message };
      }
    
      return { success: true, data };
    } catch (err) {
      console.error('Error inesperado al obtener administradores:', err.message);
      return { success: false, message: 'Error inesperado', error: err.message };
    }
  
  
  
    }
    

  export async function obtenerAdministrador(user) {
    try {
        const { data, error } = await supabase
            .from('administrador')
            .select()
            .eq('nombre_usuario', user);

        if (error) {
            console.error('Error obteniendo los usuarios:', error.message);
            return { success: false, message: error.message };
        }

        if (data.length === 0) {
            return { success: false, message: 'Administrador no encontrado' };
        }

     

        let dataAdmin = data; 
        console.log(dataAdmin,'dataAdmin DB');
        return dataAdmin
    } catch (err) {
        console.error('Error al obtener los usuarios:', err.message);
        return { success: false, message: 'Error al obtener los usuarios', error: err.message };
    }
}  







export async function updateUserDB(user,pass,mail) {
    try {
      const { data, error } = await supabase
      .from('administrador')
      .update({ nombre_usuario: user, contrasena: pass })
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


