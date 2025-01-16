import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortsubscriber',
})
export class SortsubscriberPipe implements PipeTransform {
  transform(array: any[], searchValue: string, field1: string): any[] {
    if (!searchValue || !array) {
      return array;
    }

    searchValue = searchValue.toLowerCase();

    return array.filter((item) =>
      item[field1]?.toLowerCase().includes(searchValue)
    );
  }
}
