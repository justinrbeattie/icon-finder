import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-html-template',
  templateUrl: './html-template.component.html',
  styleUrls: ['./html-template.component.scss']
})
export class HtmlTemplateComponent implements OnInit {
  @Input('') template; 
  @ViewChild('generatedHtml') generatedHtml: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

}
