'use strict';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {HomeComponent} from './components/contents/home/home.component';
//layouts
import {FooterComponent} from './components/layouts/footer/footer.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {NavComponent} from './components/layouts/nav/nav.component';
import {SidebarComponent} from './components/contents/sidebar/sidebar.component';
import {ContentsComponent} from './components/contents/contents.component';
import {ContentsRoutingModule} from "./components/contents/contents-routing.modules";
import {KeysPipe} from './pipes/pipes-keys.pipe';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        NavComponent,
        SidebarComponent,
        ContentsComponent,
        KeysPipe
    ],
    imports: [
        BrowserModule,
        ContentsRoutingModule,
        AppRoutingModule,

    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule {
}


//        "../node_modules/angular-socket-io/dist/socket.js",