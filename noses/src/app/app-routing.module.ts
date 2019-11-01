import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from "./auth.guard";
import { UploadSealComponent } from './upload-seal/upload-seal.component';
import { SealPageComponent } from './seal-page/seal-page.component';
import { ManageAccountsComponent } from './manage-accounts/manage-accounts.component';
import { ApproveObsComponent } from './approve-obs/approve-obs.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ComponentForAngServiceComponent } from './component-for-ang-service/component-for-ang-service.component';


const routes: Routes = [
{ path: '', redirectTo: '/sign-in', pathMatch: 'full'},
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'upload-seal', component: UploadSealComponent, canActivate: [AuthGuard]},
{ path: 'sign-in', component: SignInComponent},
{ path: 'verify-email', component: VerifyEmailComponent},
{ path: 'seal-page', component: SealPageComponent},
{ path: 'manage-accounts', component: ManageAccountsComponent, canActivate: [AuthGuard]},
{ path: 'approve-obs', component: ApproveObsComponent, canActivate: [AuthGuard]},
{ path: 'component-for-ang-service', component: ComponentForAngServiceComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent, SignInComponent]
