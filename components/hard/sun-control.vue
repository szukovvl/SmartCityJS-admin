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
      &laquo;Имитатор солнца&raquo;
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
          <span class="light-blue--text text--lighten-3"><b>Имитатор солнца</b></span> – программируемый ПЛК,
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
        <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :height="200" />
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
  API_SUN_SERVICE,
  API_SUN_SERVICE_ON,
  API_SUN_SERVICE_OFF,
  DELAY_BEFORE_CHECK_VALUE,
  DELAY_BEFORE_SAVE_CHANGES
} from '~/assets/helpers'

Vue.use(Vuelidate)

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
    forecastName: undefined,
    forecastLoading: false,
    selForecast: undefined,
    showMenu: false,
    forecast: undefined,
    axioError: undefined,
    timeHandle: undefined,
    powerTimeHandle: undefined,
    delayHandle: undefined,
    forecastItems: [
      { key: '_not_found_', text: 'ветровые модели не найдены' }
    ]
  }),

  validations: {
    power: {
      required,
      integer,
      betweenValue: between(0, 100)
    }
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
    errorsMsg () {
      const errors = []
      this.axioError !== undefined && errors.push(this.axioError)
      // this.state.errorMsg !== undefined && errors.push(this.state.errorMsg)
      return errors
    },

    launched () {
      return this.state.status === 'LAUNCHED'
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
    }
  },

  mounted () {
    this.setOn = this.state.on
    this.power = this.state.power
  },

  methods: {
    forecastClear () {},
    doLoadForecasts () {
      /* eslint-disable no-console */
      console.warn('состояние:', this.state)
      /* eslint-enable no-console */
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
        this.$axios.$put(API_SUN_SERVICE + '/' + this.power, undefined, { progress: false })
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
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
