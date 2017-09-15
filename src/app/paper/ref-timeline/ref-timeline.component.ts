import { Component, OnInit, Input, forwardRef, Inject } from '@angular/core';
import { DataSet, Timeline } from 'vis';
import {SearchResult, WDQService} from "../../search/search-box/search-box.component";

@Component({

  selector: 'app-ref-timeline',
  templateUrl: './ref-timeline.component.html',
  styleUrls: ['./ref-timeline.component.css']
})
export class RefTimelineComponent implements OnInit {
   @Input() qid: string;

   timelineData: Array<Object> = Array();

  constructor(
      @Inject(forwardRef(() => WDQService)) public wd: WDQService,

      ) {

  }

  ngOnInit() {
      this.wd.search(`
      select ?cited (count(?cited) as ?count) ?title ?pubdate where {
         wd:${this.qid} wdt:P2860 ?cited .
          OPTIONAL {?cited wdt:P2860 ?cited2 .}
          OPTIONAL {?cited wdt:P577 ?pubdate .}
          OPTIONAL {?cited wdt:P1476 ?title .}
        }
        group by ?cited ?title ?pubdate
    `).subscribe(
          (results: SearchResult[]) => {
              let dt = results.pop().data;
              console.log(dt);
              let i = 0;
              for (let x of dt['results']['bindings']) {
                  let p: string = x['cited']['value'].split('/').pop();
                  let count: string =  x['count']['value'];
                  let title: string =  x['title']['value'].substr(0, 100);
                  let pubdate: string =  x['pubdate']['value'];

                  let o = {id: i, content:  title , start: pubdate, style: "font-size: x-small; " };
                  if(parseInt(count) > 20) {
                      o['style'] = "font-size: x-small; color: red; background-color: pink;";
                  }
                  else if (parseInt(count) > 10 ) {
                      o['style'] = "font-size: x-small; color: black; background-color: yellow;";
                  }

                  this.timelineData.push(o);

                  i++;

                  // this.prop_name_map[p] = x['pLabel']['value'];
              }
              // console.log(this.timelineData);

              let items = new DataSet(this.timelineData);

              let container = document.getElementById('visualization');
              // Configuration for the Timeline
              let options = {
                  // width: '100%',
                  // height: '120%',
                  // maxHeight: 300,
                  minHeight: 300,
                  margin: {
                      item: 20
                  },
                  autoResize: true

              };   //http://visjs.org/docs/timeline/ for more documentation on options
              // Create a Timeline
              let timeline = new Timeline(container, items, options);

              timeline.on('select', function (properties) {
                  console.log('selected items: ' + properties.items);
              });

          },
          (err: any) => {
              console.log(err);

          },
          () => {

          }
      );

      console.log('this is the qid:', this.qid);


      let items = new DataSet([
          {id: 1, content: '<p style="width:60px; height:60px;"> kedaklsejalfksjflkasdsejimlkfkamdlaie aklseicka kasjei kkciael</p> ', start: '2014-04-20'},
          {id: 2, content: '<p style="width:30px; height:30px;"> medium</p>', start: '2014-04-14'},
          {id: 3, content: '<p style="width:20px; height:20px;">small</p>', start: '2014-04-18'},
          {id: 4, content: 'hoalkdkedaklsejalfksjflkasdsejimlkfkamdlaie aklseicka kasjei kkciaelk ,dckaeklse', start: '2014-04-16', end: '2014-04-19'},
          {id: 5, content: 'item 5', start: '2014-04-25'},
          {id: 6, content: 'ItemStyle through css', start: '2014-04-27', type: 'point', style:"color: red; background-color: pink;"}
      ]);

      // let items = new DataSet([
      //     {id: 1, content: 'item 1', start: '2013-04-20'},
      //     {id: 2, content: 'item 2', start: '2013-04-14'},
      //     {id: 3, content: 'item 3', start: '2013-04-18'},
      //     {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
      //     {id: 5, content: 'item 5', start: '2013-04-25'},
      //     {id: 6, content: 'item 6', start: '2013-04-27'}
      // ]);

      // let container = document.getElementById('visualization');
      // // Configuration for the Timeline
      // let options = {
      //     // width: '100%',
      //     // height: '120%',
      //     maxHeight: 300,
      //     minHeight: 300,
      //     margin: {
      //         item: 20
      //     },
      //     autoResize: true
      //
      // };   //http://visjs.org/docs/timeline/ for more documentation on options
      // // Create a Timeline
      // let timeline = new Timeline(container, items, options);
      //
      // timeline.on('select', function (properties) {
      //     console.log('selected items: ' + properties.items);
      // });
  }

}
