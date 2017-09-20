import { Component, OnInit, Input } from '@angular/core';
import {RouteDef} from "../menubar-item/menubar-item.component";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
    @Input('items') items: RouteDef[];

    constructor() { }

    ngOnInit() {
    }

}

// import { Component, OnInit, Input } from '@angular/core';
// import {RouteDef} from "../menubar-item/menubar-item.component";
//
// import {
//     Router,
//     ActivatedRoute
// } from '@angular/router';
// import { Location } from '@angular/common';
//
// @Component({
//     selector: 'app-menu-bar',
//     templateUrl: './menu-bar.component.html',
//     styleUrls: ['./menu-bar.component.css']
// })
// export class MenuBarComponent implements OnInit {
//     @Input('items') items: RouteDef[];
//     @Input('item') item: RouteDef;
//
//     constructor(private router: Router,
//                 private route: ActivatedRoute,
//                 private location: Location) {
//     }
//
//     isActive(): boolean {
//         return `/${this.item.path}` === this.location.path();
//     }
//
//     ngOnInit() {
//     }
//
// }
