import {Component, ViewEncapsulation} from '@angular/core';
import {CssTokensService} from "./services/css-tokens/css-tokens.service";

@Component({
  selector: 'cnv-ui',
  template: `
    <div i18n>

      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cnv-ui.scss'],
  host: {
    class: 'cnv-ui',
  },
})
export class ConvoloUiComponent {
  constructor(
    private cssTokensService: CssTokensService
  ) {
    this.cssTokensService.generateTokens()
    this.cssTokensService.setVariables()
  }

}
