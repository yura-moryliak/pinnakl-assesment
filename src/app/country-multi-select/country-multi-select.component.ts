import {Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CountrySelectComponent} from './components/country-select/country-select.component';
import {CountryMultiSelectConfigsInterface} from './interfaces/country-multi-select.configs';
import {CountryInterface} from './interfaces/country.interface';
import {CitySelectorComponent} from './components/city-selector/city-selector.component';

@Component({
  selector: 'app-country-multi-select',
  standalone: true,
  imports: [CommonModule, CountrySelectComponent, CitySelectorComponent],
  templateUrl: './country-multi-select.component.html',
  styleUrls: ['./country-multi-select.component.scss']
})
export class CountryMultiSelectComponent {

  @Input({ required: true }) config!: CountryMultiSelectConfigsInterface<CountryInterface>;

  @ViewChild(CountrySelectComponent, { static: false, read: CountrySelectComponent })
  countrySelectComponent!: CountrySelectComponent;

  selectedCountriesList: string[] = [];

  countriesSelectionChanges(selectedCountriesList: string[]): void {
    this.selectedCountriesList = selectedCountriesList;
  }

  unselectCountry(countryToUnselect: string): void {
    this.selectedCountriesList = this.selectedCountriesList.filter(
      (selectedCountry: string) => selectedCountry !== countryToUnselect
    );

    this.countrySelectComponent.config.selectedCountriesList = this.selectedCountriesList;
    this.countrySelectComponent.ngOnInit();
  }
}
