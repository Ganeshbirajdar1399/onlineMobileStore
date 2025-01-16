import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUser'
})
export class SearchUserPipe implements PipeTransform {

 transform(array: any[], searchValue: string, field1: string, field2: string): any[] {
    if (!searchValue || !array) {
      return array;
    }

    searchValue = searchValue.toLowerCase();

    return array.filter(item =>
      (item[field1]?.toLowerCase().includes(searchValue) || item[field2]?.toLowerCase().includes(searchValue))
    );
  }


}
