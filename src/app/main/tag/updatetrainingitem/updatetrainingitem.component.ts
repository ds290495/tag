import { Component, OnInit,Inject, ViewChild,TemplateRef,ElementRef, Output, EventEmitter, SimpleChanges, Input,ViewChildren,QueryList} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl,FormArray} from '@angular/forms';
import {map, startWith , switchMap , tap} from 'rxjs/operators';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable,merge,Subscription } from 'rxjs';
//import { TABLE_HELPERS, ExampleDatabase, ExampleDataSource } from './helpers.data';

import { TrainingService } from '../../../_services/index';
import { MatSnackBar, MatPaginator, MatTableDataSource ,MatDialog,MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray,CdkDrag , CdkDragMove} from '@angular/cdk/drag-drop';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';

const speed = 10;
@Component({
  selector: 'app-updatetrainingitem',
  templateUrl: './updatetrainingitem.component.html',
  styleUrls: ['./updatetrainingitem.component.scss']
})
export class UpdateTrainingItemComponent implements OnInit {
  tasks: Array<string> = ['Sugar Ray Robinson', 'Muhammad Ali', 'George Foreman', 'Joe Frazier', 'Jake LaMotta', 'Joe Louis', 'Jack Dempsey', 'Rocky Marciano', 'Mike Tyson', 'Oscar De La Hoya'];
  userForm: FormGroup;
  urls = new Array<string>();
  paths = new Array<string>();
  imgpaths= new Array<string>();
  ids = new Array<string>();
  orders = new Array<string>();
  filesToUpload: Array<File> = [];
  newIndex : Number;
  oldIndex : Number;
  accessfunc : UpdateTrainingItemComponent;
  filesToInput=  new Array<string>();
  droppedData: string;
  basepath;
  fileurls = new Array<string>();
  filesToDrag: Array<File> = [];
  @Input('cdkDropListAutoScrollDisabled')
  autoScrollDisabled: boolean;

  draggable = {
    data: "myDragData",
    effectAllowed: "all",
    disable: false,
    handle: false
  };

  @ViewChild('scrollEl')
  scrollEl:ElementRef<HTMLElement>;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    public loading = false;
    public primaryColour = PrimaryWhite;
    public secondaryColour = SecondaryGrey;
    public coloursEnabled = false;
    public loadingTemplate: TemplateRef<any>;
    public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };
  
@ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
@ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;  
  @ViewChildren(CdkDrag)
  dragEls:QueryList<CdkDrag>;

  oldid:any;
  newid:any;

  imageurls = new Array<string>();
  imagepaths = new Array<string>();
  imageToUpload: Array<File> = [];
  itemid;
  mainimageurls;
  rootproductid;
  changedIndex : Boolean;
  
  constructor(
    public composeDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public TrainingService: TrainingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    //public snackBar: MatSnackBar
  ) {

  
    //this.changedIndex = false;
  }
  
  drop(event: CdkDragDrop<string[]>) {
   
    for(var i=0;i<this.fileurls.length;i++)
    {
      if(event.previousIndex>event.currentIndex)
      {
        console.log('previous');
        // if((this.filesToUpload[event.previousIndex]) || (this.filesToUpload[event.currentIndex]))
        // {
          if(this.fileurls[i])
          {
            this.filesToUpload[event.currentIndex] =this.filesToDrag[event.previousIndex];
            this.urls[event.currentIndex] =this.fileurls[event.previousIndex];
            this.paths[event.currentIndex] =this.imgpaths[event.previousIndex];
          }
          
          
          if((!this.fileurls[event.currentIndex]) && (this.fileurls[event.previousIndex]))
          {
            this.filesToUpload[event.previousIndex] =this.filesToDrag[event.currentIndex];
            this.urls[event.previousIndex] =this.fileurls[event.currentIndex];
            this.paths[event.previousIndex] =this.imgpaths[event.currentIndex];
          }

          // if((!this.filesToDrag[event.currentIndex]) && (!this.filesToDrag[event.previousIndex]))
          // {
          //   console.log('both empty');
          //   this.filesToUpload[event.previousIndex] =this.filesToDrag[event.currentIndex];
          //   this.urls[event.previousIndex] =this.fileurls[event.currentIndex];
          // }
          
          
          if(i<event.previousIndex && i>=event.currentIndex )
          {
            
            if(this.fileurls[i])
            {
              this.filesToUpload[i+1] =this.filesToDrag[i];
              this.urls[i+1] =this.fileurls[i];
              this.paths[i+1] =this.imgpaths[i];
            }
            if(!this.fileurls[i])
            {
              this.filesToUpload[i+1] =this.filesToDrag[i];
              this.urls[i+1] =this.fileurls[i];
              this.paths[i+1] =this.imgpaths[i];
            }
          }

          

          else
          {
            if(!this.fileurls[i])
            {
              // this.filesToUpload[i] =this.filesToDrag[i];
              // this.urls[i] =this.fileurls[i];
            }
            
          }

          
          
        //}
      }
      else if(event.previousIndex<event.currentIndex)
      {
        console.log('current');
        //if((this.filesToUpload[event.previousIndex]) || (this.filesToUpload[event.currentIndex]))
        //{
          if((this.fileurls[i])||(this.fileurls[event.currentIndex]))
          {
            this.filesToUpload[event.currentIndex] =this.filesToDrag[event.previousIndex];
            this.urls[event.currentIndex] =this.fileurls[event.previousIndex];
            this.paths[event.currentIndex] =this.imgpaths[event.previousIndex];
          }
          // if(!this.filesToDrag[i])
          // {
          //   console.log('filedrag');
          //   this.filesToUpload[event.previousIndex] =this.filesToDrag[event.currentIndex];
          //   this.urls[event.previousIndex] =this.fileurls[event.currentIndex];
          // }
          if(i>event.previousIndex && i<=event.currentIndex )
          {
            if((this.fileurls[i]))
            {
              this.filesToUpload[i-1] =this.filesToDrag[i];
              this.urls[i-1] =this.fileurls[i];
              this.paths[i-1] =this.imgpaths[i];
            }
            if(!this.fileurls[i])
            {
              this.filesToUpload[i-1] =this.filesToDrag[i];
              this.urls[i-1] =this.fileurls[i];
              this.paths[i-1] =this.imgpaths[i];
            }
          }

          else
          {
            
            if((this.fileurls[i])||(this.fileurls[event.currentIndex]))
            {
              // this.filesToUpload[i] =this.filesToDrag[i];
              // this.urls[i] =this.fileurls[i];
            }
          }
          
        //}
      }
      else
      {

      }
    }

    moveItemInArray(this.userForm.get('trainingitems')['controls'], event.previousIndex, event.currentIndex);
  
    this.userForm.setControl('trainingitems', this.setformLines(this.userForm.get('trainingitems')['controls']));
    
    this.filesToDrag=[];
    for(let j=0;j<this.filesToUpload.length;j++)
    {
      this.filesToDrag.push(this.filesToUpload[j]);
    }

    this.imgpaths=[];
    for(let k=0;k<this.paths.length;k++)
    {
      this.imgpaths.push(this.paths[k]);
    }
    this.fileurls=[];
    for(let k=0;k<this.urls.length;k++)
    {
      this.fileurls.push(this.urls[k]);
    }
    
    // this.route.params.subscribe(params => {
    //   this.TrainingService.reOrderLineItems(event.previousIndex,event.currentIndex,params.itemid)
    //     .subscribe(
    //       data => {
            
    //         console.log('success');
            
    //       },
    //       error => {
    //         console.log(error);
    //      });
    //  });
    // console.log(this.filesToUpload);

    // for(var i=0;i<=this.filesToUpload.length;i++)
    // {
    //   if(event.previousIndex>event.currentIndex)
    //   {

    //   }
    //   else if(event.previousIndex<event.currentIndex)
    //   {
        
    //   }
    //   else
    //   {

    //   }
    // }
    
  }

  private scroll($event: CdkDragMove) {
     
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

   ngOnInit() {
   
    this.basepath=location.origin;
    this.userForm = this.fb.group({
      title: ['', Validators.required],
      vimeolink : [''],
      filetyperadio:[],
      itemdataimage:[''],
      trainingitems: this.fb.array([this.fb.group({itemname:['', Validators.required],gifurl:[''],itemimage:[''],fileradiotype:[],sortIndex:['']})])
      
    });

    

    this.route.params.subscribe(params => {
      this.itemid=params.itemid;
      this.TrainingService.getTrainingbyId(params.itemid)
        .subscribe(
          data => {

            console.log(data);
            this.imageurls = (data.image)?["./assets/uploads/"+data.image]:[];
            //this.imageurls = (data.image)?[this.basepath+"/assets/uploads/"+data.image]:[];

            this.imagepaths = data.image;

            this.rootproductid = data.productId;

            data.traininglineitem.forEach((element, index) => {
                  if(element.image)
                  {
                    this.urls[index] ="./assets/uploads/"+element.image;
                    this.fileurls[index] ="./assets/uploads/"+element.image;
                    this.paths[index] = element.image;
                    this.imgpaths[index] = element.image;
                  }
                  this.ids[index] =(element._id);
                  this.orders[index] =(element.order);
              });

           this.userForm = this.fb.group({
              title: [data.title, Validators.required],
              vimeolink : [data.vimeolink],
              filetyperadio:[data.filetype],
              itemdataimage:[''],
              // trainingitems: this.fb.array([this.fb.group({itemname:[data.traininglineitem.name, Validators.required],gifurl:[''],itemimage:[''],fileradiotype:[]})])
              trainingitems: this.setitemLines(data)
            });
  
            // this.userForm.get("trainingitems").valueChanges.subscribe(() => {
            //   //this.postChangesToServer(this.items.value);
            //   console.log("Vishal");
            // });
           },
          error => {
            console.log(error);
          });
      });

  }

  setitemLines(x) {
    let arr = new FormArray([])
    x.traininglineitem.forEach(y => {
      arr.push(this.fb.group({
        itemname: y.name,
        gifurl: y.gifurl,
        itemimage: '',
        fileradiotype: y.filetype,
        sortIndex: y.order
      }))
    })
    return arr;
  }

  setformLines(x) {
    let arr = new FormArray([])
    x.forEach(y => {
      arr.push(this.fb.group({
        itemname: y.controls.itemname.value,
        gifurl: y.controls.gifurl.value,
        itemimage: '',
        fileradiotype: y.controls.fileradiotype.value,
      }))
    })
    return arr;
  }

  onTrainingItems(){
    const control = new FormGroup({
        'itemname': new FormControl('', Validators.required),
        'gifurl': new FormControl(null),
        'itemimage': new FormControl(null),
        'fileradiotype' : new FormControl(null)
    });
      (<FormArray>this.userForm.get('trainingitems')).push(control);
  }

  updateTrainingItem()
  {
    var errcnt = 0;
    if((this.imageToUpload.length==0) && ((!this.userForm.value.filetyperadio) || (this.userForm.value.filetyperadio=="Image")) && (!this.imageurls))
   
    {
      $("#filetypeerror").html('Please select image');
        errcnt++;
    }
    else if(this.userForm.value.vimeolink=="" && this.userForm.value.filetyperadio=="Video")
    {
      $("#filetypeerror").html('Please enter video link');
        errcnt++;
    }
    else
    {
      $("#filetypeerror").html('');
    }
    
    var trainingdata = this.userForm.controls.trainingitems.value;
    
    for(let i=0;i<trainingdata.length;i++)
    {
      if((trainingdata[i].fileradiotype!='Gif') && (!this.filesToUpload[i]) && (!this.urls[i]))
      {
        $("#typeerror"+i).html('Please select image');
        errcnt++;
      }
      
      else if((trainingdata[i].fileradiotype=='Gif') && (!trainingdata[i].gifurl))
      {
        $("#typeerror"+i).html('Please enter Gif url');
        errcnt++;
      }
      else
      {
        $("#typeerror"+i).html('');
      
      }
    }
    if(errcnt==0)
    {
      this.loading = true;
      var mainfiletype = (this.userForm.value.filetyperadio)?this.userForm.value.filetyperadio:'Image';
  
    this.route.params.subscribe(params => {
    
    var traininglineitems = [];
    
    var trainingdata = this.userForm.controls.trainingitems.value;
    
    for(let i = 0; i <trainingdata.length; i++)
    {
      //traininglineitems.push({ 'itemname': trainingdata[i].itemname, 'fileradiotype': (trainingdata[i].fileradiotype)?trainingdata[i].fileradiotype:'Image','itemdataimage':(trainingdata[i].fileradiotype==="Image" && trainingdata[i].itemimage!="")?this.filesToUpload[i]:'' ,'itemexistimage':(trainingdata[i].fileradiotype==="Image" && trainingdata[i].itemimage=="")?this.paths[i]:'' ,'gifurl':(trainingdata[i].fileradiotype==="Gif")?trainingdata[i].gifurl:''});

      traininglineitems.push({ 'itemname': trainingdata[i].itemname, 'fileradiotype': (trainingdata[i].fileradiotype)?trainingdata[i].fileradiotype:'Image','itemdataimage':(trainingdata[i].fileradiotype==="Image" && this.filesToUpload[i])?this.filesToUpload[i]:'' ,'itemexistimage':(trainingdata[i].fileradiotype==="Image" && trainingdata[i].itemimage=="")?this.paths[i]:'' ,'gifurl':(trainingdata[i].fileradiotype==="Gif")?trainingdata[i].gifurl:''});
    }

    // console.log('traininglineitems');
    // console.log(this.filesToUpload);
    // console.log(this.paths);
    // console.log(traininglineitems);
    // return false;

    if(this.imageToUpload.length>0)
    {
      this.TrainingService.addmainTraining(this.imageToUpload,params.itemid)
      .subscribe(
        data => {
          
          this.userForm.value.mainImage = data.filename;
         
              this.TrainingService.updateTrainingItems(traininglineitems,this.imageToUpload,this.userForm.value,this.filesToUpload,params.itemid)
                .subscribe(
                  datas => {
                    this.loading = false;
                    this.snackBar.open('Training item added successfully!', '', {duration: 3000});
                    this.router.navigate(['training/viewtrainingitem/'+this.rootproductid]);
                  },
                  error => {
                    this.loading = false;
                    this.snackBar.open('Something went wrong,Please try again!', '', {duration: 3000});
                    //this.router.navigate(['auth/training/updatetrainingitem/'+params.itemid]);
                });
        },
        error => {
          this.loading = false;
          this.snackBar.open('Something went wrong,Please try again!', '', {duration: 3000});
          //this.router.navigate(['auth/training/updatetrainingitem/'+params.itemid]);
      });
    }
    else
    {
      this.userForm.value.mainImage = '';
      this.userForm.value.mainImage = this.imagepaths;
      this.TrainingService.updateTrainingItems(traininglineitems,this.imageToUpload,this.userForm.value,this.filesToUpload,params.itemid)
      .subscribe(
        data => {
          this.loading = false;
          this.snackBar.open('Training item updated successfully!', '', {duration: 3000});
          this.router.navigate(['training/viewtrainingitem/'+this.rootproductid]);
        },
        error => {
          this.loading = false;
         this.snackBar.open('Something went wrong,Please try again!', '', {duration: 3000});
         //this.router.navigate(['auth/training/updatetrainingitem/'+params.itemid]);
      });
    }
    return false;

    
    });

    }

       
  }
  get formArr() {
    return this.userForm.get('trainingitems') as FormArray;
  }
  removeTrainingItems(index,id,order) {

    
    
      this.route.params.subscribe(params => {
        if(id)
      {
        this.TrainingService.removeTrainingItems(id,params.itemid,order)
        .subscribe(
          data => {
            this.formArr.removeAt(index);
            this.urls.splice(index, 1);
            this.ids.splice(index, 1);
            this.paths.splice(index, 1);
              //orders.splice(index, 1);
              var temp = new Array<File>();
              for (var j = 0; j < this.filesToUpload.length; j++) {
                if (j != index) {
                  temp.push(this.filesToUpload[j]);
                }
              }

              this.filesToUpload = temp;
          },
          error => {
            
        });
      }
      else
      {
        this.formArr.removeAt(index);
        this.urls.splice(index, 1);
        this.ids.splice(index, 1);
        this.paths.splice(index, 1);
        //orders.splice(index, 1);
        var temp = new Array<File>();
        for (var j = 0; j < this.filesToUpload.length; j++) {
          if (j != index) {
            temp.push(this.filesToUpload[j]);
          }
        }

        this.filesToUpload = temp;
      }
        // const dialogRef = this.composeDialog.open(itemPopupComponent, {
        //   data: {
        //     itemid: id,
        //     trainingid: params.itemid,
        //     index: index,
        //     formarry : this.formArr,
        //     imgurls : this.urls,
        //     ids : this.ids,
        //     orders : this.orders,
        //     ordervalue : order
        //   },
        //   width: '450px'
        //   });
        // dialogRef.afterClosed().subscribe(result => {
        // // this.snackBar.open('Message has been sent', '', {duration: 3000});
        // });

       
      })
    
    
  }

  fileChangeEvent(fileInput: any, index) {
    this.filesToInput.push(fileInput);
    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {

      var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

      if (!(regex.test(fileInput.target.value.toLowerCase()))) {
        fileInput.target.value = ''
        this.snackBar.open('Please select correct file format', '', {
          duration: 3000,
          //horizontalPosition: this.horizontalPosition,
          //verticalPosition: this.verticalPosition,
        });

      } else {

        var filesAmount = fileInput.target.files.length;

        var testreader = new FileReader();
        testreader.onload = (fileInput: any) => {
          this.urls[index] = fileInput.target.result;
          this.fileurls[index]=fileInput.target.result;
          //this.filesToUpload.push(imagefiles[0]);
          this.filesToUpload[index]=imagefiles[0];
          this.filesToDrag[index]=imagefiles[0];
        }
        testreader.readAsDataURL(fileInput.target.files[0]);
      }

    }
  }

  close(urls, event, index, i) {
    console.log(this.urls);
    //urls.splice(i, 1);
    var temp = new Array<File>();
    var newurls = new Array<string>();
    var newpaths = new Array<string>();
    for (var j = 0; j < this.urls.length; j++) {
      if (j != i) {
        if(this.filesToUpload[j])
        {
          temp[j]=this.filesToUpload[j];
        }
        
        newurls[j]=this.urls[j];
        newpaths[j]=this.paths[j];
      }
    }
    this.urls = newurls;
    this.fileurls = newurls;
    this.filesToUpload = temp;
    this.filesToDrag = temp;
    this.paths =newpaths;
    this.imgpaths =newpaths;
    console.log(this.urls);
    console.log(this.fileurls);
    console.log(this.paths);
    console.log(this.imgpaths);
  }


  imageChangeEvent(fileInput: any) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {

      var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

      if (!(regex.test(fileInput.target.value.toLowerCase()))) {
        fileInput.target.value = ''
        this.snackBar.open('Please select correct file format', '', {duration: 3000});

      } else {

        var filesAmount = fileInput.target.files.length;

        var testreader = new FileReader();
        testreader.onload = (fileInput: any) => {
          
          this.imageurls = fileInput.target.result;
          this.imageToUpload.push(imagefiles[0]);
        }
        testreader.readAsDataURL(fileInput.target.files[0]);
      }

    }
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
export class itemPopupComponent {
  

  urls = new Array<string>();
  userForm: FormGroup;
  filesToUpload: Array<File> = [];

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
    this.userForm = this.fb.group({
      title: ['', Validators.required],
      vimeolink : [''],
      filetyperadio:[],
      itemdataimage:[''],
      trainingitems: this.fb.array([this.fb.group({itemname:['', Validators.required],gifurl:[''],itemimage:[''],fileradiotype:[]})])
      
    });
   
  }

  deletetrainingitem(itemid,trainingid,index,formarry,imgurls,ordervalue,ids,orders) {
    
    if(itemid)
    {
      this.TrainingService.removeTrainingItems(itemid,trainingid,ordervalue)
      .subscribe(
        data => {
            formarry.removeAt(index);
            imgurls.splice(index, 1);
            ids.splice(index, 1);
            //orders.splice(index, 1);
            var temp = new Array<File>();
            for (var j = 0; j < this.filesToUpload.length; j++) {
              if (j != index) {
                temp.push(this.filesToUpload[j]);
              }
            }

            this.filesToUpload = temp;
        },
        error => {
          
      });
    }
    else
    {
      formarry.removeAt(index);
      imgurls.splice(index, 1);
      ids.splice(index, 1);
      //orders.splice(index, 1);
      var temp = new Array<File>();
      for (var j = 0; j < this.filesToUpload.length; j++) {
        if (j != index) {
          temp.push(this.filesToUpload[j]);
        }
      }

      this.filesToUpload = temp;
    }
  }
}
export class DialogContentExampleDialog { }



