<template>
  <v-card
    class="ma-1"
    outlined
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        :color="state.on ? 'light-green accent-4' : 'blue-grey lighten-1'"
      >
        <v-icon dark>
          mdi-white-balance-sunny
        </v-icon>
      </v-avatar>
      &laquo;Солнечная модель&raquo;
      <v-tooltip
        right
        max-width="600"
      >
        <template #activator="{ on, attrs }">
          <v-icon
            class="align-self-start"
            color="blue"
            small
            v-bind="attrs"
            v-on="on"
          >
            mdi-help-circle-outline
          </v-icon>
        </template>
        <p class="px-0 ma-0 py-2">
          <span class="light-blue--text text--lighten-3"><b>Солнечная модель</b></span> – программируемый ПЛК,
          управляющий осветителями стэнда.
        </p>
      </v-tooltip>
    </v-card-title>
    <v-card-text
      v-if="errorsMsg.length !== 0"
      class="ma-0 pa-0"
    >
      <v-alert
        type="error"
        dense
        prominent
        max-width="600"
      >
        <div
          v-for="(item, index) in errorsMsg"
          :key="'_net_error_' + index"
        >
          <v-divider
            v-if="index !== 0"
            class="my-3"
          />
          <div>
            {{ item }}
          </div>
        </div>
      </v-alert>
    </v-card-text>
    <v-card-text>
      <div class="d-inline-flex">
        <v-text-field
          v-model="power"
          class="right-input mr-4"
          type="number"
          hint="задание мощности"
          persistent-hint
          dense
          :error-messages="powerErrors"
          @input="doSetPowerChanged"
          @blur="$v.power.$touch()"
        />
        <v-switch
          v-model="setOn"
          :label="setOn ? 'Включен' : 'Отключен'"
          @change="doSetOnChange"
        />
      </div>
    </v-card-text>
    <v-card-subtitle>Солнечная модель</v-card-subtitle>
    <v-card-text>
      <v-switch
        v-model="setUseForecast"
        :label="setUseForecast ? 'Использовать солнечную модель' : 'Использовать заданную мощность' "
        :disabled="forecast === undefined"
      />
      <v-menu
        v-model="showMenu"
        bottom
        offset-y
      >
        <template #activator="{}">
          <v-text-field
            v-model="forecastName"
            hint="модель"
            persistent-hint
            placeholder="выберите модель"
            dense
            clearable
            readonly
            append-icon="mdi-menu-down"
            :loading="forecastLoading"
            @click:clear="forecastClear"
            @click:append="doLoadForecasts"
            @focus="doLoadForecasts"
          />
        </template>
        <v-list
          :disabled="forecastItems[0].forecast === undefined"
        >
          <v-list-item-group
            v-model="selForecast"
            color="primary"
          >
            <v-list-item
              v-for="item in forecastItems"
              :key="item.key"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-text>
    <v-card-text>
      <div
        v-if="forecast === undefined"
        class="grey--text text--lighten-1 text-subtitle-2 d-flex justify-center font-weight-medium"
      >
        солнечная модель не выбрана
      </div>
      <div v-else>
        <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :width="400" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, integer, between } from 'vuelidate/lib/validators'
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { CHART_OPTIONS } from '~/assets/charts'
import {
  API_SUN_SERVICE_ON,
  API_SUN_SERVICE_OFF,
  API_SUN_SERVICE_FORECAST_ALL,
  API_SUN_SERVICE_INTERPOLATE,
  API_SUN_SERVICE_FORECAST,
  API_SUN_SERVICE_POWER,
  DELAY_BEFORE_CHECK_VALUE,
  DELAY_BEFORE_SAVE_CHANGES
} from '~/assets/helpers'

Vue.use(Vuelidate)

const notfoundForecasts = [{ key: '_EMPTY_FORECAST_', text: 'прогнозы не найдены', forecast: undefined }]

