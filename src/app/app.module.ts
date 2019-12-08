import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatMenuModule,
  MatProgressBarModule, MatSortModule,
  MatTableModule, MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {GamesListComponent} from './component/games-list/games-list.component';
import {UploadDialogComponent} from './component/upload-dialog/upload-dialog.component';
import {ChessComponent} from './component/chess/chess.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {AppRoutingModule} from './app-routing.module';
import {TokenInterceptor} from './helper/TokenInterceptor';
import {AlertComponent} from './component/alert/alert.component';
import {DeleteDialogComponent} from './component/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesListComponent,
    UploadDialogComponent,
    ChessComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSortModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  entryComponents: [
    UploadDialogComponent,
    DeleteDialogComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
