<template>
  <v-card
    class="ma-1"
    outlined
  >
    <v-card-text class="d-inline-flex text-h6">
      {{ solar.identy }}
      <v-spacer />
      <v-btn
        icon
      >
        <v-icon color="amber darken-4">
          mdi-vanity-light
        </v-icon>
      </v-btn>
    </v-card-text>
    <v-card-text v-if="lastItem !== undefined">
      {{ currentFmtVal }}&nbsp;/&nbsp;{{ calibrationFmtVal }}&nbsp;/&nbsp;<b>{{ actualFmtVal }}</b>
    </v-card-text>
    <v-card-text v-else>
      нет данных
    </v-card-text>
    <v-card-text v-if="chartPoints.length > 0">
      <ForecastChart :chart-data="chartData" :chart-options="chartOptions" :width="250" />
    </v-card-text>
  </v-card>
</template>

<script>
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { round } from '~/assets/helpers'
import { CHART_SLICES_OPTIONS } from '~/assets/charts'

export default {
  name: 'SolarCellItemCmp',

  components: { ForecastChart },

  props: {
    solar: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    items: undefined,
    lastItem: undefined,
    fmtLocale: new Intl.NumberFormat('ru-RU'),
    chartPoints: []
  }),

  computed: {
    lastSlice () {
      return this.$store.state.lastSlice
    },
    currentFmtVal () {
      return this.lastItem !== undefined ? this.valueLocale(this.lastItem.data.value) : undefined
    },
    calibrationFmtVal () {
      return this.lastItem !== undefined ? this.valueLocale(this.lastItem.data.calibration) : undefined
    },
    actualFmtVal () {
      if (this.lastItem !== undefined) {
        const val = this.lastItem.data.value - this.lastItem.data.calibration
        return this.lastItem !== undefined ? this.valueLocale(val < 0.0 ? 0.0 : val) : undefined
      }
      return undefined
    },

    chartData () {
      return {
        datasets: [
          {
            data: this.chartPoints,
            borderColor: '#B0BEC5',
            borderWidth: 2,
            stepped: true,
            radius: 0,
            hoverRadius: 0,
            hitRadius: 0
            // borderDash: [2, 2]
          }
        ]
      }
    },
    chartOptions: () => CHART_SLICES_OPTIONS
  },

  watch: {
    lastSlice (v) {
      if (v.data.key === this.solar.devaddr) {
        this.updateItem()
      }
    }
  },

  created () {
    this.updateItem()
  },

  methods: {
    updateItem () {
      this.items = this.$store.state.timeSlices[this.solar.devaddr]
      this.lastItem = this.items !== undefined ? this.items[this.items.length - 1] : undefined

      if (this.items !== undefined && this.items.length > 2) {
        this.chartPoints = this.items.map(e => ({ point: e.timestamp, value: e.data.value }))
      } else {
        this.chartPoints = []
      }
    },

    valueLocale (val) {
      return this.fmtLocale.format(round(val, 1))
    }
  }
}
</script>
