'use strict'

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'cutsKeys', pure: false})

export class KeysPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let keys: any[] = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}