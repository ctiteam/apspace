import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Apcard } from 'src/app/interfaces';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'print-transactions-modal-modal',
  templateUrl: 'print-transactions-modal.html',
})
export class PrintTransactionsModalPage implements OnInit {
  transactions: Apcard[];
  now = new Date();
  max = moment(this.now).format('YYYY-MM-DD').toString();
  transactionTypes = ['All', 'Credit', 'Debit'];

  transactionTypeModel = '';
  yearMonthModel = '';
  pdfObj = null; // used to generate report
  tableBody: any;
  summaryBody: any;
  ngOnInit() {
    console.log(this.transactions);
    console.log(this.max);
    // console.log(this.now.getFullYear() + '-' + this.now.getMonth() + '-' + this.now.getDate());
  }

  constructor(private modalCtrl: ModalController) {
    // this.item = this.params.get('item');
  }

  ionViewWillEnter() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  generatePdf() {
    const yearMonthDate = new Date(this.yearMonthModel);
    let numberOfItems = 0, totalSpent = 0, totalTopup = 0;
    // let firstItem: any;
    // let lastItem: any;
    this.tableBody = [ // empty the list whenever there is an update
      [
        { text: 'Date', bold: true, style: 'tableHeader' },
        { text: 'Time', bold: true, style: 'tableHeader', alignment: 'center' },
        { text: 'Item', bold: true, style: 'tableHeader' },
        { text: 'Value', bold: true, style: 'tableHeader', alignment: 'center' },
      ]
    ];
    this.transactions.filter(transaction => {
      const spendDateObj = new Date(transaction.SpendDate);
      return (spendDateObj.getMonth() === yearMonthDate.getMonth() && spendDateObj.getFullYear() === yearMonthDate.getFullYear());
    }).forEach((transaction, index: number) => {
      const studentData = [
        { text: moment(new Date(transaction.SpendDate)).format('YYYY-MM-DD'), style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: transaction.SpendTime, alignment: 'center', style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: transaction.ItemName, style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: Math.abs(transaction.SpendVal), alignment: 'center', style: transaction.ItemName === 'Top Up' ? 'greenText' : 'redText' },
      ];
      numberOfItems += 1;
      totalSpent += transaction.ItemName.toLowerCase() !== 'Top Up'.toLowerCase() ? Math.abs(transaction.SpendVal) : 0;
      totalTopup += transaction.ItemName.toLowerCase() === 'Top Up'.toLowerCase() ? Math.abs(transaction.SpendVal) : 0;
      if (index === 0) {
        console.log('first transaction: ', transaction);
      }
      if (index === this.transactions.length - 1) {
        console.log('last transaction: ', transaction);
      }
      this.tableBody.push(studentData);
    });

    if (this.tableBody.length === 1) {
      console.log('no transactions at that month');
      return false;
    }


    this.summaryBody = [
      [
        { text: 'Student ID', bold: true, margin: [5, 5, 5, 5] },
        { text: this.transactions[0].SNO, alignment: 'right', margin: [5, 5, 5, 5] }
      ],
      [
        { text: 'Date Range', bold: true, margin: [5, 5, 5, 5] },
        {
          text: `${yearMonthDate.getFullYear()}/${yearMonthDate.getMonth() + 1}/1 - ${yearMonthDate.getFullYear()}/${yearMonthDate.getMonth() + 1}/${new Date(yearMonthDate.getFullYear(), yearMonthDate.getMonth() + 1, 0).getDate()}`,
          alignment: 'right', margin: [5, 5, 5, 5]
        }
      ],
      [
        { text: 'Number of items', bold: true, margin: [5, 5, 5, 5] },
        { text: (numberOfItems === 1 ? numberOfItems + ' Item' : numberOfItems + ' Items'), alignment: 'right', margin: [5, 5, 5, 5] }
      ],
      [
        { text: 'Total spent in the month:', bold: true, margin: [5, 5, 5, 5] },
        { text: ('RM' + totalSpent.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5] }
      ],
      [
        { text: 'Total topup in the month:', bold: true, margin: [5, 5, 5, 5] },
        { text: ('RM' + totalTopup.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5] }
      ],
      [
        { text: 'Balance At the begining of the month:', bold: true, margin: [5, 5, 5, 5] },
        { text: 'test', alignment: 'right', margin: [5, 5, 5, 5] }
      ],
      [
        { text: 'Balance At the end of the month:', bold: true, margin: [5, 5, 5, 5] },
        { text: 'test', alignment: 'right', margin: [5, 5, 5, 5] }
      ]
    ];

    const pdfTitle = `apcard_transactions_for_${yearMonthDate.getFullYear()}_${yearMonthDate.getMonth() + 1}`;

    const docDefinition = {
      info: {
        title: pdfTitle,
        author: 'APSpace_Reports',
        subject: 'APCard Transactions Report',
        keywords: 'APCard APSpace Reports',
        creator: 'APSpace_Reports',
        producer: 'APSpace_Reports',
        creationDate: this.now.toDateString(),
        modDate: this.now.toDateString(),
      },
      content: [
        {
          text: 'APIIT Education Group',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: 'APCard Transactions Report',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        { text: '', margin: [5, 20, 5, 10] },

        {
          layout: 'noBorders',
          fillColor: '#49b571',
          color: '#FFFFFF',
          table: {
            headerRows: 1,
            widths: ['70%', '30%'],
            body: this.summaryBody,
            pageBreak: 'after'
          }
        },

        { text: '', margin: [5, 20, 5, 10] },


        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto'],
            body: this.tableBody,
            pageBreak: 'after'
          }
        },

      ],
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            { width: '5%', text: '' },
            {
              width: '75%',
              text: `Generated using APSpace (${this.now.toDateString()})`,
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
          fillColor: '#3a99d9',
          margin: [5, 5, 5, 5]
        },
        tableCell: {
          margin: [5, 5, 5, 5]
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
        },
        greenText: {
          color: '#49b571',
          margin: [5, 5, 5, 5]
        },
        redText: {
          color: '#e54d42',
          margin: [5, 5, 5, 5]
        }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.pdfObj.download(pdfTitle + '.pdf');

  }

}
