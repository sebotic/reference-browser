import { Component, OnInit } from '@angular/core';
import {SearchResult} from "./search-box/search-box.component";

export let loadingGif: string = './assets/Loading_icon.gif';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
    results: SearchResult[];

    updateResults(results: SearchResult[]): void {
        this.results = results;
    }
}
