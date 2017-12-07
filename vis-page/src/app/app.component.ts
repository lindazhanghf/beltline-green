import { Component, OnInit } from '@angular/core';
import { SockService } from './services/sock.service';
import { DataModelService } from './services/data-model.service';
import { Observable } from 'rxjs/Observable';
import * as c3 from 'c3';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data_model;
  title = 'app';
  tree;
  house;
  constructor(private dataModel: DataModelService, private sock: SockService) {
    this.data_model = dataModel;
  }
  ngOnInit() {
    this.house = c3.generate({
        bindto: '#house',
        data: {
            // x: 'x',
            columns: [
                // this.dataModel.month,
                this.dataModel.price
            ]
        },
        transition: {
          duration: 0
        },
        size: {
          height: 400,
          width: 800
        },
        legend: {
          position: 'bottom'
        },
        // axis: {
        //     x: {
        //         type: 'timeseries',
        //         tick: {
        //             format: '%Y-%mm'
        //         }
        //     }
        // }
    });

    this.tree = c3.generate({
        bindto: '#tree',
        data: {
            // x: 'x',
            columns: [
                // this.dataModel.month,
                this.dataModel.tree
            ],
            type: 'bar'
        },
        transition: {
          duration: 0
        },
        size: {
          height: 400,
          width: 800
        },
        legend: {
          position: 'bottom'
        },
        // axis: {
        //     x: {
        //         type: 'timeseries',
        //         tick: {
        //             format: '%Y-%mm'
        //         }
        //     }
        // }
    });

    this.dataModel.new_data.asObservable().subscribe(() => {
        this.house.load({
            columns: [
                this.dataModel.price
            ]
        });

        this.tree.load({
            columns: [
                this.dataModel.tree
            ]
        });
    });
  }
}
