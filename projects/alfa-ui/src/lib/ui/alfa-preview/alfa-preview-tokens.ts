// import {FactoryProvider, InjectionToken, Optional, SkipSelf, Provider} from '@angular/core';
//
// export interface TuiPreviewIcons {
//   readonly next: string;
//   readonly prev: string;
//   readonly rotate: string;
//   readonly zoomIn: string;
//   readonly zoomOut: string;
//   readonly zoomReset: string;
// }
//
// export const TUI_PREVIEW_ICONS_DEFAULT: TuiPreviewIcons = {
//   rotate: `tuiIconRotate`,
//   prev: `tuiIconArrowLeft`,
//   next: `tuiIconArrowRight`,
//   zoomIn: `tuiIconPlus`,
//   zoomOut: `tuiIconMinus`,
//   zoomReset: `tuiIconMinimize`,
// };
//
// export const TUI_PREVIEW_ICONS = tuiCreateToken(TUI_PREVIEW_ICONS_DEFAULT);
//
// export function tuiPreviewIconsProvider(icons: Partial<TuiPreviewIcons>): Provider {
//   return tuiProvideOptions(TUI_PREVIEW_ICONS, icons, TUI_PREVIEW_ICONS_DEFAULT);
// }
//
// export function tuiCreateToken<T>(defaults: T): InjectionToken<T> {
//   return tuiCreateTokenFromFactory(() => defaults);
// }
//
// export function tuiCreateTokenFromFactory<T>(factory: () => T): InjectionToken<T> {
//   return new InjectionToken<T>(``, {factory});
// }
//
// export function tuiProvideOptions<T>(
//   provide: InjectionToken<T>,
//   options: Partial<T>,
//   fallback: T,
// ): FactoryProvider {
//   return {
//     provide,
//     deps: [[new Optional(), new SkipSelf(), provide]],
//     useFactory: (parent: T | null): T => ({
//       ...(parent || fallback),
//       ...options,
//     }),
//   };
// }
