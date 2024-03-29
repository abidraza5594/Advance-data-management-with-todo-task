import { NgModule, isDevMode } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddDataComponent } from './add-data/add-data.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { dataReducer } from './Store/data.reducer';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { ManageTodoComponent } from './manage-todo/manage-todo.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import "ag-grid-enterprise";
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { ActionsRendererComponentComponent } from './actions-renderer-component/actions-renderer-component.component'
import { TaskNameRendererComponent } from './Components/task-name-renderer.component';
import { ActionsRendererComponent } from './Components/actions-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    AddDataComponent,
    HomeComponent,
    AddTodoComponent,
    ManageTodoComponent,
    ManageUserComponent,
    DeleteButtonComponent,
    ActionsRendererComponentComponent,
    TaskNameRendererComponent,
    ActionsRendererComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    EffectsModule.forRoot([]),
    StoreModule.forRoot({apiData:dataReducer}),

    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    BsDatepickerModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AgGridModule


  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [TaskNameRendererComponent],
})
export class AppModule { }
