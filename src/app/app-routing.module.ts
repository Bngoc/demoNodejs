'use strict';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// import { CanDeactivateGuard }       from './services/auth/can-deactivate-guard.service';
// import { AuthGuard }                from './services/auth/auth-guard.service';

import {CommonModule} from '@angular/common';
import {ChatComponent} from './components/admin/chat/chat.component';
import {Page404Component} from './components/errors/page404/page404.component';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";


const appRoutes: Routes = [
    // {path: 'crisis-center', component: CrisisListComponent},
    // {path: 'hero/:id', component: HeroDetailComponent},
    // {path: '/register', component: RegisterComponent, data: {title: 'Register'}, pathMatch: 'full'},
    // {path: '/login', component: LoginComponent, data: {title: 'Login'}, pathMatch: 'full'},
    {path: 'chat', component: ChatComponent, data: {title: 'Home1 chat'}},
    /* {path: '', redirectTo: '/', pathMatch: 'full'},
     {path: '**', component: Page404Component}*/
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        CommonModule
    ],
    exports: [
        RouterModule
    ],
})
export class AppRoutingModule {
}
