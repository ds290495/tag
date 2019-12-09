import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDividerModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';

import { Login2Component } from 'app/main/login/login.component';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes = [
    {
        path: 'login',
        component: Login2Component
    }
];

@NgModule({
    declarations: [
        Login2Component
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule, MatDividerModule,
        MatMenuModule, MatSelectModule,
        MatTableModule, MatTabsModule,
        MatPaginatorModule, MatDialogModule,
        MatSnackBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatSlideToggleModule,
        NgxChartsModule
    ]
})
export class Login2Module {
}
