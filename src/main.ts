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
    <h3>Lab1: Source Format Test</h3>
    <div class="content" role="main">
    <div id="plot_div"></div>
    </div>
    <h3>Lab2: Local CSV to Dataframe</h3>
    <div class="content" role="main">
    <div id="div3"></div>
    <div id="div1"></div>
    <div id="div2"></div>
    </div>
  `,
})
export class App {
  title = 'Danfojs Lab';

  // public applArray: AAPL[] = [];
  public csvHeader: string[] = [];
  public csv2dArr: any = [];
  constructor(private http: HttpClient) {}

  public ngOnInit() {
    // test source format
    this.lab1();
    // test source coming from local CSV file
    this.lab2();
  }

  lab1() {
    // Ref. https://danfo.jsdata.org/api-reference/dataframe/creating-a-dataframe
    // dataframe source: json
    const df1 = new dfd.DataFrame(
      {
        pig: [20, 18, 489, 675, 1776],
        horse: [4, 25, 281, 600, 1900],
      },
      {
        index: [1990, 1997, 2003, 2009, 2014],
      }
    );
    // df1.head().print(); // Print to console
    const s1 = new dfd.Series([1, 3, 2, 6, 10, 34, 40, 51, 90, 75]);
    // s1.print(); // Print to console
    df1['plot']('plot_div').line();

    // dataframe source: 2d array
    // dataframe2: dataframe input from assets/csv via http
    let data2 = [
      [1, 2.3, 3, 4, 5, 'girl'],
      [30, 40.1, 39, 89, 78, 'boy'],
    ];
    let df2 = new dfd.DataFrame(data2, {
      columns: ['a', 'b', 'c', 'd', 'e', 'f'],
      config: {
        lowMemoryMode: true,
      },
    });
    // df2.print();
    // console.log(dfd.toJSON(df2));
    console.log(dfd.toCSV(df2));
    /* js edition
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

  lab2() {
    this.http.get('assets/2015-AAPL.csv', { responseType: 'text' }).subscribe(
      (data) => {
        let csvToRowArray = data.split('\n');
        this.csvHeader = csvToRowArray[0].split(',');
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(',');
          // Note. Object array will not work in dataframe source
          /*
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
          */
          // set another dataset
          this.csv2dArr.push(row);
        }
        // console.log(this.applArray);
        // console.log(this.csv2dArr);
        let df = new dfd.DataFrame(this.csv2dArr, {
          columns: this.csvHeader,
          config: {
            lowMemoryMode: true,
          },
        });
        // df.print();
        df['AAPL.Open'].plot('div1').box(); //makes a box plot
        df.plot('div2').table(); //display csv as table
        // Line Chart Config
        // Ref. https://danfo.jsdata.org/api-reference/plotting/configuring-your-plots
        const layout = {
          title: {
            text: 'Time series plot of AAPL open and close points',
            x: 0,
          },
          legend: {
            bgcolor: '#fcba03',
            bordercolor: '#444',
            borderwidth: 1,
            font: { family: 'Arial', size: 10, color: '#fff' },
          },
          width: 1000,
          yaxis: {
            title: 'AAPL open points',
          },
          xaxis: {
            title: 'Date',
          },
        };

        const config = {
          columns: ['AAPL.Open', 'AAPL.Close'], //columns to plot
          displayModeBar: true,
          displaylogo: false,
        };
        // df['AAPL.Close'].plot('div3').line();
        df.plot('div3').line({ layout, config });
      },
      (error) => {
        console.log(error);
      }
    );
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
