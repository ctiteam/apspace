import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as Fuse from 'fuse.js';
import { Observable } from 'rxjs';

import { Role } from '../../interfaces';
import { CasTicketService, SettingsService, UserSettingsService } from '../../services';

import { Network } from '@ionic-native/network/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { MenuItem } from './menu.interface';
@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss']
})
export class MorePage implements OnInit {
  view$: Observable<'list' | 'cards'>;
  editMode = false;
  term = '';

  options: Fuse.FuseOptions<MenuItem> = {
    keys: ['title', 'tags']
  };

  menuFiltered = [] as MenuItem[];

  /* tslint:disable:no-bitwise */
  menuFull: MenuItem[] = [
    // START OF FINANCE
    {
      title: 'APCard',
      group: 'Finance',
      url: 'apcard',
      img: 'assets/img/apcard.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['transactions', 'money', 'card', 'credit', 'expenses']
    },
    {
      title: 'Fees',
      group: 'Finance',
      url: 'fees',
      img: 'assets/img/fees.svg',
      role: Role.Student,
      tags: ['payment', 'pricing', 'money', 'outstanding', 'overdue']
    },
    {
      title: 'PTPTN',
      group: 'Finance',
      // tslint:disable-next-line: max-line-length
      url: 'http://www.apu.edu.my/study-apu/financing-your-study/education-study-loans/national-higher-education-fund-perbadanan', // No ticket
      img: 'assets/img/ptptn.png',
      role: Role.Student,
      tags: ['loan']
    },
    {
      title: 'Scholarship & Loan (Malaysians)',
      group: 'Finance',
      url: 'http://www.apu.edu.my/study-apu/financing-your-study/education-study-loans', // No ticket
      img: 'assets/img/scholarship.png',
      role: Role.Student,
      tags: ['loan']
    },
    {
      title: 'Retake Modules, Resit & EC Fees',
      group: 'Finance',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/retake-modules-resit-ec-fees/', // no ticket
      img: 'assets/img/fees.svg',
      role: Role.Student,
      tags: []
    },
    // END OF FINANCE




    // START OF Collaboration & Information Resources
    {
      title: 'e-Forms (Forms & Applications)',
      group: 'Collaboration & Information Resources',
      url: 'http://forms.sites.apiit.edu.my/home/',
      attachTicket: true,
      img: 'assets/img/forms-and-applications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['purchase', 'incident', 'maintenance', 'order', 'exit', 'event']
    },
    {
      title: 'Feedback',
      group: 'Collaboration & Information Resources',
      url: 'feedback',
      img: 'assets/img/feedback.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['apspace feedback', 'app not working', 'issue']
    },
    {
      title: 'Help Center',
      group: 'Collaboration & Information Resources',
      url: 'https://apiit.atlassian.net/servicedesk/customer/portals', // No ticket
      img: 'assets/img/help-center.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['issue', 'ticket', 'jira', 'help', 'ask', 'feature', 'question']
    },
    {
      title: 'iConsult',
      group: 'Collaboration & Information Resources',
      img: 'assets/img/iconsult.png',
      url: 'iconsult/my-consultations',
      role: Role.Lecturer | Role.Admin,
      tags: ['consultation', 'slot']
    },
    {
      title: 'iConsult',
      group: 'Collaboration & Information Resources',
      url: 'iconsult/my-appointments',
      img: 'assets/img/iconsult.png',
      role: Role.Student,
      tags: ['consultation', 'booking']
    },
    {
      title: 'Knowledge Base',
      group: 'Collaboration & Information Resources',
      url: 'http://kb.sites.apiit.edu.my/home/', // no ticket
      img: 'assets/img/kb.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['articles', 'Q&A', 'FAQ', 'questions', 'answers', 'how to', 'kb']
    },
    // { To be added to moodle later on (not available now)
    //   title: 'Lecturer Reference Kit',
    //   group: 'Collaboration & Information Resources',
    //   url: 'http://kb.sites.apiit.edu.my/home/',
    //   img: 'assets/img/kb.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: ['articles', 'Q&A', 'FAQ', 'questions', 'answers', 'how to']
    // },
    {
      title: 'Library Homepage',
      group: 'Collaboration & Information Resources',
      url: 'https://library.apiit.edu.my/', // No Ticket
      img: 'assets/img/library.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'My Library',
      group: 'Collaboration & Information Resources',
      url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
      attachTicket: true,
      img: 'assets/img/my-library.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['book', 'articles', 'resource']
    },
    {
      title: 'News Feed',
      group: 'Collaboration & Information Resources',
      url: 'news',
      img: 'assets/img/news.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['events', 'slider']
    },
    {
      title: 'Newsletters',
      group: 'Collaboration & Information Resources',
      url: 'https://library.sites.apiit.edu.my/newsletters/', // no ticket
      img: 'assets/img/newsletter.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Notifications',
      group: 'Collaboration & Information Resources',
      url: 'notifications',
      img: 'assets/img/notifications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['messages']
    },
    {
      title: 'Office 365',
      group: 'Collaboration & Information Resources',
      img: 'assets/img/webmail.png',
      url: 'https://portal.office.com/', // no ticket
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['mail', 'email', 'teams', 'microsoft']
    },
    {
      title: 'Regulations & Policies',
      group: 'Collaboration & Information Resources',
      img: 'assets/img/policies.png',
      url: 'https://lms2.apiit.edu.my/course/view.php?id=750',  // no ticket
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['rules']
    },
    // END OF Collaboration & Information Resources




    // START Campus Life
    {
      title: 'Bus Shuttle Services',
      group: 'Campus Life',
      url: 'bus-shuttle-services',
      img: 'assets/img/bus-shuttle-services.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['bus', 'trips', 'schedule']
    },
    // {
    //   title: 'Campus Map',
    //   group: 'Campus Life',
    //   img: 'assets/img/webmail.png',
    //   url: '',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: ['mail', 'email']
    // },
    {
      title: 'Holidays',
      group: 'Campus Life',
      url: 'holidays',
      img: 'assets/img/holidays.svg',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['vacation', 'break']
    },
    {
      title: 'Operation Hours',
      group: 'Campus Life',
      url: 'operation-hours',
      img: 'assets/img/operation-hours.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['opening hours', 'time', 'working hours']
    },
    {
      title: 'Personal Counseling',
      group: 'Campus Life',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/personal-counseling/', // no ticket
      img: 'assets/img/counseling.png',
      role: Role.Student,
      tags: ['issue', 'discuss', 'talk']
    },
    {
      title: 'Student Affairs Homepage',
      group: 'Campus Life',
      url: 'https://www.studentaffairs.apu.edu.my/', // no ticket
      img: 'assets/img/student_affairs.png',
      role: Role.Student,
      tags: []
    },
    {
      title: 'Student Handbook',
      group: 'Campus Life',
      img: 'assets/img/handbook.png',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/student-handbook/', // no ticket
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Transport & Parking',
      group: 'Campus Life',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/category/students/campus-life/transportation/', // No ticket
      img: 'assets/img/transport.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['lrt', 'rapid', 'kl']
    },
    // END Campus Life





    // START OF Academic Operations
    {
      title: 'APLC Progress Report',
      group: 'Academic Operation',
      url: 'aplc-progress-report',
      img: 'assets/img/aplc-progress-report.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['progression']
    },
    // {
    //   title: 'APTime',
    //   group: 'Academic Operation',
    //   url: 'aplc-progress-report',
    //   img: 'assets/img/aplc-progress-report.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    {
      title: 'BeAPU',
      group: 'Academic Operation',
      url: 'beapu',
      img: 'assets/img/beapu.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['report', 'attire', 'formal']
    },
    {
      title: 'DingDong',
      group: 'Academic Operation',
      url: 'https://dingdong.apu.edu.my/login', // no ticket
      img: 'assets/img/dingdong.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['message', 'sms', 'email', 'push', 'notification', 'announce']
    },
    {
      title: 'Exam Paper Scheduling',
      group: 'Academic Operation',
      url: 'https://examscheduling.apu.edu.my/epaperschedule/login_page.asp', // no ticket
      img: 'assets/img/exam-scheduling.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Graduation Verification Service',
      group: 'Academic Operation',
      url: 'graduate-verification-service',
      img: 'assets/img/graduate-verification-service.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Mentorship',
      group: 'Academic Operation',
      url: 'mentorship',
      img: 'assets/img/mentorship.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['mentor', 'mentee', 'performance', 'attendance', 'results', 'my students']
    },
    {
      title: 'Monthly Returns',
      group: 'Academic Operation',
      url: 'https://monthlyreturns.apiit.edu.my', // no tickets
      img: 'assets/img/monthly-returns.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'My Reports Panel',
      group: 'Academic Operation',
      url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
      attachTicket: true,
      img: 'assets/img/reports.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['report', 'admin', 'jasper']
    },
    // END OF Academic Operations




