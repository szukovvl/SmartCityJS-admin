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
            v-model="data.energy"
            class="right-input"
            type="number"
            hint="Мощность потребления объекта в МВт"
            persistent-hint
            suffix="МВт"
            dense
            step="0.1"
            :error-messages="energyErrors"
            @input="$v.data.energy.$touch()"
            @blur="$v.data.energy.$touch()"
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
          <v-text-field
            v-model="data.carbon"
            class="right-input"
            type="number"
            hint="Экология (выброс CO2)"
            persistent-hint
            suffix="гCO2экв/кВт*час"
            dense
            step="10"
            :error-messages="carbonErrors"
            @input="$v.data.carbon.$touch()"
            @blur="$v.data.carbon.$touch()"
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
            Задается положительным числом и определяет уровень выброса загрязнения окружающей среды
            (<span class="green--text text--accent-3"><i>Углеродный след</i></span>).
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-select
            v-model="data.catprice"
            :items="catPrices"
            hint="Ценовая категория потребителя"
            persistent-hint
            dense
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
            Тариф на услугу снабжения электроэнергией для юридических лиц.
            Ценовые категории различаются условиями применения тарифа на услуги по передаче
            электроэнергии и принципами расчета стоимости электрической энергии.
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-select
            v-model="data.voltagelevel"
            :items="voltageLevels"
            hint="Уровень напряжения"
            persistent-hint
            dense
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
            Уровни напряжения различают следующие:
            низкое напряжение (НН) – 0,4 киловольта,
            среднее напряжение втрое (СН2) – 3 киловольт,
            среднее напряжение первое (СН1) – 35 киловольт,
            высокое напряжение (ВН) – 110 киловольт.
            Уровень напряжения влияет на тариф за электроэнергию.
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
            v-model="data.useforecast"
            :label="data.useforecast ? 'Прогнозирование' : 'Без прогнозирования'"
            dense
            :disabled="forecast === undefined"
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
          v-if="forecast === undefined"
          class="grey--text text--lighten-1 text-subtitle-2 d-flex justify-center font-weight-medium"
        >
          прогноз не задан
        </div>
        <div v-else>
          <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :width="400" />
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
  API_ENERGY_SERVICE_INTERPOLATE,
  PRICE_CATEGORIES,
  VOLTAGE_LEVELS
} from '~/assets/helpers'

Vue.use(Vuelidate)

