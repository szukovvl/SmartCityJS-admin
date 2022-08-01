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
          mdi-weather-windy
        </v-icon>
      </v-avatar>
      &laquo;Имитатор ветра&raquo;
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
          <span class="light-blue--text text--lighten-3"><b>Имитатор ветра</b></span> – программируемый ПЛК,
          управляющий вентилятором стэнда.
        </p>
      </v-tooltip>
    </v-card-title>
    <v-card-text class="amber lighten-3 d-inline-flex">
      <v-text-field
        v-model="url"
        hint="сервис управления"
        persistent-hint
        dense
        placeholder="имя или IP сервиса управления"
        :error-messages="urlErrors"
        @input="doSetUrlChanged"
        @blur="$v.url.$touch()"
      />
      <v-tooltip
        right
        max-width="400"
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
          Адрес сетевого ресурса блока управления вентилятором.
        </p>
      </v-tooltip>
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
    <v-card-subtitle>Ветровая модель</v-card-subtitle>
    <v-card-text>
      <v-switch
        v-model="setUseForecast"
        :label="setUseForecast ? 'Использовать ветровую модель' : 'Использовать задание мощности' "
      />
      <v-menu
        v-model="showMenu"
        bottom
        offset-y
      >
        <template #activator="{}">
          <v-text-field
            v-model="forecastName"
            hint="Ветровая модель"
            persistent-hint
            placeholder="выберите ветровую модель"
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
          :disabled="true"
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
        ветровая модель не выбрана
      </div>
      <div v-else>
        <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :width="200" />
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
  API_WIND_SERVICE_ON,
  API_WIND_SERVICE_OFF,
  API_WIND_SERVICE_SETPOWER,
  API_WIND_SERVICE_SETURL,
  DELAY_BEFORE_CHECK_VALUE,
  DELAY_BEFORE_SAVE_CHANGES
} from '~/assets/helpers'

Vue.use(Vuelidate)

export default {
  name: 'WindControl',

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
    url: '',
    setUseForecast: false,
    forecastName: undefined,
    forecastLoading: false,
    selForecast: undefined,
    showMenu: false,
    forecast: undefined,
    axioError: undefined,
    timeHandle: undefined,
    powerTimeHandle: undefined,
    urlDelayHandle: undefined,
    urlTimeHandle: undefined,
    forecastItems: [
      { key: '_not_found_', text: 'ветровые модели не найдены' }
    ]
  }),

  validations: {
    power: {
      required,
      integer,
      betweenValue: between(0, 80)
    },
    url: { required }
  },

  computed: {
    powerErrors () {
      const errors = []
      if (!this.$v.power.$dirty) {
        return errors
      }
      !this.$v.power.integer && errors.push('Задается целым числом')
      !this.$v.power.betweenValue && errors.push('Только значения от 0 до 100')
      !this.$v.power.required && errors.push('Необходимо определить')
      return errors
    },
    urlErrors () {
      const errors = []
      if (!this.$v.url.$dirty) {
        return errors
      }
      !this.$v.url.required && errors.push('Необходимо определить')
      return errors
    },

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      return {
        datasets: [
          {
            data: [],
            borderColor: '#B0BEC5',
            borderWidth: 2,
            stepped: true,
            radius: 0,
            hoverRadius: 0,
            hitRadius: 0,
            borderDash: [2, 2]
          },
          {
            data: [],
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
      this.setOn = v
    },
    'state.power' (v) {
      this.power = v
    },
    'state.url' (v) {
      this.url = v
    },
    axioError (v) {
      /* eslint-disable no-console */
      console.error('ошибка:', v)
      /* eslint-enable no-console */
    }
  },

  mounted () {
    this.setOn = this.state.on
    this.power = this.state.power
    this.url = this.state.url
  },

  methods: {
    forecastClear () {},
    doLoadForecasts () {
      /* eslint-disable no-console */
      console.warn('состояние:', this.state)
      /* eslint-enable no-console */
      this.power = 0
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
        this.$axios.$put(API_WIND_SERVICE_SETPOWER + '/' + this.power, undefined, { progress: false })
          .then((v) => {
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

    doSetUrlChanged () {
      clearTimeout(this.urlDelayHandle)
      clearTimeout(this.urlTimeHandle)
      this.urlDelayHandle = undefined
      this.urlTimeHandle = undefined

      this.$v.url.$touch()

      this.urlDelayHandle = setTimeout(() => {
        this.urlDelayHandle = undefined
        this.$v.url.$touch()
        if (this.$v.url.$invalid) {
          return
        }
        this.$axios.$put(API_WIND_SERVICE_SETURL,
          { url: this.url },
          { progress: false })
          .then((v) => {
            this.urlTimeHandle = setTimeout(() => {
              if (this.urlDelayHandle === undefined) {
                this.url = this.state.url
              }
              this.urlTimeHandle = undefined
            }, DELAY_BEFORE_CHECK_VALUE)
          })
          .catch((error) => {
            if (error.response) {
              this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
            } else {
              this.axioError = 'ошибка выполнения API - задание адреса устройства'
            }
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    },

    doSetOnChange () {
      clearTimeout(this.timeHandle)
      this.timeHandle = undefined
      this.$axios.$post(this.setOn ? API_WIND_SERVICE_ON : API_WIND_SERVICE_OFF, undefined, { progress: false })
        .then((v) => {
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
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
