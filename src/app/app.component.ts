import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './core/services/spinner/loader.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA
})
export class AppComponent implements OnInit {
  title = 'MobileShopee';
  isLoading = true;

  constructor(
    private scroller: ViewportScroller,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loaderService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
    });
    setTimeout(() => {
      this.loaderService.setLoading(false); // Stop loader after 3 seconds (or after app is fully loaded)
    }, 3000);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollButton = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 300) {
      scrollButton?.classList.add('visible'); // Show the button
      scrollButton!.style.display = 'flex'; // Makes it visible
    } else {
      scrollButton?.classList.remove('visible'); // Hide the button
      scrollButton!.style.display = 'none';
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
