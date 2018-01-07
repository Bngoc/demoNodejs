import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './/app-routing.module';
import {HomeComponent} from './components/home/home.component';
import {ChatComponent} from './components/chat/chat.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ChatComponent
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
