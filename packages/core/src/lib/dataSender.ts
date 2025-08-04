// import { HawkTracker } from "../types/core";
import { _support } from '../utils/global';
export class DataSender {
  constructor() {}

  public sendData(data: any) {
    console.log('sendData', data);
  }
}

export const dataSender = _support.dataSender || new DataSender();
