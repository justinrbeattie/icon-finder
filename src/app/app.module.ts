import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HtmlTemplatesComponent } from './html-templates/html-templates.component';

@NgModule({
  declarations: [
    AppComponent,
    HtmlTemplatesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    SharedModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
