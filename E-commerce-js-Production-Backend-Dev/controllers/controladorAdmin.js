
import { administradorLogeoDB, administradorModel, obtenerAdministrador
    
} from "../model/adminDB.js";
import { borrarCarritoDB, insertarCarritoDB, insertarImagenDB, obtenerImagenesDB, actualizarImagenesDB, coloresAgregarID, tallesAgregarID, ingresarColoresDB, ingresarTallesDB, ingresarIDVariantesDB, updateNombreProductoDB, updatePrecioProductoDB, updateDetallesProductoDB, updateDescripcionProductoDB, updateColorProductoDB, updateTalleProductoDB, updateStockProductoDB, updateCategoriaProductoDB, agregarImagenesDB,eliminarImagenesDB,
  eliminarNombreProductoDB,eliminarPrecioProductoDB,eliminarTallesProductoDB,eliminarColoresProductoDB,eliminarStockProductoDB,eliminarDetalleProductoDB,eliminarDescripcionProductoDB} from "../model/carritoDB.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path"; 
import dotenv from "dotenv" 
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";






dotenv.config(); 



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploaddirectorio = path.join(__dirname, "../uploads");
const urlBack = process.env.URL_BACKEND;   






export async function administradorControlador(req,res){ 

  let obtenerAdmistradorModel=await administradorModel() 

  if(obtenerAdmistradorModel){ 
    console.log('la data',obtenerAdmistradorModel.data)
    res.json(obtenerAdmistradorModel.data)

  }


}


export async function administradorRegistro(req, res) { 
    let { nombre_usuario, email, contrasena } = req.body;
    let data = { nombre_usuario, email, contrasena,verificado:true };

    try {
        let response = await administradorLogeoDB(data);

        if (!response.success) {
          throw new Error("no se registro el administrador")
        }

        res.json({ actualizado: true, data: response.data });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    } 

  
}    



 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export default storage;
  

 


  export const respuestaInsercion = async (req, res) => { 
    const { nombre_producto, precio, categorias, colores, talles, stock, detalles, descripcion } = req.body;
    // Si multer está configurado para subir a Cloudinary, req.files trae info con URL en path o secure_url
    console.log(nombre_producto, precio, colores, talles, stock, detalles, descripcion);

    // En req.files tienes un array de objetos de archivos subidos
    // Cloudinary normalmente devuelve URL en file.path o file.secure_url, verifica cuál usas
   // Extraer las URLs de las imágenes subidas a Cloudinary
  const imagenes = Array.isArray(req.files) && req.files.length > 0
    ? req.files.map(file => file.path || file.secure_url).filter(Boolean) // filtra nulos si algún archivo falló
    : [];

    let categoria_id = categorias;

    try {
        // Validar campos obligatorios
        if (!nombre_producto || !precio || !detalles || !descripcion || !categoria_id) {
            throw new Error("⚠️ Faltan campos obligatorios");
        }

        // Validar que se hayan subido imágenes
        if (!imagenes.length) {
            throw new Error("⚠️ No se subieron imágenes a Cloudinary");
        }

        // Insertar producto en la base de datos
        const productos = await insertarCarritoDB({
            nombre_producto,
            precio,
            categoria_id,
            detalles,
            descripcion
        }); 

        console.log(productos);
        console.log("🛍️ Producto insertado:", productos);
        console.log(imagenes, 'URLs de imágenes Cloudinary');

        // Preparar datos para insertar imágenes con producto_id
        const datos = {
            urls: imagenes,
            producto_id: productos.producto_id
        };

        console.log("Datos para insertar imágenes:", datos);

        // Insertar imágenes en la base de datos
        const insertarImagenControlador = await insertarImagenDB(datos);
        console.log('Imágenes insertadas:', insertarImagenControlador);

        // Responder con éxito
        res.status(201).json({ message: "🎉 Producto insertado correctamente", nombre: nombre_producto, id: productos.producto_id });

    } catch (err) {
        console.error("🚨 Error al insertar el producto:", err.message);
        res.status(500).json({ error: err.message });
    }
};



