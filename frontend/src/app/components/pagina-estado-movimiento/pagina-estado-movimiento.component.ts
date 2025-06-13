import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { Movimiento } from 'src/app/models/movimiento';

@Component({
  selector: 'app-pagina-estado-movimiento',
  templateUrl: './pagina-estado-movimiento.component.html',
  styleUrls: ['./pagina-estado-movimiento.component.css']
})
export class PaginaEstadoMovimientoComponent implements OnInit {
  movimiento : Movimiento | undefined;
  isLoading = true;

  estados = [
    { key: 'PEDIDO_CRISTALES', label: 'Pidiendo Cristales', image: 'assets/estadoMovimiento/lupa.gif' },
    { key: 'ARMANDO_PEDIDO', label: 'Armando el Pedido', image: 'assets/estadoMovimiento/reparar.gif' },
    { key: 'ANTEOJO_TERMINADO', label: '¡Listo! Podés pasar a buscarlo', image: 'assets/estadoMovimiento/guiño.gif' },
    { key: 'ENTREGADO', label: 'Pedido Entregado', image: 'assets/estadoMovimiento/entregado.gif' } 
  ];

  constructor(
    private route: ActivatedRoute,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movimientoService.getMovimiento(id).subscribe({
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
    if (!this.movimiento) return '0%';

    switch (this.movimiento.estadoMovimiento) {
      case 'PEDIDO_CRISTALES':
        return '25%';
      case 'ARMANDO_PEDIDO':
        return '50%';
      case 'ANTEOJO_TERMINADO':
        return '75%';
      case 'ENTREGADO':
        return '100%'; // misma barra que "terminado"
      default:
        return '0%';
    }
  }

  getProgressClass(): string {
    if (!this.movimiento) return '';

    switch (this.movimiento.estadoMovimiento) {
      case 'PEDIDO_CRISTALES':
        return 'progress-step1';
      case 'ARMANDO_PEDIDO':
        return 'progress-step2';
      case 'ANTEOJO_TERMINADO':
      case 'ENTREGADO':
        return 'progress-step3';
      default:
        return '';
    }
  }

  getEstadoTexto(): string {
    if (!this.movimiento) return '';
  
    switch (this.movimiento.estadoMovimiento) {
      case 'PEDIDO_CRISTALES':
        return 'Tu pedido está en proceso, ya solicitamos los cristales.';
      case 'ARMANDO_PEDIDO':
        return 'Estamos terminando de armar tu pedido. Entre hoy y mañana estará listo para que lo retires.';
      case 'ANTEOJO_TERMINADO':
        return '¡Tu pedido está listo! Podés pasar a retirarlo cuando gustes. Te esperamos de lunes a viernes 8:30 a 13:00 y de 16:30 a 20:00.';
      case 'ENTREGADO':
        return 'Gracias por confiar en nosotros. Tu pedido fue entregado. Recordá que tenes ajustes ilimitados y totalmente gratuitos. Te esperamos.';
      default:
        return 'Estamos procesando tu pedido.';
    }
  }
}

