import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as dfd from 'danfojs';

@Component({
  selector: 'danfo-lab',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h1>{{ title }} !</h1>
    <a target="_blank" href="https://danfo.jsdata.org/getting-started">
      Learn more about Danfo.js 
    </a>
    <div class="content" role="main">
    <div id="plot_div"></div>
    </div>
  `,
})
export class App {
  title = 'Danfojs Lab';

  public applArray: AAPL[] = [];
  public csvHeader: string[] = [];
  // public csv2dArr = [[]];
  constructor(private http: HttpClient) {
    this.http.get('assets/2015-AAPL.csv', { responseType: 'text' }).subscribe(
      (data) => {
        // console.log(data);
        let csvToRowArray = data.split('\n');
        this.csvHeader = csvToRowArray[0].split(',');
        // console.log(this.csvHeader);
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(',');
          this.applArray.push(
            new AAPL(
              row[0].trim(),
              parseFloat(row[1]),
              parseFloat(row[2]),
              parseFloat(row[3]),
              parseFloat(row[4]),
              parseFloat(row[5]),
              parseFloat(row[6]),
              parseFloat(row[7]),
              parseFloat(row[8]),
              parseFloat(row[9]),
              row[10].replace(/\s/g, '') // to trim
            )
          );
        }
        console.log(this.applArray);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public ngOnInit() {
    // dataframe1: dataframe input in code
    const df1 = new dfd.DataFrame(
      { pig: [20, 18, 489, 675, 1776], horse: [4, 25, 281, 600, 1900] },
      { index: [1990, 1997, 2003, 2009, 2014] }
    );
    // df1.head().print(); // Print to console
    const s1 = new dfd.Series([1, 3, 2, 6, 10, 34, 40, 51, 90, 75]);
    // s1.print(); // Print to console
    df1['plot']('plot_div').line();

    // dataframe2: dataframe input from assets/csv via http
    let df2 = new dfd.DataFrame(this.applArray, {
      columns: this.csvHeader,
    });
    console.log(df2);
    /*
    const df3 = dfd
      .readCSV(
        'https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv'
      )
      .then((df0: any) => {
        // df0['AAPL.Open'].plot('div1').box(); //makes a box plot

        // df0.plot('div2').table(); //display csv as table

        const new_df = df0.set_index({ key: 'Date' }); //resets the index to Date column
        new_df.plot('div3').line({ columns: ['AAPL.Open', 'AAPL.High'] }); //makes a timeseries plot

        // df is "314.578 KiB"
        df0.describe().print();
        console.log(df0);
      })
      .catch((err: any) => {
        console.log(err);
      });
    */
    /*
    const df2 = new dfd.DataFrame();
    df2
      .readCSV(
        'https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv'
      )
      .then((df: any) => {
        df['AAPL.Open'].plot('div1').box(); //makes a box plot

        df.plot('div2').table(); //display csv as table

        const new_df = df.set_index({ key: 'Date' }); //resets the index to Date column
        new_df.plot('div3').line({ columns: ['AAPL.Open', 'AAPL.High'] }); //makes a timeseries plot

        // df is "314.578 KiB"
      })
      .catch((err: any) => {
        console.log(err);
      });
      */
  }
}

export class AAPL {
  // Date,AAPL.Open,AAPL.High,AAPL.Low,AAPL.Close,AAPL.Volume,AAPL.Adjusted,dn,mavg,up,direction
  date: String;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted: number;
  dn: number;
  mavg: number;
  up: number;
  direction: String;

  constructor(
    date: String,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    adjusted: number,
    dn: number,
    mavg: number,
    up: number,
    direction: String
  ) {
    this.date = date;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
    this.adjusted = adjusted;
    this.dn = dn;
    this.mavg = mavg;
    this.up = up;
    this.direction = direction;
  }
}

bootstrapApplication(App);
