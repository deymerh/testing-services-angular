import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getValue',()=>{
    
    it('shoud return `My value`', ()=>{
      expect(service.getValue()).toBe('My value');
    });

  });

  describe('Test for setValue',()=>{
    
    it('shoud return `New value`', ()=>{
      const newValue = 'New value';
      service.setValue(newValue);
      expect(service.getValue()).toBe(newValue);
    });

  });

  describe('Test for `getPromiseValue`', ()=>{
    
    it('shoud return `promise value`', async ()=>{
      const responsePromiseValue =  await service.getPromiseValue();
      expect(responsePromiseValue).toBe('promise value');
    });

  });

  describe('Test for `getObservableValue`', ()=>{
    
    it('shoud return `observable value`', ()=>{
     service.getObservableValue().subscribe(response=>{
      expect(response).toBe('observable value');
     });
    });

  });

});
