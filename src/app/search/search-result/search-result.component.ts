import { Component, OnInit } from '@angular/core';
import {SearchResult, SearchResultService} from "../search-box/search-box.component";

@Component({
    inputs: ['result'],
    outputs: ['sdata'],
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
    result: SearchResult;

    constructor(public searchResultService: SearchResultService) {

    }

    announce() {
        this.searchResultService.announceNewSearchResult(this.result);
        console.log(this.result)
    }

    ngOnInit(){
        this.announce();
    }

}
