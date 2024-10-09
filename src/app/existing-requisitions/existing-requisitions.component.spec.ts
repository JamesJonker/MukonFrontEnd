import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingRequisitionsComponent } from './existing-requisitions.component';

describe('ExistingRequisitionsComponent', () => {
  let component: ExistingRequisitionsComponent;
  let fixture: ComponentFixture<ExistingRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExistingRequisitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
