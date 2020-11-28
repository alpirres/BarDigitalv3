import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowqrPage } from './showqr.page';

describe('ShowqrPage', () => {
  let component: ShowqrPage;
  let fixture: ComponentFixture<ShowqrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowqrPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
