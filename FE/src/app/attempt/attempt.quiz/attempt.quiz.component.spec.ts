import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuizComponent } from './attempt.quiz.component';

describe('AttemptQuizComponent', () => {
  let component: StudentQuizComponent;
  let fixture: ComponentFixture<StudentQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
