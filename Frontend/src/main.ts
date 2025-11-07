import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
// you can give this in creating app.config.ts or else you can give it here itself
  providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),
 provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // Add interceptor here
    )  ]

}).catch((err) => console.error(err));
