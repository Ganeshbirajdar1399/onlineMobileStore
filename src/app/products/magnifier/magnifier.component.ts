import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-magnifier',
  imports: [CommonModule],
  templateUrl: './magnifier.component.html',
  styleUrl: './magnifier.component.css',
})
export class MagnifierComponent {
  // @Input() imageSrc: string = ''; // URL of the image

  // isZoomVisible = false;
  // lensPosition = { x: 0, y: 0 };
  // backgroundPosition = '0% 0%';
  // zoomSize = '200%';

  // showZoom() {
  //   this.isZoomVisible = true;
  // }

  // hideZoom() {
  //   this.isZoomVisible = false;
  // }

  // onMouseMove(event: MouseEvent) {
  //   const imageElement = event.target as HTMLElement;
  //   const rect = imageElement.getBoundingClientRect();

  //   // Calculate cursor position within the image
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   // Update lens position
  //   this.lensPosition = {
  //     x: x - 50, // Offset for the lens size
  //     y: y - 50,
  //   };

  //   // Calculate background position for zoom effect
  //   const xPercent = (x / rect.width) * 100;
  //   const yPercent = (y / rect.height) * 100;

  //   this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  // }

  // @Input() imageSrc: string = ''; // URL of the image

  // isZoomVisible = false;
  // lensPosition = { x: 0, y: 0 };
  // backgroundPosition = '0% 0%';
  // zoomSize = '200%';
  // isMobile = false;

  // ngOnInit() {
  //   this.isMobile = window.innerWidth <= 768; // Detect mobile view
  // }

  // // Show zoom lens (triggered on hover or touchstart)
  // showZoom() {
  //   this.isZoomVisible = true;
  // }

  // // Hide zoom lens (triggered on mouse leave or touchend)
  // hideZoom() {
  //   this.isZoomVisible = false;
  // }

  // // Handle mouse movement for desktop
  // onMouseMove(event: MouseEvent) {
  //   this.updateLensPosition(
  //     event.clientX,
  //     event.clientY,
  //     event.target as HTMLElement
  //   );
  // }

  // // Handle touch movement for mobile
  // onTouchMove(event: TouchEvent) {
  //   const touch = event.touches[0];
  //   this.updateLensPosition(
  //     touch.clientX,
  //     touch.clientY,
  //     event.target as HTMLElement
  //   );
  // }

  // // Update lens position and background for zoom effect
  // private updateLensPosition(
  //   clientX: number,
  //   clientY: number,
  //   target: HTMLElement
  // ) {
  //   const rect = target.getBoundingClientRect();

  //   // Calculate cursor position within the image
  //   const x = clientX - rect.left;
  //   const y = clientY - rect.top;

  //   // Update lens position
  //   this.lensPosition = {
  //     x: x - 50, // Offset for the lens size
  //     y: y - 50,
  //   };

  //   // Calculate background position for zoom effect
  //   const xPercent = (x / rect.width) * 100;
  //   const yPercent = (y / rect.height) * 100;

  //   this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  // }

  @Input() imageSrc: string = ''; // Image URL

  isZoomVisible = false;
  lensPosition = { x: 0, y: 0 };
  backgroundPosition = '0% 0%';
  zoomSize = '200%';
  isMobile = false;

  ngOnInit() {
    // Determine if the device is mobile
    this.isMobile = window.innerWidth <= 768;
  }

  showZoom() {
    this.isZoomVisible = true;
  }

  hideZoom() {
    this.isZoomVisible = false;
  }

  onMouseMove(event: MouseEvent) {
    this.updateLensPosition(
      event.clientX,
      event.clientY,
      event.target as HTMLElement
    );
  }

  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    this.updateLensPosition(
      touch.clientX,
      touch.clientY,
      event.target as HTMLElement
    );
  }

  private updateLensPosition(
    clientX: number,
    clientY: number,
    target: HTMLElement
  ) {
    const rect = target.getBoundingClientRect();

    // Calculate position within the image
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Update lens position
    this.lensPosition = {
      x: x - 50, // Offset for lens size
      y: y - 50,
    };

    // Update background position for zoom effect
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  }
}
