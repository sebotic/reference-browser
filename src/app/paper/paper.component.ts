import {Component, OnInit, forwardRef, Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Http, Response, Headers} from "@angular/http";

import {SearchResult, WDQService} from "../search/search-box/search-box.component";



@Component({
    outputs: ['cid'],
    selector: 'app-paper',
    templateUrl: './paper.component.html',
    styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {
    qid: string;
    results: Object;
    data: Object;
    label: string;
    aliases: Array<string> = [];
    concat_aliases: string = '';
    table_data: Array<Object> = [];
    prop_name_map: Object = {};
    propsToDisplay: Array<string> = ['P2093', 'P577', 'P433', 'P304', 'P478', 'P1433', 'P698', 'P932', 'P356', ];
    epmc_data: Object;
    pmid: string;
    abstract_text: string;
    colilData: string[] = [];
    colilResults: string[] = [];

    cid: string;

    constructor(
        @Inject(forwardRef(() => WDQService)) public wd: WDQService,
        private route: ActivatedRoute,
        private http: Http,
    ) {
        route.params.subscribe(params => {
            this.qid = params['qid'];
        });
    }

    ngOnInit() {
        this.wd.search(`
      SELECT DISTINCT ?prop ?pLabel WHERE {
        ?p wikibase:directClaim ?prop .
        SERVICE wikibase:label {bd:serviceParam wikibase:language "en" . }
      }
    `).subscribe(
            (results: SearchResult[]) => {
                let dt = results.pop().data;
                for (let x of dt['results']['bindings']) {
                    let p: string = x['prop']['value'].split('/').pop();

                    this.prop_name_map[p] = x['pLabel']['value'];
                }

                this.buildData();

            },
            (err: any) => {
                console.log(err);

            },
            () => {

            }
        );
    }

    buildData(): void {
        let query: string = `https://query.wikidata.org/sparql?query=describe <http://www.wikidata.org/entity/${this.qid}>&format=json`;

        this.http.request(query)
            .subscribe((res: Response) => {
                this.data = res.json();
                let tmp: Object = {};

                for (let x of this.data['results']['bindings']) {
                    if (x['predicate']['value'] === 'http://www.w3.org/2000/01/rdf-schema#label' &&
                        x['object'].hasOwnProperty('xml:lang') &&
                        x['object']['xml:lang'] === 'en') {
                        this.label = x['object']['value'];
                    }
                    else if (x['predicate']['value'] === 'http://www.w3.org/2004/02/skos/core#altLabel' &&
                        x['object'].hasOwnProperty('xml:lang') &&
                        x['object']['xml:lang'] === 'en') {

                        this.aliases.push(x['object']['value']);
                    }
                    else if (x['subject']['value'] === `http://www.wikidata.org/entity/${this.qid}` &&
                        x['predicate']['value'].startsWith('http://www.wikidata.org/prop/direct/P')) {
                        let p: string = x['predicate']['value'].split('/').pop();
                        // let v = x['object']['value'].split('/').pop;
                        // console.log(p, this.prop_name_map[p] );

                        if (tmp.hasOwnProperty(p)) {
                            tmp[p].add(x['object']['value']);
                        }
                        else {
                            tmp[p] = new Set([x['object']['value']]);
                        }

                        // set PMID globally
                        if (p === 'P698'){
                            this.pmid = x['object']['value'];

                            // get abstract and other data from Europe PMC
                            this.get_abstract();
                            this.get_colil();

                        }
                    }
                }

                for (let y of this.propsToDisplay) {

                    if (tmp.hasOwnProperty(y)) {
                        let value = Array.from(tmp[y]).length > 1 ? Array.from(tmp[y]).join(', ') : Array.from(tmp[y]);
                        this.table_data.push({'property': this.prop_name_map[y], 'value': value});
                    }

                }

                if (!tmp.hasOwnProperty('P2175')) {
                    // this.retrieveLabels([]);
                }
                else {
                    // this.retrieveLabels(Array.from(tmp['P2175']).map((x: string) => x.split('/').pop()));
                }
                // Concatenate aliases so they can be rendered as one block
                this.concat_aliases = this.aliases.join(', ');

            });
    }

    get_abstract(): void {
        let query: string = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:${this.pmid}&format=json&resulttype=core`;

        this.http.request(query)
            .subscribe((res: Response) => {
                this.epmc_data = res.json();
                this.abstract_text = this.epmc_data['resultList']['result'][0]['abstractText'];
                console.log(this.epmc_data)

            })

    }

    //http://colil.dbcls.jp/sparql?query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+bibo%3A+%3Chttp%3A%2F%2Fpurl.org%2Fontology%2Fbibo%2F%3E%0D%0APREFIX+colil%3A+%3Chttp%3A%2F%2Fpurl.jp%2Fbio%2F10%2Fcolil%2Fontology%2F201303%23%3E%0D%0APREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+doco%3A+%3Chttp%3A%2F%2Fpurl.org%2Fspar%2Fdoco%2F%3E%0D%0APREFIX+togows%3A+%3Chttp%3A%2F%2Ftogows.dbcls.jp%2Fontology%2Fncbi-pubmed%23%3E%0D%0Aselect+%3FCitationPaper+%3FContext+where+%7B%0D%0A++%3FCitationPaper+bibo%3Acites+%3FReferencePaper+.%0D%0A++%3FCitationPaper+doco%3Acontains+%5B%0D%0A++++doco%3Acontains+%5B%0D%0A++++++rdf%3Avalue+%3FContext+%3B%0D%0A++++++colil%3Amentions+%3FReferencePaper%0D%0A++++%5D%0D%0A++%5D+.%0D%0A++%3FReferencePaper+rdfs%3AseeAlso+%5B%0D%0A++++rdf%3Atype+colil%3APubMed+%3B%0D%0A++++togows%3Apmid+%2722658127%27%0D%0A++%5D+.%0D%0A%7D&output=json

    get_colil(): void {
        // let query: string =
        // `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        // PREFIX owl: <http://www.w3.org/2002/07/owl#>
        // PREFIX bibo: <http://purl.org/ontology/bibo/>
        // PREFIX colil: <http://purl.jp/bio/10/colil/ontology/201303#>
        // PREFIX dcterms: <http://purl.org/dc/elements/1.1/>
        // PREFIX doco: <http://purl.org/spar/doco/>
        // PREFIX togows: <http://togows.dbcls.jp/ontology/ncbi-pubmed#>
        //
        // select ?CitationPaper ?Context where {
        //       ?CitationPaper bibo:cites ?ReferencePaper .
        //       ?CitationPaper doco:contains [
        //         doco:contains [
        //           rdf:value ?Context ;
        //           colil:mentions ?ReferencePaper
        //         ]
        //       ] .
        //       ?ReferencePaper rdfs:seeAlso [
        //         rdf:type colil:PubMed ;
        //         togows:pmid '${this.pmid}'
        //       ] .
        //     }`;
        //
        // query = 'http://colil.dbcls.jp/sparql?query=' + query + '&output=json';

        let query = "http://colil.dbcls.jp/sparql?query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+bibo%3A+%3Chttp%3A%2F%2Fpurl.org%2Fontology%2Fbibo%2F%3E%0D%0APREFIX+colil%3A+%3Chttp%3A%2F%2Fpurl.jp%2Fbio%2F10%2Fcolil%2Fontology%2F201303%23%3E%0D%0APREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+doco%3A+%3Chttp%3A%2F%2Fpurl.org%2Fspar%2Fdoco%2F%3E%0D%0APREFIX+togows%3A+%3Chttp%3A%2F%2Ftogows.dbcls.jp%2Fontology%2Fncbi-pubmed%23%3E%0D%0Aselect+%3FCitationPaper+%3FContext+where+%7B%0D%0A++%3FCitationPaper+bibo%3Acites+%3FReferencePaper+.%0D%0A++%3FCitationPaper+doco%3Acontains+%5B%0D%0A++++doco%3Acontains+%5B%0D%0A++++++rdf%3Avalue+%3FContext+%3B%0D%0A++++++colil%3Amentions+%3FReferencePaper%0D%0A++++%5D%0D%0A++%5D+.%0D%0A++%3FReferencePaper+rdfs%3AseeAlso+%5B%0D%0A++++rdf%3Atype+colil%3APubMed+%3B%0D%0A++++togows%3Apmid+%27" + this.pmid + '%27%0D%0A++%5D+.%0D%0A%7D&output=json';

        let h: Headers = new Headers();
        h.append('Access-Control-Allow-Origin', '');
        console.log(query);

        this.http.request(query)
            .subscribe((res: Response) => {
                this.colilData = res.json();
                // this.abstract_text = this.epmc_data['resultList']['result'][0]['abstractText'];
                console.log(this.colilData);
                this.colilResults = this.colilData['results']['bindings'];

                for (let x of this.colilResults){
                    x['CitationPaper']['value'] = x['CitationPaper']['value'].split('/').pop();

                }

            })
    }
}
