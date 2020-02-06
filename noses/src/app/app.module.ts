import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from  '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from "./_services/auth.service";
import { AuthGuard } from "./_services/auth.guard";
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



//Components
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UploadSealComponent } from './upload-seal/upload-seal.component';
import { SealPageComponent } from './seal-page/seal-page.component';
import { ManageAccountsComponent } from './manage-accounts/manage-accounts.component';
import { ApproveObsComponent } from './approve-obs/approve-obs.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { MenuComponent } from './menu/menu.component';
import { AllObservationsComponent } from './all-observations/all-observations.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestAccountComponent } from './request-account/request-account.component';
import { ComponentForAngServiceComponent } from './component-for-ang-service/component-for-ang-service.component';
import { CitizenSciBulkUploadMainPageComponent} from './citizen-scientist-upload-management/citizen-sci-bulk-upload-main-page/citizen-sci-bulk-upload-main-page.component';
import { CitizenSciBulkUploadDataPreviewComponent } from './citizen-scientist-upload-management/citizen-sci-bulk-upload-data-preview/citizen-sci-bulk-upload-data-preview.component';
import { FilterBlockComponent } from './filter-block/filter-block.component';
import { NewObservationComponent } from './new-observation/new-observation.component';
import { MarkTestComponent } from './mark-test/mark-test.component';
import { MarkTestChildComponent } from './mark-test-child/mark-test-child.component';
import { SealComponent } from './seal/seal.component';
import { BulkUploadObservationViewComponent } from './citizen-scientist-upload-management/bulk-upload-observation-view/bulk-upload-observation-view.component';
import { EditObservationDialogComponent } from './edit-observation-dialog/edit-observation-dialog.component';
import { TtlAngMaterialStartPageComponent } from './angular-material-tutorial-components/ttl-ang-material-start-page/ttl-ang-material-start-page.component';
import { TtlAngMaterialDialogComponent } from './angular-material-tutorial-components/ttl-ang-material-dialog/ttl-ang-material-dialog.component';
import { LoginStateComponent } from './_components/navbar/login-state/login-state.component';

// angular material section
import { MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {SelectFilterType} from "./all-observations/filter-type-selector"

// form validation service
import { ValidationService } from './_services/validation.service';
import { NavbarMainComponent } from './_components/navbar/navbar-main/navbar-main.component';



const config = {
    apiKey: "AIzaSyCJXpZDV0cQVK6kyg8B95PC5Iq1fRyRFJ4",
    authDomain: "noses-346ed.firebaseapp.com",
    databaseURL: "https://noses-346ed.firebaseio.com",
    projectId: "noses-346ed",
    storageBucket: "noses-346ed.appspot.com",
    messagingSenderId: "924457799797"
};


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    VerifyEmailComponent,
    UploadSealComponent,
    SealPageComponent,
    ManageAccountsComponent,
    ApproveObsComponent,
    EditUserDialogComponent,
    MenuComponent,
    AllObservationsComponent,
    ResetPasswordComponent,
    RequestAccountComponent,
    ComponentForAngServiceComponent,
    CitizenSciBulkUploadMainPageComponent,
    CitizenSciBulkUploadDataPreviewComponent,
    FilterBlockComponent,
    NewObservationComponent,
    MarkTestComponent,
    MarkTestChildComponent,
    SealComponent,
    BulkUploadObservationViewComponent,
    EditObservationDialogComponent,
    TtlAngMaterialStartPageComponent,
    TtlAngMaterialDialogComponent,
    SelectFilterType,
    LoginStateComponent,
    NavbarMainComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatProgressBarModule,
    MatCardModule,
    MatDatepickerModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    AngularFontAwesomeModule,
    NgbModule
  ],
  exports: [

    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    MatFormFieldModule,
    FlexLayoutModule,
    RouterModule,
    EditUserDialogComponent,
    EditObservationDialogComponent,
    TtlAngMaterialDialogComponent
  ],
  entryComponents: [
    EditUserDialogComponent,
    EditObservationDialogComponent,
    TtlAngMaterialDialogComponent
  ],
  providers: [AuthService, AuthGuard, ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
