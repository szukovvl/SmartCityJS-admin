<template>
  <v-card
    flat
    tile
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="amber darken-3"
      >
        <v-icon dark>
          {{ avatar }}
        </v-icon>
      </v-avatar>
      &laquo;{{ consumer.identy }}&raquo;
    </v-card-title>
    <div v-if="!forecastEnabled">
      <p class="px-4">
        Мощность потребления <b>{{ energy }}</b> МВт
      </p>
      <p class="px-4">
        Экологический выброс СО2 <b>{{ carbon }}</b> гCO2экв/кВт*час
      </p>
      <p class="px-4">
        Электропитание <b>&laquo;{{ voltagelevel }}&raquo;</b>
      </p>
      <p class="px-4">
        <b>{{ catprice }}</b>
      </p>
      <p
        v-for="(item, index) in tariffs"
        :key="'t_' + index + '_' + catprice"
        class="px-4"
      >
        {{ item.text }} <b>{{ item.value }}</b> руб/кВт*ч
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
          Электропитание <b>&laquo;{{ voltagelevel }}&raquo;</b>
        </p>
        <p class="px-4">
          <b>{{ catprice }}</b>
        </p>
        <p
          v-for="(item, index) in tariffs"
          :key="'t_' + index + '_' + catprice"
          class="px-4"
        >
          {{ item.text }} <b>{{ item.value }}</b> руб/кВт*ч
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
  ESO_CONSUMER_TYPE_DISTRICT,
  ESO_CONSUMER_TYPE_INDUSTRY,
  VOLTAGE_LEVELS,
  PRICE_CATEGORIES,
  PRICE_CATEGORIES_CATEGORY_2_2,
  PRICE_CATEGORIES_CATEGORY_2_3,

  formatValueLocale,
  roundToTwoAsStr,

  API_ENERGY_SERVICE_INTERPOLATE
} from '~/assets/helpers'

export default {
  name: 'ConsumerCardComponent',

  components: { ForecastChart },

  props: {
    consumer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    interpolate: [],
    axioError: undefined
  }),

  computed: {
    avatar () {
      switch (this.consumer.data.consumertype) {
        case ESO_CONSUMER_TYPE_DISTRICT: return 'mdi-home-city'
        case ESO_CONSUMER_TYPE_INDUSTRY: return 'mdi-factory'
        default: return 'mdi-hospital-building'
      }
    },
    energy () {
      return formatValueLocale(this.consumer.data.energy)
    },
    carbon () {
      return formatValueLocale(this.consumer.data.carbon)
    },
    voltagelevel () {
      return VOLTAGE_LEVELS.find(e => this.consumer.data.voltagelevel === e.value).text
    },
    catprice () {
      return PRICE_CATEGORIES.find(e => this.consumer.data.catprice === e.value).text
    },
    tariffs () {
      switch (this.consumer.data.catprice) {
        case PRICE_CATEGORIES_CATEGORY_2_2:
          return [
            {
              text: 'Тариф дневной зоны суток',
              value: roundToTwoAsStr(this.$store.state.game.tariffs.t_zone_2.day)
            },
            {
              text: 'Тариф ночной зоны суток',
              value: roundToTwoAsStr(this.$store.state.game.tariffs.t_zone_2.night)
            }
          ]
        case PRICE_CATEGORIES_CATEGORY_2_3:
          return [
            {
              text: 'Тариф пиковой зоны суток',
              value: roundToTwoAsStr(this.$store.state.game.tariffs.t_zone_3.peak)
            },
            {
              text: 'Тариф полупиковой зоны суток',
              value: roundToTwoAsStr(this.$store.state.game.tariffs.t_zone_3.pp)
            },
            {
              text: 'Тариф ночной зоны суток',
              value: roundToTwoAsStr(this.$store.state.game.tariffs.t_zone_3.night)
            }
          ]
        default: return [{ text: 'Стоимость ЭЭ', value: roundToTwoAsStr(this.$store.state.game.tariffs.t_total / 1000.0) }]
      }
    },
    forecastEnabled () {
      return this.consumer.data.useforecast && this.consumer.data.forecast !== undefined
    },

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      return {
        datasets: [
          {
            data: this.consumer.data.forecast.data.map(e => ({ point: e.point, value: e.value * this.consumer.data.energy })),
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
      this.$axios.$get(API_ENERGY_SERVICE_INTERPOLATE + '/' + this.consumer.identy, { progress: false })
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
