import {Component, OnDestroy, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {FormControl} from '@angular/forms';

import {Subscription} from 'rxjs';

@Component({
  template: ``,
  standalone: true
})
export abstract class CountryMultiSelectBaseComponent implements OnDestroy {

  @ViewChild('cdkVirtualScrollViewport', {static: false, read: CdkVirtualScrollViewport})
  cdkVirtualScrollViewport!: CdkVirtualScrollViewport;

  protected searchFormControl: FormControl<string | null> = new FormControl<string | null>('');

  protected selectedItemsSet: Set<string> = new Set<string>();

  protected isDropdownOpened = false;
  protected dynamicViewportHeight!: string;

  protected subscriptions: Subscription = new Subscription();

  protected openDropdown(): void {
    this.isDropdownOpened = true;
  }

  protected clearSearch(): void {
    this.searchFormControl.reset('');
  }

  protected select(item: string): void {
    !this.selectedItemsSet.has(item) ?
      this.selectedItemsSet.add(item) :
      this.selectedItemsSet.delete(item);

    this.clearSearch();
  }

  protected closeDropdown(): void {
    this.isDropdownOpened = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected checkViewportHeight(itemsList: any[]): void {
    const numberOfItems = itemsList.length;
    const itemHeight = 50;
    const visibleItems = 7;

    setTimeout(() => this.cdkVirtualScrollViewport?.checkViewportSize(), 300);

    this.dynamicViewportHeight = (numberOfItems <= visibleItems) ?
      `${itemHeight * numberOfItems}px` :
      `${itemHeight * visibleItems}px`;
  }

  protected abstract trackSearchTermChanges(): void;
}
