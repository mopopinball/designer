import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RuleComponent } from './rule/rule.component';
import { DesiredOutputStateComponent } from './desired-output-state/desired-output-state.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CreateDesiredOutputStateDialogComponent } from './create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { CreateActionDialogComponent } from './create-action-dialog/create-action-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RuleComponent,
    DesiredOutputStateComponent,
    CreateDesiredOutputStateDialogComponent,
    CreateActionDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatInputModule,
    MatToolbarModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
