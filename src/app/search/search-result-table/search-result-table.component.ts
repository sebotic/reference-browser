import { Component, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';

import { SearchResult, SearchResultService, WDQService } from "../search-box/search-box.component";

@Component({
  selector: 'app-search-result-table',
  templateUrl: './search-result-table.component.html',
  styleUrls: ['./search-result-table.component.css']
})
export class SearchResultTableComponent implements OnInit {
    obs: Observable<SearchResult>;
    results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
    r: SearchResult[];

    // settings documentation: https://akveo.github.io/ng2-smart-table/#/documentation
    settings = {
        actions: {
            add: false,
            delete: false,
            edit: false
        },
        pager: {
            display: true,
            perPage: 10,
        },
        columns: {
            title: {
                title: 'Title'
            },
            pmid: {
                title: 'PubMed ID'
            },
            doi: {
                title: 'DOI'
            },
            c: {
                title: 'Wikidata'
            },
        }
    };

    data: any;
    sdata:any;


    constructor(private searchResultService: SearchResultService,
                public wd: WDQService,
                private el: ElementRef,
                private router: Router,
    ) {
        this.searchResultService.newSearchResult$.subscribe(
            result => {
                this.sdata = result;
            });

        console.log(this.sdata);

        // this.obs  = Observable.fromEvent(this.el.nativeElement, 'click');
    }

    public userRowSelect(e):void {
        console.log('click works');
        console.log(e);

        let qid: string = e.data.c.split('/').pop();
        console.log(qid);

        this.router.navigate([`paper_data/${qid}`]);
    }

    ngOnInit() {
        if(this.sdata) {
            // console.log(this.sdata);
            this.data = this.prepareViewData(this.sdata.data)

            // this.itemResource = new DataTableResource(this.prepareViewData(this.sdata.data));
            // this.itemResource.count().then(count => this.itemCount = count);
        }
    }

    prepareViewData(raw_json: Object): any {
        let compounds: Array<Object> = [];

        if (raw_json) {
            for (let x of raw_json['results']['bindings']) {
                // console.log(x);

                compounds.push({
                    'c': x['c']['value'],
                    'pmid': x['pmid']['value'],
                    'title': x['title']['value'],
                    'doi': x['doi'] ? x['doi']['value'] : " ",

                });
            }
        }
        return compounds;
    }

}
