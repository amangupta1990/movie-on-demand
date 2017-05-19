import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {

  constructor(public http: Http) {
    console.log('Hello DataService Provider');
  }

  getData(){
    return this.http.get("/movies")
    .map(data=>{
      return data.json();
    })
  }

  getHistory(){
    return this.http.get("/history")
    .map(data=>{
      return data.json();
    })
  }

  updateLastWatched(movieId){
    return this.http.post("/history",{data:movieId})
    .map(data=>{
      return data.json();
    })
  }

}
