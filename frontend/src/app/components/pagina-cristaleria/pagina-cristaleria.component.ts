import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-pagina-cristaleria',
  templateUrl: './pagina-cristaleria.component.html',
  styleUrls: ['./pagina-cristaleria.component.css']
})
export class PaginaCristaleriaComponent {

  constructor(private viewportScroller: ViewportScroller) { }

  scrollToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

}
