import {Component, ViewEncapsulation} from '@angular/core';
// import {CssTokensService} from "./services/css-tokens/css-tokens.service";

@Component({
  selector: 'alfa-ui',
  template: `
    <div i18n>
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./alfa-ui.scss'],
  host: {
    class: 'alfa-ui',
  },
})
export class AlfaUiComponent {
  constructor(
    // private cssTokensService: CssTokensService
  ) {
    // this.cssTokensService.generateTokens()
    // this.cssTokensService.setVariables()
  }

}
