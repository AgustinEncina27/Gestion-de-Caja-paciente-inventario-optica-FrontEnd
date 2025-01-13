import { Component, Input, OnChanges,OnInit,SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit,OnChanges{
  @Input() paginador:any;
  @Input() url:string='';
  @Input() categoriaId:number=-1;
  @Input() marcaId:number=-1;
  @Input() genero:string='-1';
  paginas: number[]= [];
  desde:number=0;
  hasta:number=0;

  ngOnInit(){
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.url.includes("inicio")){
      this.url="/inicio/page/"
    }else{
      this.url="/productos/page/"
    }
    if (changes['paginador'] && changes['paginador'].previousValue !== undefined) {
      this.initPaginator();
    }
  }

  private initPaginator():void{
    this.desde= Math.min(Math.max(1,this.paginador.number-4),this.paginador.totalPages-5);
    this.hasta= Math.max(Math.min(this.paginador.totalPages,this.paginador.number+4),6);
    if(this.paginador.totalPages>5){
      this.paginas = new Array(this.hasta-this.desde+1).fill(0).map((_valor,indice)=> indice+this.desde);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor,indice)=> indice+1);
    }
  }
}
