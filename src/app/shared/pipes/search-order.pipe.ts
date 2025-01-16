import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchOrder',
})
export class SearchOrderPipe implements PipeTransform {
  transform(
    array: any[],
    searchValue: string | number,
    ...fields: string[]
  ): any[] {
    if (!searchValue || !array || fields.length === 0) {
      return array;
    }

    const searchStr = searchValue.toString().toLowerCase();

    return array.filter((item) =>
      fields.some((field) => {
        const fieldValue = field
          .split('.')
          .reduce((obj, key) => obj?.[key], item);

        // Check if fieldValue is an array (like items) and search in its properties
        if (Array.isArray(fieldValue)) {
          return fieldValue.some((nestedItem) =>
            Object.values(nestedItem)
              .map((val) => val?.toString().toLowerCase() || '') // Ensure val is a string or fallback to empty string
              .some((val) => val.includes(searchStr))
          );
        }

        // Normal field search with fallback for undefined
        return (
          fieldValue?.toString().toLowerCase().includes(searchStr) || false
        );
      })
    );
  }
}