export const upload = multer({ storage: storage }); 




 export async function ingresoCaracterticasController(req, res) {

  

  const { insertar_talle,insertar_color,stock,producto_id} = req.body; 

    console.log(insertar_color, insertar_talle,stock, 'colores y talles')
      try {
        // Verificar si se recibieron colores y talles
       if (!insertar_color || !insertar_talle || !stock || !producto_id) {
            throw new Error("⚠️ Faltan campos obligatorios");
        }

   

        // Insertar colores y talles en la base de datos
        const coloresInsertados = await ingresarColoresDB({insertar_color:insertar_color});
        const tallesInsertados = await ingresarTallesDB({insertar_talle:insertar_talle});
  
        console.log(coloresInsertados, tallesInsertados, 'colores y talles insertados')

        const color_id=await coloresAgregarID(coloresInsertados[0].color_id)
        const talle_id=await tallesAgregarID(tallesInsertados[0].talle_id) 
        console.log(color_id, talle_id, 'colores y talles id') 
          console.log(producto_id, 'producto_id')
   

        let variantes = await ingresarIDVariantesDB({
            producto_id: producto_id,
            talle_id,
            color_id,
            stock
          });
            console.log('variantes',variantes)        

        res.json("🎉 Características ingresadas correctamente");  



    } catch (err) {
        console.error("❌ Error al ingresar características:", err);
        res.status(500).json({ error: err.message });
    } 

} 




