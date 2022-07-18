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
      &laquo;Эмитатор солнца&raquo;
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
          <span class="light-blue--text text--lighten-3"><b>Эмитатор солнца</b></span> – программируемый ПЛК,
          управляющий осветителями стэнда.
        </p>
      </v-tooltip>
      <v-icon
        class="ml-4"
        :color="launched ? 'indigo accent-4' : 'amber darken-3'"
      >
        {{ launched ? 'mdi-rocket-launch-outline' : 'mdi-power-standby' }}
      </v-icon>
    </v-card-title>
    <v-card-text class="amber lighten-3">
      <div class="d-inline-flex">
        <v-text-field
          v-model="plcTime"
          class="right-input"
          type="number"
          hint="длительность цикла опроса"
          persistent-hint
          suffix="мс"
          dense
          step="50"
          :error-messages="plcTimeErrors"
          @input="onPlcTimeChange"
          @blur="$v.plcTime.$touch()"
        />
        <v-tooltip
          right
          max-width="400"
        >
          <template #activator="{ on, attrs }">
            <v-icon
              class="align-self-start mr-4"
              color="blue"
              small
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <p class="px-0 ma-0 py-2">
            <span class="red--text text--lighten-1"><b>ВНИМАНИЕ !</b></span>
            Данный параметр управляет временем опроса ПЛК.
            Малые значения времени опроса увеличивают интерактивность.
            Тем не менее, не следует прибегать к чрезмерно малым значением времени опроса,
            что может увеличить количество ошибок взаимодействия с ПЛК.
            Устанавливаемое значение должно соотносится со скоростью реакции пользовательского интерфейса и
            быть достаточным, чтобы модуль связи ПЛК успел приготовится к обслуживанию следующих запросов.
          </p>
        </v-tooltip>
        <v-text-field
          v-model="restartTime"
          class="right-input"
          type="number"
          hint="задержка при перезапуске сервиса"
          persistent-hint
          suffix="мс"
          dense
          step="100"
          :error-messages="restartTimeErrors"
          @input="$v.restartTime.$touch()"
          @blur="$v.restartTime.$touch()"
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
            <span class="red--text text--lighten-1"><b>ВНИМАНИЕ !</b></span>
            Данный параметр определяет временную задержку перед запускам сервиса, после его останова
            во время обработки команды API "перезапустить".
          </p>
        </v-tooltip>
      </div>
    </v-card-text>
    <v-card-text>
      <div class="d-inline-flex">
        <v-text-field
          v-model="power"
          class="right-input mr-4"
          type="number"
          hint="задание мощности"
          persistent-hint
          suffix="%"
          dense
          step="5"
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
    <v-card-subtitle>
      Управление сервисом
    </v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-center">
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="indigo accent-4"
          :disabled="launched"
          @click="onStart"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="teal"
          :disabled="!launched"
          @click="onRestart"
        >
          <v-icon>mdi-replay</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="amber darken-3"
          :disabled="!launched"
          @click="onStop"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>
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
  API_SUN_SERVICE_ON,
  API_SUN_SERVICE_OFF,
  API_SUN_SERVICE_START,
  API_SUN_SERVICE_STOP,
  API_SUN_SERVICE_RESTART,
  API_SUN_SERVICE_SETPOWER,
  DELAY_BEFORE_CHECK_VALUE,
  DELAY_BEFORE_SAVE_CHANGES
} from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGtZero = value => value !== undefined && value !== null && value >= 0

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
    plcTime: undefined,
    powerTimeHandle: undefined,
    delayHandle: undefined,
    restartTime: undefined,
    forecastItems: [
      { key: '_not_found_', text: 'ветровые модели не найдены' }
    ]
  }),

  validations: {
    power: {
      required,
      integer,
      betweenValue: between(0, 100)
    },
    plcTime: { required, integer, checkGtZero },
    restartTime: { required, integer, checkGtZero }
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
    plcTimeErrors () {
      const errors = []
      if (!this.$v.plcTime.$dirty) {
        return errors
      }
      !this.$v.plcTime.integer && errors.push('Задается целым числом')
      !this.$v.plcTime.checkGtZero && errors.push('Не может быть отрицательным')
      !this.$v.plcTime.required && errors.push('Необходимо определить')
      return errors
    },
    restartTimeErrors () {
      const errors = []
      if (!this.$v.restartTime.$dirty) {
        return errors
      }
      !this.$v.restartTime.integer && errors.push('Задается целым числом')
      !this.$v.restartTime.checkGtZero && errors.push('Не может быть отрицательным')
      !this.$v.restartTime.required && errors.push('Необходимо определить')
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
      this.setOn = v
    },
    'state.power' (v) {
      this.power = v
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
  },

  methods: {
    forecastClear () {},
    doLoadForecasts () {
      /* eslint-disable no-console */
      console.warn('состояние:', this.state)
      /* eslint-enable no-console */
      this.power = 0
    },

    onPlcTimeChange () {
      this.$v.plcTime.$touch()
      /* eslint-disable no-console */
      console.log('onPlcTimeChange:', this.plcTime)
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
        this.$axios.$put(API_SUN_SERVICE_SETPOWER + '/' + this.power, undefined, { progress: false })
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

    doSetOnChange () {
      clearTimeout(this.timeHandle)
      this.timeHandle = undefined
      this.$axios.$post(this.setOn ? API_SUN_SERVICE_ON : API_SUN_SERVICE_OFF, undefined, { progress: false })
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
    },

    executeServiceApi (url) {
      this.$axios.$put(url, undefined, { progress: false })
        // .then((v) => {})
        .catch((error) => {
          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - управление сервисом эмитатора ветра'
          }
        })
    },
    onStart () {
      this.executeServiceApi(API_SUN_SERVICE_START)
    },
    onRestart () {
      this.executeServiceApi(API_SUN_SERVICE_RESTART)
    },
    onStop () {
      this.executeServiceApi(API_SUN_SERVICE_STOP)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
