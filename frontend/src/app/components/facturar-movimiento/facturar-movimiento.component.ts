import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { FacturaService } from 'src/app/services/factura.service';
import Swal from 'sweetalert2';
import { SolicitudFacturaDTO } from 'src/app/dto/SolicitudfacturaDTO';
import { Movimiento } from 'src/app/models/movimiento';

@Component({
  selector: 'app-facturar-movimiento',
  templateUrl: './facturar-movimiento.component.html'
})
export class FacturarMovimientoComponent implements OnInit {
  form: FormGroup;
  idMovimiento: number | undefined ;
  cargando = true;
  movimiento: Movimiento = new Movimiento();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movimientoService: MovimientoService,
    private facturaService: FacturaService,
  ) {
    this.form = this.fb.group({
      tipoComprobante: ['B', Validators.required],
      tipoCliente: ['CONSUMIDOR_FINAL', Validators.required],
      dni: [null, [Validators.required, Validators.pattern(/^\d{7,9}$/)]]
    });
  }

  ngOnInit(): void {
    this.idMovimiento = +this.route.snapshot.paramMap.get('idMovimiento')!;
    this.movimientoService.getMovimiento(this.idMovimiento).subscribe({
      next: movimiento => {
        this.movimiento = movimiento;
        // Podés precargar datos si tenés el cliente guardado
        this.cargando = false;

        // Prellenar DNI si el paciente lo tiene
        if (movimiento.paciente?.documento) {
          this.form.patchValue({ dni: movimiento.paciente.documento });
        }
      },
      error: () => {
        Swal.fire('Error', 'No se encontró el movimiento.', 'error');
        this.router.navigate(['/caja']);
      }
    });
  }

  emitirFactura(): void {
    if (this.form.invalid) return;

    Swal.fire({
      title: '¿Deseás emitir la factura?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, emitir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const dto: SolicitudFacturaDTO = {
          movimientoId: this.idMovimiento!,
          tipoComprobante: this.form.value.tipoComprobante,
          tipoCliente: this.form.value.tipoCliente,
          dni: this.form.value.dni
        };

        this.facturaService.emitirFactura(dto).subscribe({
          next: () => {
            Swal.fire({
              title: 'Factura emitida',
              text: 'La factura fue generada correctamente.',
              icon: 'success',
              confirmButtonText: 'Volver a Caja'
            }).then(() => {
              this.router.navigate(['/adminitrarCaja']);
            });
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo emitir la factura.', 'error');
          }
        });
      }
    });
  }

  mostrarMetodoPago(pago: any): string {
    const tipo = pago.metodoPago?.tipo;
    let texto = tipo?.replace('_', ' ').toUpperCase(); // ej: TARJETA CREDITO
  
    // Si es tarjeta, agregar tipo de tarjeta
    if (tipo === 'TARJETA_CREDITO' || tipo === 'TARJETA_DEBITO') {
      const detalle = pago.metodoPago?.tarjetaDetalle;
      if (detalle?.tipoTarjeta) {
        texto += ' - ' + detalle.tipoTarjeta.nombre;
        if (detalle.tipoTarjeta.nombre === 'OTRA' && detalle.nombreOtro) {
          texto += ` (${detalle.nombreOtro})`;
        }
      }
    }
  
    return texto;
  }

}