    // START OF Corporate
    {
      title: 'Corporate Communication',
      group: 'Corporate',
      url: 'http://apiitgroupcomm.sites.apiit.edu.my/', // no ticket
      img: 'assets/img/corcum.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Human Resource',
      group: 'Corporate',
      url: 'hr',
      img: 'assets/img/hr.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['leave', 'break', 'mc']
    },
    {
      title: 'Quality Procedure',
      group: 'Corporate',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/quality-procedures-information-and-personal-data-protection/', // no ticket
      img: 'assets/img/quality.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['rules']
    },
    // {
    //   title: 'Report an Exception',
    //   group: 'Corporate',
    //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
    //   img: 'assets/img/reports.png',
    //   role: Role.Lecturer | Role.Admin,
    //   tags: ['report', 'admin', 'jasper']
    // },
    // END OF Corporate



    // START OF Academic & Enrollment
    {
      title: 'Attendance',
      group: 'Academic & Enrollment',
      url: 'attendance',
      img: 'assets/img/attendance.png',
      role: Role.Student,
      tags: []
    },
    // {
    //   title: 'Course Progression Pathway',
    //   group: 'Academic & Enrollment',
    //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
    //   img: 'assets/img/reports.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: ['report', 'admin', 'jasper']
    // },
    {
      title: 'Course Schedule',
      group: 'Academic & Enrollment',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/course-schedule/',
      img: 'assets/img/course-schedule.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Exam Schedule',
      group: 'Academic & Enrollment',
      url: 'exam-schedule',
      img: 'assets/img/exam-schedule.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'FYP Bank Homepage',
      group: 'Academic & Enrollment',
      url: 'https://fypbank.apiit.edu.my/', // no ticket
      img: 'assets/img/fyp.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['fyp', 'bank', 'final project', 'project']
    },
    {
      title: 'Intake Calendar',
      group: 'Academic & Enrollment',
      url: 'http://www.apu.edu.my/study-apu/intake-calendar', // no ticket
      img: 'assets/img/intake-calendar.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['intake date', 'intake duration', 'next intake']
    },
    // {
    //   title: 'Module Appraisal',
    //   group: 'Academic & Enrollment',
    //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
    //   img: 'assets/img/reports.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: ['report', 'admin', 'jasper']
    // },
    {
      title: 'Moodle (Course Material)',
      group: 'Academic & Enrollment',
      url: 'https://lms2.apiit.edu.my/login/index.php', // with ticket
      img: 'assets/img/moodle.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      attachTicket: true,
      tags: ['material', 'modules', 'lecturer note', 'assignment']
    },
    {
      title: 'My Timetable',
      group: 'Academic & Enrollment',
      url: 'lecturer-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Lecturer,
      tags: ['class', 'schedule']
    },
    {
      title: 'PGD Bank Homepage',
      group: 'Academic & Enrollment',
      url: 'https://pgd.apiit.edu.my/', // no ticket
      img: 'assets/img/fyp.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['fyp', 'bank', 'final project', 'project']
    },
    {
      title: 'Results',
      group: 'Academic & Enrollment',
      url: 'results',
      img: 'assets/img/results.png',
      role: Role.Student,
      tags: ['marks']
    },
    {
      title: 'Timetable',
      group: 'Academic & Enrollment',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Student,
      tags: ['class', 'schedule', 'break']
    },
    {
      title: 'Student Timetable',
      group: 'Academic & Enrollment',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['class', 'schedule', 'break']
    },
    {
      title: 'Web Attendance (Legacy)',
      group: 'Academic & Enrollment',
      url: 'https://titan.apiit.edu.my/gims/attendance/default.asp?CAMPUS=TPM',
      img: 'assets/img/web-attendance.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['mark', 'students attendance', 'update']
    },
    // END OF Academic & Enrollment




