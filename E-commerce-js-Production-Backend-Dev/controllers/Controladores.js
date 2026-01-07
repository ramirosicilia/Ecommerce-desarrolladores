
import dotenv from "dotenv";
 import { obtenerProductos } from "../model/carritoDB.js";
import { obtenerProductoPorId } from "../model/carritoDB.js"; 
import { logeoDB, recuperacionCuentaDB} from "../model/loginDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import { obtenerAdministrador } from "../model/adminDB.js";
import { token } from "morgan";
import { validarMail } from "../email/recuperacionMail.js";
import path from "path"; 
import { fileURLToPath } from "url"; 
import { updateUserDB } from "../model/adminDB.js";
import { obtenerUsuarioDB,updateUsuarioDB } from "../model/usuarioDB.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
let adjuntarMail=null


dotenv.config();

export async function enviarProductos(req,res){  
    
    try{   
        let datos=await obtenerProductos()

        if(!datos){
           throw new Error('no se recibieron los productos')
        } 

        res.json(datos)


    } 

    catch(err){
        res.status(500).json({error:err.message})
    }

}  




export async function obtenerProductoID(req,res){  
    let {id}=req.params 

    try{ 
        let data=await obtenerProductoPorId(id) 

        if(!data){
            console.log('no se recibieron los productos')
        } 

        res.json({actulizado:true,data})
    } 

    catch(err){
        res.status(500).json('ocurrio un error al recibir los productos',err.message)
    }

} 



export async function controladorLogeo(req, res, next) {
    const { userInto: usuarioIngresado, passwordInto: passWordIngresado } = req.body;

    try {
        // Validación de entrada
        if (!usuarioIngresado) {
             throw new Error ('El usuario no fue proporcionado')
        }
        if (!passWordIngresado) {
            throw new Error ('La contraseña no fue proporcionada')
        }

        // Obtener el usuario y el administrador de la base de datos
        const obtenerLogeoDB = await logeoDB(usuarioIngresado);
        const obtenerAdminDB = await obtenerAdministrador(usuarioIngresado);

        const data = obtenerLogeoDB?.usuarios || [];
        const dataAdmin = obtenerAdminDB?.[0] || null;

        // Verificar si no se encontró ni el usuario ni el administrador
        if (!data.length && !dataAdmin) {
           throw new Error('no ay registros con ese usuario!!')
        }

        // Lógica para administrar el login del administrador
        if (dataAdmin && dataAdmin.contrasena) {
            const verificarContraseñaAdmin = await bcrypt.compare(passWordIngresado, dataAdmin.contrasena);
            if (!verificarContraseñaAdmin) {
              throw new Error('Contraseña incorrecta para el administrador')
            }
            console.log('Administrador autenticado:', dataAdmin);

            req.isAdmin = true; // Marca como administrador verificado
            req.dataAdmin = dataAdmin; // Almacena los datos del administrador
            return next(); // Pasa al siguiente controlador
        }

        // Lógica para el login del usuario
        if (data.length > 0) {
            const verificarContraseña = await bcrypt.compare(passWordIngresado, data[0].contrasena);
            if (!verificarContraseña) {
                throw new Error('Contraseña incorrecta para el usuario' )
            }
            console.log('Usuario autenticado:', data[0]);

            // Generar token y configurar cookies solo para usuarios
            const token = jwt.sign({ user: data[0].usuario }, process.env.JWT_SECRET, { expiresIn: "1h" });
       

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000 // 1 hora
            });

           

            req.token = token; // Almacena el token en la solicitud
            req.isUser = true; // Marca como usuario verificado 
            req.dataUser = data[0].dni; // Almacena los datos del usuario
            req.userName = data[0].usuario; // Almacena los datos del usuario
     

            return next(); // Pasa al siguiente controlador
        }
    } catch (err) {
        console.error('Error en el controladorLogeo:', err);
        res.status(500).json({ error: err.message});
    }
}




export function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token ; 
  
   try {  

    if (!token) {
        throw new Error('No autorizado, falta token' )
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido' }); 
        }
        req.user = user; 
        req.token
       next(); // Pasa al siguiente middleware o controlador
      
        
    }); 

   } 

   catch(error){ 
    res.status(500).json({error:err.message})

   }

    next();

    
} 

