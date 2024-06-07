import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheSidebarContentComponent } from './the-sidebar-content.component';

describe('TheSidebarContentComponent', () => {
  let component: TheSidebarContentComponent;
  let fixture: ComponentFixture<TheSidebarContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheSidebarContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TheSidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