    // START OF Career Centre & Corporate Training
    {
      title: 'Corporate Training Homepage',
      group: 'Career Centre & Corporate Training',
      url: 'http://training.apiit.edu.my/', // no ticket
      img: 'assets/img/training.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'APLink',
      group: 'Career Centre & Corporate Training',
      url: 'https://apu-joblink-csm.symplicity.com/students/', // no ticket
      img: 'assets/img/aplink.png',
      role: Role.Student,
      tags: []
    },
    {
      title: 'APLink',
      group: 'Career Centre & Corporate Training',
      url: 'https://apu-joblink-csm.symplicity.com/faculty/', // no ticket
      img: 'assets/img/aplink.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Career Centre Facebook',
      group: 'Career Centre & Corporate Training',
      url: 'https://www.facebook.com/apucc?ref=hl', // no ticket
      img: 'assets/img/career.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    // END OF Career Centre & Corporate Training




    // START OF OTHERS
    // { To be added
    //   title: 'About',
    //   group: 'Others',
    //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
    //   img: 'assets/img/reports.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: ['report', 'admin', 'jasper']
    // },
    {
      title: 'Classroom Finder',
      group: 'Others',
      url: 'classroom-finder',
      img: 'assets/img/classroom-finder.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['empty', 'class', 'lab', 'auditorium', 'workshop', 'room']
    },
    {
      title: 'Profile',
      group: 'Others',
      url: 'profile',
      img: 'assets/img/profile.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['mentor', 'programme leader', 'visa']
    },
    {
      title: 'Settings',
      group: 'Others',
      url: 'settings',
      img: 'assets/img/settings.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Staff Directory',
      group: 'Others',
      url: 'staffs',
      img: 'assets/img/staff-directory.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['lecturer', 'academic', 'teacher']
    },
    {
      title: 'Track Student Visa Status',
      group: 'Others',
      url: 'visa-status',
      img: 'assets/img/visa-status.png',
      role: Role.Admin,
      tags: ['visa']
    },
    {
      title: 'Logout',
      group: 'Others',
      url: 'logout',
      img: 'assets/img/logout.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['exit', 'log out', 'log-out', 'sign out', 'sign-out']
    },
    // END OF OTHERS




    // START OF UNGROUPED
    // {
    //   title: 'Upcoming Graduation',
    //   group: 'UNGROUPED',
    //   url: 'https://graduation.sites.apiit.edu.my/',
    //   img: 'assets/img/upcoming-graduations.png',
    //   role: Role.Student,
    //   tags: ['graduation', 'cermony']
    // },
    // END OF UNGROUPED
  ];
  /* tslint:enable:no-bitwise */

