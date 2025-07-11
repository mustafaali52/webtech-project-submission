import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetmarksComponent } from './getmarks.component';

describe('GetmarksComponent', () => {
  let component: GetmarksComponent;
  let fixture: ComponentFixture<GetmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