export async function controladorAdmin(req,res,next){  


     try{  

       const {isAdmin,dataAdmin}=req  

    
         if(isAdmin){
            return  res.json({respuesta:' administrador exictosamente',dataAdmin,reedireccionar:'./dashboard.html'})
         } 

        return next()

     }
       
            
      catch(err){
            res.status(500).json({err:'no se pudo logear en la base de datos'})
        } 
         
   } 



  export async function controladorUser(req,res,next){  

    try{  

        const {isUser,dataUser,userName,token}=req 
          if( isUser){
              return res.json({respuesta:' usuario exictosamente',token,usuario:dataUser,userName:userName,reedireccionar:'./productosUsuario.html'})
          } 
     
            return next()
    }
      
           
       catch(err){
           res.status(500).json({err:'no se pudo logear en la base de datos'})
       }  

       return next()
        
  } 

  export async function recuperacionCuentaController(req,res){ 

    const Email=req.body.email 

       try{  

        const dataEmail=await recuperacionCuentaDB(Email) 

        if(!dataEmail){
          throw new Error("el email no se encuentra registrado'")
        }
    

        console.log(dataEmail,'data email') 

        const token=jwt.sign({email:dataEmail},process.env.JWT_SECRET_EMAIL,{expiresIn:'1h'}) 
        
        const {email}=dataEmail 

        console.log(email,'email')

        let validacionMail= await validarMail(email,token) 

       
    console.log(validacionMail)

       if(!validacionMail){
           throw new Error('no se pudo enviar el mail')

        
           } 

             console.log(validacionMail,'mail enviado') 
             adjuntarMail=dataEmail 


             res.status(200).json({ ok:true});

       } 

       catch(err){ 
        return res.json({error:err.message})
       }
  } 


  export async function recuperacionMailControlador(req,res){ 

    const token=req.params.token 

    console.log(token,'token')

    try{ 

        jwt.verify(token,process.env.JWT_SECRET_EMAIL,(err,usuario)=>{ 

            if(err){
                return res.status(404).json({error:'el token no es valido'})
            } 

            console.log(usuario)
   
        })   

   
        
        return res.redirect(`${process.env.URL_FRONT}/nuevoRegistro`);
    } 
    
    catch(err){
        res.status(500).json({err:'no se pudo verificar el token'})
    }

  } 

   let ingresoUsuario=null
   let ingresoAdmin=null  

   let cookieUser=null
   let cookieUserDni=null


  export  async function nuevoRegistroControlador(req,res){ 


   const {usuario,password}=req.body 

        try{    
            
            let usuarios=await obtenerUsuarioDB(usuario) 
            console.log(usuarios)
            

          if(usuarios.length>0){  
           throw new Error('Usuario ya existe')
             
          }  


            console.log(adjuntarMail,'adjuntarMail') 

            if(adjuntarMail.verificado===true){ 
             ingresoAdmin=adjuntarMail.email 
            
                let contraseñaHasheada=await bcrypt.hash(password,10)
            
               let ingresoAdminDB=await updateUserDB(usuario,contraseñaHasheada,ingresoAdmin) 
            
               console.log(ingresoAdminDB,'ingresoAdminDB')
            
                if(ingresoAdminDB.data[0].nombre_usuario===usuario && ingresoAdminDB.data[0].email===ingresoAdmin){ 
                    console.log('se cumplio la condicion')
                     

                    return res.json({reedireccion:'./dashboard.html'})
            
                }   
    
            }
        
            if(adjuntarMail.verificado===false){ 
              ingresoUsuario=adjuntarMail.email  
              cookieUser=adjuntarMail.cookie 
              cookieUserDni=adjuntarMail.dni
            
                let contraseñaHasheada=await bcrypt.hash(password,10)
            
                let ingresoUsuarioDB=await updateUsuarioDB(usuario,contraseñaHasheada,ingresoUsuario) 
            
                console.log(ingresoUsuarioDB,'ingresoUsuarioDB ')
            
                if(ingresoUsuarioDB.data[0].usuario===usuario && ingresoUsuarioDB.data[0].email===ingresoUsuario){ 
                  
                
                    console.log(ingresoUsuarioDB.data[0].usuario,'ingresoUsuarioDB.data[0].usuario') 
                 



                    res.cookie('DNI', cookieUserDni, {
                        httpOnly: true,
                        secure: false, // Cambiar a true si usas HTTPS
                        sameSite: 'Lax', // Ajusta según sea necesario
                    }); 

                     
                    
                    res.cookie('userCookie', cookieUser, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Lax',
                    }); 

                
                    return res.json({reedireccion:'./productosUsuario.html'})                
                } 

            }     
    
             throw new Error('no se pudo verificar el email')

        } 

        catch(err){
            res.status(500).json({error:err.message}) 
        
        
        }


   }  


  
   



