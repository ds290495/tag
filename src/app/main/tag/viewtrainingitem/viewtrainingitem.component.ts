import { Component, OnInit,Inject, ViewChild,TemplateRef,Output,Input, EventEmitter ,ElementRef,ViewChildren,QueryList } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl,FormArray} from '@angular/forms';
import {map, startWith, switchMap , tap} from 'rxjs/operators';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable,merge,Subscription } from 'rxjs';
//import { TABLE_HELPERS, ExampleDatabase, ExampleDataSource } from './helpers.data';

import { TrainingService } from '../../../_services/index';
import { MatSnackBar, MatPaginator, MatTableDataSource ,MatDialog,MAT_DIALOG_DATA} from '@angular/material';

import {MatSort} from '@angular/material/sort';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle,CdkDrag , CdkDragMove} from '@angular/cdk/drag-drop';
import  clonedeep from 'lodash.clonedeep';

const speed = 10;

@Component({
  selector: 'app-viewtrainingitem',
  templateUrl: './viewtrainingitem.component.html',
  styleUrls: ['./viewtrainingitem.component.scss']
})
export class ViewTrainingItemComponent implements OnInit {

  productList: any[];
  productItem: any[];
  displayedColumns = ['title','noofsteps', 'status', 'action'];
  dataSource:MatTableDataSource<any>;
  productId;
  productName;
  productCode;
  flag;

  items = [
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('scrollEl')
  scrollEl:ElementRef<HTMLElement>;
  
  @ViewChildren(CdkDrag)
  dragEls:QueryList<CdkDrag>; 
  private scroll($event: CdkDragMove) {
    console.log('scroll');  
    const { y } = $event.pointerPosition;
        const baseEl = this.scrollEl.nativeElement;
        const box = baseEl.getBoundingClientRect();
        const scrollTop = baseEl.scrollTop;
        const top = box.top + - y ;
        if (top > 0 && scrollTop !== 0) {
            const newScroll = scrollTop - speed * Math.exp(top / 50);
            baseEl.scrollTop = newScroll;
            this.animationFrame = requestAnimationFrame(() => this.scroll($event));
            return;
        }

        const bottom = y - box.bottom ;
        if (bottom > 0 && scrollTop < box.bottom) {
            const newScroll = scrollTop + speed * Math.exp(bottom / 50);
            baseEl.scrollTop = newScroll;
            this.animationFrame = requestAnimationFrame(() => this.scroll($event));
        }
  }
  subs = new Subscription();

  ngAfterViewInit(){
      const onMove$ = this.dragEls.changes.pipe(
      startWith(this.dragEls)
      , map((d: QueryList<CdkDrag>) => d.toArray())
      , map(dragels => dragels.map(drag => drag.moved))
      , switchMap(obs => merge(...obs))
      , tap(this.triggerScroll)
  );
        
  this.subs.add(onMove$.subscribe());

  const onDown$ = this.dragEls.changes.pipe(
      startWith(this.dragEls)
      , map((d: QueryList<CdkDrag>) => d.toArray())
      , map(dragels => dragels.map(drag => drag.ended))
      , switchMap(obs => merge(...obs))
      , tap(this.cancelScroll)
  );

  this.subs.add(onDown$.subscribe());
  }
  private animationFrame: number | undefined;
  @bound
    public triggerScroll($event: CdkDragMove) {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
        this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }

    
    @bound
    private cancelScroll() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
    }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dropTable(event: CdkDragDrop<string[]>) {
    console.log('event');
    console.log(event);
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = clonedeep(this.dataSource.data);
    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    // const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    // moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    // //moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    // //this.table.renderRows();
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
}

onListDrop(event: CdkDragDrop<string[]>) {
  console.log(event);
  // Swap the elements around
  console.log(`Moving item from ${event.previousIndex} to index ${event.currentIndex}`)
  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  console.log(`event.container ${event.container.data}`)
  this.dataSource.data = clonedeep(this.dataSource.data);

  this.TrainingService.reOrderItems(event.previousIndex,event.currentIndex)
        .subscribe(
          data => {
            
            console.log('success');
            
          },
          error => {
            console.log(error);
          });

  
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
    
    this.route.params.subscribe(params => {
      this.productId=params.productid;
      this.flag=btoa("2");
      this.TrainingService.getProductbyId(params.productid)
        .subscribe(
          data => {
            this.productName = data.product.procutName;
            this.productCode = data.product.productCode;
            
            this.productItem = data.lineitem;
          
            const itemList = [];
            this.productItem.forEach(element => {
             
            element.steps = element.traininglineitem.length;
            
            itemList.push(element);
            });
            
            this.dataSource = new MatTableDataSource(itemList);
          
            //this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            console.log(error);
          });
      });
  }
  
