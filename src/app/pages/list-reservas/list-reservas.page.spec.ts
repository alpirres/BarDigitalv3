import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListReservasPage } from './list-reservas.page';

describe('ListReservasPage', () => {
  let component: ListReservasPage;
  let fixture: ComponentFixture<ListReservasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReservasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListReservasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
