import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { MatToolbarModule, MatTableModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from  '@angular/forms';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserLoginComponent } from './user-login/user-login.component';
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UploadSealComponent } from './upload-seal/upload-seal.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PapaParseModule } from 'ngx-papaparse';

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
    UserLoginComponent,
    VerifyEmailComponent,
    UploadSealComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    PapaParseModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
