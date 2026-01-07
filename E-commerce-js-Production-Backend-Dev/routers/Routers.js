import { authenticateToken, controladorAdmin,
        controladorLogeo, controladorUser,
        enviarProductos, nuevoRegistroControlador, recuperacionCuentaController, 
        recuperacionMailControlador,obtenerProductoID 
    } from "../controllers/Controladores.js"; 
 import { desactivarProductosController } from "../controllers/desactivarProductController.js";
 import { administradorRegistro, deleteCarrito, respuestaInsercion,  obtenerImagenesController,actualizarImagenesController, ingresoCaracterticasController, updateNombreProducto, updatePrecioProducto, updateDetallesProducto, updateDescripcionProducto, updateColorProducto, updateTalleProducto, updateStockProducto, updateCategoriaProducto, agregarImagenesController, eliminarImagenesController, eliminarNombrecontroller, eliminarPrecioController, eliminarTallesController, eliminarColoresController, eliminarStockController, eliminarDetalleController, eliminarDescripcionController, administradorControlador} from "../controllers/controladorAdmin.js";
 import { crearUser, obtenerUsuariosController } from "../controllers/controladorUser.js";
 import { upload } from "../controllers/controladorAdmin.js"; 
 import express from "express" 
 import { actualizarCategoriaController, agregarCategoriaControllers, desactivarCategoriasController, eliminarCategoriaController, getProductsCategorysController } from "../controllers/ControladorCategorias.js";




const router = express.Router(); 


router.get("/obtener-productos",enviarProductos) 
router.get("/obtener-productos/:id",obtenerProductoID)
router.get('/ruta-protegida', authenticateToken)
router.post("/login-logeado",controladorLogeo,controladorAdmin,controladorUser)
router.post("/login",administradorRegistro)     
router.post("/registro",crearUser) 
router.post("/recuperacion-cuenta",recuperacionCuentaController)
router.get('/verificar-email/:token', recuperacionMailControlador) 
router.get("/administrador",administradorControlador)
router.post("/nuevo-registro",nuevoRegistroControlador) 
router.get("/obtener-usuarios",obtenerUsuariosController)
router.post("/agregar-categorias",agregarCategoriaControllers)
router.get("/obtener-categorias",getProductsCategorysController) 
router.get("/obtener-imagenes",obtenerImagenesController)
router.put("/actualizar-categoria/:id",actualizarCategoriaController)
router.put("/desactivar-productos/:id",desactivarProductosController)
router.put("/desactivar-categoria",desactivarCategoriasController) 
router.delete("/eliminar-categoria/:id",eliminarCategoriaController)
router.post("/subir-productos",upload.array('images',100),respuestaInsercion) 
router.post("/agregar-imagenes",upload.array('images',100),agregarImagenesController) 
router.put("/update-nombre-producto/:id",updateNombreProducto) 
router.put("/update-precio-producto/:id",updatePrecioProducto) 
router.put("/update-producto-detalles/:id",updateDetallesProducto) 
router.put("/update-producto-categoria/:id",updateCategoriaProducto) 
router.put("/update-precio-descripcion/:id",updateDescripcionProducto) 
router.put("/update-color-producto/:id",updateColorProducto) 
router.put("/update-talle-producto/:id",updateTalleProducto) 
router.put("/update-stock-producto/:id",updateStockProducto) 
router.put("/delete-nombre-producto/:id",eliminarNombrecontroller)
router.put("/delete-precio-producto/:id",eliminarPrecioController)
router.put("/delete-talle-producto/:id",eliminarTallesController)
router.put("/delete-color-producto/:id",eliminarColoresController)
router.put("/delete-stock-producto/:id",eliminarStockController)
router.put("/delete-producto-detalles/:id",eliminarDetalleController)
router.put("/delete-producto-descripcion/:id",eliminarDescripcionController)
router.put("/actualizar-imagenes/:id",upload.array('images',100),actualizarImagenesController)
router.delete("/eliminar_imagenes/:id",eliminarImagenesController)
router.post("/insertar-caracteristicas",ingresoCaracterticasController)
router.delete("/borrar-productos/:id",deleteCarrito) 





export default router 


    