  deleteTrainingItems(itemid,productId,title,order){
    
    const dialogRef = this.composeDialog.open(confirmDeletePopupComponent, {
        data: {
          itemid: itemid,
          productId: productId,
          title: title,
          order: order,
        },
        width: '450px'
      });
    dialogRef.afterClosed().subscribe(result => {
     // this.snackBar.open('Message has been sent', '', {duration: 3000});
     this.route.params.subscribe(params => {
      this.productId=params.productid;
      this.TrainingService.getProductbyId(params.productid)
        .subscribe(
          data => {
            this.productName = data.product.procutName;
            this.productCode = data.product.productCode;
            
            this.productItem = data.lineitem;
          
            const itemList = [];
            this.productItem.forEach(element => {
             
            element.steps = element.traininglineitem.length;
            
            itemList.push(element);
            });
            
            this.dataSource = new MatTableDataSource(itemList);
          
            //this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            console.log(error);
          });
      });
    });
}

changestatus(status,id){
  this.TrainingService.updatestatus(status.checked,id)
  .subscribe(
    data => {
        
    },
    error => {
        console.log(error);
    });
 }

}

export function bound(target: Object, propKey: string | symbol) {
  var originalMethod = (target as any)[propKey] as Function;

  // Ensure the above type-assertion is valid at runtime.
  if (typeof originalMethod !== "function") throw new TypeError("@bound can only be used on methods.");

  if (typeof target === "function") {
      // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
      return {
          value: function () {
              return originalMethod.apply(target, arguments);
          }
      };
  } else if (typeof target === "object") {
      // Instance method, bind to instance on first invocation (as that is the only way to access an instance from a decorator).
      return {
          get: function () {
              // Create bound override on object instance. This will hide the original method on the prototype, and instead yield a bound version from the
              // instance itself. The original method will no longer be accessible. Inside a getter, 'this' will refer to the instance.
              var instance = this;

              Object.defineProperty(instance, propKey.toString(), {
                  value: function () {
                      // This is effectively a lightweight bind() that skips many (here unnecessary) checks found in native implementations.
                      return originalMethod.apply(instance, arguments);
                  }
              });

              // The first invocation (per instance) will return the bound method from here. Subsequent calls will never reach this point, due to the way
              // JavaScript runtimes look up properties on objects; the bound method, defined on the instance, will effectively hide it.
              return instance[propKey];
          }
      } as PropertyDescriptor;
  }
}

@Component({
  selector: 'delete-confirm-popup',
  templateUrl: './deleteconfirmpopup.html'
})
export class confirmDeletePopupComponent {
  


  constructor(@Inject(MAT_DIALOG_DATA)public data: any,
  public composeDialog: MatDialog,
  private router: Router,
  private route: ActivatedRoute,
  private TrainingService: TrainingService,
  private snackBar: MatSnackBar,
  private fb: FormBuilder,
  ) {


  }
  ngOnInit() {
   
  }

  

  deleteitem(itemid,productid,order) {
    
    this.TrainingService.deleteitem(itemid,productid,order)
        .subscribe(
            data => {
              this.snackBar.open('Training item deleted successfully!', '', {duration: 3000});
              //this.router.navigate(['/auth/training/viewtrainingitem/'+productid]);
              //this.router.navigate(['/gettag/gettag']);
            },
            error => {
                console.log(error);
                this.snackBar.open('Something went wrong,Please try again!', '', {duration: 3000});
            });

}




}
export class DialogContentExampleDialog { }
  




