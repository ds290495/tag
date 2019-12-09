import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { MatRadioModule, MatCheckboxModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';

import {  MatCardModule,MatButtonModule,MatButtonToggleModule, MatInputModule,MatToolbarModule,MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule,MatPaginatorModule,MatDialogModule,MatSnackBarModule,MatAutocompleteModule,MatRadioModule,MatCheckboxModule } from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutofocusModule } from 'angular-autofocus-fix';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


import { GetTag } from './gettag/gettag.component';
import { AddTrainingComponent } from './addtraining/addtraining.component';
import { AddTrainingItemComponent } from './addtrainingitem/addtrainingitem.component';
import { itemdeletePopupComponent } from './addtrainingitem/addtrainingitem.component';
import { confirmPopupComponent } from './addtraining/addtraining.component';
import { ViewTrainingItemComponent } from './viewtrainingitem/viewtrainingitem.component';
import { confirmDeletePopupComponent } from './viewtrainingitem/viewtrainingitem.component';
import { UpdateTrainingItemComponent } from './updatetrainingitem/updatetrainingitem.component';
import { itemPopupComponent } from './updatetrainingitem/updatetrainingitem.component';
import { UpdateProductComponent } from './updateproduct/updateproduct.component';


import { UpdateTagData } from './updatetagdata/updatetagdata.component';
import { AuthGuard } from './../../_guards/index';
import { NgxLoadingModule } from 'ngx-loading';
import { deletetagPopupComponent } from './gettag/gettag.component';
import {DatePipe} from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatSortModule} from '@angular/material/sort';
import { NgSelect2Module } from 'ng-select2';
//import { DragScrollModule } from "cdk-drag-scroll";

const routes = [
   
    {
        path: 'trainingprograms',
        component: GetTag,
        canActivate: [AuthGuard]
    },
    {
        path     : 'tag/updatetagdata/:id',
        component: UpdateTagData,
        canActivate: [AuthGuard]
    },
    {
        path     : 'trainingprograms',
        component: deletetagPopupComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/addtraining',
        component: AddTrainingComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/addtraining',
        component: confirmPopupComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/createtrainingitem/:productid/:pagetype',
        component: AddTrainingItemComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/createtrainingitem/:productid/:pagetype',
        component: itemdeletePopupComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/viewtrainingitem/:productid',
        component: ViewTrainingItemComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/viewtrainingitem/:productid',
        component: confirmDeletePopupComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/updatetrainingitem/:itemid',
        component: UpdateTrainingItemComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'training/updatetrainingitem/:itemid',
        component: itemPopupComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'products/updateproduct/:productid',
        component: UpdateProductComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        GetTag,
        UpdateTagData,
        deletetagPopupComponent,
        AddTrainingComponent,
        AddTrainingItemComponent,
        itemdeletePopupComponent,
        confirmPopupComponent,
        ViewTrainingItemComponent,
        confirmDeletePopupComponent,
        UpdateTrainingItemComponent,
        itemPopupComponent,
        UpdateProductComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatInputModule,
        NgxChartsModule,
        MatPaginatorModule,
        MatDialogModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatSlideToggleModule,
        AutofocusModule,
        MatCheckboxModule,
        MatRadioModule,
        DragDropModule,
        MatCardModule,
        MatButtonToggleModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatSortModule,
        //DragScrollModule,
        NgxMatSelectSearchModule,
        NgSelect2Module,
        NgxLoadingModule.forRoot({})
    ],
    providers: [
        DatePipe
      ],
    exports: [
        GetTag,
        UpdateTagData,
        deletetagPopupComponent,
        AddTrainingComponent,
        AddTrainingItemComponent,
        itemdeletePopupComponent,
        confirmPopupComponent,
        ViewTrainingItemComponent,
        confirmDeletePopupComponent,
        UpdateTrainingItemComponent,
        itemPopupComponent,
        UpdateProductComponent
    ]
})

export class TagModule {
}
