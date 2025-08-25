import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MovimientoService } from 'src/app/services/movimiento.service';
import { MovimientoDTO, EstadoMovimiento } from 'src/app/dto/movimiento.dto';

@Component({
  selector: 'app-pagina-estado-movimiento',
  templateUrl: './pagina-estado-movimiento.component.html',
  styleUrls: ['./pagina-estado-movimiento.component.css']
})
export class PaginaEstadoMovimientoComponent implements OnInit {
  movimiento: MovimientoDTO | null = null;
  isLoading = true;

  // catálogo de estados para la UI (tipado con el union del DTO)
  estados: Array<{ key: EstadoMovimiento; label: string; image: string }> = [
    { key: 'PEDIDO_CRISTALES',  label: 'Pidiendo Cristales',                image: 'assets/estadoMovimiento/lupa.gif' },
    { key: 'ARMANDO_PEDIDO',    label: 'Armando el Pedido',                 image: 'assets/estadoMovimiento/reparar.gif' },
    { key: 'ANTEOJO_TERMINADO', label: '¡Listo! Podés pasar a buscarlo',    image: 'assets/estadoMovimiento/guiño.gif' },
    { key: 'ENTREGADO',         label: 'Pedido Entregado',                  image: 'assets/estadoMovimiento/entregado.gif' }
  ];

  constructor(
    private route: ActivatedRoute,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      return;
    }

    // Usa el service basado en DTOs
    this.movimientoService.obtener(id).subscribe({
      next: (data) => {
        this.movimiento = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getProgressWidth(): string {
    const estado = this.movimiento?.estadoMovimiento;
    if (!estado) return '0%';
    switch (estado) {
      case 'PEDIDO_CRISTALES':  return '25%';
      case 'ARMANDO_PEDIDO':    return '50%';
      case 'ANTEOJO_TERMINADO': return '75%';
      case 'ENTREGADO':         return '100%';
      default:                  return '0%';
    }
  }

  getProgressClass(): string {
    const estado = this.movimiento?.estadoMovimiento;
    if (!estado) return '';
    switch (estado) {
      case 'PEDIDO_CRISTALES':  return 'progress-step1';
      case 'ARMANDO_PEDIDO':    return 'progress-step2';
      case 'ANTEOJO_TERMINADO':
      case 'ENTREGADO':         return 'progress-step3';
      default:                  return '';
    }
  }

  getEstadoTexto(): string {
    const estado = this.movimiento?.estadoMovimiento;
    if (!estado) return 'Estamos procesando tu pedido.';

    switch (estado) {
      case 'PEDIDO_CRISTALES':
        return 'Tu pedido está en proceso de solicitud de cristales. El tiempo estimado de entrega es de entre 10 y 15 días hábiles.';
      case 'ARMANDO_PEDIDO':
        return 'Estamos terminando de armar tu pedido. Entre hoy y mañana estará listo para que lo retires.';
      case 'ANTEOJO_TERMINADO':
        return '¡Tu pedido está listo! Podés pasar a retirarlo cuando gustes.';
      case 'ENTREGADO':
        return 'Gracias por confiar en nosotros. Tu pedido ya fue entregado. ¡Que lo disfrutes!';
      default:
        return 'Estamos procesando tu pedido.';
    }
  }
}
