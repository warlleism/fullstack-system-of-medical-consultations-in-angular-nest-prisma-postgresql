import { NgModule } from '@angular/core';
import { SafePipe } from './utils/safeUrl';

@NgModule({
  declarations: [SafePipe],
  exports: [SafePipe] 
})
export class PipesModule { }
