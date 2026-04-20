import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate',
    standalone: true,
})
export class CustomDatePipe implements PipeTransform {
    transform(value: number, withMinutes = false): string {
        
        const date = new Date(value);

        if (Number.isNaN(date.valueOf())) {
            return '';
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        if (!withMinutes) {
            return `${day}/${month}/${year}`;
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}