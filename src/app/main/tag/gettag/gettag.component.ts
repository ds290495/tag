import { Component, OnInit, ViewChild, Inject,QueryList } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import  clonedeep from 'lodash.clonedeep';
import { TrainingService } from '../../../_services/index';
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }

const ELEMENT_DATA = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    {position: 11, name: 'Neon1', weight: 20.1797, symbol: 'Ne'},
    {position: 12, name: 'Neon2', weight: 20.1797, symbol: 'Ne'},
  ];

  const items = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Neon1', weight: 20.1797, symbol: 'Ne'},
    {position: 12, name: 'Neon2', weight: 20.1797, symbol: 'Ne'},
  ];


@Component({
    selector: 'app-gettag',
    templateUrl: '../gettag/gettag.component.html',
    styleUrls: ['../gettag/gettag.component.scss'],
    animations: fuseAnimations
})


export class GetTag implements OnInit {
    //@ViewChild('table') table: MatTable<PeriodicElement>;
    alltagdata: any[];
    alltagdatadelete: any;
    productList: any[];
    displayedColumns: string[] = ['procutName','productCode', 'datemodified','export','action'];
    dataSource:MatTableDataSource<any>;
    dataelement;
    allresellers: any;
    private setting = {
        element: {
          dynamicDownload: null as HTMLElement
        }
      }
     
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    


    constructor(public dialog: MatDialog, private AuthenticationService: AuthenticationService,private TrainingService:TrainingService, public snackBar: MatSnackBar, ) { }

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentExampleDialog);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    exportTrainingItems(index,productid) {
        this.TrainingService.getProductbyId(productid)
          .subscribe(
            data => {
              
              var trainingitems = [];
    
              for(let i=0;i<data.lineitem.length;i++ )
              {
                var traininglineitems = [];
                var trainingline = data.lineitem[i].traininglineitem;
                for(let j=0;j<trainingline.length;j++)
                  { 
                    var lineitemimage = location.origin+"/assets/uploads/"+trainingline[j].image;
                    traininglineitems.push({ 'order': trainingline[j].order.toString(), 'title': trainingline[j].name,"imageOrGif": (trainingline[j].filetype=="Image")?lineitemimage:trainingline[j].gifurl})
                    
                  }
    
                var itemimage = location.origin+"/assets/uploads/"+data.lineitem[i].image;
                trainingitems.push({ 'order': data.lineitem[i].order.toString(), 'name': data.lineitem[i].title,'product_name': data.product.procutName,'product_item_code': data.product.productCode,"imageOrVideo": (data.lineitem[i].filetype=="Image")?itemimage:data.lineitem[i].vimeolink,"Steps":traininglineitems});
              }
    
              
              var trainingdata ={"Trainings":trainingitems};
              //trainingdata.Trainings:JSON.stringify(traininglineitems);
    
              this.dyanmicDownloadByHtmlTag({
                fileName: data.product.procutName+'_Report.json',
                text: JSON.stringify(trainingdata)
              });
            },
            error => {
              console.log(error);
            });
          
       
      }

      dyanmicDownloadByHtmlTag(arg: {
        fileName: string,
        text: string
      }) {
        if (!this.setting.element.dynamicDownload) {
          this.setting.element.dynamicDownload = document.createElement('a');
        }
        const element = this.setting.element.dynamicDownload;
        const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
        element.setAttribute('download', arg.fileName);
    
        var event = new MouseEvent("click");
        element.dispatchEvent(event);
      }

    ngOnInit() {
        //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        //this.dataSource = new MatTableDataSource(items);
        //this.dataSource.paginator = this.paginator;
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
                    
                        productList.push(element);
                    });
                    this.dataSource = new MatTableDataSource(productList);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                },
                error => {
                    console.log(error);
                });

    }

    removeTrainingItems(index,productid)
    {
        this.TrainingService.getProductbyId(productid)
          .subscribe(
            data => {
              
              console.log(data);
              var checklength =(data.lineitem.length>0)?'This program contains training line items,':'';

              const dialogRef = this.dialog.open(deletetagPopupComponent, {
                data: {
                    checklengthmsg: checklength,
                    productid: productid,
                    productname: data.product.procutName,
                    },
                    width: '450px'
                });
                dialogRef.afterClosed().subscribe(result => {
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
                            
                                productList.push(element);
                            });
                            this.dataSource = new MatTableDataSource(productList);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        },
                        error => {
                            console.log(error);
                        });
                // this.snackBar.open('Message has been sent', '', {duration: 3000});
                });
            },
            error => {
              console.log(error);
            });
    }

}


@Component({
    selector: 'deletetag-popup',
    templateUrl: './deletetagpopup.html'
})
export class deletetagPopupComponent {
    returnUrl: string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private AuthenticationService: AuthenticationService,
        private TrainingService: TrainingService,
        private route: ActivatedRoute,
        private router: Router,
        public snackBar: MatSnackBar

    ) {


    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/trainingprograms';
    }

    delete(id) {
        this.TrainingService.deleteTrainingProgram(id)
            .subscribe(
                data => {
                    this.snackBar.open('Training program deleted successfully', '', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.log(error);
                    // this.alertService.error(error);
                });

    }


}


export class DialogContentExampleDialog { }