  /* tslint:disable:no-bitwise */
  // Default Faviorate Items
  fav: MenuItem[] = [
    {
      title: 'APCard',
      group: 'Finance',
      url: 'apcard',
      img: 'assets/img/apcard.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['transactions', 'money', 'card', 'credit', 'expenses']
    },
    {
      title: 'Classroom Finder',
      group: 'Others',
      url: 'classroom-finder',
      img: 'assets/img/classroom-finder.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['empty', 'class', 'lab', 'auditorium', 'workshop', 'room']
    },
    {
      title: 'e-Forms (Forms & Applications)',
      group: 'Collaboration & Information Resources',
      url: 'http://forms.sites.apiit.edu.my/home/',
      attachTicket: true,
      img: 'assets/img/forms-and-applications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['purchase', 'incident', 'maintenance', 'order', 'exit', 'event']
    },
    {
      title: 'Fees',
      group: 'Finance',
      url: 'fees',
      img: 'assets/img/fees.svg',
      role: Role.Student,
      tags: ['payment', 'pricing', 'money', 'outstanding', 'overdue']
    },
    {
      title: 'iConsult',
      group: 'Collaboration & Information Resources',
      img: 'assets/img/iconsult.png',
      url: 'iconsult/my-consultations',
      role: Role.Lecturer | Role.Admin,
      tags: ['consultation', 'slot']
    },
    {
      title: 'iConsult',
      group: 'Collaboration & Information Resources',
      url: 'iconsult/my-appointments',
      img: 'assets/img/iconsult.png',
      role: Role.Student,
      tags: ['consultation', 'booking']
    },
    {
      title: 'Monthly Returns',
      group: 'Academic Operation',
      url: 'https://monthlyreturns.apiit.edu.my', // no tickets
      img: 'assets/img/monthly-returns.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Moodle (Course Material)',
      group: 'Academic & Enrollment',
      url: 'https://lms2.apiit.edu.my/login/index.php', // with ticket
      img: 'assets/img/moodle.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      attachTicket: true,
      tags: ['material', 'modules', 'lecturer note', 'assignment']
    },
    {
      title: 'My Reports Panel',
      group: 'Academic Operation',
      url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
      attachTicket: true,
      img: 'assets/img/reports.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['report', 'admin', 'jasper']
    },
    {
      title: 'News Feed',
      group: 'Collaboration & Information Resources',
      url: 'news',
      img: 'assets/img/news.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['events', 'slider']
    },
    {
      title: 'Notifications',
      group: 'Collaboration & Information Resources',
      url: 'notifications',
      img: 'assets/img/notifications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['messages']
    },
    {
      title: 'Profile',
      group: 'Others',
      url: 'profile',
      img: 'assets/img/profile.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['mentor', 'programme leader', 'visa']
    },
    {
      title: 'Results',
      group: 'Academic & Enrollment',
      url: 'results',
      img: 'assets/img/results.png',
      role: Role.Student,
      tags: ['marks']
    },
    {
      title: 'Staff Directory',
      group: 'Others',
      url: 'staffs',
      img: 'assets/img/staff-directory.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['lecturer', 'academic', 'teacher']
    },
  ];
  /* tslint:enable:no-bitwise */

