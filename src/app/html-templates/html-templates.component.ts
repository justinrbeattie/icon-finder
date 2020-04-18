import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditTemplateDialogComponent } from './edit-template-dialog/edit-template-dialog.component';
import { HtmlTemplateComponent } from './html-template/html-template.component';

export interface DialogData {
  currentTemplate: HtmlTemplate;
  colorPallete: Array<ColorSwatch>;
  iconFonts;
}

export interface HtmlTemplate {
  name: string,
  icon: { font: string, content: string, size: string, color: string, alignment: string },
  label: { font: string, content: string, size: string, color: string, weight: string, alignment: string, position: string },
  html: SafeHtml,
}

export interface ColorSwatch {
  name: string, hex: string
}

export interface StoredData {
  htmlTemplates: Array<HtmlTemplate>, colorPallete: Array<ColorSwatch>,
}

@Component({
  selector: 'app-html-templates',
  templateUrl: './html-templates.component.html',
  styleUrls: ['./html-templates.component.scss']
})
export class HtmlTemplatesComponent implements OnInit, OnChanges {
  @Input() iconFonts;
  defaultHtmlTemplate: HtmlTemplate = { name: 'Example Template', icon: { font: '', content: '', size: '96', color: 'red', alignment: 'center' }, label: { font: 'Inter', content: 'Label', size: '28', color: 'green', weight: 'bold', alignment: 'center', position: 'top' }, html: null, };
  defaultColorSwatch: ColorSwatch = { name: '', hex: '#fff' };

  storedData: StoredData = {
    htmlTemplates: [this.defaultHtmlTemplate],
    colorPallete: [this.defaultColorSwatch]
  }
  removeTemplatesMode: boolean = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (localStorage.getItem("storedData")) {
      this.storedData = this.parseData(localStorage.getItem("storedData"));
    }
    /* this.setIcon(); */
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
  /*   this.setIcon(); */
  }

  parseData(data) {
    const storedData: StoredData = JSON.parse(data);
    if (storedData.htmlTemplates && storedData.colorPallete) {
      return storedData;
    } else {
      alert('Invalid Data');
      return this.storedData;
    }
  }

/*   setIcon() {
    if (this.storedData.htmlTemplates) {
      this.storedData.htmlTemplates.map(template => {
        template.icon.font = this.font;
        const iconDecimal = parseInt(this.iconContent.substring(3).replace(';', ''), 16);
        template.icon.content = '&#' + iconDecimal + ';';
      });
    }
  } */

  editTemplate(i): void {

    const currentTemplate: HtmlTemplate = {
      name: this.storedData.htmlTemplates[i].name,
      icon: Object.assign({}, this.storedData.htmlTemplates[i].icon),
      label: Object.assign({}, this.storedData.htmlTemplates[i].label),
      html: this.storedData.htmlTemplates[i].html,
    }

    const dialogRef = this.dialog.open(EditTemplateDialogComponent, {
      height: '80vh',
      width: '80vw',
      data: { currentTemplate: currentTemplate, colorPallete: this.storedData.colorPallete, iconFonts:this.iconFonts }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storedData.htmlTemplates[i] = result.currentTemplate;
        this.storedData.colorPallete = result.colorPallete;
        localStorage.setItem("storedData", JSON.stringify(this.storedData));
      }
    });
  }

  copyTemplateHtml(component: HtmlTemplateComponent, templateIndex) {

    const html = component.generatedHtml.nativeElement.parentElement.cloneNode(true);
    const iconUnicode = this.storedData.htmlTemplates[templateIndex].icon.content;
    this.createExportableHtml(html, iconUnicode);
    console.log(html.children[0].innerHTML.toString().replace('&amp;','&'));
  }

  createExportableHtml(node, iconUnicode) {
    const nodeIterator = document.createNodeIterator(
      node,
      NodeFilter.SHOW_ALL,
      { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } }
    );
    while (nodeIterator.nextNode()) {
      if (nodeIterator.referenceNode.nodeName == '#comment') {
        const commentNode = nodeIterator.referenceNode;
        commentNode.parentNode.removeChild(commentNode);
      } else {
        const node: any = nodeIterator.referenceNode;
        if (node.attributes) {
          node.removeAttribute('class');
          for (let attr of node.attributes) {
            if (attr.name.includes('_ng')) { node.removeAttribute(attr.name) };
          };
        }
        if (node.innerText == "" && node.children.length === 0) {
          node.innerText = iconUnicode;
        }
      }
    }
  }


  addTemplate() {
    this.storedData.htmlTemplates.push(this.defaultHtmlTemplate);
    localStorage.setItem("storedData", JSON.stringify(this.storedData));
  }

  removeTemplate(i) {
    this.storedData.htmlTemplates.splice(i, 1);
    localStorage.setItem("storedData", JSON.stringify(this.storedData));
  }

  import(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, "UTF-8");
      fileReader.onload = () => {
        const result: any = fileReader.result;
        this.storedData = this.parseData(result);
        localStorage.setItem("storedData", JSON.stringify(this.storedData));
    /*     this.setIcon(); */
        alert('Template Upload Complete');
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    } else {
      alert('no file selected');
    }
  }

  export(): void {
    const blob = new Blob([JSON.stringify(this.storedData)], { type: 'text/json' });
    const filename = "templates.json";

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

}