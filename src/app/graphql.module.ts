import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Credentials } from 'aws-sdk/lib/credentials';
import { ApolloLink } from 'apollo-link';
import { AWSAppSyncClient, createAppSyncLink, AUTH_TYPE } from 'aws-appsync';

export function createApollo(httpLink: HttpLink, storage: Storage) {
  // console.log(Credentials);
  // const cred = new Credentials('AKIAJ3QWJKJUQLKOSPHA', 'yuk+PGOKtDPKaCVWeL8x++JkxRflFi6ftI/itluT');
  storage.set('apiKey', 'da2-25okpf6pybc5blho4fg7qxke7u');
  const link = createAppSyncLink({
    url: 'https://wmrk2iy4ora4xlpmgaq2gan4si.appsync-api.ap-southeast-1.amazonaws.com/graphql',
    region: 'ap-southeast-1',
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: () => storage.get('apiKey'),
      // type: AUTH_TYPE.OPENID_CONNECT,
    },
    complexObjectsCredentials: null,
  });

  return { cache: new InMemoryCache(), link };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage],
    },
  ],
})
export class GraphQLModule { }
