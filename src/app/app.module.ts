'use strict';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HomeComponent} from './components/home/home.component';
import {ChatComponent} from './components/admin/chat/chat.component';
// page error
import {Page404Component} from './components/errors/page404/page404.component';
import {Page503Component} from './components/errors/page503/page503.component';
import {PageErrorComponent} from './components/errors/page-error/page-error.component';

//layouts
import {FooterComponent} from './components/layouts/footer/footer.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {NavComponent} from './components/layouts/nav/nav.component';
import {SidebarComponent} from './components/layouts/sidebar/sidebar.component';

import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ContentsComponent} from './components/contents/contents.component';


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
        ContentsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
