<template>
  <v-card
    flat
    tile
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="#008000"
      >
        <v-icon dark>
          mdi-engine-outline
        </v-icon>
      </v-avatar>
      &laquo;{{ generator.identy }}&raquo;
    </v-card-title>
    <div v-if="!forecastEnabled">
      <p class="px-4">
        Мощность генерации <b>{{ energy }}</b> МВт
      </p>
      <p class="px-4">
        Экологический выброс СО2 <b>{{ carbon }}</b> гCO2экв/кВт*час
      </p>
      <p class="px-4">
        Порог высокой нагрузки <b>{{ highload }}</b>
      </p>
      <p class="px-4">
        Порог критической нагрузки <b>{{ criticalload }}</b>
      </p>
      <p class="px-4">
        Время действия критической нагрузки до блэкаута <b>{{ generator.data.blackouttime }}</b> сек.
      </p>
      <p class="px-4">
        Режим использования <b>{{ generationMode.text }}</b>
      </p>
      <p class="px-4">
        Стоимость генерации <b>{{ tariff }}</b> руб/кВт
      </p>
    </div>
    <div
      v-else
      class="d-flex flex-nowrap"
    >
      <div>
        <p class="px-4">
          Экологический выброс СО2 <b>{{ carbon }}</b> гCO2экв/кВт*час
        </p>
        <p class="px-4">
          Порог высокой нагрузки <b>{{ highload }}</b>
        </p>
        <p class="px-4">
          Порог критической нагрузки <b>{{ criticalload }}</b>
        </p>
        <p class="px-4">
          Время действия критической нагрузки до блэкаута <b>{{ generator.data.blackouttime }}</b> сек.
        </p>
        <p class="px-4">
          Режим использования <b>{{ generationMode.text }}</b>
        </p>
        <p class="px-4">
          Стоимость генерации <b>{{ tariff }}</b> руб/кВт
        </p>
      </div>
      <div>
        <p class="px-4">
          Мощность потребления <b>{{ energy }}</b> МВт
        </p>
        <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :width="400" />
      </div>
    </div>
  </v-card>
</template>

<script>
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { CHART_OPTIONS } from '~/assets/charts'
import {
  formatValueLocale,
  roundToTwoAsStr,

  GENERATION_USAGE_MODES,

  API_ENERGY_SERVICE_INTERPOLATE
} from '~/assets/helpers'

export default {
  name: 'GeneratorCardComponent',

  components: { ForecastChart },

  props: {
    generator: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    interpolate: [],
    axioError: undefined
  }),

  computed: {
    energy () {
      return formatValueLocale(this.generator.data.energy)
    },
    carbon () {
      return formatValueLocale(this.generator.data.carbon)
    },
    highload () {
      return formatValueLocale(this.generator.data.highload)
    },
    criticalload () {
      return formatValueLocale(this.generator.data.criticalload)
    },
    generationMode () {
      return GENERATION_USAGE_MODES.find(e => e.value === this.generator.data.mode)
    },
    forecastEnabled () {
      return this.generator.data.useforecast && this.generator.data.forecast !== undefined
    },
    tariff () {
      return roundToTwoAsStr(
        this.$store.state.game.tariffs !== undefined
          ? this.$store.state.game.tariffs.t_alternative.resource
          : 0)
    },

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      return {
        datasets: [
          {
            data: this.generator.data.forecast.data.map(e => ({ point: e.point, value: e.value * this.generator.data.energy })),
            borderColor: '#B0BEC5',
            borderWidth: 2,
            stepped: true,
            radius: 0,
            hoverRadius: 0,
            hitRadius: 0,
            borderDash: [2, 2]
          },
          {
            data: this.interpolate,
            backgroundColor: 'rgba(20, 0, 255, 0.3)',
            borderColor: '#03A9F4',
            borderWidth: 2,
            radius: 0,
            hoverRadius: 0,
            hitRadius: 0
          }
        ]
      }
    }
  },

  created () {
    if (process.client) {
      this.doInterpolate()
    }
  },

  methods: {
    doInterpolate () {
      if (!this.forecastEnabled) {
        this.interpolate = []
        return
      }
      this.$axios.$get(API_ENERGY_SERVICE_INTERPOLATE + '/' + this.generator.identy, { progress: false })
        .then((v) => {
          if (v !== undefined) {
            this.interpolate = v.items
          }
        })
        .catch((error) => {
          this.interpolate = []
          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - интерполяция'
          }
        })
    }
  }
}
</script>
