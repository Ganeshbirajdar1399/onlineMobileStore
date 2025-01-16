import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-magnifier',
  imports: [CommonModule],
  templateUrl: './magnifier.component.html',
  styleUrl: './magnifier.component.css'
})
export class MagnifierComponent {
  @Input() image!: string; // Input for image source
  @ViewChild('lens', { static: true }) lens!: ElementRef<HTMLDivElement>;
  @ViewChild('result', { static: true }) result!: ElementRef<HTMLDivElement>;
  @ViewChild('productImage', { static: true }) productImage!: ElementRef<HTMLImageElement>;

  moveLens(event: MouseEvent) {
    const image = this.productImage.nativeElement;
    const lens = this.lens.nativeElement;
    const result = this.result.nativeElement;

    lens.style.display = 'block';
    result.style.display = 'block';

    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left - lens.offsetWidth / 2;
    const y = event.clientY - rect.top - lens.offsetHeight / 2;

    // Prevent lens from going out of bounds
    const lensX = Math.max(0, Math.min(x, image.width - lens.offsetWidth));
    const lensY = Math.max(0, Math.min(y, image.height - lens.offsetHeight));

    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    result.style.backgroundImage = `url(${this.image})`;
    result.style.backgroundPosition = `-${lensX * 2}px -${lensY * 2}px`;
    result.style.backgroundSize = `${image.width * 2}px ${image.height * 2}px`;
  }

  hideLens() {
    const lens = this.lens.nativeElement;
    const result = this.result.nativeElement;

    lens.style.display = 'none';
    result.style.display = 'none';
  }
}
