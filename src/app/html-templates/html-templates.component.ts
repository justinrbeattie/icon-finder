import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { EditTemplateDialogComponent } from './edit-template-dialog/edit-template-dialog.component';
import { HtmlTemplateComponent } from './html-template/html-template.component';
import { Clipboard } from '@angular/cdk/clipboard'
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class HtmlTemplatesComponent implements OnInit {
  @Input() iconFonts;
  defaultHtmlTemplate: HtmlTemplate = { name: 'Example Template', icon: { font: '', content: '', size: '96', color: '#ffffff', alignment: 'center' }, label: { font: 'icons_text', content: 'Label', size: '28', color: '#ffffff', weight: 'bold', alignment: 'center', position: 'top' }, html: null, };
  defaultColorSwatch: ColorSwatch = { name: 'New Color', hex: '#ffffff' };

  storedData: StoredData = {
    htmlTemplates: [this.defaultHtmlTemplate],
    colorPallete: [this.defaultColorSwatch]
  }
  removeTemplatesMode: boolean = false;

  constructor(private dialog: MatDialog, private clipboard: Clipboard, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (localStorage.getItem("storedData")) {
      this.storedData = this.parseData(localStorage.getItem("storedData"));
    }
  }

  openAlert(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  parseData(data) {
    const storedData: StoredData = JSON.parse(data);
    if (storedData.htmlTemplates && storedData.colorPallete) {
      return storedData;
    } else {
      this.openAlert('Invalid Data');
      return this.storedData;
    }
  }

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
      data: { currentTemplate: currentTemplate, colorPallete: this.storedData.colorPallete, iconFonts: this.iconFonts }
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
    const htmlString: string = html.children[0].innerHTML.toString().replace('&amp;', '&');
    this.clipboard.copy(htmlString);
    console.log(htmlString);
    this.openAlert('Template Copied to Clipboard')
  }

  createExportableHtml(node: Node, iconUnicode: string) {
    const nodeIterator: NodeIterator = document.createNodeIterator(
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
        if (node.children == undefined && node.length == 1) {
            node.nodeValue = iconUnicode;
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
        this.openAlert('Template Upload Complete');
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    } else {
      this.openAlert('no file selected');
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