import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Local } from 'src/app/models/local';
import { LocalService } from 'src/app/services/local.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { MetodoPago } from 'src/app/models/metodoPago';
import { ProductoService } from 'src/app/services/producto.service';
import { StockTotalSucursal } from 'src/app/dto/StockTotalSucursal';
import { PacienteService } from 'src/app/services/paciente.service';
import { PacientesPorSucursal } from 'src/app/dto/PacientesPorSucursal';
import { StockPorMaterial } from 'src/app/dto/StockPorMaterial';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-pagina-estadistica',
  templateUrl: './pagina-estadistica.component.html',
  styleUrls: ['./pagina-estadistica.component.css']
})
export class PaginaEstaditicaComponent {
  
  
}
