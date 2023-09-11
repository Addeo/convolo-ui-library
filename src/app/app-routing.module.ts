import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'headers',
    loadChildren: () => import('./pages/headers/headers.module').then((m) => m.HeadersModule),
  },
  {
    path: 'layouts',
    loadChildren: () => import('./pages/layouts/layouts.module').then((m) => m.LayoutsModule), }
];

//TODO
const config: ExtraOptions = {
    useHash: false,
};

@NgModule({
    imports: [
        RouterModule.forRoot(routes, config),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
