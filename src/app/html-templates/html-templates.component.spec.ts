import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlTemplatesComponent } from './html-templates.component';

describe('HtmlTemplatesComponent', () => {
  let component: HtmlTemplatesComponent;
  let fixture: ComponentFixture<HtmlTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
