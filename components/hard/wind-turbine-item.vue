<template>
  <v-card
    class="ma-1"
    outlined
  >
    <v-card-text class="d-inline-flex text-h6">
      {{ wind.identy }}
      <v-spacer />
      <v-btn
        icon
        :disabled="lastItem === undefined"
        @click="doCalibrate"
      >
        <v-icon color="amber darken-4">
          mdi-vanity-light
        </v-icon>
      </v-btn>
    </v-card-text>
    <v-card-text v-if="lastItem !== undefined">
      {{ currentFmtVal }}&nbsp;/
      &nbsp;<span class="orange--text text--darken-4">{{ calibrationFmtVal }}</span>&nbsp;/
      &nbsp;<b>{{ actualFmtVal }}</b>&nbsp;/
      &nbsp;<span class="light-blue--text text--darken-4">{{ percentFmtVal }}</span>%
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
import {
  API_WIND_SERVICE_CALIBRATE,
  round
} from '~/assets/helpers'
import { CHART_SLICES_OPTIONS } from '~/assets/charts'

export default {
  name: 'WindTurbineItemCmp',

  components: { ForecastChart },

  props: {
    wind: {
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
      return this.lastItem !== undefined ? this.valueLocale(this.lastItem.data.value) : undefined
    },
    percentFmtVal () {
      return this.lastItem !== undefined ? this.valueLocale(this.lastItem.data.percent) : undefined
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
          }
        ]
      }
    },
    chartOptions: () => CHART_SLICES_OPTIONS
  },

  watch: {
    lastSlice (v) {
      if (v.data.key === this.wind.devaddr) {
        this.updateItem()
      }
    }
  },

  created () {
    this.updateItem()
  },

  methods: {
    updateItem () {
      this.items = this.$store.state.timeSlices[this.wind.devaddr]
      this.lastItem = this.items !== undefined ? this.items[this.items.length - 1] : undefined

      if (this.items !== undefined && this.items.length > 2) {
        this.chartPoints = this.items.map(e => ({ point: e.timestamp, value: e.data.percent }))
      } else {
        this.chartPoints = []
      }
    },

    valueLocale (val) {
      return this.fmtLocale.format(round(val, 1))
    },

    doCalibrate () {
      this.$axios.$put(API_WIND_SERVICE_CALIBRATE + '/' + this.wind.devaddr, undefined, { progress: false })
        // .then((v) => {})
        .catch((error) => {
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
    }
  }
}
</script>
