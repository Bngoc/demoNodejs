import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppComponent} from './app.component';
import {HomeComponent} from "./components/contents/home/home.component";
import {FooterComponent} from "./components/layouts/footer/footer.component";
import {HeaderComponent} from "./components/layouts/header/header.component";
import {NavComponent} from "./components/layouts/nav/nav.component";
import {SidebarComponent} from "./components/contents/sidebar/sidebar.component";
import {ContentsComponent} from "./components/contents/contents.component";
import {ContentsRoutingModule} from "./components/contents/contents-routing.modules";
import {AppRoutingModule} from "./app-routing.module";
import {HttpRequestService} from "./common/http-request.service";
import {AuthInterceptor} from "./common/auth.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        NavComponent,
        SidebarComponent,
        ContentsComponent
    ],
    imports: [
        BrowserModule,
        ContentsRoutingModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [
        HttpRequestService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
