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
   * Funcion que recoge todos los datos de firebase
   */
  reedTodo(): Observable<firebase.default.firestore.QuerySnapshot>{
    return this.myCollection.get();
  }

  /**
   * Funcion que lanza un time out y setea los datos que recibe de la funcion anterior a un array para ser usados.
   * @param user string que contiene el id del usuario que esta logeado
   * @param timer number que contiene el timpo que dura el time out
   */
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

  

  /**
   * Funcion que añade una nueva comida a firebase 
   * @param myComida 
   */
  addTodo(myComida:Comida):Promise<firebase.default.firestore.DocumentReference>{
    console.log("service");
   return this.myCollection.add(myComida);
  }

  /**
   * Funcion para obtener todos los datos de una reserva mediante el id
   * @param id string con el identificador de la reserva
   */
  readTodoById(id:string):Observable<firebase.default.firestore.DocumentSnapshot>{
    return this.myCollection.doc(id).get();
  }

  /**
   * Funcion que actualiza una comida mediante su id
   * @param id string que contiene el identificador de la reserva
   * @param data Comida 
   */
  updateTodo(id:string, data:Comida):Promise<void>{
    return this.myCollection.doc(id).set(data);
  }

  /**
   * Funcion que elimina una reserva segun su id de firebase
   * @param id string con el identificador de la reserva
   */
  deleteTodo(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
  }

/**
 * funcion que filtra mediante el parametro de la fecha
 * @param fecha string con la fecha a filtrar
 */
  searchTodo(fecha:string): Observable<firebase.default.firestore.DocumentSnapshot>{
    return this.myCollection.doc(fecha).get();
  }

}
