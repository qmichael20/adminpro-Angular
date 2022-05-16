import { Component, OnInit } from '@angular/core';
import { ModalImageService } from '../../services/modal-image.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public showModal: boolean = false;

  public imgTemp: any = null;

  public image!: File;

  constructor(public modalService: ModalImageService, public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  addImage() {

    const id = this.modalService.id;
    const type = this.modalService.type;

    this.fileUploadService
      .updateImage(this.image, type, id)
      .then((img) => {
        Swal.fire('Image saved', 'Image updated succesfully', 'success');

        this.modalService.newImage.emit(img);

        this.closeModal()
      })
      .catch((err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  loadImage(event) {

  }

  changeImageContainer(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

    this.image = event.target.files[0];
  }


  closeModal() {
    this.imgTemp = null;

    this.modalService.closeModal();
  }

}
