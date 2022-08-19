import { Calculator } from './calculator';


describe('Test for Calculator', () => {
  it('#Multiply should return a nine', ()=>{
    const expectedResponse = 9;
    // Arrange
    const calculator =  new Calculator();
    // Act
    const responseMultiply = calculator.multiply(3, 3);
    // Assert
    expect(responseMultiply).toEqual(expectedResponse);
  });

  it('#Multiply should return a six', ()=>{
    const expectedResponse = 6;
    // Arrange
    const calculator =  new Calculator();
    // Act
    const responseMultiply1 = calculator.multiply(3, 2);
    // Assert
    expect(responseMultiply1).toEqual(expectedResponse);
  });

  it('#Didide shoud return cero', () => {
    // Arrange
    const expectedResponse = 0;
    // Act
    const calculatorDivide = new Calculator();
    // Assert
    expect(calculatorDivide.divide(0, 2)).toEqual(expectedResponse);
  });

  it('#Didide shoud return 1', () => {
    // Arrange
    const expectedResponse = 3;
    // Act
    const calculatorDivide = new Calculator();
    // Assert
    expect(calculatorDivide.divide(9, 3)).toEqual(expectedResponse);
  });
  
});
