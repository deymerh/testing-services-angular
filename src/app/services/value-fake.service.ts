export class FakeValueService {

  private value = 'My fake value';

  constructor() { }

  getValue(){
    return this.value;
  }

  setValue(value:string){}

  getPromiseValue(){
    return Promise.resolve('promise fake value');
  }
}
