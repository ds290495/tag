import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector: 'fuse-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavbarComponent implements OnDestroy {
    private fusePerfectScrollbar: FusePerfectScrollbarDirective;

    @ViewChild(FusePerfectScrollbarDirective) set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this.fusePerfectScrollbar = theDirective;

        this.navigationServiceWatcher =
            this.navigationService.onItemCollapseToggled.subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this.fusePerfectScrollbar.update();
                }, 310);
            });
    }

    @Input() layout;
    navigation: any;
    custom: any;
    custom2: any;
    navigationServiceWatcher: Subscription;
    fusePerfectScrollbarUpdateTimeout;

    constructor(
        private sidebarService: FuseSidebarService,
        private navigationService: FuseNavigationService,
        private route: ActivatedRoute,
        private router: Router,
     //   private company: CompanyService
    ) {
        
        var custom = [
            {
                id: 'dashboard',
                title: 'Dashboards',
                url: '/dashboard',
                type: 'item',
                icon: 'dashboard'
            },      
        ];     
        router.events.subscribe(
            (event) => {

                if (event instanceof NavigationEnd) {
        
                    var custom = [
                        {
                            id: 'dashboard',
                            title: 'Dashboards',
                            url: '/dashboard',
                            type: 'item',
                            icon: 'dashboard'
                        },
                    
                    ];
                }
            });
    }
    ngOnInit() {

        this.toggleSidebarFolded('navbar');
    }
    ngOnDestroy() {
        if (this.fusePerfectScrollbarUpdateTimeout) {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        if (this.navigationServiceWatcher) {
            this.navigationServiceWatcher.unsubscribe();
        }
    }

    toggleSidebarOpened(key) {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    toggleSidebarFolded(key) {
        this.sidebarService.getSidebar(key).toggleFold();
    }
}
