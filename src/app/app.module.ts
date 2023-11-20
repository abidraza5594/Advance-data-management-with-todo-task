import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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


@NgModule({
  declarations: [
    AppComponent,
    AddDataComponent,
    HomeComponent,
    AddTodoComponent,
    ManageTodoComponent,
    ManageUserComponent,
    
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
    MatIconModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
