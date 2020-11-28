import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { Comida } from '../Model/Comida';

@Injectable({
  providedIn: 'root'
})

//este es el servicio que se comunica con firebase
export class ReservaService {

  myCollection:AngularFirestoreCollection;
  
  constructor(private fireStore:AngularFirestore) { 
    this.myCollection=fireStore.collection<any>(environment.coleccion);
  }

   /**
   * 
   */
  reedTodo(): Observable<firebase.default.firestore.QuerySnapshot>{
    return this.myCollection.get();
  }

  readTodo(user: string, timer: number=10000): Observable<Comida[]>{
    return new Observable((observer)=>{
      let subcripcion:Subscription;
      let tempo=setTimeout(()=>{
        subcripcion.unsubscribe();
        observer.error("TimeOut passsssssed")
      },timer);
      subcripcion=this.reedTodo().subscribe((lista)=>{
        clearTimeout(tempo);
        let listado=[];
        lista.docs.forEach((comida)=>{
          if(user==comida.data().userId){
            listado.push({id: comida.id, ...comida.data()})
          }
        });
        observer.next(listado);
        observer.complete();
      })
    });
  }

  /* leerNotasPorUsuario(user: string, loadmore: number, howmany: number): Observable<firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>> {
    console.log(user);
    if (loadmore == 0) {
      this.nextQueryAfter = null;
    }

    this.myCollection = this.getCollectionQuery(user);
    return new Observable((observer) => {
      //observer.next()   observer.error();   observer.complete();
      let subscripcion: Subscription;
      let tempo = setTimeout(() => {
        subscripcion.unsubscribe();
        console.log("aaaaaaaaaaaaaaaaaaaaaa"); 
      }, 5000);
      subscripcion = this.conexionColeccion.get().subscribe(res => {
        console.log("entrando suscripcion");

        this.nextQueryAfter = res.docs[res.docs.length - 1] as QueryDocumentSnapshot<nota>;


        clearTimeout(tempo);
        observer.next(res);
        observer.complete();
      },
        err => { 
          console.log("eeeeeeeeeeeeeeeeeeeeeeee"); 
          observer.error(console.log(err)) },
      )
    });
  } */

  /**
   * funcion que añade una nueva comida 
   * @param myComida 
   */
  addTodo(myComida:Comida):Promise<firebase.default.firestore.DocumentReference>{
    console.log("service");
   return this.myCollection.add(myComida);
  }

  /**
   * funcion para obtener todos los datos
   * @param id 
   */
  readTodoById(id:string):Observable<firebase.default.firestore.DocumentSnapshot>{
    return this.myCollection.doc(id).get();
  }

  /**
   * funcion que actualiza una comida mediante su id
   * @param id 
   * @param data 
   */
  updateTodo(id:string, data:Comida):Promise<void>{
    return this.myCollection.doc(id).set(data);
  }

  /**funcion que elimina
   * 
   * @param id 
   */
  deleteTodo(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
  }

/**
 * funcion que filtra mediante el parametro de la fecha
 * @param fecha 
 */
  searchTodo(fecha:string): Observable<firebase.default.firestore.DocumentSnapshot>{
    return this.myCollection.doc(fecha).get();
  }

}
