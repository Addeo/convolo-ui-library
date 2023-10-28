export interface CnvTokensComponent {
  name: string,
  color: string
}

export interface CnvTokensColors {
  primary900: string
}

export interface CnvTokensTheme {
  cnvColors: CnvTokensColors,
  cnvComponents: [CnvTokensComponent]
}

export interface CnvTokens {
  cnvWhiteTheme: CnvTokensTheme
}

export const defaultTokens: CnvTokens = {
  cnvWhiteTheme: {
    cnvColors: {
      primary900: ''
    },
    cnvComponents: [{
      name: 'cnvInput',
      color: ''
    }]
  }
}
