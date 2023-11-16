import { Pipe, PipeTransform } from '@angular/core';

/**
 * Cut string by symbols with `...` adding.
 */
@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
    public transform(value: string | number | null, maxLength: number): string | null {
        if (value == null) return null;
        const val = typeof value === 'number' ? `${value}` : value;
        return val.length <= maxLength ? val : val.slice(0, maxLength) + '...';
    }
}
