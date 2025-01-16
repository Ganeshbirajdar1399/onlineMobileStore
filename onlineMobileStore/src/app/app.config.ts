import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configures routing
    provideAnimationsAsync(), // Provides animations for the app
    provideHttpClient(withFetch()), // Configures HTTP client
    provideToastr({
      timeOut: 2000, // Toast duration
      positionClass: 'toast-top-right', // Toast position
      preventDuplicates: true, // Prevent duplicate messages
    }), // Configures Toastr
  ],
};
