import { Component, OnInit, Inject, ViewChild, TemplateRef, Output, Input, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormArray } from '@angular/forms';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, merge, Subscription } from 'rxjs';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
//import { TABLE_HELPERS, ExampleDatabase, ExampleDataSource } from './helpers.data';

import { TrainingService } from '../../../_services/index';
import { MatSnackBar, MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';

const speed = 10;

@Component({
  selector: 'app-addtrainingitem',
  templateUrl: './addtrainingitem.component.html',
  styleUrls: ['./addtrainingitem.component.scss']
})
export class AddTrainingItemComponent implements OnInit {

  userForm: FormGroup;
  urls = new Array<string>();
  fileurls = new Array<string>();
  filesToUpload: Array<File> = [];
  filesToDrag: Array<File> = [];
  filesToInput = new Array<string>();

  imageurls = new Array<string>();
  imageToUpload: Array<File> = [];
  datalength = Number;
  flag;
  productid;

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  @ViewChild('scrollEl')
  scrollEl: ElementRef<HTMLElement>;

  @ViewChildren(CdkDrag)
  dragEls: QueryList<CdkDrag>;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate: TemplateRef<any>;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };

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

  private scroll($event: CdkDragMove) {

    const { y } = $event.pointerPosition;
    const baseEl = this.scrollEl.nativeElement;
    const box = baseEl.getBoundingClientRect();
    const scrollTop = baseEl.scrollTop;
    const top = box.top + - y;
    if (top > 0 && scrollTop !== 0) {
      const newScroll = scrollTop - speed * Math.exp(top / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      return;
    }

    const bottom = y - box.bottom;
    if (bottom > 0 && scrollTop < box.bottom) {
      const newScroll = scrollTop + speed * Math.exp(bottom / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }
  }
  subs = new Subscription();

  ngAfterViewInit() {
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
  setTypeValidators() {
    const videoControl = this.userForm.get('vimeolink');
    const imageControl = this.userForm.get('itemdataimage');

    // this.userForm.get('filetyperadio').valueChanges
    //   .subscribe(typefile => {
    //     console.log('here');
    //     console.log(typefile);
    //     console.log('imageControl');
    //     console.log(imageControl);
    //     // if (typefile === 'Video') {
    //     //   videoControl.setValidators([Validators.required]);
    //     //   imageControl.setValidators(null);
    //     // }
    //     // if (typefile === 'Image') {
    //     //   imageControl.setValidators([Validators.required]);
    //     //   videoControl.setValidators(null);
    //     // }

    //   });


    // (this.userForm.get('trainingitems') as FormArray).valueChanges
    // .subscribe(trainingitems => {
    //   console.log('trainingitems');
    //   console.log(trainingitems);
    //   (this.userForm.get('trainingitems') as FormArray).push(this.fb.group({
    //     'gifurl': ['', Validators.required]
    //   }));
    //   for(let i=0;i<trainingitems.length;i++)
    //   {

    //   }

    // });
  }

  drop(event: CdkDragDrop<string[]>) {
    for (var i = 0; i < this.filesToUpload.length; i++) {
      if (event.previousIndex > event.currentIndex) {
        // if((this.filesToUpload[event.previousIndex]) || (this.filesToUpload[event.currentIndex]))
        // {
        if (this.filesToDrag[i]) {
          this.filesToUpload[event.currentIndex] = this.filesToDrag[event.previousIndex];
          this.urls[event.currentIndex] = this.fileurls[event.previousIndex];
        }

        if ((!this.filesToDrag[event.currentIndex]) && (this.filesToDrag[event.previousIndex])) {
          this.filesToUpload[event.previousIndex] = this.filesToDrag[event.currentIndex];
          this.urls[event.previousIndex] = this.fileurls[event.currentIndex];
        }

        // if((!this.filesToDrag[event.currentIndex]) && (!this.filesToDrag[event.previousIndex]))
        // {
        //   console.log('both empty');
        //   this.filesToUpload[event.previousIndex] =this.filesToDrag[event.currentIndex];
        //   this.urls[event.previousIndex] =this.fileurls[event.currentIndex];
        // }

        if (i < event.previousIndex && i >= event.currentIndex) {

          if (this.filesToDrag[i]) {
            this.filesToUpload[i + 1] = this.filesToDrag[i];
            this.urls[i + 1] = this.fileurls[i];
          }
          if (!this.filesToDrag[i]) {
            this.filesToUpload[i + 1] = this.filesToDrag[i];
            this.urls[i + 1] = this.fileurls[i];
          }
        }



        else {
          if (!this.filesToDrag[i]) {
            // this.filesToUpload[i] =this.filesToDrag[i];
            // this.urls[i] =this.fileurls[i];
          }

        }



        //}
      }
      else if (event.previousIndex < event.currentIndex) {
        //if((this.filesToUpload[event.previousIndex]) || (this.filesToUpload[event.currentIndex]))
        //{
        if ((this.filesToDrag[i]) || (this.filesToDrag[event.currentIndex])) {
          this.filesToUpload[event.currentIndex] = this.filesToDrag[event.previousIndex];
          this.urls[event.currentIndex] = this.fileurls[event.previousIndex];
        }
        // if(!this.filesToDrag[i])
        // {
        //   console.log('filedrag');
        //   this.filesToUpload[event.previousIndex] =this.filesToDrag[event.currentIndex];
        //   this.urls[event.previousIndex] =this.fileurls[event.currentIndex];
        // }
        if (i > event.previousIndex && i <= event.currentIndex) {
          if ((this.filesToDrag[i])) {
            this.filesToUpload[i - 1] = this.filesToDrag[i];
            this.urls[i - 1] = this.fileurls[i];
          }
          if (!this.filesToDrag[i]) {
            this.filesToUpload[i - 1] = this.filesToDrag[i];
            this.urls[i - 1] = this.fileurls[i];
          }
        }

        else {

          if ((this.filesToDrag[i]) || (this.filesToDrag[event.currentIndex])) {
            // this.filesToUpload[i] =this.filesToDrag[i];
            // this.urls[i] =this.fileurls[i];
          }
        }

        //}
      }
      else {

      }
    }

    moveItemInArray(this.userForm.get('trainingitems')['controls'], event.previousIndex, event.currentIndex);

    this.userForm.setControl('trainingitems', this.setitemLines(this.userForm.get('trainingitems')['controls']));

    this.filesToDrag = [];
    for (let j = 0; j < this.filesToUpload.length; j++) {
      this.filesToDrag.push(this.filesToUpload[j]);
    }

    this.fileurls = [];
    for (let k = 0; k < this.urls.length; k++) {
      this.fileurls.push(this.urls[k]);
    }
    //this.filesToDrag=this.filesToUpload;
  }
  setitemLines(x) {
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

  ngOnInit() {
    this.userForm = this.fb.group({
      title: ['', Validators.required],
      vimeolink: [''],
      filetyperadio: [],
      itemdataimage: [''],
      trainingitems: this.fb.array([this.fb.group({ itemname: ['', Validators.required], gifurl: [''], itemimage: [''], fileradiotype: [] })])
    });
    this.setTypeValidators();

    this.route.params.subscribe(params => {

      this.flag = atob(params.pagetype);
      this.productid = params.productid;
      this.TrainingService.getTrainingbyProductId(params.productid)
        .subscribe(
          data => {
            this.datalength = data.length;
          },
          error => {
            this.snackBar.open('Something went wrong,Please try again!', '', { duration: 3000 });
            this.router.navigate(['auth/training/viewtrainingitem/' + params.productid]);
          });
    });
  }

  onTrainingItems() {
    const control = new FormGroup({
      'itemname': new FormControl('', Validators.required),
      'gifurl': new FormControl(null),
      'itemimage': new FormControl(null),
      'fileradiotype': new FormControl(null)
    });
    (<FormArray>this.userForm.get('trainingitems')).push(control);
  }
  addTrainingItem() {
    var errcnt = 0;
    if ((this.imageToUpload.length == 0) && ((!this.userForm.value.filetyperadio) || (this.userForm.value.filetyperadio == "Image"))) {
      $("#filetypeerror").html('Please select image');
      errcnt++;
    }
    else if (this.userForm.value.vimeolink == "" && this.userForm.value.filetyperadio == "Video") {
      $("#filetypeerror").html('Please enter video link');
      errcnt++;
    }
    else {
      $("#filetypeerror").html('');
    }

    var trainingdata = this.userForm.controls.trainingitems.value;

    for (let i = 0; i < trainingdata.length; i++) {
      if ((trainingdata[i].fileradiotype != 'Gif') && (!this.filesToUpload[i])) {
        $("#typeerror" + i).html('Please select image');
        errcnt++;
      }

      else if ((trainingdata[i].fileradiotype == 'Gif') && (!trainingdata[i].gifurl)) {
        $("#typeerror" + i).html('Please enter Gif url');
        errcnt++;
      }
      else {
        $("#typeerror" + i).html('');

      }
    }

    if (errcnt == 0) {
      this.loading = true;
      var mainfiletype = (this.userForm.value.filetyperadio) ? this.userForm.value.filetyperadio : 'Image';

      this.route.params.subscribe(params => {

        var traininglineitems = [];


        for (let i = 0; i < trainingdata.length; i++) {
          traininglineitems.push({ 'itemname': trainingdata[i].itemname, 'fileradiotype': (trainingdata[i].fileradiotype) ? trainingdata[i].fileradiotype : 'Image', 'itemdataimage': (trainingdata[i].fileradiotype === "Gif") ? '' : this.filesToUpload[i], 'gifurl': (trainingdata[i].fileradiotype === "Gif") ? trainingdata[i].gifurl : '' });
        }

        if ((mainfiletype == 'Image') && (this.imageToUpload.length > 0)) {
          this.TrainingService.addmainTraining(this.imageToUpload, params.productid)
            .subscribe(
              data => {
                this.userForm.value.mainImage = data.filename;
                this.TrainingService.addTrainingItems(traininglineitems, this.imageToUpload, this.userForm.value, this.filesToUpload, params.productid, this.datalength)
                  .subscribe(
                    datas => {
                      this.loading = false;
                      this.snackBar.open('Training item added successfully!', '', { duration: 3000 });
                      this.router.navigate(['training/viewtrainingitem/' + params.productid]);
                    },
                    error => {
                      this.loading = false;
                      this.snackBar.open('Something went wrong,Please try again!', '', { duration: 3000 });
                      //this.router.navigate(['auth/training/viewtrainingitem/'+params.productid]);
                    });
              },
              error => {
                this.snackBar.open('Something went wrong,Please try again!', '', { duration: 3000 });
                //this.router.navigate(['auth/training/viewtrainingitem/'+params.productid]);
              });
        }
        else {
          this.userForm.value.mainImage = '';
          this.TrainingService.addTrainingItems(traininglineitems, this.imageToUpload, this.userForm.value, this.filesToUpload, params.productid, this.datalength)
            .subscribe(
              data => {
                this.loading = false;
                this.snackBar.open('Training item added successfully!', '', { duration: 3000 });
                this.router.navigate(['training/viewtrainingitem/' + params.productid]);
              },
              error => {
                this.loading = false;
                this.snackBar.open('Something went wrong,Please try again!', '', { duration: 3000 });
                //this.router.navigate(['auth/training/viewtrainingitem/'+params.productid]);
              });
        }
        return false;


      });
    }



  }
  get formArr() {
    return this.userForm.get('trainingitems') as FormArray;
  }
  removeTrainingItems(index) {

    this.formArr.removeAt(index);
    this.urls.splice(index, 1);
    var temp = new Array<File>();
    for (var j = 0; j < this.filesToUpload.length; j++) {
      if (j != index) {
        console.log('if');
        temp.push(this.filesToUpload[j]);
      }
    }

    this.filesToUpload = temp;

    // this.route.params.subscribe(params => {

    //   const dialogRef = this.composeDialog.open(itemdeletePopupComponent, {
    //     data: {
    //       index: index,
    //       productid: params.productid,
    //       formarry : this.formArr,
    //       imgurls : this.urls,
    //       filesToUpload : this.filesToUpload
    //     },
    //     width: '450px'
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //   // this.snackBar.open('Message has been sent', '', {duration: 3000});
    //   });


    // })
  }
  fromchild() {
    console.log('fromchild');
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
          this.fileurls[index] = fileInput.target.result;
          //this.filesToUpload.push(imagefiles[0]);
          this.filesToUpload[index] = imagefiles[0];
          this.filesToDrag[index] = imagefiles[0];
        }
        testreader.readAsDataURL(fileInput.target.files[0]);
      }

    }
  }

  close(urls, event, index, i) {

    //urls.splice(i, 1);
    var temp = new Array<File>();
    var newurls = new Array<string>();
    for (var j = 0; j < this.filesToUpload.length; j++) {
      if (j != i) {
        temp[j] = this.filesToUpload[j];
        newurls[j] = this.urls[j];
      }
    }
    this.urls = newurls;
    this.fileurls = newurls;
    this.filesToUpload = temp;
    this.filesToDrag = temp;

  }


  imageChangeEvent(fileInput: any) {

    var imagefiles = fileInput.target.files;
    if (fileInput.target.files && fileInput.target.files[0]) {

      var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

      if (!(regex.test(fileInput.target.value.toLowerCase()))) {
        fileInput.target.value = ''
        this.snackBar.open('Please select correct file format', '', { duration: 3000 });

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

  onValueChanged(data?: any) {

  }

  deleteitem() {
    console.log('delete in');
  }
  deletetrainingitem(index, formarry, imgurls, filesupload) {
    //AddTrainingItemComponent.filesToUpload();
    console.log(filesupload);

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
  selector: 'deleteitem-confirm-popup',
  templateUrl: './deleteconfirmpopup.html'
})
export class itemdeletePopupComponent {

  @Output() someEvent = new EventEmitter<string>();
  urls = new Array<string>();
  userForm: FormGroup;
  filesToUpload: Array<File> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public composeDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private TrainingService: TrainingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {


  }

  @ViewChild(AddTrainingItemComponent) AddTrainingItemComponent;
  ngOnInit() {
    this.userForm = this.fb.group({
      title: ['', Validators.required],
      vimeolink: [''],
      filetyperadio: [],
      itemdataimage: [''],
      trainingitems: this.fb.array([this.fb.group({ itemname: ['', Validators.required], gifurl: [''], itemimage: [''], fileradiotype: [] })])

    });



  }


  callParent() {
    this.someEvent.next('fromchild');
  }

  deletetrainingitem(index, formarry, imgurls, filesupload) {
    this.AddTrainingItemComponent.deleteitem();
    console.log(filesupload);
    return false;
    formarry.removeAt(index);
    imgurls.splice(index, 1);
    var temp = new Array<File>();
    for (var j = 0; j < filesupload.length; j++) {
      if (j != index) {
        console.log('if');
        temp.push(filesupload[j]);
      }
    }

    this.filesToUpload = temp;
    console.log(this.filesToUpload);
  }
}
export class DialogContentExampleDialog { }