  newFav: MenuItem[] = [];


  constructor(
    public navCtrl: NavController,
    public iab: InAppBrowser,
    private cas: CasTicketService,
    private settings: SettingsService,
    private userSettings: UserSettingsService,
    private network: Network,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.view$ = this.userSettings.getMenuUI();

    const storageMenuItems = this.settings.get('favoriteItems');
    if (storageMenuItems) {
      this.fav = storageMenuItems;
    }

    const role = this.settings.get('role');
    // tslint:disable-next-line:no-bitwise
    this.menuFiltered = this.menuFull.filter(menu => menu.role & role);

    // tslint:disable-next-line:no-bitwise
    this.fav = this.fav.filter(menuItem => menuItem.role & role);
  }

  /** Open page, manually check for third party pages. */
  openPage(url: string, attachTicket = false) {
    // external pages does not use relative or absolute link
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Manually exclude sites that do not need service ticket
      if (!attachTicket) {
        this.iab.create(url, '_system', 'location=true');
      } else {
        if (this.network.type !== 'none') {
          this.cas.getST(url).subscribe(st => {
            this.iab.create(`${url}?ticket=${st}`, '_system', 'location=true');
          });
        } else {
          this.presentToast('External links cannot be opened in offline mode. Please ensure you have a network connection and try again');
        }

      }
    } else {
      this.navCtrl.navigateForward([url]);
    }
  }

  /** No sorting for KeyValuePipe. */
  noop(): number {
    return 0;
  }

  addToFav(item: MenuItem) {
    const index = this.fav.map(favItem => `${favItem.title},${favItem.url}`).indexOf(`${item.title},${item.url}`);
    if (index > -1) {
      this.fav.splice(index, 1);
      this.newFav = [...this.fav];
    } else {
      this.newFav = [ // this way is used because pipes detect changes on arrays, lists... by refrence
        ...this.fav,
        item
      ];
    }
    this.fav = this.newFav;
    this.settings.set('favoriteItems', this.fav);
  }

  enableEditMode() {
    this.editMode = !this.editMode;
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'danger',
      duration: 6000,
      showCloseButton: true,
      position: 'top'
    });
    toast.present();
  }

}
