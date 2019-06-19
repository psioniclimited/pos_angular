import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { HeaderComponent } from './shared/header/header.component';
import { LoginLayoutComponent } from './shared/login-layout/login-layout.component';
import { SigninComponent } from './shared/signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeLayoutComponent } from './shared/home-layout/home-layout.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownDirective } from './shared/directives/dropdown.directive';
import { ApiUrlInterceptor } from './_helpers/api-url-interceptor';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy
} from '@angular/common';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
import { CardModule } from 'primeng/card';
import {
  BlockUIModule,
  ButtonModule,
  CaptchaModule,
  InputTextModule, PaginatorModule,
  PasswordModule,
  ProgressBarModule,
  ProgressSpinnerModule, TooltipModule
} from 'primeng/primeng';
import { SuccessInterceptor } from './_helpers/success.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderInterceptor } from './_helpers/loader.interceptor';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    SigninComponent,
    DropdownDirective,
    SignUpComponent,
    LoaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule,
    BrowserAnimationsModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
    CaptchaModule,
    ProgressBarModule,
    BlockUIModule,
    PaginatorModule,
    TooltipModule
  ],
  providers: [
    MessageService,
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
