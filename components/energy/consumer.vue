<template>
  <v-card flat>
    <v-row
      class="d-flex align-center"
      no-gutters
    >
      <v-col cols="1">
        <v-avatar
          tile
          color="amber darken-3"
        >
          <v-icon dark>
            mdi-{{ avatars[element.data.consumertype] }}
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-card-title class="pa-0">
          &laquo;{{ einfoes[element.data.consumertype].title }}&raquo;
          <v-tooltip right>
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
            <!-- eslint-disable vue/no-v-html -->
            <p class="px-0 ma-0 py-2" v-html="einfoes[element.data.consumertype].info" />
            <!--eslint-enable-->
          </v-tooltip>
          &nbsp;{{ element.identy }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="4"
      >
        <div class="d-flex">
          <v-text-field
            v-model="energyobj.data.energy"
            class="right-input"
            type="number"
            hint="Мощность потребления объекта в МВт"
            persistent-hint
            suffix="МВт"
            dense
            :error-messages="energyErrors"
            @input="$v.energyobj.$touch()"
            @blur="$v.energyobj.$touch()"
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
            Задается положительным числом и определяет статическую нагрузку или используется как базовая величина при прогнозировании.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-menu
            v-model="showMenu"
            bottom
            offset-y
          >
            <template #activator="{}">
              <v-text-field
                v-model="forecastName"
                hint="Шаблон прогноза"
                persistent-hint
                placeholder="выберите прогноз"
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
        </div>
        <div class="d-flex">
          <v-switch
            v-model="energyobj.data.useforecast"
            :label="energyobj.data.useforecast ? 'Прогнозирование' : 'Без прогнозирования'"
            dense
            :disabled="energyobj.data.forecast === undefined"
          />
          <v-tooltip
            right
            max-width="400"
          >
            <template #activator="{ on, attrs }">
              <v-icon
                class="align-self-start mt-3"
                color="blue"
                small
                v-bind="attrs"
                v-on="on"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
            Определяет использование прогнозирования в игровом сценарии.
            <span class="red--text text--lighten-1"><i>Для использования необходимо задать прогноз.</i></span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col>
        <div
          v-if="energyobj.data.forecast === undefined"
          class="grey--text text--lighten-1 text-subtitle-2 d-flex justify-center font-weight-medium"
        >
          прогноз не задан
        </div>
        <div v-else>
          <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :height="200" />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { CHART_OPTIONS } from '~/assets/charts'
import {
  DELAY_BEFORE_SAVE_CHANGES,
  API_ENERGY_SERVICE_DATA,
  API_ENERGY_SERVICE_FORECAST,
  API_ENERGY_SERVICE_INTERPOLATE
} from '~/assets/helpers'

Vue.use(Vuelidate)

const powerValidate = value => value !== undefined && value !== null && value >= 0.0

const notfoundForecasts = [{ key: '_EMPTY_FORECAST_', text: 'прогнозы не найдены', forecast: undefined }]

export default {
  name: 'ConsumerObjet',

  components: { ForecastChart },

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    avatars: {
      DISTRICT: 'home-city',
      INDUSTRY: 'factory',
      HOSPITAL: 'hospital-building'
    },
    einfoes: {
      HOSPITAL: {
        title: 'Больница',
        info: `<span class="light-blue--text text--lighten-3"><b>1 категория</b></span> надежности электроснабжения (ПУЭ-7 п.1.2.19): 
          перерыв электроснабжения который влечет за собой опасность для жизни людей, угрозу для безопасности государства, 
          обеспечивается электроэнергией от двух независимых взаимнорезервирующих источников питания. 
          Перерыв при нарушении электроснабжения от одного из источников питания может быть допущен лишь на время автоматического восстановления питания. 
          В Игре этот элемент называется <span class="light-blue--text text--lighten-3"><b>&laquo;Больница&raquo;</b></span>.`
      },
      INDUSTRY: {
        title: 'Завод',
        info: `<span class="light-blue--text text--lighten-3"><b>2 категория</b></span> надежности электроснабжения (ПУЭ-7 п.1.2.20): 
          перерыв электроснабжения который влечет нарушение нормальной деятельности значительного количества городских и сельских жителей. 
          Обеспечиваться электроэнергией от двух независимых взаимно резервирующих источников питания. 
          Перерыв в электроснабжения определяется временем действия выездной оперативной бригады. 
          В Игре этот элемент называется <span class="light-blue--text text--lighten-3"><b>&laquo;Завод&raquo;</b></span>.`
      },
      DISTRICT: {
        title: 'Микрорайон',
        info: `<span class="light-blue--text text--lighten-3"><b>3 категория</b></span> надежности электроснабжения (ПУЭ-7 п.1.2.21) – все остальные электроприемники, 
          не подпадающие под определения первой и второй категорий. 
          Обеспечиваться электроэнергией от одного источника питания. Перерыв в электроснабжения не более 1 суток. 
          В Игре этот элемент называется <span class="light-blue--text text--lighten-3"><b>&laquo;Микрорайон&raquo;</b></span>.`
      }
    },
    energyobj: undefined,
    postdelay: undefined,
    useforecast_enabled: false,
    energy_enabled: false,
    forecast_enabled: false,
    forecastLoading: false,
    forecastItems: notfoundForecasts,
    showMenu: false,
    interpolate: [],
    chartPoints: [],
    selForecast: undefined,

    aaa: undefined
  }),

  validations: {
    energyobj: {
      data: {
        energy: { required, decimal, powerValidate }
      }
    },
    energyval: { required, decimal, powerValidate }
  },

  computed: {
    energyErrors () {
      const errors = []
      if (!this.$v.energyobj.$dirty) {
        return errors
      }
      !this.$v.energyobj.data.energy.decimal && errors.push('Мощность задается вещественным числом')
      !this.$v.energyobj.data.energy.powerValidate && errors.push('Мощность не должна быть меньше нуля')
      !this.$v.energyobj.data.energy.required && errors.push('Мощность необходимо определить')
      return errors
    },

    forecastName: {
      get () {
        return this.energyobj.data.forecast !== undefined
          ? this.energyobj.data.forecast.name
          : undefined
      },
      set: (newvalue) => { }
    },

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      return {
        datasets: [
          {
            data: this.energyobj.data.forecast.data.map(e => ({ point: e.point, value: e.value * this.energyobj.data.energy })),
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
    /* 'energyobj.data.useforecast' (v) {
      if (this.useforecast_enabled) {
        this.saveChanges()
      }
      this.useforecast_enabled = true
    },
    'energyobj.data.energy' (v) {
      / * eslint-disable no-console * /
      console.log('energyobj.data.energy')
      / * eslint-enable no-console * /
      if (this.energy_enabled) {
        this.saveChanges()
      }
      this.energy_enabled = true
    }, */
    'energyobj.data.forecast' (v) {
      /* eslint-disable no-console */
      console.log('energyobj.data.forecast')
      /* eslint-enable no-console */
      if (this.forecast_enabled) {
        this.saveChanges()
      }
      this.forecast_enabled = true
      /* eslint-disable no-console */
      console.log('-> energyobj.data.forecast')
      /* eslint-enable no-console */
    },
    'energyobj.data': {
      handler (newval, oldval) {
        /* eslint-disable no-console */
        console.log('-> energyobj.data:')
        console.log('-> новые:', newval)
        console.log('-> старые:', oldval)
        if (oldval === undefined || newval === undefined) {
          return
        }
        console.log('===')
        /* eslint-enable no-console */
        // this.saveChanges()
      },
      deep: true
    },
    aaa: {
      handler (v) {
        /* eslint-disable no-console */
        console.log('-> watch(aaa)', v)
        console.log('+++')
        /* eslint-enable no-console */
      },
      deep: true
    },

    selForecast (idx) {
      if (this.selForecast !== undefined) {
        this.energyobj.data.forecast = this.forecastItems[idx].forecast
        this.aaa = this.energyobj.data.forecast
        /* eslint-disable no-console */
        console.log('-> selForecast', this.energyobj)
        /* eslint-enable no-console */
      }
    }
  },

  created () {
    this.energyobj = this.element
    this.aaa = this.element.data.forecast
    /* eslint-disable no-console */
    console.log('==> created', this.energyobj)
    /* eslint-enable no-console */
    this.forecast_enabled = this.energyobj.data.forecast === undefined
    if (this.energyobj.data.forecast !== undefined) {
      this.doInterpolate()
    }
  },

  methods: {
    saveChanges () {
      clearTimeout(this.postdelay)
      /* eslint-disable no-console */
      console.log('-> saveChanges')
      /* eslint-enable no-console */
      if (this.$v.energyobj.$invalid) {
        return
      }
      this.postdelay = setTimeout(() => {
        this.postdelay = undefined
        this.$v.energyobj.$touch()
        if (this.$v.energyobj.$invalid) {
          return
        }
        this.$axios.$put(API_ENERGY_SERVICE_DATA + '/' + this.energyobj.identy,
          {
            energy: this.energyobj.data.energy,
            useforecast: this.energyobj.data.useforecast,
            forecast: this.energyobj.data.forecast
          }, { progress: false })
          .then((v) => {
            this.doInterpolate()
          })
          .catch((error) => {
            /* eslint-disable no-console */
            if (error.response) {
              console.error('ошибка %d: %s', error.response.status, error.response.data)
            }
            /* eslint-enable no-console */
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    },

    forecastClear () {
      this.energyobj.data.forecast = undefined
      this.interpolate = []
    },
    doLoadForecasts () {
      if (this.forecastLoading) {
        return
      }
      this.forecastLoading = true
      this.forecastItems = notfoundForecasts
      this.selForecast = undefined

      this.$axios.$get(API_ENERGY_SERVICE_FORECAST + '/' + this.energyobj.componentType, { progress: false })
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
      /* eslint-disable no-console */
      console.log('-> doInterpolate')
      /* eslint-enable no-console */
      this.interpolate = []
      if (this.energyobj.data.forecast === undefined) {
        return
      }
      this.$axios.$get(API_ENERGY_SERVICE_INTERPOLATE + '/' + this.energyobj.identy, { progress: false })
        .then((v) => {
          if (v !== undefined) {
            this.interpolate = v.items
          }
        })
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

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
