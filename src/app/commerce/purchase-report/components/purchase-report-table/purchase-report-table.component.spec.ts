import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportTableComponent } from './purchase-report-table.component';

describe('PurchaseReportTableComponent', () => {
  let component: PurchaseReportTableComponent;
  let fixture: ComponentFixture<PurchaseReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseReportTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
