//
import moment from 'moment'
//
export const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top'
    },
    title: {
      display: false
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
