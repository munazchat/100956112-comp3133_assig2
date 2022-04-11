import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { SignupComponent } from './signup/signup.component';
import {SignnupComponent} from "./signup/signup.component";
import {RouterModule, Routes} from "@angular/router";
const routes: Routes = [{ path: '', component: SignnupComponent },
{ path: 'signup', component: SignnupComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
