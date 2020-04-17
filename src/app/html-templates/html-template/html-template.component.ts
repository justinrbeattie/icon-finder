import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-html-template',
  templateUrl: './html-template.component.html',
  styleUrls: ['./html-template.component.scss']
})
export class HtmlTemplateComponent implements OnInit {
  @Input('') template; 
  constructor() { }

  ngOnInit(): void {
  }

}
