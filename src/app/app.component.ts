import { Component } from '@angular/core';

import {
    Router,
    Routes
} from '@angular/router';
import {SearchComponent} from "./search/search.component";
import {PaperComponent} from "./paper/paper.component";
import {RouteDef} from "./menubar-item/menubar-item.component";

let routeDef: RouteDef[] = [
    {label: 'Paper Search', name: 'Root', path: '', component: SearchComponent },
    {label: 'Paper Overview', name: 'paper_data', path: 'paper_data/:qid', component: PaperComponent },
];

export const routes: Routes = [
    { path: '', component: SearchComponent, pathMatch: 'full' },
    { path: 'paper_data/:qid', component: PaperComponent, pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    routeDef: RouteDef[];

    constructor(private router: Router) {
        this.routeDef = routeDef;
    }
}
