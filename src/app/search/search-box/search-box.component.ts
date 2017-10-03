import {
    Component,
    Injectable,
    OnInit,
    ElementRef,
    EventEmitter,
    Input
} from '@angular/core';
import {Http, Response} from '@angular/http';


import {Observable} from 'rxjs';
import { Subject } from 'rxjs/Subject';

export let loadingGif: string = './assets/Loading_icon.gif';

import {$} from "protractor";
import {Router} from "@angular/router";


@Injectable()
export class SearchResultService {
    private newSearchResultSource = new Subject<SearchResult>();

    newSearchResult$ = this.newSearchResultSource.asObservable();

    announceNewSearchResult(result: SearchResult) {
        this.newSearchResultSource.next(result);
        // console.log(result);
    }
}

export class SearchResult {
    data: Object;
    tabulatedData: Object;

    constructor(obj?: any) {
        this.data              = obj && obj.data             || null;

        console.log(this.data);

        console.log(this.tabulatedData);

    }
}

@Injectable()
export class WDQService {
    apiUrl: string;
    q: string;

    constructor(public http: Http) {
        this.apiUrl = 'https://query.wikidata.org/sparql';

    }

    search(query: string): Observable<SearchResult[]> {
        // this.q = `SELECT * WHERE {?c wdt:P235 '${query}' .}`;

        this.q = query;
        if(!this.q){
            this.q = ''
        }

        // this.q = `SELECT * WHERE {?c wdt:P235 ?ikey . FILTER (STRSTARTS(?ikey, '${query}'))}`;

        console.log(this.q);

        let params: string = [
            `query=${this.q}`,
            `format=json`
        ].join('&');

        let queryUrl: string = encodeURI(`${this.apiUrl}?${params}`);

        console.log(queryUrl);

        return this.http.get(queryUrl)
            .map((response: Response) => {
                return ([<any>response.json()]).map(item => {
                    return new SearchResult({
                        data: item,

                    });
                });
            });
    }

    searchFullText(query: string, sparql: string): Observable<SearchResult[]> {
        // this.q = query;
        let url = 'https://www.wikidata.org/w/api.php';

        console.log(query);

        let params: string = [
            // 'action=wbsearchentities',
            // `search=${query}`,
            // 'language=en',
            // 'type=item',
            // 'limit=50',
            'action=query',
            'list=search',
            `srsearch=${query}`,

            `format=json`,
            'srlimit=100', // limit to 100 right now, otherwise, SPARQL value QID list for paper filtering will get too long.
            // 'callback=parseResponse'
            'origin=*' // required for Wikidata CORS, see https://www.wikidata.org/wiki/Special:ApiSandbox#action=query&meta=siteinfo&siprop=namespaces&format=json
        ].join('&');
        let queryUrl: string = encodeURI(`${url}?${params}`);

        console.log(queryUrl);

        let freetext_search = this.http.get(queryUrl)
            .map((response: Response) => {
                return ([<any>response.json()]).map(item =>
                {
                    return item['query']['search'].map(x => {
                        console.log(x);
                        return x['title'];
                    })
                        .join(' wd:')})});

        console.log(freetext_search);


        return freetext_search
            .flatMap((qids: string[]) => {
                let q: string = 'wd:' + qids;
                console.log(qids);
                return this.search(`
           SELECT DISTINCT ?c ?pmid ?doi ?title WHERE {
           {
               SELECT * WHERE {
                VALUES ?c { ${q} }
                ?c wdt:P31 wd:Q13442814 . 
             }} UNION {
              SELECT * WHERE {
                ?c wdt:P698 '${query}' . 
             }} 
             
             OPTIONAL { ?c wdt:P698 ?pmid . }
             OPTIONAL { ?c wdt:P356 ?doi . }
             OPTIONAL { ?c wdt:P1476 ?title . }
           }
          `)
            })
    }
}

@Component({
    outputs: ['loading', 'results'],
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
    loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

    constructor(public wd: WDQService,
                private el: ElementRef) {
    }

    ngOnInit(): void {
        // convert the `keyup` event into an observable stream
        // Observable.fromEvent(this.el.nativeElement, 'keyup')
        //   .map((e: any) => e.target.value.toUpperCase()) // extract the value of the input
        //   .filter((text: string) => text.length > 1) // filter out if empty
        //   .debounceTime(250)                         // only once every 250ms
        //   .do(() => this.loading.next(true))         // enable loading
        //   // search, discarding old events if new input comes in
        //   .map((query: string) => this.wd.search(`
        //     SELECT ?c ?ikey ?cLabel ?cid ?csid WHERE {
        //       ?c wdt:P235 ?ikey . FILTER (STRSTARTS(?ikey, '${query}'))
        //       OPTIONAL {?c wdt:P662 ?cid .}
        //       OPTIONAL {?c wdt:P661 ?csid .}
        //       SERVICE wikibase:label {
        //         bd:serviceParam wikibase:language "en" .
        //       }
        //       }
        //     `))
        //   .switch()
        //   // act on the return of the search
        //   .subscribe(
        //     (results: SearchResult[]) => { // on sucesss
        //       this.loading.next(false);
        //       this.results.next(results);
        //     },
        //     (err: any) => { // on error
        //       console.log(err);
        //       this.loading.next(false);
        //     },
        //     () => { // on completion
        //       this.loading.next(false);
        //     }
        //   );


        Observable.fromEvent(this.el.nativeElement, 'keyup')
            .map((e: any) => e.target.value.toUpperCase()) // extract the value of the input
            .filter((text: string) => text.length > 1) // filter out if empty
            .debounceTime(500)                         // only once every 250ms
            .do(() => this.loading.next(true))         // enable loading
            // .map((query: string) => this.wd.searchFullText(query).subscribe((test) => {return test;})
            .map((query: string) => this.wd.searchFullText(query ,`

        `))
            .switch()
            // act on the return of the search
            .subscribe(
                (results: SearchResult[]) => { // on sucesss
                    this.loading.next(false);
                    this.results.next(results);
                },
                (err: any) => { // on error
                    console.log(err);
                    this.loading.next(false);
                },
                () => { // on completion
                    this.loading.next(false);
                }
            );

        // this.wd.searchFullText('vemu', '').subscribe((test) => {console.log(test)});
    }
}

