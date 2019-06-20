import { Component } from '@angular/core';
import {
  Plugins, CameraResultType, CameraSource, FilesystemDirectory,
  FilesystemEncoding
} from '@capacitor/core';

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.page.html',
  styleUrls: ['./take-picture.page.scss'],
})
export class TakePicturePage {

  async takePicture() {

    const { Camera, Filesystem } = Plugins;

    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    const file = await Filesystem.readFile({ path: photo.path });
    const fileName = new Date().getTime() + '.jpeg';

    await Filesystem.writeFile({
      data: file.data,
      path: fileName,
      directory: FilesystemDirectory.Data
    });

    const uri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName
    });

    console.log(uri);
  }

}
