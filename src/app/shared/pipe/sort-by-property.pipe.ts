import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByProperty'
})
export class SortByPropertyPipe implements PipeTransform {
  transform(array: any[], propertyName: string, sortOrder: 'asc' | 'desc' = 'asc'): any[] {
    if (!array || !propertyName) {
      return array;
    }

    return array.slice().sort((a, b) => {
      const aValue = a[propertyName];
      const bValue = b[propertyName];

      // Special case for 'gender' property
      if (propertyName === 'gender') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue !== 'string' || typeof bValue !== 'string') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      const aParts = aValue.split('-');
      const bParts = bValue.split('-');

      if (aParts.length !== 2 || bParts.length !== 2) {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      const aNumber = parseInt(aParts[1]);
      const bNumber = parseInt(bParts[1]);

      if (isNaN(aNumber) || isNaN(bNumber)) {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      if (sortOrder === 'asc') {
        return aNumber - bNumber;
      } else {
        return bNumber - aNumber;
      }
    });
  }
}
