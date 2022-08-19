import { Component } from '@angular/core';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testing-services';

  ngOnInit(): void {
    const calulator = new Calculator();
    const responseMutiply = calulator.multiply(2, 3);
    console.log(responseMutiply === 6);

    const calulator2 = new Calculator();
    const responseDivide = calulator2.divide(2, 0);
    console.log(responseDivide);
  }
}
