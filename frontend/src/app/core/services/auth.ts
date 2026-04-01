import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { TokenService } from './token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private tokenService: TokenService
  ) {}

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            success
            message
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: {
        input: { username, email, password }
      }
    }).pipe(
      map((result) => result.data.signup)
    );
  }

  login(usernameOrEmail: string, password: string) {
    return this.apollo.query<any>({
      query: gql`
        query Login($input: LoginInput!) {
          login(input: $input) {
            success
            message
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: {
        input: { usernameOrEmail, password }
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result) => {
        const data = result.data.login;

        if (data.success && data.token) {
          this.tokenService.setToken(data.token);
        }

        return data;
      })
    );
  }

  logout() {
    this.tokenService.clearToken();
  }
}