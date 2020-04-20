import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {DialogData} from '../html-templates/html-templates.component'

@Component({
  selector: 'app-icon-finder',
  templateUrl: './icon-finder.component.html',
  styleUrls: ['./icon-finder.component.scss'],
  encapsulation:ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconFinderComponent implements OnInit {
  @Input() data:DialogData;
  searchTerm: string;
  browse: boolean = true;
  isTyping;
  constructor() { }

  ngOnInit(): void {}

  onSearch() {
    console.log('type');
    window.clearTimeout(this.isTyping);

    this.isTyping = setTimeout(() => {
      if (this.searchTerm.length > 0) {
        this.browse = false;
        this.data.iconFonts.forEach((font, fontIndex) => {
          const filteredIcons = font.icons.filter(icon => {
            return icon.name.includes(this.searchTerm);
          });
          font['filteredIcons'] = Array.from(filteredIcons);
        });

      } else {
        this.browse = true;
        this.data.iconFonts.forEach((font, fontIndex) => {
          font['filteredIcons'] = font.icons;
        });
      }
    }, 250);
  }

  clearTimeout() {
    window.clearTimeout(this.isTyping);
  }

  selectIcon(fontIndex: number, iconIndex: number) {
    this.data.iconFonts.forEach(font => { font.filteredIcons.map(icon => icon.selected = false) });
    this.data.iconFonts[fontIndex].filteredIcons[iconIndex].selected = true;

    this.data.currentTemplate.icon.font = this.data.iconFonts[fontIndex].name;
    const iconHex = this.data.iconFonts[fontIndex].filteredIcons[iconIndex].unicode;
    const iconDecimal = parseInt(iconHex.substring(3).replace(';', ''), 16);
    this.data.currentTemplate.icon.content = '&#' + iconDecimal + ';';

  }
}
