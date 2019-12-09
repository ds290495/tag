import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
//import { TABLE_HELPERS, ExampleDatabase, ExampleDataSource } from './helpers.data';
import { TrainingService } from '../../../_services/index';
import { MatSnackBar, MatPaginator, MatTableDataSource ,MatDialog,MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.scss']
})
export class UpdateProductComponent implements OnInit {

  userForm: FormGroup;
  
  productList: any[];
  displayedColumns = ['productCode', 'procutName', 'date_added', 'datemodified'];
  dataSource;
  products;
  productId;
  productName;
  productCode;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(
    public composeDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private TrainingService: TrainingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    //public snackBar: MatSnackBar
  ) {
   
  }
  ngOnInit() {

    this.userForm = this.fb.group({
        productName : ['', Validators.required],
        productCode  : ['', Validators.required],
    });

  //   this.userForm = new FormGroup({
  //     productName: new FormControl('', Validators.compose([
  //          Validators.required
           
  //     ])), productCode: new FormControl('', Validators.compose([
  //       Validators.required
        
  //  ]))});

    this.route.params.subscribe(params => {
      this.productId=params.productid;
      this.TrainingService.getProductbyId(params.productid)
        .subscribe(
          data => {
            console.log('data');
            console.log(data);
            this.userForm = this.fb.group({
              productName : [data.product.procutName, Validators.required],
              productCode  : [data.product.productCode, Validators.required]
            });

          //   this.userForm = new FormGroup({
          //     productName: new FormControl(data.product.procutName, Validators.compose([
          //          Validators.required
                   
          //     ])), productCode: new FormControl(data.product.productCode, Validators.compose([
          //       Validators.required
                
          //  ]))});
            
            
          },
          error => {
            console.log(error);
          });
      });

  }

  updateproduct(){
    
    this.route.params.subscribe(params => {
        this.userForm.value._id = params.productid;
        this.TrainingService.updateproduct(this.userForm.value)
        .subscribe(
            data => {
              if (data.string == 'Item code is already exist, Please enter another code!') {
                this.snackBar.open('Item code is already exist, Please enter another code!', '', {duration: 3000});
                
              }
              else
              {
                this.snackBar.open('Product updated successfully!', '', {duration: 3000});
                this.router.navigate(['trainingprograms']);
              }
              
            },
            error => {
                
                console.log(error);
                this.snackBar.open('Something went wrong,Please try again!', '', {duration: 3000});
               // this.router.navigate(['auth/training']);
            });
    });
  }

  
}




