import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),                      // ✅ Enables fetch-based HttpClient
      withInterceptors([authInterceptor]) // ✅ Keeps your existing interceptors
    )
  ]
});
