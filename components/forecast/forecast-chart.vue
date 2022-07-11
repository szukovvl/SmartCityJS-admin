<script>
import { Line } from 'vue-chartjs'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'

Chart.register(CategoryScale)

export default {
  extends: Line,

  props: {
    chartData: {
      type: Object,
      default: null
    },
    chartOptions: {
      type: Object,
      default: null
    }
  }
}
</script>
