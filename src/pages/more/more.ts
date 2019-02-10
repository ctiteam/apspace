import { Component } from "@angular/core";
import {
  AlertController,
  App,
  Events,
  IonicPage,
  NavController,
  NavParams,
  Platform
} from "ionic-angular";

import { Role } from "../../interfaces";
import {
  NotificationProvider,
  SettingsProvider,
  WsApiProvider
} from "../../providers";

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  component: string;
  icon: string;
  size: string;
  desc: string;
  color: string;
  role: Role;
}

@IonicPage()
@Component({
  selector: "page-more",
  templateUrl: "more.html"
})
export class MorePage {
  menuFull: MenuGroup[] = [
    {
      title: "Main",
      items: [
        {
          title: "Profile",
          component: "ProfilePage",
          size: "small",
          desc: "purple",
          color: "purple",
          icon: "contact",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Fees",
          component: "FeesPage",
          size: "small",
          desc: "dark-orange",
          color: "dark-orange",
          icon: "cash",
          role: Role.Student
        },
        {
          title: "Bus Tracking",
          component: "BusTrackingPage",
          size: "medium",
          desc: "orange",
          color: "orange",
          icon: "bus",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Holidays",
          component: "HolidaysPage",
          size: "small",
          desc: "green",
          color: "green",
          icon: "bicycle",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Forms & Application",
          component: "FormsApplicationPage",
          size: "large",
          desc: "blue",
          color: "blue",
          icon: "clipboard",
          role: Role.Student | Role.Lecturer | Role.Admin
        }
      ]
    },
    {
      title: "Course Related",
      items: [
        {
          title: "Results",
          component: "ResultsPage",
          size: "small",
          desc: "red",
          color: "red",
          icon: "checkbox",
          role: Role.Student
        },
        {
          title: "iConsult (Beta)",
          component: "UpcominglecPage",
          size: "large",
          desc: "green",
          color: "green",
          icon: "clipboard",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Exam Schedule",
          component: "ExamSchedulePage",
          size: "medium",
          desc: "purple",
          color: "purple",
          icon: "book",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "My Library",
          component: "KohaPage",
          size: "medium",
          desc: "blue",
          color: "blue",
          icon: "bookmarks",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Student Timetable",
          component: "TimetablePage",
          size: "medium",
          desc: "red",
          color: "red",
          icon: "calendar",
          role: Role.Lecturer | Role.Admin
        },
        {
          title: "Moodle (Course Material)",
          component: "LmsPage",
          size: "xlarge",
          desc: "dark-orange",
          color: "dark-orange",
          icon: "open",
          role: Role.Student | Role.Lecturer | Role.Admin
        }
      ]
    },
    {
      title: "Others",
      items: [
        {
          title: "Staff Directory",
          component: "StaffDirectoryPage",
          size: "medium",
          desc: "dark-orange",
          color: "dark-orange",
          icon: "people",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Classroom Finder",
          component: "ClassroomFinderPage",
          size: "medium",
          desc: "purple",
          color: "purple",
          icon: "search",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "News",
          component: "NewsPage",
          size: "small",
          desc: "blue",
          color: "blue",
          icon: "paper",
          role: Role.Student
        },
        {
          title: "Operation Hours",
          component: "OperationHoursPage",
          size: "medium",
          desc: "orange",
          color: "orange",
          icon: "information-circle",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Feedback",
          component: "FeedbackPage",
          size: "small",
          desc: "green",
          color: "green",
          icon: "at",
          role: Role.Student | Role.Lecturer | Role.Admin
        },
        {
          title: "Settings",
          component: "SettingsPage",
          icon: "settings",
          size: "small",
          desc: "blue",
          color: "blue",
          role: Role.Student
        },
        {
          title: "Logout",
          component: "LogoutPage",
          icon: "log-out",
          size: "large",
          desc: "red",
          color: "red",
          role: Role.Student | Role.Lecturer | Role.Admin
        }
      ]
    }
  ];

  menuFiltered: MenuGroup[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ws: WsApiProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App,
    public settings: SettingsProvider,
    public notification: NotificationProvider,
    public plt: Platform
  ) {
    this.setMenuItems();
  }

  setMenuItems() {
    const role = this.settings.get("role");
    this.menuFiltered = this.menuFull
      .map(({ title, items }) => ({
        title,
        items: items.filter(page => page.role & role)
      }))
      .filter(group => group.items.length > 0);
  }

  filterMenu(event: any) {
    this.setMenuItems();
    let val = event.target.value;
    if (val && val.trim() !== "") {
      this.menuFiltered = this.menuFiltered
        .map(({ title, items }) => ({
          title,
          items: items.filter(
            page =>
              page.title.toLowerCase().includes(val.toLowerCase()) ||
              page.desc.toLowerCase().includes(val.toLowerCase())
          )
        }))
        .filter(group => group.items.length > 0);
    }
  }

  openPage(page) {
    if (page.component == "LogoutPage") {
      this.logout();
    } else {
      this.app.getRootNav().push(page.component);
    }
  }

  logout() {
    this.alertCtrl
      .create({
        title: "Confirm Log out",
        message: "Do you want to log out?",
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Log out",
            handler: () => {
              this.events.publish("user:logout");
            }
          }
        ]
      })
      .present();
  }
}
