import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import {AppComponent, routes,} from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {SearchComponent} from "./search/search.component";
import {MenubarItemComponent} from "./menubar-item/menubar-item.component";
import { PaperComponent } from './paper/paper.component';
import { DataTableComponent } from './data-table/data-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {SearchBoxComponent, SearchResultService, WDQService} from './search/search-box/search-box.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import { SearchResultTableComponent } from './search/search-result-table/search-result-table.component';
import { RefTimelineComponent } from './paper/ref-timeline/ref-timeline.component';

@NgModule({
  declarations: [
      AppComponent,
      MenuBarComponent,
      SearchComponent,
      MenubarItemComponent,
      PaperComponent,
      // DataTableComponent,
      SearchBoxComponent,
      SearchResultComponent,
      SearchResultTableComponent,
      RefTimelineComponent,
  ],
  imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      Ng2SmartTableModule,
  ],
  providers: [
      { provide: APP_BASE_HREF,    useValue: '/' },
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      { provide: SearchResultService, useClass: SearchResultService },
      { provide: WDQService, useClass: WDQService },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
