import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Todolist } from './todolist';

describe('Todolist', () => {
  let component: Todolist;
  let fixture: ComponentFixture<Todolist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Todolist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Todolist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
