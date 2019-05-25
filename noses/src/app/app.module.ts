import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { MatToolbarModule, MatTableModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from  '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }
];

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
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
