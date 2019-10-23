import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createAppSyncLink, AUTH_TYPE } from 'aws-appsync';

import { CasTicketService } from './services';

export function createApollo(httpLink: HttpLink, cas: CasTicketService) {
  const url = 'https://umpvznhwzbcgznypfo3ihn2k24.appsync-api.ap-southeast-1.amazonaws.com/graphql';
  const link = createAppSyncLink({
    url,
    region: 'ap-southeast-1',
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: 'da2-5y25wsxr6fby7fkxuyw2yd24si'
    },
    complexObjectsCredentials: null,
    // use "ticket" header for custom authentication
    resultsFetcherLink: ApolloLink.from([
      setContext(async (_request, previousContext: Record<string, any>) => ({
        headers: {
          ...previousContext.headers,
          ticket: await cas.getST('https://api.apiit.edu.my/attendix').toPromise()
        }
      })),
      httpLink.create({ uri: url })
    ]),
  });

  return { cache: new InMemoryCache(), link };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, CasTicketService],
    },
  ],
})
export class GraphQLModule { }
