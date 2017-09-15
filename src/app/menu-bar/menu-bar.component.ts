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
