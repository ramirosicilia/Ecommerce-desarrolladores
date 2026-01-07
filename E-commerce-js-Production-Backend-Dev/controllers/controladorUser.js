import { crearUserDB, obtenerUsuarios } from "../model/usuarioDB.js"
import { obtenerUsuarioDB } from "../model/usuarioDB.js"
import bcrypt from "bcryptjs"; 


export async function crearUser(req, res){      

    try{
        const {nombre,apellido,dni,usuario,email,contrasena:usuarioContrasena} = req.body; 
        Number(dni);
       
        const usuarios = await obtenerUsuarioDB(usuario, email,dni);
        console.log(usuarios, 'data recibida');

        // Extraer coincidencias (si existen)
        const coincidencias = usuarios.data || [];

        const usuarioExistente =coincidencias.find(u => u.usuario === usuario);
        const emailExistente =coincidencias.find(u => u.email === email);
        const dniExistente=coincidencias.find(u=>u.dni==dni)
         


        if (usuarioExistente) {
            console.log('Usuario ya existe');
            throw new Error('Usuario ya existe');
        }

        if (emailExistente) {
            console.log('Email ya existe');
            throw new Error('Email ya existente en nuestra base de datos');
        } 

        if(dniExistente){
             console.log('DNI ya existe');
            throw new Error('DNI ya existente en nuestra base de datos');

        }


    
          const hash= await bcrypt.hash(usuarioContrasena, 10);
          const data = {email:email,contrasena:hash,dni:dni,apellido:apellido,nombre:nombre,usuario:usuario}; 
          console.log(data)
          const respuesta = await crearUserDB(data); 
          
         console.log(respuesta,'respuesta') 
         

        if(respuesta){
                res.status(200).json({message: 'Usuario creado, exictosamente' , });
        }else{
                res.status(400).json({error: 'Error creando el usuario'});
        }   

      
    }
    catch(err){
      
        res.status(400).json({ error: err.message});
    }   
} 

export async function obtenerUsuariosController(req, res){  
    
           
    try{
        const usuarios = await obtenerUsuarios(); 
        console.log(usuarios,'data recibidaaa') 
        if(usuarios){
            res.status(200).json({message: 'Usuarios obtenidos, exictosamente' ,user:usuarios});
        }else{
            res.status(400).json({error: 'Error obteniendo los usuarios'});
        }   
    }
    catch(err){
      
        res.status(400).json({ error: err.message});
    }   
} 




