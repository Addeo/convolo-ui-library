import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CssTokensService {

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  public setVariables() {
    this.document.body.style.setProperty('--cnv-color-common-primary-900', 'green');
  }

  public generateTokens() {
    console.log('defaultTokens')
  }
}
