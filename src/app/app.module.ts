import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RuleComponent } from './rule/rule.component';
import { DesiredOutputStateComponent } from './desired-output-state/desired-output-state.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

import { FormsModule } from '@angular/forms';
import { CreateDesiredOutputStateDialogComponent } from './create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { SelectHardwareDialogComponent } from './select-hardware-dialog/select-hardware-dialog.component';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { CreateDataDialogComponent } from './create-data-dialog/create-data-dialog.component';
import { SelectDataDialogComponent } from './select-data-dialog/select-data-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { DataKeySelectorComponent } from './data-key-selector/data-key-selector.component';
import { DataOperationComponent } from './data-operation/data-operation.component';
import { OperandSelectorComponent } from './operand-selector/operand-selector.component';
import { ActionActionsComponent } from './action-actions/action-actions.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StyleDialogComponent } from './style-dialog/style-dialog.component';
import { NumberDataComponent } from './number-data/number-data.component';
import { StringDataComponent } from './string-data/string-data.component';
import { NamedActionComponent } from './named-action/named-action.component';
import { TriggerComponent } from './trigger/trigger.component';
import { SwitchSelectorComponent } from './switch-selector/switch-selector.component';
import { HeaderComponent } from './trigger/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    RuleComponent,
    DesiredOutputStateComponent,
    CreateDesiredOutputStateDialogComponent,
    SelectHardwareDialogComponent,
    ExportDialogComponent,
    CreateDataDialogComponent,
    SelectDataDialogComponent,
    DataKeySelectorComponent,
    DataOperationComponent,
    OperandSelectorComponent,
    ActionActionsComponent,
    ConfirmDialogComponent,
    StyleDialogComponent,
    NumberDataComponent,
    StringDataComponent,
    NamedActionComponent,
    TriggerComponent,
    SwitchSelectorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatMenuModule,
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
