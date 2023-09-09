import { Component } from '@angular/core';
import {CssTokensService} from "../../projects/convolo-ui/src/lib/services/css-tokens/css-tokens.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-ui-library';

  constructor(
    private cssTokensService: CssTokensService
  ) {
    this.cssTokensService.setVariables()
  }
}