const powerValidate = value => value !== undefined && value !== null && value >= 0.0
const carbonValidate = value => value !== undefined && value !== null && value >= 0

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
    data: undefined,
    postdelay: undefined,
    useforecast_enabled: false,
    energy_enabled: false,
    carbon_enabled: false,
    catprice_enabled: false,
    voltage_enabled: false,
    forecast_enabled: false,
    forecastLoading: false,
    forecastItems: notfoundForecasts,
    showMenu: false,
    interpolate: [],
    selForecast: undefined,
    forecast: undefined
  }),

  validations: {
    data: {
      energy: { required, decimal, powerValidate },
      carbon: { required, decimal, carbonValidate }
    }
  },

  computed: {
    energyErrors () {
      const errors = []
      if (!this.$v.data.energy.$dirty) {
        return errors
      }
      !this.$v.data.energy.decimal && errors.push('Мощность задается вещественным числом')
      !this.$v.data.energy.powerValidate && errors.push('Мощность не должна быть меньше нуля')
      !this.$v.data.energy.required && errors.push('Мощность необходимо определить')
      return errors
    },
    carbonErrors () {
      const errors = []
      if (!this.$v.data.carbon.$dirty) {
        return errors
      }
      !this.$v.data.carbon.decimal && errors.push('Задается вещественным числом')
      !this.$v.data.carbon.carbonValidate && errors.push('Не должно быть меньше нуля')
      !this.$v.data.carbon.required && errors.push('Необходимо определить')
      return errors
    },

    forecastName: {
      get () {
        return this.forecast !== undefined
          ? this.forecast.name
          : undefined
      },
      set: (newvalue) => { }
    },
    catPrices: () => PRICE_CATEGORIES,
    voltageLevels: () => VOLTAGE_LEVELS,

    chartOptions: () => CHART_OPTIONS,
    axesdata () {
      const data = [
        {
          data: this.forecast.data.map(e => ({ point: e.point, value: e.value * this.data.energy })),
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
          borderColor: '#03A9F4',
          borderWidth: 2,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0
        }
      ]

      if (this.data.catprice === 'CATEGORY_2_2') {
        data.push({
          data: [
            { point: '07:00', value: this.data.energy },
            { point: '23:00', value: this.data.energy }
          ],
          backgroundColor: 'rgba(255, 152, 0, 0.3)',
          borderWidth: 0,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
          fill: true
        })
      } else if (this.data.catprice === 'CATEGORY_2_3') {
        data.push({
          data: [
            { point: '07:00', value: this.data.energy },
            { point: '10:00', value: this.data.energy }
          ],
          backgroundColor: 'rgba(244, 67, 54, 0.3)',
          borderWidth: 0,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
          fill: true
        },
        {
          data: [
            { point: '17:00', value: this.data.energy },
            { point: '21:00', value: this.data.energy }
          ],
          backgroundColor: 'rgba(244, 67, 54, 0.3)',
          borderWidth: 0,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
          fill: true
        },
        {
          data: [
            { point: '10:00', value: this.data.energy },
            { point: '17:00', value: this.data.energy }
          ],
          backgroundColor: 'rgba(255, 152, 0, 0.3)',
          borderWidth: 0,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
          fill: true
        },
        {
          data: [
            { point: '21:00', value: this.data.energy },
            { point: '23:00', value: this.data.energy }
          ],
          backgroundColor: 'rgba(255, 152, 0, 0.3)',
          borderWidth: 0,
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
          fill: true
        })
      }
      return {
        datasets: data
      }
    }
  },

  watch: {
    'data.useforecast' (v) {
      if (this.useforecast_enabled) {
        this.saveChanges()
      }
      this.useforecast_enabled = true
    },
    'data.energy' (v) {
      if (this.energy_enabled) {
        this.saveChanges()
      }
      this.energy_enabled = true
    },
    'data.carbon' (v) {
      if (this.carbon_enabled) {
        this.saveChanges()
      }
      this.carbon_enabled = true
    },
    'data.catprice' (v) {
      if (this.catprice_enabled) {
        this.saveChanges()
      }
      this.catprice_enabled = true
    },
    'data.voltagelevel' (v) {
      if (this.voltage_enabled) {
        this.saveChanges()
      }
      this.voltage_enabled = true
    },
    forecast (v) {
      this.data.forecast = v
      if (this.forecast_enabled) {
        this.saveChanges()
      }
      this.forecast_enabled = true
    },

    selForecast (idx) {
      if (this.selForecast !== undefined) {
        this.forecast = this.forecastItems[idx].forecast
      }
    }
  },

  created () {
    this.data = this.element.data
    this.forecast = this.data.forecast
    this.forecast_enabled = this.forecast === undefined
    if (this.forecast !== undefined) {
      this.doInterpolate()
    }
  },

  methods: {
    saveChanges () {
      clearTimeout(this.postdelay)
      if (this.$v.data.$invalid) {
        return
      }
      this.postdelay = setTimeout(() => {
        this.postdelay = undefined
        this.$v.data.$touch()
        if (this.$v.data.$invalid) {
          return
        }
        this.$axios.$put(API_ENERGY_SERVICE_DATA + '/' + this.element.identy,
          {
            energy: this.data.energy,
            useforecast: this.data.useforecast,
            forecast: this.forecast,
            carbon: this.data.carbon,
            catprice: this.data.catprice,
            voltagelevel: this.data.voltagelevel
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
      this.data.useforecast = false
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

      this.$axios.$get(API_ENERGY_SERVICE_FORECAST + '/' + this.element.componentType, { progress: false })
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
      this.interpolate = []
      if (this.forecast === undefined) {
        return
      }
      this.$axios.$get(API_ENERGY_SERVICE_INTERPOLATE + '/' + this.element.identy, { progress: false })
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
