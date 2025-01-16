import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitWords'
})
export class LimitWordsPipe implements PipeTransform {
  transform(value: string, wordLimit: number = 15): string {
    if (!value) return '';
    const words = value.split(' ');

    // Check if the word count exceeds the limit and trim the description
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'; // Add ellipsis if there are more than the limit
    } else {
      return value; // Return the full description if it's within the word limit
    }
  }
}
