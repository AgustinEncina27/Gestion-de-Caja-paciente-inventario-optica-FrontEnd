import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductoService } from './services/producto.service';
import { PacienteService } from './services/paciente.service';
import { MovimientoService } from './services/movimiento.service';
import { LocalService } from './services/local.service';
import { ExcelService } from './services/excel.service';
import { MetodoPagoService } from './services/metodoPago.service';
import { CategoriaService } from './services/categoria.service';
import { MarcaService } from './services/marca.service';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/user/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthToken } from './services/interceptors/auth.interceptor';
import { TokenInterceptor } from './services/interceptors/token.interceptor';
import { ListarProductoComponent } from './components/listar-producto/listar-producto.component';
import { ListarPacienteComponent } from './components/listar-paciente/listar-paciente.component';
import { ListarMovimientoComponent } from './components/listar-movimiento/listar-movimiento.component';
import { PaginaPrincipalComponent } from './components/pagina-principal/pagina-principal.component';
import { PaginaSobreNosotrosComponent } from './components/pagina-sobre-nosotros/pagina-sobre-nosotros.component';
import { PaginaCristaleriaComponent } from './components/pagina-cristaleria/pagina-cristaleria.component';
import { PaginaFiltrarProductoComponent } from './components/pagina-filtrar-producto/pagina-filtrar-producto.component';
import { PaginaCrearEditarProductoComponent } from './components/pagina-crear-editar-producto/pagina-crear-editar-producto.component';
import { PaginaCrearEditarPacienteComponent } from './components/pagina-crear-editar-paciente/pagina-crear-editar-paciente.component';
import { PaginaCrearEditarMovimientoComponent } from './components/pagina-crear-editar-movimiento/pagina-crear-editar-movimiento.component';
import { PaginaGestionarCategoriasComponent } from './components/pagina-gestionar-categorias/pagina-gestionar-categorias.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { PaginaVisitanosComponent } from './components/pagina-visitanos/pagina-visitanos.component';
import { PaginaGestionarMarcasComponent } from './components/pagina-gestionar-marcas/pagina-gestionar-marcas.component';
import { PaginaGestionarMetodosPagosComponent } from './components/pagina-gestionar-metodoPago/pagina-gestionar-metodoPago.component';
import { PaginaGestionarLocalesComponent } from './components/pagina-gestionar-locales/pagina-gestionar-locales.component';
import { PaginaGestionarPacientesComponent } from './components/pagina-gestionar-pacientes/pagina-gestionar-pacientes.component';
import { PaginaGestionarCajaComponent } from './components/pagina-gestionar-caja/pagina-gestionar-caja.component';
import { PaginaEstadoMovimientoComponent } from './components/pagina-estado-movimiento/pagina-estado-movimiento.component';
import { MaterialProductoService } from './services/materialProducto.service';
import { PaginaGestionarMaterialProductoComponent } from './components/pagina-gestionar-material-producto/pagina-gestionar-material-producto.component';
import { PaginaGestionarProveedoresComponent } from './components/pagina-gestionar-proveedores/pagina-gestionar-proveedores.component';
import { PaginaEstaditicaComponent } from './components/pagina-estadistica/pagina-estadistica.component';
import { PaginaCrearVariosProductosComponent } from './components/pagina-crear-varios-productos/pagina-crear-varios-productos.component';
import { PaginaActualizarProductosComponent } from './components/pagina-actualizar-productos/pagina-actualizar-productos.component';
import { FichaGraduacionService } from './services/FichaGraduacionService';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ListarProductoComponent,
    ListarPacienteComponent,
    PaginaPrincipalComponent,
    PaginaSobreNosotrosComponent,
    PaginaCristaleriaComponent,
    PaginaFiltrarProductoComponent,
    PaginaCrearEditarProductoComponent,
    PaginaCrearVariosProductosComponent,
    PaginaCrearEditarPacienteComponent,
    PaginaGestionarCategoriasComponent,
    WhatsappComponent,
    PaginaVisitanosComponent,
    PaginaGestionarMarcasComponent,
    PaginaGestionarMaterialProductoComponent,
    PaginaGestionarMetodosPagosComponent,
    PaginaGestionarProveedoresComponent,
    PaginaGestionarLocalesComponent,
    PaginaGestionarPacientesComponent,
    PaginaGestionarCajaComponent,
    PaginaCrearEditarMovimientoComponent,
    PaginaEstadoMovimientoComponent,
    PaginaEstaditicaComponent,
    ListarMovimientoComponent,
    PaginaActualizarProductosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ProductoService,
    CategoriaService,
    MarcaService,
    MaterialProductoService,
    PacienteService,
    FichaGraduacionService,
    MovimientoService,
    LocalService,
    MetodoPagoService,
    ExcelService,
    ProductoService,
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:AuthToken,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
