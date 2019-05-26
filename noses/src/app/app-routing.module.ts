import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from "./auth.guard";
import { UploadSealComponent } from './upload-seal/upload-seal.component';


const routes: Routes = [
{ path: '', redirectTo: '/sign-in', pathMatch: 'full'},
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'upload-seal', component: UploadSealComponent, canActivate: [AuthGuard]},
{ path: 'sign-in', component: SignInComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent, SignInComponent]
