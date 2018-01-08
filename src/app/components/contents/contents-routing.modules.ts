'use strict';

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {ChatComponent} from './../../components/admin/chat/chat.component';
import {Page404Component} from './../../components/errors/page404/page404.component';


const contentsRoutes: Routes = [
    // {path: 'crisis-center', component: CrisisListComponent},
    // {path: 'hero/:id', component: HeroDetailComponent},
    {path: 'chat', component: ChatComponent, data: {title: 'Homexxxx chat'}, pathMatch: 'full'},
    {path: '', redirectTo: '/', pathMatch: 'full'},
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