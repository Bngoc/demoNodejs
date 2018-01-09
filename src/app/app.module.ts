'use strict';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HomeComponent} from './components/contents/home/home.component';
import {ChatComponent} from './components/contents/chat/chat.component';
// page error
import {Page404Component} from './components/contents/errors/page404/page404.component';
import {Page503Component} from './components/contents/errors/page503/page503.component';
import {PageErrorComponent} from './components/contents/errors/page-error/page-error.component';

//layouts
import {FooterComponent} from './components/layouts/footer/footer.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {NavComponent} from './components/layouts/nav/nav.component';
import {SidebarComponent} from './components/contents/sidebar/sidebar.component';

import {LoginComponent} from './components/contents/login/login.component';
import {RegisterComponent} from './components/contents/register/register.component';
import {ContentsComponent} from './components/contents/contents.component';
import {ContentsRoutingModule} from "./components/contents/contents-routing.modules";
import {ForgotComponent} from './components/contents/forgot/forgot.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ChatComponent,
        Page404Component,
        Page503Component,
        PageErrorComponent,
        FooterComponent,
        HeaderComponent,
        NavComponent,
        SidebarComponent,
        LoginComponent,
        RegisterComponent,
        ContentsComponent,
        ForgotComponent
    ],
    imports: [
        BrowserModule,
        ContentsRoutingModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}


//        "../node_modules/angular-socket-io/dist/socket.js",