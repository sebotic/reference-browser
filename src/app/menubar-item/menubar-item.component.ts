import { Component, Input } from '@angular/core';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import { Location } from '@angular/common';

export interface RouteDef {
    label: string;  // link label
    name: string;   // route name of the example
    path: string;   // route path
    component: any; // component class
    dev?: boolean;  // is it an intermediate step?
}

@Component({
  selector: 'app-menubar-item',
  templateUrl: './menubar-item.component.html',
  styleUrls: ['./menubar-item.component.css']
})
export class MenubarItemComponent {
    @Input('item') item: RouteDef;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private location: Location) {
    }

    isActive(): boolean {
        return `/${this.item.path}` === this.location.path();
    }

}
