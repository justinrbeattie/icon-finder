import { Component, Renderer2, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import *  as  IconFonts from '../assets/json/iconFonts.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Icon Finder';
  breakpoints: Array<string>;
  iconFonts = IconFonts['default'];
  searchTerm: string;
  browse: boolean = true;
  isTyping;
  font:string;
  iconContent:string;

  constructor(private breakpointObserver: BreakpointObserver, private renderer: Renderer2) { }

  ngOnInit() {
    this.addResponsiveClasses();
    this.selectIcon(0, 0);
  }

  addResponsiveClasses() {
    this.breakpoints = Object.keys(Breakpoints);
    this.breakpoints.forEach(breakpoint => {
      this.breakpointObserver.observe([
        Breakpoints[`${breakpoint}`]
      ]).subscribe(result => {

        let className = this.formatClassName(breakpoint);

        if (result.matches) {
          this.renderer.addClass(document.body, className);
        } else {
          this.renderer.removeClass(document.body, className);
        }
      });
    });
  }

  formatClassName(breakpoint) {
    switch (breakpoint) {
      case 'XSmall':
        breakpoint = "xs";
        break;
      case 'Small':
        breakpoint = "sm";
        break;
      case 'Medium':
        breakpoint = "md";
        break;
      case 'Large':
        breakpoint = "lg";
        break;
      case 'XLarge':
        breakpoint = "xl";
        break;
      default:
        breakpoint = breakpoint.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        breakpoint.charAt(0) === '-' ? breakpoint = breakpoint.substr(1) : null;
    }
    return breakpoint;
  }

  onSearch() {
    window.clearTimeout(this.isTyping);

    this.isTyping = setTimeout(() => {
      if (this.searchTerm.length > 0) {
        this.browse = false;
        this.iconFonts.forEach((font, fontIndex) => {
          const filteredIcons = font.icons.filter(icon => {
            return icon.name.includes(this.searchTerm);
          });
          font['filteredIcons'] = Array.from(filteredIcons);
        });

      } else {
        this.browse = true;
        this.iconFonts.forEach((font, fontIndex) => {
          font['filteredIcons'] = font.icons;
        });
      }
    }, 250);
  }

  clearTimeout() {
    window.clearTimeout(this.isTyping);
  }

  selectIcon(fontIndex: number, iconIndex: number) {
    this.iconFonts.forEach(font => { font.filteredIcons.map(icon => icon.selected = false) });
    this.iconFonts[fontIndex].filteredIcons[iconIndex].selected = true;

    this.font = this.iconFonts[fontIndex].name;
    this.iconContent = this.iconFonts[fontIndex].filteredIcons[iconIndex].unicode;

  }
}
