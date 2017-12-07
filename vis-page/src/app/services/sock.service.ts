import { Injectable } from '@angular/core';
import { Socket } from '../modules/ng2-socket-io';
import { DataModelService } from './data-model.service';
// import { AngleData } from '../prototypes';

@Injectable()
export class SockService {

  constructor(private socket: Socket, private dataModel: DataModelService) {
    const self = this;

    socket.on('connect', (msg) => {
      console.log('on connect');
    });
    socket.on('newData', newDataHandle);

    function newDataHandle(msg) {
      dataModel.msg = msg;
      console.log(msg);
      // const data = JSON.parse(msg);
      dataModel.updateData( {price: msg.zillow, month: msg.month, tree: msg.tree});
    }

  }

}
