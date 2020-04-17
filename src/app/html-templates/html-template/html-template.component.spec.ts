import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlTemplateComponent } from './html-template.component';

describe('HtmlTemplateComponent', () => {
  let component: HtmlTemplateComponent;
  let fixture: ComponentFixture<HtmlTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
