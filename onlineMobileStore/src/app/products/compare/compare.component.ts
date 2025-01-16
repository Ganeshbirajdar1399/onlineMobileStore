import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compare',
  imports: [CommonModule],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  compareItems: any[] = [];

  constructor(
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.getCompareItems(); // Fetch compare items when the component loads
  }

  // Get all products in the compare list
  getCompareItems(): void {
    this.globalService.getCompareItems().subscribe((res) => {
      this.compareItems = res;
    });
  }

  // Remove single product from the compare list
  removeFromCompare(id: string): void {
    this.toastr
      .info('Are you sure you want to delete this product from compare?', 'Confirm Deletion', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0, // Make the toast persistent until the user interacts with it
        extendedTimeOut: 0, // Keep the toast open until action
      })
      .onTap.pipe()
      .subscribe(() => {
        this.globalService.removeFromCompare(id).subscribe(() => {
          this.toastr.success('Product removed from compare!', 'Success');
          this.getCompareItems(); // Refresh the comparison list
        });
      });
  }

  // Clear all products in compare section
  clearComparison() {
    this.toastr
      .info('Are you sure you want to clear the entire compare section?', 'Confirm Clear Compare', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0,
        extendedTimeOut: 0,
      })
      .onTap.pipe()
      .subscribe(() => {
        this.globalService.clearCompare().subscribe(() => {
          this.toastr.success('Compare has been cleared!', 'Success');
          this.getCompareItems(); // Refresh the comparison list
        });
      });
  }
}
