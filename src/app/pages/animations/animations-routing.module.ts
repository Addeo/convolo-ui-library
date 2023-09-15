import { ActivatedRoute, CanActivate, Router, RouterModule, Routes } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';

import {ScrubComponent} from "./scrub/scrub.component";
import {AnimationsComponent} from "./animations.component";


const routes: Routes = [
    {
        path: '',
        component: AnimationsComponent,
        children: [
            {
              path: 'scrub',
              component: ScrubComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnimationsRoutingModule {}
