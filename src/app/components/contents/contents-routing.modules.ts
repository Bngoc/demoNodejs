'use strict';

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat/chat.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {Page404Component} from "./errors/page404/page404.component";
import {HomeComponent} from "./home/home.component";
import {ForgotComponent} from "./forgot/forgot.component";


const contentsRoutes: Routes = [
    // {path: 'crisis-center', component: CrisisListComponent},
    // {path: 'hero/:id', component: HeroDetailComponent},
    {path: 'register', component: RegisterComponent, data: {title: 'Register'}, pathMatch: 'full'},
    {path: 'login', component: LoginComponent, data: {title: 'Login'}, pathMatch: 'full'},
    {path: 'forgot', component: ForgotComponent, data: {title: 'Login'}, pathMatch: 'full'},
    {path: 'chat', component: ChatComponent, data: {title: 'Home chat'}, pathMatch: 'full'},
    {path: 'home', component: HomeComponent, pathMatch: 'full'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: Page404Component}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(contentsRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class ContentsRoutingModule {
}
//https://www.concretepage.com/angular-2/angular-2-4-child-routes-and-relative-navigation-example