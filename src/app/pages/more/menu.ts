import { Role } from '../../interfaces';
import { MenuItem } from './menu.interface';

// internal used only
/* tslint:disable:no-bitwise */
export const menusRaw = [
  // START OF FINANCE
  {
    id: 'apcard' as const,
    title: 'APCard',
    group: 'Finance',
    url: 'apcard',
    img: 'assets/img/apcard.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['transactions', 'money', 'card', 'credit', 'expenses']
  },
  {
    id: 'fees' as const,
    title: 'Fees',
    group: 'Finance',
    url: 'fees',
    img: 'assets/img/fees.svg',
    role: Role.Student,
    tags: ['payment', 'pricing', 'money', 'outstanding', 'overdue']
  },
  {
    id: 'ptptn' as const,
    title: 'PTPTN',
    group: 'Finance',
    // tslint:disable-next-line: max-line-length
    url: 'http://www.apu.edu.my/study-apu/financing-your-study/education-study-loans/national-higher-education-fund-perbadanan', // No ticket
    img: 'assets/img/ptptn.png',
    role: Role.Student,
    tags: ['loan']
  },
  {
    id: 'scholarship-loan' as const,
    title: 'Scholarship & Loan (Malaysians)',
    group: 'Finance',
    url: 'http://www.apu.edu.my/study-apu/financing-your-study/education-study-loans', // No ticket
    img: 'assets/img/scholarship.png',
    role: Role.Student,
    tags: ['loan']
  },
  {
    id: 'retake-reset-ec' as const,
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
    id: 'apspace-feedback' as const,
    title: 'APSpace Feedback',
    group: 'Collaboration & Information Resources',
    url: 'feedback',
    img: 'assets/img/feedback.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['apspace feedback', 'app not working', 'issue']
  },
  {
    id: 'e-forms' as const,
    title: 'e-Forms (Forms & Applications)',
    group: 'Collaboration & Information Resources',
    url: 'http://forms.sites.apiit.edu.my/home/',
    attachTicket: true,
    img: 'assets/img/forms-and-applications.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['purchase', 'incident', 'maintenance', 'order', 'exit', 'event']
  },
  {
    id: 'help-centre' as const,
    title: 'Help Centre',
    group: 'Collaboration & Information Resources',
    url: 'https://apiit.atlassian.net/servicedesk/customer/portals', // No ticket
    img: 'assets/img/help-center.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['issue', 'ticket', 'jira', 'help', 'ask', 'feature', 'question']
  },
  {
    id: 'iconsult-staff' as const,
    title: 'iConsult',
    group: 'Collaboration & Information Resources',
    img: 'assets/img/iconsult.png',
    url: 'iconsult/my-consultations',
    role: Role.Lecturer | Role.Admin,
    tags: ['consultation', 'slot']
  },
  {
    id: 'iconsult-student' as const,
    title: 'iConsult',
    group: 'Collaboration & Information Resources',
    url: 'iconsult/my-appointments',
    img: 'assets/img/iconsult.png',
    role: Role.Student,
    tags: ['consultation', 'booking']
  },
  {
    id: 'knowledge-base' as const,
    title: 'Knowledge Base',
    group: 'Collaboration & Information Resources',
    url: 'http://kb.sites.apiit.edu.my/home/', // no ticket
    img: 'assets/img/kb.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['articles', 'Q&A', 'FAQ', 'questions', 'answers', 'how to', 'kb']
  },
  // { To be added to moodle later on (not available now)
  //   id: 'lecturer-reference-kit' as const,
  //   title: 'Lecturer Reference Kit',
  //   group: 'Collaboration & Information Resources',
  //   url: 'http://kb.sites.apiit.edu.my/home/',
  //   img: 'assets/img/kb.png',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: ['articles', 'Q&A', 'FAQ', 'questions', 'answers', 'how to']
  // },
  {
    id: 'library' as const,
    title: 'Library Homepage',
    group: 'Collaboration & Information Resources',
    url: 'https://library.apiit.edu.my/', // No Ticket
    img: 'assets/img/library.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'my-library' as const,
    title: 'My Library',
    group: 'Collaboration & Information Resources',
    url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
    attachTicket: true,
    img: 'assets/img/my-library.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['book', 'articles', 'resource']
  },
  {
    id: 'koha' as const,
    title: 'Koha',
    group: 'Collaboration & Information Resources',
    url: 'koha',
    role: Role.Student,
    tags: ['library', 'library fee', 'library checkout', 'book']
  },
  {
    id: 'news-feed' as const,
    title: 'News Feed',
    group: 'Collaboration & Information Resources',
    url: 'news',
    img: 'assets/img/news.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['events', 'slider']
  },
  {
    id: 'newsletters' as const,
    title: 'Newsletters',
    group: 'Collaboration & Information Resources',
    url: 'https://library.sites.apiit.edu.my/newsletters/', // no ticket
    img: 'assets/img/newsletter.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'notifications' as const,
    title: 'Notifications',
    group: 'Collaboration & Information Resources',
    url: 'notifications',
    img: 'assets/img/notifications.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['messages']
  },
  {
    id: 'office365' as const,
    title: 'Office 365',
    group: 'Collaboration & Information Resources',
    img: 'assets/img/webmail.png',
    url: 'https://portal.office.com/', // no ticket
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['mail', 'email', 'teams', 'microsoft']
  },
  {
    id: 'regulations-policies' as const,
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
    id: 'bus-shuttle-services' as const,
    title: 'Bus Shuttle Services',
    group: 'Campus Life',
    url: 'bus-shuttle-services',
    img: 'assets/img/bus-shuttle-services.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['bus', 'trips', 'schedule']
  },
  // {
  //   id: 'campus-map' as const,
  //   title: 'Campus Map',
  //   group: 'Campus Life',
  //   img: 'assets/img/webmail.png',
  //   url: '',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: ['mail', 'email']
  // },
  {
    id: 'holidays' as const,
    title: 'Holidays',
    group: 'Campus Life',
    url: 'holidays',
    img: 'assets/img/holidays.svg',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['vacation', 'break']
  },
  {
    id: 'operations-hours' as const,
    title: 'Operation Hours',
    group: 'Campus Life',
    url: 'operation-hours',
    img: 'assets/img/operation-hours.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['opening hours', 'time', 'working hours']
  },
  {
    id: 'personal-counseling' as const,
    title: 'Personal Counseling',
    group: 'Campus Life',
    url: 'http://kb.sites.apiit.edu.my/knowledge-base/personal-counseling/', // no ticket
    img: 'assets/img/counseling.png',
    role: Role.Student,
    tags: ['issue', 'discuss', 'talk']
  },
  {
    id: 'student-affairs' as const,
    title: 'Student Affairs Homepage',
    group: 'Campus Life',
    url: 'https://www.studentaffairs.apu.edu.my/', // no ticket
    img: 'assets/img/student_affairs.png',
    role: Role.Student,
    tags: []
  },
  {
    id: 'student-handbook' as const,
    title: 'Student Handbook',
    group: 'Campus Life',
    img: 'assets/img/handbook.png',
    url: 'http://kb.sites.apiit.edu.my/knowledge-base/student-handbook/', // no ticket
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'transport-parking' as const,
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
    id: 'apix-erp-legacy' as const,
    title: 'APiX / ERP (Legacy)',
    group: 'Academic Operation',
    url: 'https://erp.apiit.edu.my/easymoo/web/en/auth/security/login',
    img: 'assets/img/apix.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['exception', 'feedback', 'legacy', 'old']
  },
  {
    id: 'aplc-progress-report' as const,
    title: 'APLC Progress Report',
    group: 'Academic Operation',
    url: 'aplc-progress-report',
    img: 'assets/img/aplc-progress-report.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['progression']
  },
  // {
  //   id: 'aptime' as const,
  //   title: 'APTime',
  //   group: 'Academic Operation',
  //   url: 'aplc-progress-report',
  //   img: 'assets/img/aplc-progress-report.png',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: []
  // },
  {
    id: 'beapu' as const,
    title: 'BeAPU',
    group: 'Academic Operation',
    url: 'beapu',
    img: 'assets/img/beapu.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['report', 'attire', 'formal']
  },
  {
    id: 'dingdong' as const,
    title: 'DingDong',
    group: 'Academic Operation',
    url: 'https://dingdong.apu.edu.my/login', // no ticket
    img: 'assets/img/dingdong.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['message', 'sms', 'email', 'push', 'notification', 'announce']
  },
  {
    id: 'e-orientation' as const,
    title: 'E-Orientation',
    group: 'Academic Operation',
    url: 'orientation-student-portal',
    attachTicket: true,
    img: 'assets/img/counseling.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['orientation', 'counsellor']
  },
  {
    id: 'exam-schedule-admin' as const,
    title: 'Exam Schedule (Admin)',
    group: 'Academic Operation',
    url: 'exam-schedule-admin',
    img: 'assets/img/exam-schedule-admin.png',
    role: Role.Admin,
    tags: []
  },
  {
    id: 'exam-paper-scheduling' as const,
    title: 'Exam Paper Scheduling',
    group: 'Academic Operation',
    url: 'https://examscheduling.apu.edu.my/epaperschedule/login_page.asp', // no ticket
    img: 'assets/img/exam-scheduling.png',
    role: Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'graduation-verification-service' as const,
    title: 'Graduation Verification Service',
    group: 'Academic Operation',
    url: 'graduate-verification-service',
    img: 'assets/img/graduate-verification-service.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'mentorship' as const,
    title: 'Mentorship',
    group: 'Academic Operation',
    url: 'mentorship',
    img: 'assets/img/mentorship.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['mentor', 'mentee', 'performance', 'attendance', 'results', 'my students']
  },
  {
    id: 'monthly-returns' as const,
    title: 'Monthly Returns',
    group: 'Academic Operation',
    url: 'https://monthlyreturns.apiit.edu.my', // no tickets
    img: 'assets/img/monthly-returns.png',
    role: Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'my-reports-panel' as const,
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
    id: 'corporate-communication' as const,
    title: 'Corporate Communication',
    group: 'Corporate',
    url: 'http://apiitgroupcomm.sites.apiit.edu.my/', // no ticket
    img: 'assets/img/corcum.png',
    role: Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'human-resource' as const,
    title: 'Human Resource',
    group: 'Corporate',
    url: 'hr',
    img: 'assets/img/hr.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['leave', 'break', 'mc']
  },
  {
    id: 'quality-procedure' as const,
    title: 'Quality Procedure',
    group: 'Corporate',
    url: 'http://kb.sites.apiit.edu.my/knowledge-base/quality-procedures-information-and-personal-data-protection/', // no ticket
    img: 'assets/img/quality.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['rules']
  },
  {
    id: 'report-an-exception-legacy' as const,
    title: 'Report an Exception (Legacy)',
    group: 'Corporate',
    url: 'http://asterix.apiit.edu.my/exception/login.jsp',
    img: 'assets/img/filing-report.png',
    role: Role.Lecturer | Role.Admin,
    tags: ['report', 'admin', 'exception']
  },
  // END OF Corporate

  // START OF Academic & Enrollment
  {
    id: 'attendance' as const,
    title: 'Attendance',
    group: 'Academic & Enrollment',
    url: 'attendance',
    img: 'assets/img/attendance.png',
    role: Role.Student,
    tags: []
  },
  // {
  //   id: 'course-progression-pathway' as const,
  //   title: 'Course Progression Pathway',
  //   group: 'Academic & Enrollment',
  //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
  //   img: 'assets/img/reports.png',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: ['report', 'admin', 'jasper']
  // },
  {
    id: 'course-schedule' as const,
    title: 'Course Schedule',
    group: 'Academic & Enrollment',
    url: 'http://kb.sites.apiit.edu.my/knowledge-base/course-schedule/',
    img: 'assets/img/course-schedule.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'exam-schedule' as const,
    title: 'Exam Schedule',
    group: 'Academic & Enrollment',
    url: 'exam-schedule',
    img: 'assets/img/exam-schedule.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'fyp-bank' as const,
    title: 'FYP Bank Homepage',
    group: 'Academic & Enrollment',
    url: 'https://fypbank.apiit.edu.my/', // no ticket
    img: 'assets/img/fyp.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['fyp', 'bank', 'final project', 'project']
  },
  {
    id: 'intake-calendar' as const,
    title: 'Intake Calendar',
    group: 'Academic & Enrollment',
    url: 'http://www.apu.edu.my/study-apu/intake-calendar', // no ticket
    img: 'assets/img/intake-calendar.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['intake date', 'intake duration', 'next intake']
  },
  // {
  //   id: 'module-appraisal' as const,
  //   title: 'Module Appraisal',
  //   group: 'Academic & Enrollment',
  //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
  //   img: 'assets/img/reports.png',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: ['report', 'admin', 'jasper']
  // },
  {
    id: 'moodle' as const,
    title: 'Moodle (Course Material)',
    group: 'Academic & Enrollment',
    url: 'https://lms2.apiit.edu.my/login/index.php', // with ticket
    img: 'assets/img/moodle.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    attachTicket: true,
    tags: ['material', 'modules', 'lecturer note', 'assignment']
  },
  {
    id: 'lecturer-timetable' as const,
    title: 'My Timetable',
    group: 'Academic & Enrollment',
    url: 'lecturer-timetable',
    img: 'assets/img/timetable.png',
    role: Role.Lecturer,
    tags: ['class', 'schedule']
  },
  {
    id: 'pgd-bank' as const,
    title: 'PGD Bank Homepage',
    group: 'Academic & Enrollment',
    url: 'https://pgd.apiit.edu.my/', // no ticket
    img: 'assets/img/fyp.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['fyp', 'bank', 'final project', 'project']
  },
  {
    id: 'results' as const,
    title: 'Results',
    group: 'Academic & Enrollment',
    url: 'results',
    img: 'assets/img/results.png',
    role: Role.Student,
    tags: ['marks']
  },
  {
    id: 'students-results' as const,
    title: 'Students\' Results',
    group: 'Academic & Enrollment',
    url: 'students-results',
    img: 'assets/img/results.png',
    role: Role.Lecturer | Role.Admin,
    canAccess: true,
    tags: ['marks', 'web results']
  },
  {
    id: 'student-timetable' as const,
    title: 'Timetable',
    group: 'Academic & Enrollment',
    url: 'student-timetable',
    img: 'assets/img/timetable.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['class', 'schedule', 'break']
  },
  // END OF Academic & Enrollment

  // START OF Career Centre & Corporate Training
  {
    id: 'corporate-training' as const,
    title: 'Corporate Training Homepage',
    group: 'Career Centre & Corporate Training',
    url: 'http://training.apiit.edu.my/', // no ticket
    img: 'assets/img/training.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'aplink-student' as const,
    title: 'APLink',
    group: 'Career Centre & Corporate Training',
    url: 'https://apu-joblink-csm.symplicity.com/students/', // no ticket
    img: 'assets/img/aplink.png',
    role: Role.Student,
    tags: []
  },
  {
    id: 'aplink-staff' as const,
    title: 'APLink',
    group: 'Career Centre & Corporate Training',
    url: 'https://apu-joblink-csm.symplicity.com/sso/faculty/', // no ticket
    img: 'assets/img/aplink.png',
    role: Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'career-centre-facebook' as const,
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
  //   id: 'about' as const,
  //   title: 'About',
  //   group: 'Others',
  //   url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
  //   img: 'assets/img/reports.png',
  //   role: Role.Student | Role.Lecturer | Role.Admin,
  //   tags: ['report', 'admin', 'jasper']
  // },
  {
    id: 'classroom-finder' as const,
    title: 'Classroom Finder',
    group: 'Others',
    url: 'classroom-finder',
    img: 'assets/img/classroom-finder.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['empty', 'class', 'lab', 'auditorium', 'workshop', 'room']
  },
  {
    id: 'profile' as const,
    title: 'Profile',
    group: 'Others',
    url: 'profile',
    img: 'assets/img/profile.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['mentor', 'programme leader', 'visa']
  },
  {
    id: 'settings' as const,
    title: 'Settings',
    group: 'Others',
    url: 'settings',
    img: 'assets/img/settings.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: []
  },
  {
    id: 'staff-directory' as const,
    title: 'Staff Directory',
    group: 'Others',
    url: 'staffs',
    img: 'assets/img/staff-directory.png',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['lecturer', 'academic', 'teacher']
  },
  {
    id: 'track-student-visa-status' as const,
    title: 'Track Student Visa Status',
    group: 'Others',
    url: 'visa-status',
    img: 'assets/img/visa-status.png',
    role: Role.Admin,
    tags: ['visa']
  },
  {
    id: 'about-us' as const,
    title: 'About Us',
    group: 'Others',
    url: 'about-us',
    role: Role.Student | Role.Lecturer | Role.Admin,
    tags: ['about', 'developer', 'contact', 'version', 'cti']
  },
  {
    id: 'logout' as const,
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
  //   id: 'upcoming-gradutation' as const,
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

export const menus = menusRaw as MenuItem[];
