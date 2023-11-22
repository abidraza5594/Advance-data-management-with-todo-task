import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateDataService {

  constructor() { }

  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  private actionSubject = new BehaviorSubject<any>(null);
  public action$ = this.dataSubject.asObservable();

  private actionDelete= new BehaviorSubject<any>(null);
  public actionD$ = this.dataSubject.asObservable();
  
  sendUpdatedData(data:any){
    this.dataSubject.next(data);
  }
  getUpdatedData(){
    return this.dataSubject.value;
  }

  sendDeletedData(data:any){
    this.actionDelete.next(data);
  }
  getDeletedData(){
    return this.actionDelete.value;
  }

  setAction(data:any){
    this.actionSubject.next("ytgvkvhlui");
  }
  getAction(){
    return this.actionSubject.value;
  }





}
