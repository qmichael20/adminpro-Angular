import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root',
})
export class ModalImageService {
  private _hideModal: boolean = true;

  public id: string = '';

  public img: string = '';

  public type: 'users' | 'doctors' | 'hospitals'

  public newImage: EventEmitter<string> = new EventEmitter<string>();

  get hideModal() {
    return this._hideModal;
  }

  openModal(type: 'users' | 'doctors' | 'hospitals', id: string, img?: string) {
    this._hideModal = false;

    this.id = id;

    this.img = img;

    this.type = type;

    // if (img?.includes('https')) {
    //   this.img = img;
    // } else {
    //   this.img = `${base_url}/uploads/${type}/${img}`;
    // }
  }

  closeModal() {
    this._hideModal = true;
  }

  constructor() { }
}
