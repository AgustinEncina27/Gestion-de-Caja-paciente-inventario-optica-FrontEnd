import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login.component';
import { PaginaPrincipalComponent } from './components/pagina-principal/pagina-principal.component';
import { PaginaSobreNosotrosComponent } from './components/pagina-sobre-nosotros/pagina-sobre-nosotros.component';
import { PaginaFiltrarProductoComponent } from './components/pagina-filtrar-producto/pagina-filtrar-producto.component';
import { PaginaCristaleriaComponent } from './components/pagina-cristaleria/pagina-cristaleria.component';
import { PaginaCrearEditarProductoComponent } from './components/pagina-crear-editar-producto/pagina-crear-editar-producto.component';
import { PaginaCrearEditarPacienteComponent } from './components/pagina-crear-editar-paciente/pagina-crear-editar-paciente.component';
import { PaginaGestionarCategoriasComponent } from './components/pagina-gestionar-categorias/pagina-gestionar-categorias.component';
import { PaginaVisitanosComponent } from './components/pagina-visitanos/pagina-visitanos.component';
import { PaginaGestionarMarcasComponent } from './components/pagina-gestionar-marcas/pagina-gestionar-marcas.component';
import { PaginaGestionarLocalesComponent } from './components/pagina-gestionar-locales/pagina-gestionar-locales.component';
import { PaginaEstadoMovimientoComponent } from './components/pagina-estado-movimiento/pagina-estado-movimiento.component';
import { PaginaGestionarPacientesComponent } from './components/pagina-gestionar-pacientes/pagina-gestionar-pacientes.component';
import { PaginaGestionarCajaComponent } from './components/pagina-gestionar-caja/pagina-gestionar-caja.component';
import { PaginaGestionarMetodosPagosComponent } from './components/pagina-gestionar-metodoPago/pagina-gestionar-metodoPago.component';
import { PaginaCrearEditarMovimientoComponent } from './components/pagina-crear-editar-movimiento/pagina-crear-editar-movimiento.component';
import { PaginaGestionarMaterialProductoComponent } from './components/pagina-gestionar-material-producto/pagina-gestionar-material-producto.component';
import { PaginaGestionarProveedoresComponent } from './components/pagina-gestionar-proveedores/pagina-gestionar-proveedores.component';
import { PaginaEstaditicaComponent } from './components/pagina-estadistica/pagina-estadistica.component';
import { PaginaCrearVariosProductosComponent } from './components/pagina-crear-varios-productos/pagina-crear-varios-productos.component';
import { PaginaActualizarProductosComponent } from './components/pagina-actualizar-productos/pagina-actualizar-productos.component';

const routes: Routes = [
  {path:'', redirectTo:'/inicio', pathMatch:'full'},
  {path:'inicio',component: PaginaPrincipalComponent},
  {path:'productos/page/:page', component: PaginaFiltrarProductoComponent }, 
  {path: 'productos', redirectTo: 'productos/page/0', pathMatch: 'full' }, 
  {path:'sobreNosotros',component: PaginaSobreNosotrosComponent},
  {path:'cristaleria',component: PaginaCristaleriaComponent},
  {path:'crearProducto',component: PaginaCrearEditarProductoComponent},
  {path:'crearVariosProductos',component: PaginaCrearVariosProductosComponent},
  {path:'crearMovimiento',component: PaginaCrearEditarMovimientoComponent},
  {path:'crearPaciente',component: PaginaCrearEditarPacienteComponent},
  {path:'editarProducto/:id',component: PaginaCrearEditarProductoComponent},
  {path:'editarPaciente/:id',component: PaginaCrearEditarPacienteComponent},
  {path:'editarMovimiento/:id',component: PaginaCrearEditarMovimientoComponent},
  {path:'crearMovimiento/:pacienteId',component: PaginaCrearEditarMovimientoComponent},
  {path:'adminitrarCategoria',component: PaginaGestionarCategoriasComponent},
  {path:'adminitrarProveedor',component: PaginaGestionarProveedoresComponent},
  {path:'adminitrarMarca',component: PaginaGestionarMarcasComponent},
  {path:'adminitrarMaterial',component: PaginaGestionarMaterialProductoComponent},
  {path:'adminitrarMetodoPago',component: PaginaGestionarMetodosPagosComponent},
  {path:'adminitrarLocal',component: PaginaGestionarLocalesComponent},
  {path:'adminitrarPaciente',component: PaginaGestionarPacientesComponent},
  {path:'estadoCompra/:id',component: PaginaEstadoMovimientoComponent},
  {path:'adminitrarCaja',component: PaginaGestionarCajaComponent},
  {path:'estadistica',component: PaginaEstaditicaComponent},
  {path:'adminitrarCajaPaciente/:pacienteFicha',component: PaginaGestionarCajaComponent},
  {path:'visitanos',component: PaginaVisitanosComponent},
  {path:'actualizar-productos',component: PaginaActualizarProductosComponent},
  {path:'login',component: LoginComponent},
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
