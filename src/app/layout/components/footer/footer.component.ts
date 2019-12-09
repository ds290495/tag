

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent
{
   //router:any;
    data:string
    /**
     * Constructor
     */
    constructor( private route: ActivatedRoute,
  //private router: Router
    )
    {

    }
    readLocalStorageValue(key) {
        return localStorage.getItem(key);
    }
    ngOnInit() {
   
    
     
    } 


}