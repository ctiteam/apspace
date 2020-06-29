import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { IonInput, IonSearchbar, ModalController } from '@ionic/angular';

import { SearchModalComponent } from './search-modal.component';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      declarations: [SearchModalComponent, IonInput, IonSearchbar],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      imports: [
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('default (no) params', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have placeholder', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.placeholder).toEqual('Search');
    });
  });

  describe('items', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      component.items = ['foo', 'bar', 'baz'];
      fixture.detectChanges();
    });

    it('should display type to search', () => {
      const items = fixture.nativeElement.querySelectorAll('ion-item');
      expect(items[0].textContent).toContain('Type to search');
      expect(items.length).toEqual(1);
    });

    it('should input be empty', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.value).toEqual('');
    });
  });

  describe('defaultItems', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      component.defaultItems = ['foo', 'bar', 'baz'];
      fixture.detectChanges();
    });

    it('should display default items', () => {
      const items = fixture.nativeElement.querySelectorAll('ion-item');
      expect(items.length).toEqual(3);
      expect(items[0].textContent).toContain('FOO');
      expect(items[1].textContent).toContain('BAR');
      expect(items[2].textContent).toContain('BAZ');
    });

    it('should have be empty', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.value).toEqual('');
    });
  });

  describe('items & defaultItems', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      component.items = ['nan'];
      component.defaultItems = ['foo', 'bar', 'baz'];
      fixture.detectChanges();
    });

    it('should display default items', () => {
      const items = fixture.nativeElement.querySelectorAll('ion-item');
      expect(items.length).toEqual(3);
      expect(items[0].textContent).toContain('FOO');
      expect(items[1].textContent).toContain('BAR');
      expect(items[2].textContent).toContain('BAZ');
    });

    it('should input be empty', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.value).toEqual('');
    });
  });

  describe('items & defaultTerm', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      component.items = ['foo', 'bar', 'baz'];
      component.defaultTerm = 'a';
      fixture.detectChanges();
    });

    it('should display items searched', () => {
      const items = fixture.nativeElement.querySelectorAll('ion-item');
      expect(items.length).toEqual(2);
      expect(items[0].textContent).toContain('BAR');
      expect(items[1].textContent).toContain('BAZ');
    });

    it('should input default term', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.value).toEqual('A');
    });
  });

  describe('items & defaultItems & defaultTerm', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchModalComponent);
      component = fixture.componentInstance;
      component.autofocus = false;
      component.defaultItems = ['nan'];
      component.items = ['foo', 'bar', 'baz'];
      component.defaultTerm = 'a';
      fixture.detectChanges();
    });

    it('should display default items', () => {
      const items = fixture.nativeElement.querySelectorAll('ion-item');
      expect(items.length).toEqual(1);
      expect(items[0].textContent).toContain('NAN');
    });

    it('should input default term', () => {
      const searchbar = fixture.nativeElement.querySelector('ion-searchbar');
      expect(searchbar.value).toEqual('A');
    });
  });
});
