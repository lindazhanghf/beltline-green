import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataModelService {
  msg = '';
  // month =  ['x', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  price = ['Median Home Value'];
  tree = ['Number of Trees', 0];
  counter = 1;
  new_data = new Subject<any>();
  constructor() { }

  updateData(data) {
    console.log(data);
    // if (this.counter === 12) {
    //     return;
    // }
    if (data.month === 0) {
      this.tree.push(data.tree);
    }
    this.price.push(data.price);
    this.counter++;
    this.new_data.next('');
  }

}
