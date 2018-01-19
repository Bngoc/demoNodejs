'use strict';

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat/chat.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {Page404Component} from "./errors/page404/page404.component";
import {HomeComponent} from "./home/home.component";
import {ForgotComponent} from "./forgot/forgot.component";
import {Page503Component} from "./errors/page503/page503.component";
import {PageErrorComponent} from "./errors/page-error/page-error.component";
import {ApiServiceChat} from "../services/api-chat.service";
import {KeysPipe} from "../../pipes/pipes-keys.pipe";
import {LogoutComponent} from "./logout/logout.component";


const contentsRoutes: Routes = [
    {path: 'register', component: RegisterComponent, data: {title: 'Register'}, pathMatch: 'full'},
    {path: 'login', component: LoginComponent, data: {title: 'Login'}, pathMatch: 'full'},
    {path: 'logout', component: LogoutComponent, data: {title: 'Logout'}, pathMatch: 'full'},
    {path: 'forgot', component: ForgotComponent, data: {title: 'Login'}, pathMatch: 'full'},
    {path: 'chat', component: ChatComponent, data: {title: 'Home chat'}, pathMatch: 'full'},
    {path: 'home', component: HomeComponent, pathMatch: 'full'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: Page404Component}
];


@NgModule({
    declarations: [
        ChatComponent,
        Page404Component,
        Page503Component,
        PageErrorComponent,
        LoginComponent,
        RegisterComponent,
        ForgotComponent,
        KeysPipe,
        LogoutComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule.forChild(contentsRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [ApiServiceChat]
})
export class ContentsRoutingModule {
}

//https://www.concretepage.com/angular-2/angular-2-4-child-routes-and-relative-navigation-example