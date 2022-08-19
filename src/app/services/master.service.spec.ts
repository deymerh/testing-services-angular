import { MasterService } from './master.service';
import { ValueService } from './value.service';
// import { FakeValueService } from './value-fake.service';
import { TestBed } from '@angular/core/testing';

describe('Test in service "MasterService"', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;
  
  beforeEach(()=>{
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [ 
        MasterService,
        { provide: ValueService, useValue: spy }
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  // it('should retunr "My value" from the real service', () => {
  //   const valueService = new ValueService();    
  //   const masterService = new MasterService(valueService);    
  //   expect(masterService.getValueOfValueService()).toBe('My value')
  // });

  // it('should retunr "another value" from the fake service', () => {
  //   const fakeValueService = new FakeValueService();    
  //   const masterService = new MasterService(fakeValueService as unknown as ValueService);    
  //   expect(masterService.getValueOfValueService()).toBe('My fake value');
  // });

  // it('should return "another value" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from object' }    
  //   const masterService = new MasterService(fake as ValueService);
  //   expect(masterService.getValueOfValueService()).toBe('fake from object');
  // });

  it('should call to "getValue" from the "valueService"', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(masterService.getValueOfValueService()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
