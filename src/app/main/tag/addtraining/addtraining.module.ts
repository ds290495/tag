import { NgModule } from '@angular/core';
//import { AddTrainingComponent } from './addtraining.component';
import {  MatCardModule,MatButtonModule,MatButtonToggleModule, MatInputModule,MatToolbarModule,MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule,MatPaginatorModule,MatDialogModule,MatSnackBarModule,MatAutocompleteModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
//import { confirmPopupComponent } from './addtraining.component';

const routes: Routes = [
    //{path: '', component: AddTrainingComponent},
    //{path: '', component: confirmPopupComponent},
  ];  
@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatTableModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatTabsModule,
        MatMenuModule,
        RouterModule.forChild(routes)
    ],
    
    declarations: [   
        //AddTrainingComponent,
        //confirmPopupComponent
    ],
    exports: [
     //   RouterModule,
     //AddTrainingComponent,
     //confirmPopupComponent
    ],
   
    providers: [
    ] 
})
export class AddTrainingModule {
}
