//
import moment from 'moment'
//
export const CHART_OPTIONS = {
  responsive: true,
  animation: false,
  parsing: {
    xAxisKey: 'point',
    yAxisKey: 'value'
  },
  plugins: {
    legend: {
      display: false,
      position: 'top'
    },
    title: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    x: {
      display: true,
      type: 'time',
      time: {
        tooltipFormat: 'HH:mm',
        displayFormats: {
          hour: 'HH:mm'
        },
        unit: 'hour',
        parser: value => moment(value, 'HH:mm')
      },
      title: {
        display: false
      }
    },
    y: {
      display: true,
      title: {
        display: false
      }
    }
  }
}
