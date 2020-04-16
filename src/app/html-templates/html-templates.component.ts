import { Component, OnInit, Input, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-templates',
  templateUrl: './html-templates.component.html',
  styleUrls: ['./html-templates.component.scss']
})
export class HtmlTemplatesComponent implements OnInit, OnChanges {
  @Input() font: string;
  @Input() iconContent: string;
  @ViewChild("dialogRef") dialogRef: TemplateRef<any>;
  currentTemplate = {
    name: '',
    icon: { font: '', content: '', size: '', color: '', alignment: '' },
    label: { font: 'Inter', content: '', size: '', color: '', weight: '', alignment: '', position: '' },
    html: null,
  }
  htmlTemplates = [

    {
      name: 'Character Only',
      icon: { font: '', content: '', size: '96', color: 'red', alignment: 'center' },
      label: { font: 'Inter', content: 'Label', size: '28', color: 'green', weight: 'bold', alignment: 'center', position: 'top' },
      html: null,
    }



  ]


  constructor(private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.setFont();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.setFont();
  }

  setFont() {
    this.htmlTemplates.map(template => {
      template.icon.font = this.font;
      template.icon.content = this.iconContent;
    });
    this.setHTML();
  }


  setHTML() {

    this.htmlTemplates.map(template => {
      const title = `<h3>${template.name}</h3>`;
      let htmlString = '';
      let label = '';
      const icon = `
      <span style="--font-size:${template.icon.size}pt; ">
      <FONT size="${template.icon.size}" 
            color="${template.icon.color}" 
            face="${template.icon.font}">
        <P align="${template.icon.alignment}">${template.icon.content}</P>
      </FONT>
      </span>
      `
      if (template.label) {
        label = `
        <span style="--font-size:${template.label.size}pt; ">
        <FONT size="${template.label.size}" 
              color="${template.label.color}" 
              face="${template.label.font}">
              <P align="${template.label.alignment}">
              ${template.label.weight == 'bold' ? '<B>' : ''} 
              ${template.label.content}
              ${template.label.weight == 'bold' ? '</B>' : ''}
              </P>
        </FONT>
        </span>
        `
      }

      const position = template.label.position;
      switch (position) {
        case 'top':
          htmlString = label + icon;
          break;
        case 'left':
          htmlString = label + icon;
          htmlString.replace(/<P/g, "<span");
          htmlString.replace(/P>/g, "span>");
          break;
        case 'bottom':
          htmlString = icon + label;
          break;
        case 'right':
          htmlString = icon + label;
          htmlString.replace(/<P/g, "<span");
          htmlString.replace(/P>/g, "span>");
          break;
        default:
          htmlString = icon + label;
      }

      template.html = this.sanitizer.bypassSecurityTrustHtml(title + htmlString);

    });
  }

  openDialog(i): void {
    this.currentTemplate = this.htmlTemplates[i];
    this.dialog.open(this.dialogRef, {
      height: '80vh',
      width: '80vw',
    });
  }


}
