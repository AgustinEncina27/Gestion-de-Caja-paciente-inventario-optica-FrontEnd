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
  movimiento!: Movimiento;
  isLoading = true;

  estados = [
    { key: 'PEDIDO_CRISTALES', label: 'Pidiendo Cristales', image: 'assets/estadoMovimiento/lupa.gif' },
    { key: 'ARMANDO_PEDIDO', label: 'Armando el Pedido', image: 'assets/estadoMovimiento/reparar.gif' },
    { key: 'ANTEOJO_TERMINADO', label: '¡Listo! Podes pasar a buscarlo', image: 'assets/estadoMovimiento/guiño.gif' }
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
        return '20%';
      case 'ARMANDO_PEDIDO':
        return '66%';
      case 'ANTEOJO_TERMINADO':
        return '100%';
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
        return 'progress-step3';
      default:
        return '';
    }
  }
}
