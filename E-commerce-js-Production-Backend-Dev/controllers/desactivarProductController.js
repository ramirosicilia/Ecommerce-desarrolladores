import { desactivarProductosDB } from "../model/carritoDB.js";


export async function desactivarProductosController(req, res) {
    

    const activo= req.body.activo
    const  id = req.params.id
  
    console.log('Activo:', activo);
    console.log('ID', id); 

  

    try{ 
        let desactivarProducto=await desactivarProductosDB(id,activo) 
        console.log(desactivarProducto)

        if(desactivarProducto.length===0){
            throw new Error("no se pudo desactivar");
            

        }
     
  
        res.json({ message: 'exitoso',desactivado:desactivarProducto[0].activacion }); 

    } 

    catch(err){
        res.statu(500).json({message:err})
    }
  }
  
    