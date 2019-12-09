import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';



@Component({
    selector: 'app-updatetagdata',
    templateUrl: '../updatetagdata/updatetagdata.component.html',
    styleUrls: ['../updatetagdata/updatetagdata.component.scss'],
    animations: fuseAnimations
})
export class UpdateTagData implements OnInit, OnDestroy {
    form: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    hide = true;

    queryData: any;
    lableType: any;
    product_type: any;
    @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
    @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    public loading = false;
    public primaryColour = PrimaryWhite;
    public secondaryColour = SecondaryGrey;
    public coloursEnabled = false;
    public loadingTemplate: TemplateRef<any>;
    public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private AuthenticationService: AuthenticationService,
        public snackBar: MatSnackBar,
        private sanitizer: DomSanitizer,
        private datePipe: DatePipe
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    public toggleColours(): void {
        this.coloursEnabled = !this.coloursEnabled;

        if (this.coloursEnabled) {
            this.primaryColour = PrimaryRed;
            this.secondaryColour = SecondaryBlue;
        } else {
            this.primaryColour = PrimaryWhite;
            this.secondaryColour = SecondaryGrey;
        }
    }

    //   toggleTemplate(): void {
    //     if (this.loadingTemplate) {
    //       this.loadingTemplate = null;
    //     } else {
    //       this.loadingTemplate = this.customLoadingTemplate;
    //     }
    //   }

    public showAlert(): void {
        alert('ngx-loading rocks!');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Reactive Form
        this.form = this._formBuilder.group({
            qr_code: [''],
            product_type: [''],
            TagNo: [''],
            product_name: [''],
            username: [''],

            sourceNo: [''],
            destinationNo: [''],
            datemodified: ['']
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/trainingprograms';

        this.route.params.subscribe(params => {

            this.AuthenticationService.gettagdataId(params.id)
                .subscribe(
                    data => {

                        var result = data[0];
                        var source = result.sourcePortNo != "" ? result.sourcePortNo : '';
                        var destination = result.destinationPortNo != '' ? result.destinationPortNo : '';
                        this.queryData = result.product_type;

                        var username = '';
                        if (result.TagUserDetails.length > 0) {
                            username = result.TagUserDetails[0].username;
                        }
                        var medium = result.datemodified ? this.datePipe.transform(result.datemodified, "MMM d, y, h:mm:ss a") : '';

                        this.lableType = result.product_type == 'Panel' ? 'Panel Port Count' : 'Panel Count';


                        this.form = this._formBuilder.group({

                            qr_code: [result.qr_code],
                            product_type: [result.product_type],
                            datemodified: [medium],
                            product_name: [result.product_name],
                            username: [username],
                            // cabinet_name: [!result.cabinet_name?'':result.cabinet_name],
                            // panelPortCount: [result.panelPortCount],
                            sourceNo: [source],
                            destinationNo: [destination],
                            description: [result.destination],
                            radius_curvature_a: [result.radius_curvature_a],
                            apex_offset_a: [result.apex_offset_a],
                            fibre_height_a: [result.fibre_height_a],
                            apc_angle_a: [result.apc_angle_a],
                            key_error_a: [result.key_error_a],
                            radius_curvature_b: [result.radius_curvature_b],
                            apex_offset_b: [result.apex_offset_b],
                            fibre_height_b: [result.fibre_height_b],
                            apc_angle_b: [result.apc_angle_b],
                            key_error_b: [result.key_error_b],
                            insertion_loss_a: [result.insertion_loss_a],
                            insertion_loss_b: [result.insertion_loss_b],
                            return_loss_a: [result.return_loss_a],
                            return_loss_b: [result.return_loss_b],
                            odfPortCount: [result.odfPortCount],
                            endAInstalledOnOdf: [result.endAInstalledOnOdf],
                            endBInstalledOnOdf: [result.endBInstalledOnOdf]
                           
                        });
                    },
                    error => {
                        console.log(error);

                    });

        });

    }


    updatetagdatafunction() {
        this.loading = true;
        this.route.params.subscribe(params => {
            this.form.value._id = params.id;
            this.form.value.userId = localStorage.getItem('User Type');
            this.loading = false;
            this.AuthenticationService.updatingTagDataReview(this.form.value)
                .subscribe(
                    data => {
                        this.loading = false;
                        this.snackBar.open('Tag data updated successfully!', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        this.loading = false;
                        console.log(error);
                    });
        });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
