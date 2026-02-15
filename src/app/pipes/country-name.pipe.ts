import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countryName', standalone: true })
export class CountryNamePipe implements PipeTransform {
  private regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

  transform(code: string): string {
    return this.regionNames.of(code) ?? code;
  }
}
