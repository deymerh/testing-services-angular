export class Calculator{
  multiply(a:number,b: number){
    return a * b;
  }
  divide(a:number,b:number){
    if (b === 0) {
      return 0;
    }
    if(a < b){
      return 0;
    }
    return a / b;
  }
}