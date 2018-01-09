'use strict';

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// import { CanDeactivateGuard }       from './services/auth/can-deactivate-guard.service';
// import { AuthGuard }                from './services/auth/auth-guard.service';

import {CommonModule} from '@angular/common';
// import {ChatComponent} from './components/admin/chat/chat.component';
import {Page404Component} from './components/contents/errors/page404/page404.component';



const appRoutes: Routes = [
    // {path: 'crisis-center', component: CrisisListComponent},
    // {path: 'hero/:id', component: HeroDetailComponent},
    // {path: 'chat', component: ChatComponent, data: {title: 'Homexxxx chat'}, pathMatch:'full'},
    {path: '', redirectTo: '/', pathMatch: 'full'},
    {path: '**', component: Page404Component}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class AppRoutingModule {
}
