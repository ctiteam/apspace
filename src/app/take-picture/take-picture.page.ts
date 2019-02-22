import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.page.html',
  styleUrls: ['./take-picture.page.scss'],
})
export class TakePicturePage {

  constructor(private camera: Camera) { }

  // const options: CameraOptions = {
  //   quality: 100,
  //   destinationType = this.camera.DestinationType.FILE_URI,
  //   encodingType = this.camera.EncodingType.JPEG,
  //   mediaType = this.camera.MediaType.PICTURE
  // }

  // this.camera.g
}
