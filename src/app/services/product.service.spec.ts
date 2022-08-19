import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from './../../environments/environment';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductService', () => {

  let productService: ProductService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;

  const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  // Antes de cada prueba haga esto
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ],
    });
    productService = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });
  
  // Despues de cada prueba haga esto
  afterEach(()=>{
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('Test for method "getAllSimple"', () => {
    it('should return a product list', (doneFn)=>{
      // Arrnage
      const myMockData:Product[] = generateManyProducts(5);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // Act
      productService.getAllSimple()
        .subscribe((responseData)=>{
        // Assert 
        expect(responseData.length).toEqual(myMockData.length);
        expect(responseData).toEqual(myMockData);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/products`;
      const request = httpTestingController.expectOne(API_URL);
      const headers = request.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      expect()
      request.flush(myMockData);
    });
  });

  describe('Tests for method "getAll"', () => {

    it('shoud return product list with the calculate of taxes correctly', (doneFn)=>{
      // Arrnage
      const myMockData:Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        
        {
          ...generateOneProduct(),
          price: 0, // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // 0
        },
      ]
      // Act
      productService.getAll()
      .subscribe((responseData)=>{
        // Assert 
        expect(responseData.length).toEqual(myMockData.length);
        expect(responseData[0].taxes).toEqual(19);
        expect(responseData[1].taxes).toEqual(38);
        expect(responseData[2].taxes).toEqual(0);
        expect(responseData[3].taxes).toEqual(0);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/products`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(myMockData);
      
    });

    it('shoud return product list with taxes', (doneFn)=>{
      // Arrnage
      const myMockData:Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        }
      ]
      // Act
      productService.getAll()
      .subscribe((responseData)=>{
        // Assert 
        expect(responseData.length).toEqual(myMockData.length);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/products`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(myMockData);
    });

    it('shoud send query with limit and offset', (doneFn)=>{
      // Arrnage
      const myMockData:Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      // Act
      productService.getAll(limit, offset)
      .subscribe((responseData)=>{
        // Assert 
        expect(responseData.length).toEqual(myMockData.length);
        doneFn();
      });
      // http config
      const API_URL = `${environment.API_URL}/products?limit=${limit}&offset=${offset}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(myMockData);
      const params = request.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      
    });

  });

  describe('Test for method "create"', () => {
    
    it('shoud return a new product', (doneFn)=>{
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'titulo',
        price: 100,
        images: ['image'],
        description: 'description',
        categoryId: 12
      }
      // Act
      productService.create({...dto})
        .subscribe((responseCreate)=>{
          // Assert
          expect(responseCreate).toEqual(mockData);
          doneFn();
        });
      // http config
      const API_URL = `${environment.API_URL}/products`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(mockData);
      expect(request.request.body).toEqual(dto);
      expect(request.request.method).toEqual(METHODS.POST);
    });

  });

  describe('test for method "update"', () => {

    it('should update a product', (done) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '12345';
      const dto: UpdateProductDTO = {
        title: 'titulo'
      }
      productService.update(productId, {...dto})
        .subscribe((responseUpdate)=>{
          // Assert
          expect(responseUpdate).toEqual(mockData);
          done();
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(mockData);
      expect(request.request.body).toEqual(dto);
      expect(request.request.method).toEqual(METHODS.PUT);
    });

  });

  describe('test for method "delete"', () => {

    it('should delete a product', (done) => {
      // Arrange
      const mockData = true;
      const productId = '12345';
      productService.delete(productId)
        .subscribe((responseDelete)=>{
          // Assert
          expect(responseDelete).toEqual(true);
          done();
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(mockData);
      expect(request.request.method).toEqual(METHODS.DELETE);
    });

  });
  
  describe('test for method "getOne"', () => {

    it('should return a product', (done) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '1';
      productService.getOne(productId)
        .subscribe((responseDelete)=>{
          // Assert
          expect(responseDelete).toEqual(mockData);
          done();
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(mockData);
      expect(request.request.method).toEqual(METHODS.GET);
    });

    it('should return a right msg when the status code is NotFound', (done) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound, //404
        statusText: msgError
      };
      productService.getOne(productId)
        .subscribe({
          error: (err)=>{
            expect(err).toEqual('El producto no existe');
            done();
          }
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(msgError, mockError);
      expect(request.request.method).toEqual(METHODS.GET);
    });

    it('should return a right msg when the status code is Conflict', (done) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Conflict, //409
        statusText: msgError
      };
      productService.getOne(productId)
        .subscribe({
          error: (err)=>{
            expect(err).toEqual('Algo esta fallando en el server');
            done();
          }
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(msgError, mockError);
      expect(request.request.method).toEqual(METHODS.GET);
    });

    it('should return a right msg when the status code is Unauthorized', (done) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized, //401
        statusText: msgError
      };
      productService.getOne(productId)
        .subscribe({
          error: (err)=>{
            expect(err).toEqual('No estas permitido');
            done();
          }
      });
      // http config
      const API_URL = `${environment.API_URL}/products/${productId}`;
      const request = httpTestingController.expectOne(API_URL);
      request.flush(msgError, mockError);
      expect(request.request.method).toEqual(METHODS.GET);
    });

  });

});