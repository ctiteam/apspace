import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WsApiService } from 'src/app/services';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { APLCClassDescription, APLCStudentBehaviour, APLCStudentBehaviourPDF } from 'src/app/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-progress-report',
  templateUrl: './view-progress-report.page.html',
  styleUrls: ['./view-progress-report.page.scss'],
})
export class ViewProgressReportPage implements OnInit {
  pdfObj = null; // used to generate report
  classDescription: APLCClassDescription[] = [];
  pdfStudentsList: any;
  subjects$: Observable<any>; // to create interface
  classes$: Observable<any>; // to create interface
  scoreLegend$: Observable<any>; // to create interface
  descriptionLegend$: Observable<any>; // to create interface
  classDescription$: Observable<APLCClassDescription[]>;
  studentsBehaviour$: Observable<APLCStudentBehaviour[]>;

  skeletons = new Array(6);
  subjectCode: string;
  classCode: string;

  constructor(
    private ws: WsApiService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.initData();
  }

  initData() { // changed with refresher
    this.subjects$ = this.ws.get<any>(`/aplc/subjects`);
    this.scoreLegend$ = this.ws.get<any[]>(`/aplc/score-legend`, { caching: 'cache-only' });
    this.descriptionLegend$ = this.ws.get<any[]>(`/aplc/description-legend`, { caching: 'cache-only' });
  }

  onSubjectCodeChange() {
    this.classes$ = this.ws.get<any>(`/aplc/classes?subject_code=${this.subjectCode}`).pipe(
      tap(_ => this.classCode = '')
    );
  }

  onClassCodeChange() {
    this.classDescription$ = this.ws.get<APLCClassDescription[]>(`/aplc/class-description?class_code=${this.classCode}`).pipe(
      tap(res => this.classDescription = res)
    );
    this.studentsBehaviour$ = this.ws.get<APLCStudentBehaviour[]>(`/aplc/student-behavior?class_code=${this.classCode}`).pipe(
      tap(_ => this.pdfStudentsList = [ // empty the list whenever there is an update
       [
        { text: 'Student Name', bold: true, style: 'tableHeader' },
        { text: 'Student ID', bold: true, style: 'tableHeader', alignment: 'center' },
        { text: 'Average Score', bold: true, style: 'tableHeader', alignment: 'center'},
        { text: 'Remarks', bold: true, style: 'tableHeader' }
      ]
      ]),
      tap(res => res.forEach(student => {
          const studentData = [
            { text: student.STUDENT_NAME},
            { text: student.STUDENT_NUMBER, alignment: 'center'},
            { text: student.AVERAGE_BEH, alignment: 'center'},
            { text: student.REMARK}
          ];
          this.pdfStudentsList.push(studentData);
      }))
    );
  }

  generateReport() {
    const currentDate = new Date();
    const dateForFileName = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
    const pdfTitle = `PR--${this.classCode}--${dateForFileName}`;

    const docDefinition = {
      info: {
        title: pdfTitle,
        author: this.classDescription[0].LECTURER_NAME,
        subject: 'Progress Report',
        keywords: 'APLC APSpace Reports',
        creator: 'APSpace',
        producer: 'APSpace',
        creationDate: currentDate.toDateString(),
        modDate: currentDate.toDateString(),

      },
      content: [
        {
          text: 'APIIT Education Group',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: 'APLC Progress Report',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: this.classCode,
          style: 'subheader2bold',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: `${this.classDescription[0].SDATE} - ${this.classDescription[0].EDATE}`,
          style: 'subheader2bold',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        { text: '', margin: [5, 20, 5, 10] },

        {
          columns: [
            {
              width: '5%',
              text: ''
            },
            {
              width: '40%',
              alignment: 'center',
              text: 'Lecturer Name',
              style: 'subheader2bold'
            },
            {
              width: '10%',
              text: ''
            },
            {
              width: '40%',
              alignment: 'center',
              text: 'Subject Code',
              style: 'subheader2bold'
            },
            {
              width: '5%',
              text: ''
            },
          ],
          columnGap: 1
        },


        {
          columns: [
            {
              width: '5%',
              text: ''
            },
            {
              width: '40%',
              alignment: 'center',
              text: this.classDescription[0].LECTURER_NAME
            },
            {
              width: '10%',
              text: ''
            },
            {
              width: '40%',
              alignment: 'center',
              text: this.subjectCode
            },
            {
              width: '5%',
              text: ''
            },
          ],
          columnGap: 1,
          margin: [0, 5, 0, 0]
        },

        { text: '', margin: [5, 20, 5, 10] },


        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*'],
            body: this.pdfStudentsList,
            pageBreak: 'after'
          }
        },

        { text: 'Average Score Legend', style: 'subheader', margin: [5, 30, 5, 10] },

        {
          table: {
            headerRows: 1,
            widths: ['auto', '*'],
            body: [
              [{ text: 'Legend', bold: true, style: 'tableHeader' }, { text: 'Description', bold: true, style: 'tableHeader' }],
              [{ text: '1', bold: true, alignment: 'center' }, 'A below average student. Needs improvement as student displays poor attitude or behaviour throughout the intake.'],
              [{ text: '>1-2', bold: true, alignment: 'center' }, 'An average student. Has shown satisfactory or reasonable improvement throughout the intake.'],
              [{ text: '>2-3', bold: true, alignment: 'center' }, 'An excellent student. Has fully shown exceptional development in every aspect throughout the intake.'],
            ],
            pageBreak: 'after'
          }
        }

      ],
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            { width: '5%', text: '' },
            {
              width: '75%',
              text: `Generated using APSpace (${currentDate.toDateString()})`,
              alignment: 'left',
              style: 'greyColor'
            },
            {
              width: '5%',
              text: ''
            },
            {
              width: '10%',
              text: currentPage.toString() + ' of ' + pageCount,
              alignment: 'right',
              style: 'greyColor'
            },
            { width: '5%', text: '' }
          ]
        };
      },

      styles: {
        greyColor: {
          color: '#8a8a8a'
        },
        tableHeader: {
          color: '#FFFFFF',
          fillColor: '#A9A9A9'
        },
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        subheader2bold: {
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        subheader2: {
          fontSize: 12,
          bold: false,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.download(pdfTitle + '.pdf');

  }

}
