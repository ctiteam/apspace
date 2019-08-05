import { Component, OnInit, NgZone, AfterViewInit, } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Role, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { SettingsService, WsApiService } from '../../services';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, AfterViewInit {
  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile>;
  staffProfile$: Observable<StaffProfile[]>;
  visa$: Observable<any>;
  contriesList: {
    alpha2Code: string,
    name: string,
    demonym: string
  }[];

  local = false;
  studentRole = false;
  countryName: string;
  countryType: string;
  constructor(
    private ws: WsApiService,
    private settings: SettingsService,
    private navCtrl: NavController,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.settings.ready().then(() => {
      const role = this.settings.get('role');
      // tslint:disable-next-line:no-bitwise
      if (role & Role.Student) {
        this.studentRole = true;
        this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo', true);
        this.profile$ = this.ws.get<StudentProfile>('/student/profile', true);
        this.getProfile();
      // tslint:disable-next-line:no-bitwise
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', true);
      }
      this.setUserCountry();
    });
  }

  openStaffDirectoryInfo(id: string) {
    this.navCtrl.navigateRoot('/student-timetable');
  }

  setUserCountry() {
    const role = this.settings.get('role');
    // tslint:disable-next-line:no-bitwise
    if (role & Role.Student) {
      this.ws.get<StudentProfile>('/student/profile').pipe(
        tap(p => {
          this.countryName = p.COUNTRY;
          this.countryType = 'country';
        }),
      ).subscribe();
    } else {
      this.ws.get<StaffProfile[]>('/staff/profile').pipe(
        tap(p => {
          this.countryName = p[0].NATIONALITY;
          this.countryType = 'nationality';
        }),
      ).subscribe();
    }
  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(p => {
        if (p.COUNTRY === 'Malaysia') {
          this.local = true;
        } else {
          this.local = false;
          this.visa$ = this.getVisaStatus();
        }
      }),
    ).subscribe();
  }

  getCountryData(countryName: string, type: string) {
    console.log(countryName + ' ' + type);
    return this.contriesList.filter(
      country => {
        if (type === 'nationality') {
          return country.demonym.toLowerCase().includes(countryName.toLowerCase());
        } else {
          return country.name.toLowerCase().includes(countryName.toLowerCase());
        }
      }
    );
  }

  getVisaStatus() {
    return this.ws.get<any>('/student/visa_status');
  }
  ngAfterViewInit() {

    this.ws.get<{alpha2Code: string, name: string, demonym: string}[]>('', false,
      {
        auth: false,
        url: 'https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;demonym'
      }
    ).subscribe(
      (response) => {
        this.contriesList = response;
      },
      (error) => {
        console.log(error);
      },
      () => {

        am4core.ready(() => {
          this.zone.runOutsideAngular(() => {
            /* Chart code */

            // Create map instance
            const chart = am4core.create('map', am4maps.MapChart);

            // Set map definition
            chart.geodata = am4geodata_worldLow;

            // Set projection
            chart.projection = new am4maps.projections.NaturalEarth1();

            // Create map polygon series
            const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
            // polygonSeries.mapPolygons.template.strokeWidth = 0.5;

            // Exclude Antartica
            polygonSeries.exclude = ['AQ'];

            // Make map load polygon (like country names) data from GeoJSON
            polygonSeries.useGeodata = true;

            // Configure series
            const polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.tooltipText = '{name}';
            polygonTemplate.fill = chart.colors.getIndex(0);

            // Create hover state and set alternative fill color
            const hs = polygonTemplate.states.create('hover');
            hs.properties.fill = chart.colors.getIndex(2);

            // Create active state
            const activeState = polygonTemplate.states.create('active');
            activeState.properties.fill = chart.colors.getIndex(4);

            // Create an event to toggle "active" state
            // polygonTemplate.events.on("hit", function(ev) {
            //   ev.target.isActive = !ev.target.isActive;
            // })

            chart.events.on('ready', (ev) => {
              // const countryMapper = new Countries();
              const countryName = polygonSeries.getPolygonById(this.getCountryData(this.countryName, this.countryType)[0].alpha2Code);
              countryName.isActive = true;

              setTimeout(() => {
                chart.zoomToMapObject(countryName);
                countryName.isActive = true;
              }, 1500);
            });

            const graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
          });
        });


      }
    );
  }
}
