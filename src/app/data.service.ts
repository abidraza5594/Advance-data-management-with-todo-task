import { Injectable ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService  {
  

  private apiUrl = 'https://6544d3e45a0b4b04436d0bfc.mockapi.io/food';
  constructor(private http: HttpClient,private store: Store<{apiData:any}>) { }
  getDataFromAPI(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  sendTodoEditData(data:any){
    this.dataSubject.next(data);
  }

  sendUpdatedData(data:any){
    this.dataSubject.next(data);
  }
  getUpdatedData(){
    return this.dataSubject.value;
  }

}
