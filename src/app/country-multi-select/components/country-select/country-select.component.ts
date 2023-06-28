import {
  Component, EventEmitter, Input, OnDestroy,
  OnInit, Output, ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

import {distinctUntilChanged, Subscription} from 'rxjs';

import {CountryInterface} from '../../interfaces/country.interface';
import {CountryMultiSelectConfigsInterface} from '../../interfaces/country-multi-select.configs';
import {IsSelectedPipe} from '../../pipes/is-selected.pipe';
import {CountryMultiSelectBaseComponent} from '../../classes/country-multi-select.base.component';


@Component({
  selector: 'app-country-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, IsSelectedPipe],
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CountrySelectComponent extends CountryMultiSelectBaseComponent implements OnInit, OnDestroy {

  @Input({ required: true }) config!: CountryMultiSelectConfigsInterface<CountryInterface>;

  @Output() selectionChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  unifiedCountriesList: string[] = [];

  private unifiedCountriesListCopy: string[] = [];

  ngOnInit(): void {
    this.unifiedCountriesList = [ ...new Set(this.config.countriesList.map((country: CountryInterface) => country.country)) ];
    this.checkForInitiallySelectedAndSelect();
    this.trackSearchTermChanges();
  }

  override openDropdown(): void {
    super.openDropdown();

    this.unifiedCountriesListCopy = [...this.unifiedCountriesList];
    this.checkViewportHeight(this.unifiedCountriesList);
  }

  override select(country: string): void {
    super.select(country);
    this.selectionChanged.emit(Array.from(this.selectedItemsSet));
  }

  trackSearchTermChanges(): void {
    const searchFormControlChangesSubscription: Subscription = this.searchFormControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe({
      next: (changes: string | null): void => {

        if (!changes) {
          this.unifiedCountriesList = [...this.unifiedCountriesListCopy];
        }

        this.unifiedCountriesList = this.unifiedCountriesList.filter((listItem: string) => listItem.toLowerCase().includes(changes?.toLowerCase()!))
        this.checkViewportHeight(this.unifiedCountriesList);
      }
    });

    this.subscriptions.add(searchFormControlChangesSubscription);
  }

  private checkForInitiallySelectedAndSelect(): void {

    if (!this.config.selectedCountriesList) {
      return;
    }

    if (this.config.selectedCountriesList && !this.config.selectedCountriesList.length) {
      this.selectedItemsSet = new Set();
    }

    const filteredCountriesList = this.unifiedCountriesList.filter((unifiedCountry: string) => {
      return this.config.selectedCountriesList?.some((selectedCountry: string) => unifiedCountry.toLowerCase().includes(selectedCountry.toLowerCase()))
    });

    this.selectedItemsSet = new Set(filteredCountriesList);
    this.selectionChanged.emit(Array.from(this.selectedItemsSet));
  }
}
