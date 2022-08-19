import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { Auth } from '../models/auth.model';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';


describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ],
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService); 
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created the AuthService service', () => {
    expect(authService).toBeTruthy();
  });

  describe('Tests for method "login"', () => {

    it('should reuturn an access_token', (doneFn)=>{
      // Arrnage
      const access_token = '12e3dkewnrfnklr';
      const user = { email: 'deymerh@hotmail.com', password: '123456' };
      const myMockData:Auth = { access_token }; 
      // Act
      authService.login(user.email, user.password)
        .subscribe((responseLogin)=>{
        // Assert 
        expect(responseLogin).toEqual(myMockData);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/auth/login`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(myMockData);
    });

    it('should call "saveToken', (doneFn)=>{
      // Arrnage
      const access_token = '12e3dkewnrfnklr';
      const user = { email: 'deymerh@hotmail.com', password: '123456' };
      const myMockData:Auth = { access_token };
      // No llamar a la funcion real pero si espíar
      spyOn(tokenService, 'saveToken').and.callThrough();
      // Act
      authService.login(user.email, user.password)
        .subscribe((responseLogin)=>{
        // Assert 
        expect(responseLogin.access_token).toEqual(access_token);
        expect(responseLogin).toEqual(myMockData);
        expect(tokenService.saveToken).toHaveBeenCalled();
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith(myMockData.access_token);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/auth/login`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(myMockData);
    });
  });
});