export async function updateNombreProducto(req,res){ 

  try {
    const { nombre_producto } = req.body;
    const { id } = req.params;
    
    const error = await updateNombreProductoDB(nombre_producto, id);
    if (error) return res.status(500).json({ error });

    res.json({ mensaje: "Nombre actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 

export async function updatePrecioProducto(req,res){ 

  let {precio}=req.body 

  let id=req.params.id 

  updatePrecioProductoDB(precio,id)

  res.json("actualizado")

} 

export async function updateCategoriaProducto(req,res){ 

  let {nombre_categoria}=req.body 

  let id=req.params.id 

  updateCategoriaProductoDB(nombre_categoria,id)



  res.json("actualizado")

} 


export async function updateDetallesProducto(req,res){ 

  let {detalles}=req.body 

  let id=req.params.id  

  updateDetallesProductoDB(detalles,id)

  res.json("actualizado")

} 

export async function updateDescripcionProducto(req,res){ 

  let {descripcion}=req.body 

  let id=req.params.id 

  updateDescripcionProductoDB(descripcion,id)

  res.json("actualizado")

} 

export async function updateColorProducto(req, res) {
  try {
    const {
      insertar_color,     // Nuevo nombre del color (para tabla "colores")
      producto_id,        // ID del producto    
    } = req.body;

    const color_id = req.params.id; // ID del color a modificar

    console.log("🎯 ID del color:", color_id);
    console.log("📝 Nuevo nombre del color:", insertar_color);

    // Ejecutar la función que actualiza ambas tablas
    await updateColorProductoDB(insertar_color, color_id, producto_id);

    res.status(200).json("Color actualizado correctamente");
  } catch (error) {
    console.error("❌ Error en controlador:", error.message);
    res.status(500).json({ error: error.message });
  }
}





export async function updateTalleProducto(req,res){ 

  const {
    insertar_talle,     
    producto_id,          
  } = req.body;

  let talle_id=req.params.id 

  try{  

    updateTalleProductoDB(insertar_talle,talle_id,producto_id)

     res.json("actualizado")

  } 

  catch(err){ 

    console.log('hubo un error al actualizar la variante')

  }

}  

export async function updateStockProducto(req,res){ 

  try {
    const { producto_id,stock } = req.body;
    let variante_id=req.params.id 

    if (typeof stock !== "number") {
      return res.status(400).json({ error: "Stock debe ser un número" });
    }

    const error = await updateStockProductoDB(stock,variante_id,producto_id);
    if (error) return res.status(500).json({ error });

    res.json({ mensaje: "Stock actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}  





export async function deleteCarrito(req, res) {
  let { id } = req.params;
  let { color_id, talle_id } = req.body;

  console.log("ID recibido:", id, "Color ID:", color_id, "Talle ID:", talle_id);

  try {
    let data = await borrarCarritoDB(id, color_id, talle_id);

    if (!data) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ eliminado: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error eliminando el producto", error: err.message });
  }
} 
 






export async function obtenerImagenesController(req, res) {
  try {
    let data = await obtenerImagenesDB(); 
    console.log(data);

    let dataImagenes = data.map(imagen => {
      return {
        imagenes_id: imagen.imagenes_id,
        producto_id: imagen.producto_id,
        urls: Array.isArray(imagen.urls) ? imagen.urls : [imagen.urls]  // asegurar que sea array
      };
    });

    if (dataImagenes.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron imágenes' });
    }

    res.json({ data: dataImagenes });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error obteniendo imágenes', error: err.message });
  }
}


export async function agregarImagenesController(req, res) {
  const productoID = req.body.productoID;
  console.log(productoID, 'productoID');
  console.log(req.files, 'files');

  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('No se recibieron imágenes');
    }

    // Procesar y obtener URLs públicas (y public_ids) de Cloudinary
    // Asumiendo que req.files ya contiene las imágenes subidas a Cloudinary con su propiedad 'path' o 'secure_url'
    // Si no es así, tendrías que subirlas aquí con cloudinary.uploader.upload()

    // Aquí asumimos que multer con cloudinary ya subió las imágenes y en req.files tienes la info
        const imageData = req.files.map(file => ({
      url: file.path || file.secure_url,
      public_id: file.public_id || file.filename || null
    }));


    // Guardar URLs en la base de datos asociado al productoID
    // Adaptar agregarImagenesDB para que reciba array de { url, public_id }
    const imageUrls = await agregarImagenesDB(productoID, imageData);

    res.json({ message: 'Imágenes agregadas correctamente', data: imageUrls });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


 export async function actualizarImagenesController(req, res) {
    const id = req.params.id;
    const urlAntigua = req.body.urlAntigua;

    if (!id) return res.status(400).json({ error: 'Falta el ID del registro' });
    if (!urlAntigua) return res.status(400).json({ error: 'Falta la URL antigua' });

    console.log(id, 'id');
    console.log(urlAntigua, 'URL Antigua');
    console.log(req.files, 'files');

    let imagenNueva = null;
    if (req.files && req.files.length > 0) {
        imagenNueva = req.files[0].secure_url || req.files[0].path;
    }

    if (!imagenNueva) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen nueva' });
    }

    try {
        // Extraer public_id de la URL antigua
        const partesUrl = urlAntigua.split('/');
        const nombreArchivoConExt = partesUrl[partesUrl.length - 1]; // e.g. imagen123.jpg
        const carpeta = partesUrl[partesUrl.length - 2];             // e.g. productos
        const publicIdAntiguo = `${carpeta}/${nombreArchivoConExt.split('.')[0]}`;

        // Eliminar imagen antigua en Cloudinary
        const resultDestroy = await cloudinary.uploader.destroy(publicIdAntiguo);
        console.log('Resultado eliminación en Cloudinary:', resultDestroy);

        // Actualizar DB con la URL nueva
        const dataImagen = await actualizarImagenesDB(id, urlAntigua, imagenNueva);

        if (!dataImagen) throw new Error('No se pudo actualizar la imagen en la base de datos');

        res.json({ message: 'Imagen actualizada correctamente', data: dataImagen });

    } catch (err) {
        console.error("Error al actualizar la imagen:", err.message);
        res.status(500).json({ error: err.message });
    }
}




export async function eliminarImagenesController(req, res) {
    const id = req.params.id; // ID de la imagen a eliminar
    const urlAntigua = req.body.urlAntigua; // URL antigua de la imagen a eliminar

    try {
        if (!urlAntigua) {
            throw new Error('No se recibió la URL antigua');
        }

        // Extraer public_id de la URL (ejemplo simple)
        // Asumiendo que tu URL tiene formato:
        // https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/carpeta/archivo.jpg
        // quieres obtener 'carpeta/archivo' sin extensión
        
        const partesUrl = urlAntigua.split('/');
        const nombreArchivoConExtension = partesUrl[partesUrl.length - 1]; // archivo.jpg
        const carpeta = partesUrl[partesUrl.length - 2]; // carpeta
        const publicId = `${carpeta}/${nombreArchivoConExtension.split('.')[0]}`; 

        // Eliminar imagen de Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Eliminar la referencia en base de datos
        const dataImagen = await eliminarImagenesDB(id, urlAntigua);

        if (!dataImagen) {
            throw new Error('No se pudo eliminar la imagen de la base de datos');
        }

        res.json({ mensaje: "Imagen eliminada con éxito" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function  eliminarNombrecontroller(req,res){


  let id=req.params.id 

await eliminarNombreProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarPrecioController(req,res){


  let id=req.params.id 

   await eliminarPrecioProductoDB(id)

  res.json("actualizado")
} 



export async function eliminarTallesController(req,res){


  let id=req.params.id 
  const producto_id=req.body.producto_id

   await eliminarTallesProductoDB(id,producto_id)

  res.json("actualizado")
} 

export async function eliminarColoresController(req,res){

  const producto_id=req.body.producto_id
  let id=req.params.id 

   await eliminarColoresProductoDB(id,producto_id)

  res.json("actualizado")
} 

export async function eliminarStockController(req,res){

  
  let id=req.params.id 
  
  const producto_id=req.body.producto_id
 
   await eliminarStockProductoDB(id,producto_id) 

  res.json("actualizado")
} 

export async function eliminarDetalleController(req,res){


  let id=req.params.id 
 
   await eliminarDetalleProductoDB(id)

  res.json("actualizado")
} 

export async function eliminarDescripcionController(req,res){


  let id=req.params.id 
 
   await eliminarDescripcionProductoDB(id)

  res.json("actualizado")
} 













