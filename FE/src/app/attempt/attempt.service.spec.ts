import { TestBed } from '@angular/core/testing';
import { StudentQuizService } from './attempt.service';

describe('StudentQuizService', () => {
  let service: StudentQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});