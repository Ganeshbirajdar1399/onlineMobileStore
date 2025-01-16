import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'MobileShopee';

  constructor(private scroller: ViewportScroller) {}
  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
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
