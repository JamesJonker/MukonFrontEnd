import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqResultsComponent } from './req-results.component';

describe('ReqResultsComponent', () => {
  let component: ReqResultsComponent;
  let fixture: ComponentFixture<ReqResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReqResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReqResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
