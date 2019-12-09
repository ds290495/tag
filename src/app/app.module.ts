import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { fuseConfig } from 'app/fuse-config';
import { AuthGuard } from './_guards/index';
import { JwtInterceptorProvider, ErrorInterceptorProvider } from './_helpers/index';

import { AuthenticationService } from './_services/index';
import { DashbordService } from './_services/index';
import { TrainingService } from './_services/index';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { Login2Module } from 'app/main/login/login.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { TagModule } from 'app/main/tag/tag.module';
//import { ProductModule } from 'app/main/products/product.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'login'
    }
];


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true, onSameUrlNavigation: 'reload' }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        //
        // App modules
        LayoutModule,
        Login2Module,
        DashboardModule,
        TagModule,
        //ProductModule,
        AngularFontAwesomeModule,
        NgxMatSelectSearchModule,
        DragDropModule
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        JwtInterceptorProvider,
        ErrorInterceptorProvider,
        DashbordService,
        TrainingService,
        BnNgIdleService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
