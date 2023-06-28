import {
  Component, ElementRef, EventEmitter,
  inject, Input, OnDestroy, OnInit, Output,
  Renderer2, ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

import {distinctUntilChanged, Subscription} from 'rxjs';

import {CountryInterface} from '../../interfaces/country.interface';
import {CountryMultiSelectConfigsInterface} from '../../interfaces/country-multi-select.configs';
import {IsSelectedPipe} from '../../pipes/is-selected.pipe';
import {CountryMultiSelectBaseComponent} from '../../classes/country-multi-select.base.component';

@Component({
  selector: 'app-city-select',
  standalone: true,
  imports: [CommonModule, CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, FormsModule, IsSelectedPipe, ReactiveFormsModule],
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CitySelectorComponent extends CountryMultiSelectBaseComponent implements OnInit, OnDestroy {

  @Input({ required: true }) config!: CountryMultiSelectConfigsInterface<CountryInterface>;
  @Input({ required: true }) country!: string;

  @Output() unselectCountry: EventEmitter<string> = new EventEmitter<string>();

  citiesList: CountryInterface[] = [];

  private citiesListCopy: CountryInterface[] = [];

  private elementRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  ngOnInit(): void {
    this.citiesList = this.config.countriesList.filter(
      (country: CountryInterface) => country.country === this.country
    );

    this.trackSearchTermChanges();
    this.checkViewportHeight(this.citiesList);
    this.checkForInitiallySelectedAndSelect();
  }

  override openDropdown(): void {
    super.openDropdown();

    this.citiesListCopy = [...this.citiesList];
    this.renderer.addClass(this.elementRef.nativeElement, 'opened');
  }

  override closeDropdown(): void {
    super.closeDropdown();
    this.renderer.removeClass(this.elementRef.nativeElement, 'opened');
  }

  protected override trackSearchTermChanges(): void {
    const searchFormControlChangesSubscription: Subscription = this.searchFormControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe({
      next: (changes: string | null): void => {

        if (!changes) {
          this.citiesList = [...this.citiesListCopy];
        }

        this.citiesList = this.citiesList.filter((city: CountryInterface) => city.name.toLowerCase().includes(changes?.toLowerCase()!))
        this.checkViewportHeight(this.citiesList);
      }
    });

    this.subscriptions.add(searchFormControlChangesSubscription);
  }

  protected override checkForInitiallySelectedAndSelect(): void {

    if (!this.config.selectedCitiesList) {
      return;
    }

    if (this.config.selectedCitiesList && !this.config.selectedCitiesList.length) {
      this.selectedItemsSet = new Set();
    }

    const filteredCountriesList: CountryInterface[] = this.citiesList.filter((city: CountryInterface) => {
      return this.config.selectedCitiesList?.some((selectedCity: string) =>
        city.name.toLowerCase().includes(selectedCity.toLowerCase())
      )
    });

    this.selectedItemsSet = new Set(
      filteredCountriesList.map((filtered: CountryInterface) => filtered.name)
    );
  }
}
