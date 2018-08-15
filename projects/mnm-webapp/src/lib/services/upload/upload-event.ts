import {UploadEventType} from './upload-event-type';
/**
 * Created by mohammed on 6/12/17.
 */
export interface UploadEvent {
  type: UploadEventType;
  data: any;
}
