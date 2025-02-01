import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { PostService } from '../services/post.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

defineCustomElements(window);

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.page.html',
  styleUrls: ['./add-post-modal.page.scss'],
  standalone: false,
})
export class AddPostModalPage implements OnInit {
  post_image: any;
  addPostForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private postService: PostService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController
  ) {
    this.addPostForm = this.formBuilder.group({
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {}

  async takePhoto(source: CameraSource) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: source,
      quality: 100
    });
    this.post_image = capturedPhoto.dataUrl;
    this.addPostForm.patchValue({
      image: this.post_image
    });
  }
  dismiss() {
    this.modalController.dismiss();
  }
  async presentPhotoOptions() {
    const alert = await this.alertController.create({
      header: "Seleccione una opción",
      message: "¿De dónde desea obtener la imagen?",
      buttons: [
        {
          text: "Cámara",
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          }
        },
        {
          text: "Galería",
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          }
        },
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    await alert.present();
  }

  async addPost(post_data: any) {
    console.log('Add Post');
    console.log(post_data);
    const user = await this.storage.get('user');
    const post_param = {
      post: {
        description: post_data.description,
        image: post_data.image,
        user_id: user.id
      }
    };
    console.log(post_param, 'post para enviar');
    this.postService.createPost(post_param).then(
      (data: any) => {
        console.log(data, ' post creado ');
        data.user = {
          id: user.id,
          name: user.name,
          image: user.image || 'assets/images/imagepredert.jpg'
        };
        this.postService.postCreated.emit(data);
        this.addPostForm.reset();
        this.post_image = null;
        this.modalController.dismiss();
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

  finish(){
    console.log("Entro al Home");
    this.router.navigateByUrl('/menu/home');
  }

}