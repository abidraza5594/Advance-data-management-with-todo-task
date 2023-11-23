import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDataComponent } from './add-data/add-data.component';
import { HomeComponent } from './home/home.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { ManageTodoComponent } from './manage-todo/manage-todo.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const routes: Routes = [
  { path:'', component : HomeComponent,pathMatch: 'full'},
  {path:'edit/:id' , component : AddDataComponent},
  {path:'adddata' , component : AddDataComponent},
  {path:'addtodo' , component : AddTodoComponent},
  {path:'managetodo' , component : ManageTodoComponent},
  {path:'managetodo/edittodo/:id' , component : AddTodoComponent},
  {path:'manageuser',component:ManageUserComponent},
  {path:'manageuser/edittodo/:id',component:AddTodoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
