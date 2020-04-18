import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconFinderComponent } from './icon-finder.component';

describe('IconFinderComponent', () => {
  let component: IconFinderComponent;
  let fixture: ComponentFixture<IconFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
