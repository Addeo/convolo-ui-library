import { ActivatedRoute, CanActivate, Router, RouterModule, Routes } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import {PagesComponent} from "./pages.component";


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'layouts',
                loadChildren: () =>
                    import('./layouts/layouts.module').then(
                        (m) => m.LayoutsModule,
                    ),
            },
          {
            path: 'animations',
            loadChildren: () =>
              import('./animations/animations.module').then(
                (m) => m.AnimationsModule,
              ),
          },
          {
            path: 'ui',
            loadChildren: () =>
              import('./ui/ui.module').then(
                (m) => m.UiModule,
              ),
          },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
