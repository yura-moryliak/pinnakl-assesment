import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {Subscription} from 'rxjs';

import {CountryMultiSelectComponent} from './country-multi-select/country-multi-select.component';
import {CountryMultiSelectConfigsInterface} from './country-multi-select/interfaces/country-multi-select.configs';
import {CountryInterface} from './country-multi-select/interfaces/country.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CountryMultiSelectComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

  private httpClient: HttpClient = inject(HttpClient);

  selectConfigs: CountryMultiSelectConfigsInterface<CountryInterface> = {
    countriesList: [],
    selectedCountriesList: ['India', 'Ukraine'],
    selectedCitiesList: ['kiev', 'Sumy', 'Delhi', 'Wok']
  }
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const dataSourceSubscription: Subscription = this.httpClient.get<CountryInterface[]>('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json').subscribe({
      next: (countriesList: CountryInterface[]): void => {
        this.selectConfigs = { ...this.selectConfigs, countriesList };
      }
    });

    this.subscriptions.add(dataSourceSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
