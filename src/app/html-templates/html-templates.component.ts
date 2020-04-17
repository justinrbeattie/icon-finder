import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditTemplateDialogComponent } from './edit-template-dialog/edit-template-dialog.component';

export interface DialogData {
  currentTemplate: HtmlTemplate;
}

export interface HtmlTemplate {
  name: string,
  icon: { font: string, content: string, size: string, color: string, alignment: string },
  label: { font: string, content: string, size: string, color: string, weight: string, alignment: string, position: string },
  html: SafeHtml,
}

@Component({
  selector: 'app-html-templates',
  templateUrl: './html-templates.component.html',
  styleUrls: ['./html-templates.component.scss']
})
export class HtmlTemplatesComponent implements OnInit, OnChanges {
  @Input() font: string;
  @Input() iconContent: string;
  selectedFile;
  htmlTemplates: Array<HtmlTemplate>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (localStorage.getItem("htmlTemplates") != undefined) {
      this.htmlTemplates = JSON.parse(localStorage.getItem("htmlTemplates"));
    } else {
      this.htmlTemplates = [
        {
          name: 'Example Template',
          icon: { font: '', content: '', size: '96', color: 'red', alignment: 'center' },
          label: { font: 'Inter', content: 'Label', size: '28', color: 'green', weight: 'bold', alignment: 'center', position: 'top' },
          html: null,
        }
      ]
    }
    this.setIcon();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.setIcon();
  }

  setIcon() {
    if (this.htmlTemplates) {
      this.htmlTemplates.map(template => {
        template.icon.font = this.font;
        template.icon.content = this.iconContent;
      });
    }
  }

  openDialog(i): void {

    const currentTemplate: HtmlTemplate = {
      name: this.htmlTemplates[i].name,
      icon: Object.assign({}, this.htmlTemplates[i].icon),
      label: Object.assign({}, this.htmlTemplates[i].label),
      html: this.htmlTemplates[i].html,
    }

    const dialogRef = this.dialog.open(EditTemplateDialogComponent, {
      height: '80vh',
      width: '80vw',
      data: { currentTemplate: currentTemplate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.htmlTemplates[i] = result.currentTemplate;
        localStorage.setItem("htmlTemplates", JSON.stringify(this.htmlTemplates));
      }
    });
  }

  download(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(blob, filename);
    else { // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  exportJson(): void {
    const c = JSON.stringify(this.htmlTemplates);
    const file = new Blob([c], { type: 'text/json' });
    this.download(file, "templates.json");
  }

  uploadFile(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    fileReader.onload = () => {
      const result: any = fileReader.result;
      this.htmlTemplates = JSON.parse(result);
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
}