import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isSelected',
  pure: false, // Hacky workaround
  standalone: true
})
export class IsSelectedPipe implements PipeTransform {

  transform(item: string, itemsSet: Set<string>): boolean {
    if (!item || !itemsSet.size) {
      return false;
    }

    return itemsSet.has(item);
  }

}
