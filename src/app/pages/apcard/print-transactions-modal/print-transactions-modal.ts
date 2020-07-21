import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { Apcard } from 'src/app/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'print-transactions-modal-modal',
  templateUrl: 'print-transactions-modal.html',
})
export class PrintTransactionsModalPage implements OnInit {
  loading: HTMLIonLoadingElement;
  transactions: Apcard[];
  now = new Date();
  max = moment(this.now).format('YYYY-MM-DD').toString();
  transactionTypes = ['all', 'credit', 'debit'];
  transactionTypeModel = '';
  yearMonthModel = '';
  pdfObj = null; // used to generate report
  tableBody: any;
  summaryBody: any;
  noRecordsForSelectedMonth = false;
  pdfTitle = '';

  ngOnInit() { }

  constructor(
    private modalCtrl: ModalController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private loadingCtrl: LoadingController
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  generatePdf() {
    this.presentLoading();
    const yearMonthDate = new Date(this.yearMonthModel);
    let numberOfItems = 0, totalSpent = 0, totalTopup = 0;
    // let firstTransaction: Apcard;
    // let lastTransaction: Apcard;
    this.tableBody = [ // empty the list whenever there is an update
      [
        { text: '#', bold: true, style: 'tableHeader' },
        { text: 'Date', bold: true, style: 'tableHeader' },
        { text: 'Time', bold: true, style: 'tableHeader', alignment: 'center' },
        { text: 'Item', bold: true, style: 'tableHeader' },
        { text: 'Value', bold: true, style: 'tableHeader', alignment: 'center' },
      ]
    ];
    this.transactions.filter(transaction => {
      const spendDateObj = new Date(transaction.SpendDate);
      return (spendDateObj.getMonth() === yearMonthDate.getMonth() && spendDateObj.getFullYear() === yearMonthDate.getFullYear()) &&
        (this.transactionTypeModel === 'credit'
          ? transaction.ItemName.toLowerCase() === 'top up'
          : this.transactionTypeModel === 'debit'
            ? transaction.ItemName.toLowerCase() !== 'top up'
            : true
        );

    }).reverse().forEach((transaction, index: number) => {
      const studentData = [
        { text: index + 1, alignment: 'center', style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: moment(new Date(transaction.SpendDate)).format('YYYY-MM-DD'), style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: transaction.SpendTime, alignment: 'center', style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: transaction.ItemName, style: transaction.ItemName === 'Top Up' ? 'greenText' : 'tableCell' },
        { text: Math.abs(transaction.SpendVal), alignment: 'center', style: transaction.ItemName === 'Top Up' ? 'greenText' : 'redText' },
      ];
      numberOfItems += 1;
      totalSpent += transaction.ItemName.toLowerCase() !== 'Top Up'.toLowerCase() ? Math.abs(transaction.SpendVal) : 0;
      totalTopup += transaction.ItemName.toLowerCase() === 'Top Up'.toLowerCase() ? Math.abs(transaction.SpendVal) : 0;
      // if (index === 0) { // first transaction
      //   firstTransaction = transaction;
      // }
      // if (index === array.length - 1) { // last transaction
      //   lastTransaction = transaction;
      // }
      this.tableBody.push(studentData);
    });

    if (this.tableBody.length === 1) {
      this.dismissLoading();
      this.noRecordsForSelectedMonth = true;
      return false;
    }

    this.pdfTitle = `${this.transactionTypeModel}_apcard_transactions_for_${yearMonthDate.getFullYear()}_${yearMonthDate.getMonth() + 1}`;

    const docDefinition = {
      info: {
        title: this.pdfTitle,
        author: 'APSpace_Reports',
        subject: `APCard @ ${this.now.toString()}`,
        keywords: 'APCard APSpace Reports',
        creator: 'APSpace_Reports',
        producer: 'APSpace_Reports',
        creationDate: this.now.toDateString(),
        modDate: this.now.toDateString()
      },
      content: [
        {
          text: 'APIIT Education Group',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: 'APCard Transactions Monthly Report',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: `Report for ${moment(yearMonthDate.getMonth() + 1, 'M').format('MMMM').toString()}, ${yearMonthDate.getFullYear()}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },

        {
          text: this.transactionTypeModel === 'credit' ? '** Credit Only **' : this.transactionTypeModel === 'debit' ? '** Debit Only **' : '',
          style: this.transactionTypeModel === 'credit' ? 'green_subheader' : this.transactionTypeModel === 'debit' ? 'red_subheader' : '',
          alignment: 'center',
          margin: this.transactionTypeModel === 'all' ? [0, 0, 0, 0] : [0, 10, 0, 0]
        },

        { text: '', margin: [5, 20, 5, 10] },

        {
          layout: 'noBorders',
          fillColor: '#dbdbdb',
          color: '#000000',
          table: {
            headerRows: 1,
            widths: ['70%', '30%'],
            body: [
              [
                { text: 'Student ID', bold: true, margin: [5, 5, 5, 5] },
                { text: this.transactions[0].SNO, alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                { text: 'Number of items', bold: true, margin: [5, 5, 5, 5] },

                // tslint:disable-next-line: max-line-length
                { text: (numberOfItems === 1 ? numberOfItems + ' Item' : numberOfItems + ' Items'), alignment: 'right', margin: [5, 5, 5, 5] }
              ],
              [
                { text: 'Total debit in the month:', bold: true, margin: [5, 5, 5, 5] },
                { text: ('RM' + totalSpent.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5], color: '#e54d42' }
              ],
              [
                { text: 'Total credit in the month:', bold: true, margin: [5, 5, 5, 5] },
                { text: ('RM' + totalTopup.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5], color: '#346948' }
              ],
              // [
              //   { text: 'Balance At the begining of the month:', bold: true, margin: [5, 5, 5, 5] },
              //   { text: ('RM' + firstTransaction.Balance.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5] }
              // ],
              // [
              //   { text: 'Balance At the end of the month:', bold: true, margin: [5, 5, 5, 5] },
              //   { text: ('RM' + lastTransaction.Balance.toFixed(2)), alignment: 'right', margin: [5, 5, 5, 5] }
              // ]
            ],
            pageBreak: 'after'
          }
        },

        { text: '', margin: [5, 20, 5, 10] },


        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*', 'auto'],
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
        green_subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
          color: '#346948'
        },
        red_subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0],
          color: '#e54d42'
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
          color: '#346948',
          fillColor: '#e4f7e9',
          margin: [5, 5, 5, 5]
        },
        redText: {
          color: '#e54d42',
          margin: [5, 5, 5, 5]
        },
        blueText: {
          color: '#3a99d9'
        }
      }
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadFile();
    // this.pdfObj.download(pdfTitle + '.pdf');
  }

  downloadFile() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, `${this.pdfTitle}.pdf`, blob, { replace: true }).then(_ => {
          // Open the PDf with the correct OS tools
          this.dismissLoading();
          this.fileOpener.open(this.file.dataDirectory + `${this.pdfTitle}.pdf`, 'application/pdf');
        });
      });
    } else {
      // On a browser simply use download!
      this.dismissLoading();
      this.pdfObj.download(this.pdfTitle + '.pdf');
    }
  }

}
