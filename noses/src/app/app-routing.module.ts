import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from "./_services/auth.guard";
import { SealPageComponent } from './seal-page/seal-page.component';
import { ManageAccountsComponent } from './manage-accounts/manage-accounts.component';
import { ApproveObservationsComponent } from './approve-observations/approve-observations.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component'
import { MenuComponent } from './menu/menu.component';
import { AllObservationsComponent } from './all-observations/all-observations.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestAccountComponent} from './request-account/request-account.component';
import { ComponentForAngServiceComponent } from './component-for-ang-service/component-for-ang-service.component';
import { CitizenSciBulkUploadMainPageComponent } from './citizen-scientist-upload-management/citizen-sci-bulk-upload-main-page/citizen-sci-bulk-upload-main-page.component';
import { NewObservationComponent } from './new-observation/new-observation.component';
import { SealComponent } from './seal/seal.component';
import { MarkTestComponent } from './mark-test/mark-test.component';
import { TtlAngMaterialStartPageComponent } from './angular-material-tutorial-components/ttl-ang-material-start-page/ttl-ang-material-start-page.component';
import { ObsFormMainComponent } from './_components/observation_form/obs-form-main/obs-form-main.component';
import { UserPofileMainComponent } from './_components/UserProfile/user-pofile-main/user-pofile-main.component';

const routes: Routes = [
{ path: '', redirectTo: '/sign-in', pathMatch: 'full'},
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'sign-in', component: SignInComponent},
{ path: 'verify-email', component: VerifyEmailComponent},
{ path: 'seal-page', component: SealPageComponent},
{ path: 'manage-accounts', component: ManageAccountsComponent, canActivate: [AuthGuard]},
{ path: 'approve-obs', component: ApproveObservationsComponent, canActivate: [AuthGuard]},
{ path: 'menu', component: MenuComponent, canActivate: [AuthGuard]},
{ path: 'all-observations', component: AllObservationsComponent, canActivate: [AuthGuard]},
{ path: 'reset', component: ResetPasswordComponent},
{ path: 'request-account', component: RequestAccountComponent},
{ path: 'component-for-ang-service', component: ComponentForAngServiceComponent, canActivate: [AuthGuard]},
{ path: 'citizen-sci-bulk-upload', component: CitizenSciBulkUploadMainPageComponent, canActivate: [AuthGuard]},
{ path: 'new-observation', component: NewObservationComponent, canActivate: [AuthGuard]},
{ path: 'mark', component: MarkTestComponent},
{ path: 'seal', component: SealComponent},
{ path: 'ang-material-tutorial', component: TtlAngMaterialStartPageComponent },
{ path: 'observation-form', component: ObsFormMainComponent},
{ path: 'user-profile-main', component: UserPofileMainComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent, SignInComponent]
