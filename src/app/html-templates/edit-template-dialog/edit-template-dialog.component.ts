import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlTemplatesComponent, DialogData } from '../html-templates.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorEvent } from 'ngx-color';



@Component({
  selector: 'app-edit-template-dialog',
  templateUrl: './edit-template-dialog.component.html',
  styleUrls: ['./edit-template-dialog.component.scss']
})
export class EditTemplateDialogComponent implements OnInit {
  @ViewChild('paletteMenuTrigger') menu: MatMenuTrigger;

  constructor(
    public dialogRef: MatDialogRef<HtmlTemplatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }


  changeFont() {
    if (this.data.currentTemplate.label.position == 'top' || this.data.currentTemplate.label.position == 'bottom') {
      this.data.currentTemplate.label.font = "Inter";
    } else {
      this.data.currentTemplate.label.font = "icons_text";
    }
   console.log(this.data.currentTemplate);
  }

  addColor() {
    this.data.colorPallete.push({ name: 'New', hex: '#ffffff' });
  }

  removeColor(i) {
    this.data.colorPallete.splice(i, 1)
  }

  handleChange($event: ColorEvent, i) {
    console.log($event);
    this.data.colorPallete[i].hex = $event.color.hex;
  }

}
