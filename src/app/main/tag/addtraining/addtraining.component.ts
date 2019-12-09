import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable,Subject } from 'rxjs';
//import { TABLE_HELPERS, ExampleDatabase, ExampleDataSource } from './helpers.data';
import { AUTOCOMPLETE_HELPERS } from './helpers.data';
import { TrainingService } from '../../../_services/index';
//import { AuthenticationService } from '../../../_services/index';
import { MatSnackBar, MatPaginator, MatTableDataSource ,MatDialog,MAT_DIALOG_DATA} from '@angular/material';
import { MatSelect } from '@angular/material';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-addtraining',
  templateUrl: './addtraining.component.html',
  styleUrls: ['./addtraining.component.scss']
})
export class AddTrainingComponent implements OnInit {

  userForm: FormGroup;
  public productidtest: FormControl = new FormControl();
  // states = [
  //   'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  //   'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  //   'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  //   'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  //   'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  //   'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  //   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  // ];
  productList: any[];
  displayedColumns = ['productCode', 'procutName', 'date_added', 'datemodified'];
  dataSource;
  products;
  public exampleData: Array<Select2OptionData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  public bankFilterCtrl: FormControl = new FormControl();
  public productidfilter: FormControl = new FormControl();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  protected _onDestroy = new Subject<void>();

  constructor(
    public composeDialog: MatDialog,
    private router: Router,
    private TrainingService: TrainingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
   
  ) {
    
  }

 
  ngOnInit() {

    this.exampleData = [
      {
        id: 'basic1',
        text: 'Basic 1'
      },
      {
        id: 'basic2',
        disabled: true,
        text: 'Basic 2'
      },
      {
        id: 'basic3',
        text: 'Basic 3'
      },
      {
        id: 'basic4',
        text: 'Basic 4'
      }
    ];
    this.buildForm();
    this.TrainingService.getAllProduct()
      .subscribe(
        data => {

          this.productList = data;
         
          const productList = [];
          this.productList.forEach(element => {
            var date = new Date(element.dateadded);
            
            element.date_added = date.toDateString();
           var datemodify = new Date(element.datemodified);
          
           element.date_modified = datemodify.toDateString();

           element.productname = element.procutName +'('+element.productCode+')';
          //  prodata.id = element._id;
          //  prodata.text = element.procutName +'('+element.productCode+')';
           //console.log(data)
            productList.push({'id':element._id,'text': element.procutName +'('+element.productCode+')'});
          });
          
          this.products = productList;
        },
        error => {
          console.log(error);
        });
        this.productidfilter.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.products();
        });

        this.bankFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.products();
        });
  }

  buildForm() {
    this.userForm = this.fb.group({
      
      'productid': ['', [
        Validators.required
        
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;



  onValueChanged(data?: any) {

  }

  openComposeDialog() {
    this.TrainingService.exportTrainingItems(this.userForm.controls.productid.value)
      .subscribe(
        data => {
          if(data.length>0)
          {
            const dialogRef = this.composeDialog.open(confirmPopupComponent, {
                data: {
                  proId: this.userForm.controls.productid.value,
                  flag: btoa("1"),
                },
                width: '450px'
              });
            dialogRef.afterClosed().subscribe(result => {
             // this.snackBar.open('Message has been sent', '', {duration: 3000});
            });
          }
          else
          {
            this.router.navigate(['/training/createtrainingitem/'+this.userForm.controls.productid.value+'/'+btoa("1")]);
          }
        },
        error => {
          console.log(error);
        });
    
    
  }
  autocompleteHelpers: any = AUTOCOMPLETE_HELPERS;
}

@Component({
  selector: 'confirm-popup',
  templateUrl: './confirmpopup.html'
})
export class confirmPopupComponent {
  


  constructor(@Inject(MAT_DIALOG_DATA)public data: any,

  ) {


  }
  ngOnInit() {
   
  }

    


}
export class DialogContentExampleDialog { }


