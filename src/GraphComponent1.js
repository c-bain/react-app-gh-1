import React from 'react';
import CanvasJSReact from './canvasjs.react';
import csvFile from './curepak-combined.csv';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class GraphComponent1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: null,
    };
  }

  componentDidMount() {
    fetch(csvFile)
      .then((res) => res.text())
      .then((text) => {
        // console.log(text);
        const dataPoints = [];
        const csvLines = text.split(/[\r?\n|\r|\n]+/);
        console.log(csvLines);
        for (let i = 1; i < csvLines.length; i += 1) {
          if (csvLines[i].length > 0) {
            const points = csvLines[i].split(',');
            const x = parseInt(points[1], 10) * 1000;
            const y = parseFloat(points[5], 10);
            dataPoints.push({
              x,
              y,
              toolTipContent: `Time: ${CanvasJS.formatDate(x, 'MMM DD/YY, HH:mm')} <br/> reading: ${y}`,
            });
          }
        }
        this.setState({
          graphData: dataPoints,
        });
      });
  }

  render() {
    const { graphData } = this.state;
    if (!graphData) {
      return '';
    }
    // const getDataPointsFromCSV = (csv) => {
    //   // fetch('./combined-csv-files-part1.csv')
    //   // .then((res) => console.log(res));
    //   var dataPoints = csvLines = points = [];
    //   csvLines = csv.split(/[\r?\n|\r|\n]+/);

    //   for (var i = 0; i < csvLines.length; i++)
    //     if (csvLines[i].length > 0) {
    //       points = csvLines[i].split(",");
    //       dataPoints.push({
    //         x: parseFloat(points[0]),
    //         y: parseFloat(points[1])
    //       });
    //     }
    //   return dataPoints;
    // };

    const options = {
      zoomEnabled: true,
      title: {
        text: 'Curepak readings',
      },
      axisX: {
        title: 'Date',
        // minimum: 1636606800000,
        // maximum: 1636693140000,
        labelFormatter: (e) => CanvasJS.formatDate(e.value, 'DD MM YYYY hh:mm ss'),
      },
      axisY: {
        title: 'Reading',
      },
      data: [{
        type: 'column',
        xValueType: 'dateTime',
        dataPoints: graphData,
      }],
    };

    return (
      <div>
        <CanvasJSChart options={options} />
      </div>
    );
  }
}

export default GraphComponent1;
