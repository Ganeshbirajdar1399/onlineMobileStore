import { Component } from '@angular/core';
import { GetProductService } from '../../core/services/product/get-product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Webdata } from '../../core/services/product/webdata';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../core/services/global.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortsubscriberPipe } from '../../shared/pipes/sortsubscriber.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrconfirmService } from '../../core/services/toastrConfirm/toastrconfirm.service';

@Component({
  selector: 'app-otherinfo',
  templateUrl: './otherinfo.component.html',
  styleUrls: ['./otherinfo.component.css'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    SortsubscriberPipe,
    RouterModule,
  ],
})
export class OtherinfoComponent {
  isAdded = false;
  isUpdated = false;
  isSubmit = false;
  isEditing = false;
  editingWebdataId: string | null = null;
  carouselImages: string[] = [];

  myForm: FormGroup;
  imageUrl: string[] = [];
  webdatas: Webdata[] = [];
  subscribeData: any[] = [];
  searchText: string = '';
  page = 1;
  itemsPerPage = 10;

  //dialog
  isDialogOpen: boolean = false;
  dialogMessage: string = '';
  subscriberIdToDelete: string = ''; // Store the subscriber ID to be deleted

  constructor(
    private getProducts: GetProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private confirmationService: ToastrconfirmService
  ) {
    this.myForm = this.fb.group({
      about: ['', Validators.required],
      location: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      wbrand: ['', Validators.required],
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      youtube: ['', Validators.required],
      cc: ['', Validators.required],
      image: [null, this.imagesValidator.bind(this)],
    });
  }

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.fetchwebdata();
    this.getSubscribe();
  }

  imagesValidator(control: any): { [key: string]: boolean } | null {
    return this.carouselImages.length > 0 ? null : { required: true };
  }

  fetchwebdata(): void {
    this.getProducts.fetchWebData().subscribe((res) => {
      this.webdatas = res;
    });
  }

  getSubscribe(): void {
    this.globalService.getSubscribe().subscribe((res) => {
      this.subscribeData = res;
    });
  }

  // Method to trigger the confirmation dialog for deletion
  deleteSubscriber(id: string): void {
    this.subscriberIdToDelete = id; // Store the ID for later use
    this.dialogMessage =
      'Are you sure you want to delete this subscriber email?';
    this.isDialogOpen = true;
  }

  // Handle the user response
  handleConfirmation(confirmed: boolean): void {
    this.isDialogOpen = false;

    if (confirmed) {
      this.globalService.deleteSubscriber(this.subscriberIdToDelete).subscribe(
        () => {
          this.toastr.success(
            'Subscriber email successfully removed!',
            'Success'
          );
          this.getSubscribe();
        },
        () => this.toastr.error('Failed to remove subscriber.', 'Error')
      );
    } else {
      this.toastr.info('Subscriber email deletion canceled!', 'Info');
    }
  }

  // deleteSubscriber(id: string): void {
  //   this.toastr
  //     .info('Are you sure you want to delete subscriber email?', 'Confirm Deletion', {
  //       closeButton: true,
  //       progressBar: true,
  //       positionClass: 'toast-top-center',
  //       timeOut: 0,
  //       extendedTimeOut: 0,
  //     })
  //     .onTap.pipe()
  //     .subscribe(() => {
  //       this.globalService.deleteSubscriber(id).subscribe(() => {
  //         this.toastr.success('Subscriber email successfully removed!', 'Success');
  //         this.getSubscribe();
  //       });
  //     });
  // }

  updateCancel(): void {
    this.myForm.reset();
    this.carouselImages = [];
    this.isEditing = false;
  }

  editInfo(webdata: any): void {
    this.isEditing = true;
    this.editingWebdataId = webdata.id;
    this.myForm.patchValue({
      about: webdata.about,
      location: webdata.location,
      contactNo: webdata.contactNo,
      email: webdata.email,
      wbrand: webdata.wbrand,
      facebook: webdata.facebook,
      twitter: webdata.twitter,
      instagram: webdata.instagram,
      youtube: webdata.youtube,
      cc: webdata.cc,
    });
    this.carouselImages = webdata.image;
  }

  updateWebdata(): void {
    if (this.myForm.valid && this.editingWebdataId) {
      const updatedWebdata = {
        id: this.editingWebdataId,
        ...this.myForm.value,
        image: this.carouselImages,
      };

      this.getProducts
        .updateWebData(this.editingWebdataId, updatedWebdata)
        .subscribe(() => {
          this.isUpdated = true;
          setTimeout(() => {
            this.isUpdated = false;
          }, 2000);
          this.isEditing = false;
          this.editingWebdataId = null;
          this.fetchwebdata();
          this.myForm.reset();
          this.carouselImages = [];
        });
    }
  }

  onFileChange(event: any): void {
    const files: FileList | null = event.target?.files;
    if (!files || files.length === 0) {
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file: File) => {
      formData.append('images', file);
    });

    this.http
      .post('http://localhost:5000/upload-multiple', formData)
      .subscribe((response: any) => {
        if (response.imageUrls) {
          this.carouselImages.push(...response.imageUrls);
          this.myForm.patchValue({ image: this.carouselImages });
        }
      });
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateWebdata();
    } else {
      if (this.myForm.valid) {
        const webInfo = {
          id: uuidv4(),
          ...this.myForm.value,
          image: this.carouselImages,
        };

        this.getProducts.addWebData(webInfo).subscribe(() => {
          this.toastr.success('Data added successfully', 'Success');
          this.isAdded = true;
          setTimeout(() => {
            this.isAdded = false;
          }, 2000);
          this.fetchwebdata();
          this.myForm.reset();
          this.carouselImages = [];
        });
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
