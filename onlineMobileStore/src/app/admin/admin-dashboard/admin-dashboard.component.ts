import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetProductService } from '../../core/services/product/get-product.service';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchProductPipe } from '../../shared/pipes/search-product.pipe';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SearchProductPipe,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  isAdded = false;
  isUpdated = false;
  products: any[] = [];
  myForm: FormGroup;
  imageUrl: string = '';
  isSubmit = false;
  searchText = '';
  page = 1;
  itemsPerPage = 5;
  isEditing = false;
  editingProductId: string | null = null;

  constructor(
    private getProducts: GetProductService,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private scroller: ViewportScroller
  ) {
    this.myForm = this.fb.group({
      pname: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
      color: ['', [Validators.required]],
      disksize: ['', [Validators.required]],
      ram: ['', [Validators.required]],
      psp: ['', [Validators.required]],
      pop: ['', [Validators.required]],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.fetchProducts();
  }

  updateCancel() {
    this.myForm.reset();
  }

  fetchProducts(): void {
    this.getProducts.fetchData().subscribe((res) => {
      this.products = res;
    });
  }

  deleteProduct(id: string): void {
    this.toastr
      .info(
        'Are you sure you want to delete this product?',
        'Confirm Deletion',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0,
          extendedTimeOut: 0,
        }
      )
      .onTap.pipe()
      .subscribe({
        next: () => {
          this.getProducts.deleteData(id).subscribe(() => {
            this.toastr.success('Product removed successfully!', 'Success');
            this.fetchProducts();
          });
        },
        error: () => {
          this.toastr.info('Product deletion canceled', 'Info');
        },
      });
  }

  editProduct(product: any): void {
    this.isEditing = true;
    this.editingProductId = product.id;

    this.myForm.patchValue({
      pname: product.pname,
      brand: product.brand,
      description: product.description,
      color: product.color,
      disksize: product.disksize,
      ram: product.ram,
      psp: product.psp,
      pop: product.pop,
    });
    this.imageUrl = product.image || '';

    if (this.isEditing) {
      this.myForm.get('image')?.clearValidators();
    } else {
      this.myForm.get('image')?.setValidators(Validators.required);
    }
    this.myForm.get('image')?.updateValueAndValidity();
  }

  updateProduct(): void {
    if (this.myForm.valid && this.editingProductId) {
      const updatedProduct = {
        id: this.editingProductId,
        ...this.myForm.value,
        image: this.imageUrl,
      };

      this.getProducts
        .updateData(this.editingProductId, updatedProduct)
        .subscribe(() => {
          this.toastr.success('Product updated successfully!', 'Success');
          this.isUpdated = true;
          setTimeout(() => {
            this.isUpdated = false;
          }, 2000);
          this.isEditing = false;
          this.editingProductId = null;
          this.fetchProducts();
          this.myForm.reset();
        });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.http
        .post('http://localhost:5000/upload', formData)
        .subscribe((response: any) => {
          this.imageUrl = response.imageUrl;
          this.myForm.patchValue({ image: this.imageUrl });
          this.myForm.get('image')?.setErrors(null);
          this.myForm.get('image')?.updateValueAndValidity();
        });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateProduct();
    } else {
      if (this.myForm.valid && this.imageUrl) {
        const product = {
          id: uuidv4(),
          ...this.myForm.value,
          image: this.imageUrl,
        };

        this.getProducts.addData(product).subscribe(() => {
          this.toastr.success('Product added successfully!', 'Success');
          this.isAdded = true;
          setTimeout(() => {
            this.isAdded = false;
          }, 2000);
          this.fetchProducts();
          this.myForm.reset();
        });
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