export default {
  name: 'SunControl',

  components: { ForecastChart },

  props: {
    state: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    setOn: false,
    power: 0,
    setUseForecast: false,
    forecastLoading: false,
    selForecast: undefined,
    showMenu: false,
    forecast: undefined,
    axioError: undefined,
    timeHandle: undefined,
    powerTimeHandle: undefined,
    delayHandle: undefined,
    forecastItems: notfoundForecasts,
    interpolate: [],
    delayForecastSave: undefined,
    enabledForecast: false,
    enabledUseForecast: false
  }),

  validations: {
    power: {
      required,
      integer,
      betweenValue: between(0, 80)
    }
  },

  computed: {
    powerErrors () {
      const errors = []
      if (!this.$v.power.$dirty) {
        return errors
      }
      !this.$v.power.integer && errors.push('Задается целым числом')
      !this.$v.power.betweenValue && errors.push('Только значения от 0 до 80')
      !this.$v.power.required && errors.push('Необходимо определить')
      return errors
    },
    errorsMsg () {
      const errors = []
      this.axioError !== undefined && errors.push(this.axioError)
      // this.state.errorMsg !== undefined && errors.push(this.state.errorMsg)
      return errors
    },

    launched () {
      return this.state.status === 'LAUNCHED'
    },
    forecastName: {
      get () {
        return this.forecast !== undefined
          ? this.forecast.name
          : undefined
      },
      set: (newvalue) => { }
    },

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      return {
        datasets: [
          {
            data: this.forecast.data.map(e => ({ point: e.point, value: e.value * 100.0 })),
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

  watch: {
    'state.on' (v) {
      if (this.timeHandle === undefined) {
        this.setOn = v
      }
    },
    'state.power' (v) {
      if (this.delayHandle === undefined && this.powerTimeHandle === undefined) {
        if (this.power !== v) {
          this.power = v
        }
      }
    },

    selForecast (idx) {
      if (this.selForecast !== undefined) {
        this.forecast = this.forecastItems[idx].forecast
      }
    },
    setUseForecast () {
      if (this.enabledUseForecast) {
        this.doSaveForecast()
      }
      this.enabledUseForecast = true
    },
    forecast () {
      if (this.enabledForecast) {
        this.doSaveForecast()
      }
      this.enabledForecast = true
    }
  },

  created () {
    if (!this.$isServer) {
      this.setOn = this.state.on
      this.power = this.state.power

      this.enabledUseForecast = this.setUseForecast === this.state.useforecast
      this.enabledForecast = this.forecast === this.state.forecast

      this.setUseForecast = this.state.useforecast
      this.forecast = this.state.forecast
      if (this.forecast !== undefined) {
        this.doInterpolate()
      }
    }
  },

  methods: {
    forecastClear () {
      this.setUseForecast = false
      this.forecast = undefined
      this.interpolate = []
    },
    doLoadForecasts () {
      if (this.forecastLoading) {
        return
      }
      this.forecastLoading = true
      this.forecastItems = notfoundForecasts
      this.selForecast = undefined

      this.$axios.$get(API_SUN_SERVICE_FORECAST_ALL, { progress: false })
        .then((v) => {
          if (v !== undefined && v.length !== 0) {
            this.forecastItems = v.map((item) => {
              return {
                key: 'FORECAST_' + item.fc_type + '_' + item.id,
                text: item.name,
                forecast: item
              }
            })
          }
          this.forecastLoading = false
          this.showMenu = true
        })
        .catch(() => {
          this.forecastLoading = false
          this.showMenu = true
        })
    },
    doInterpolate () {
      if (this.forecast === undefined) {
        this.interpolate = []
        return
      }
      this.$axios.$get(API_SUN_SERVICE_INTERPOLATE, { progress: false })
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
    },

    doSetPowerChanged () {
      clearTimeout(this.delayHandle)
      clearTimeout(this.powerTimeHandle)
      this.delayHandle = undefined
      this.powerTimeHandle = undefined

      this.$v.power.$touch()

      this.delayHandle = setTimeout(() => {
        this.delayHandle = undefined
        this.$v.power.$touch()
        if (this.$v.power.$invalid) {
          return
        }
        this.$axios.$put(API_SUN_SERVICE_POWER + '/' + this.power, undefined, { progress: false })
          .then((v) => {
            this.axioError = undefined
            this.powerTimeHandle = setTimeout(() => {
              if (this.delayHandle === undefined) {
                this.power = this.state.power
              }
              this.powerTimeHandle = undefined
            }, DELAY_BEFORE_CHECK_VALUE)
          })
          .catch((error) => {
            if (error.response) {
              this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
            } else {
              this.axioError = 'ошибка выполнения API - задание мощности осветителей'
            }
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    },
    doSetOnChange () {
      clearTimeout(this.timeHandle)
      this.timeHandle = undefined
      this.$axios.$post(this.setOn ? API_SUN_SERVICE_ON : API_SUN_SERVICE_OFF, undefined, { progress: false })
        .then((v) => {
          this.axioError = undefined
          this.timeHandle = setTimeout(() => {
            this.setOn = this.state.on
            this.timeHandle = undefined
          }, DELAY_BEFORE_CHECK_VALUE)
        })
        .catch((error) => {
          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - включить/отключить осветители'
          }
        })
    },
    doSaveForecast () {
      if (this.delayForecastSave !== undefined) {
        return
      }

      this.delayForecastSave = setTimeout(() => {
        this.delayForecastSave = undefined
        this.$axios.$put(API_SUN_SERVICE_FORECAST,
          {
            power: this.power,
            useforecast: this.setUseForecast,
            on: this.setOn,
            forecast: this.forecast
          }, { progress: false })
          .then((v) => {
            this.doInterpolate()
          })
          .catch((error) => {
            if (error.response) {
              this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
            } else {
              this.axioError = 'ошибка выполнения API - интерполяция'
            }
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
