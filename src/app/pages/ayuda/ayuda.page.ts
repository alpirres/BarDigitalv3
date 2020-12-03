import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  items: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ]

  changeIndex(index: number) {
    if( this.items[index]){
      this.closeAll();
      this.items[index] = !this.items[index];
    }else{
      this.closeAll();
    }
  }

  closeAll(){
    for(let i=0;i<this.items.length; i++){
     this.items[i]=true; 
    }
  }

}
