import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
const PROFILE_FOLDER = 'ChatApp/profiles/';

@Injectable()
export class CloudinaryService {
  private cloudinary = v2;
  constructor() {
    this.cloudinary.config({
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
  }

  async removeImage(url: string) {
    const public_id = url.split(PROFILE_FOLDER)[1].split('.')[0];
    console.log('delete image:', PROFILE_FOLDER + public_id);
    const res = await this.cloudinary.uploader
      .destroy(PROFILE_FOLDER + public_id)
      .then((result) => result.result);
    if (res === 'not found') throw new Error('image not found in cloudinary');
  }
}
