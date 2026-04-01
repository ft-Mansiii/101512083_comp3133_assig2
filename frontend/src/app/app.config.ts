import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';
import { TokenService } from './core/services/token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const tokenService = inject(TokenService);
      const platformId = inject(PLATFORM_ID);

      const authLink = new ApolloLink((operation, forward) => {
        let token = '';

        if (isPlatformBrowser(platformId)) {
          token = tokenService.getToken() || '';
        }

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
          }
        }));

        return forward(operation);
      });

      return {
        link: authLink.concat(
          httpLink.create({
            uri: 'https://one01512083-comp3133-assig2.onrender.com/graphql'
          })
        ),
        cache: new InMemoryCache()
      };
    })
  ]
};