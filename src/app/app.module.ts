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
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

import { FormsModule } from '@angular/forms';
import { CreateDesiredOutputStateDialogComponent } from './create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { CreateActionDialogComponent } from './create-action-dialog/create-action-dialog.component';
import { SelectHardwareDialogComponent } from './select-hardware-dialog/select-hardware-dialog.component';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { CreateDataDialogComponent } from './create-data-dialog/create-data-dialog.component';
import { SelectDataDialogComponent } from './select-data-dialog/select-data-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RuleComponent,
    DesiredOutputStateComponent,
    CreateDesiredOutputStateDialogComponent,
    CreateActionDialogComponent,
    SelectHardwareDialogComponent,
    ExportDialogComponent,
    CreateDataDialogComponent,
    SelectDataDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
