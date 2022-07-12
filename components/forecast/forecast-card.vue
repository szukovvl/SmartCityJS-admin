<template>
  <v-card flat>
    <v-toolbar
      dense
      flat
    >
      <v-text-field
        v-model="forecast.name"
        hint="Название прогноза"
        persistent-hint
        placeholder="введите название прогноза"
        dense
        :error-messages="fnameErrors"
        @input="$v.forecast.name.$touch()"
        @blur="$v.forecast.name.$touch()"
      />
      <v-spacer />
      <v-btn
        icon
        color="red"
        :disabled="!deleteEnabled"
        @click="removeItem(forecast.id)"
      >
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
        :disabled="!downloadEnabled"
      >
        <v-icon>
          mdi-file-download-outline
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
      >
        <v-icon>
          mdi-file-upload-outline
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row>
        <v-col cols="4">
          <table>
            <tbody>
              <tr
                v-for="(item, index) in element.data"
                :key="'pt_trow_' + index"
              >
                <td>#{{ index + 1 }}</td>
                <td>
                  <v-text-field
                    v-model="item.point"
                    dense
                    class="right-input"
                    type="time"
                    :error-messages="geterrors_forpoint($v.forecast.data.$each[index].point)"
                    @input="$v.forecast.data.$each[index].point.$touch()"
                    @blur="$v.forecast.data.$each[index].point.$touch()"
                  />
                </td>
                <td>
                  <v-text-field
                    v-model="item.value"
                    dense
                    class="right-input"
                    type="number"
                    :error-messages="geterrors_forvalue($v.forecast.data.$each[index].value)"
                    @input="$v.forecast.data.$each[index].value.$touch()"
                    @blur="$v.forecast.data.$each[index].value.$touch()"
                  />
                </td>
                <td>
                  <v-btn
                    v-if="forecast.data.length > 1 || forecast.id < 1"
                    icon
                    color="red"
                    @click="deleteRow(index)"
                  >
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="forecast.data.length !== 0">
                <td colspan="4">
                  <v-divider />
                </td>
              </tr>
              <tr key="py_table_row">
                <td />
                <td>
                  <v-text-field
                    v-model="newrow.point"
                    class="right-input"
                    type="time"
                    dense
                    :error-messages="newrowPtErrors"
                    @input="$v.newrow.point.$touch()"
                    @blur="$v.newrow.point.$touch()"
                  />
                </td>
                <td>
                  <v-text-field
                    v-model="newrow.value"
                    class="right-input"
                    type="number"
                    dense
                    :error-messages="newrowErrors"
                    @input="$v.newrow.value.$touch()"
                    @blur="$v.newrow.value.$touch()"
                  />
                </td>
                <td>
                  <v-btn
                    icon
                    color="primary"
                    :disabled="$v.newrow.$invalid"
                    @click="addRow"
                  >
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
        <v-col>
          <ForecastChart :chart-data="axesdata" :chart-options="chartOptions" :height="200" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal, between } from 'vuelidate/lib/validators'
import moment from 'moment'
import 'chartjs-adapter-moment'
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { nextTimePoint } from '~/assets/datetime'
import { CHART_OPTIONS } from '~/assets/charts'
import { DELAY_BEFORE_SAVE_CHANGES, API_ENERGY_SERVICE_FORECAST } from '~/assets/helpers'

moment.locale('ru')

Vue.use(Vuelidate)

function pointCheck (value) {
  if (this.forecast !== undefined && this.forecast.data !== undefined) {
    return this.forecast.data.find(e => e.point === value) === undefined
  }
  return true
}

function pointDuplicateCheck (value) {
  if (this.forecast !== undefined && this.forecast.data !== undefined) {
    return this.forecast.data.filter(e => e.point === value).length === 1
  }
  return true
}

export default {
  name: 'ForecastCard',

  components: { ForecastChart },

  props: {
    element: {
      type: Object,
      required: true
    },
    removeItem: {
      type: Function,
      default: undefined
    }
  },

  data: () => ({
    newrow: {
      point: '00:00',
      value: 0
    },
    forecast: undefined,
    forecastWatch: false,
    forecastNameWatch: false,
    scrolloptions: {
      duration: 900,
      offset: 0
    },
    scrolltarget: Number(9999),
    postdelay: undefined
  }),

  validations: {
    newrow: {
      value: {
        required,
        decimal,
        betweenValue: between(0.0, 1.0)
      },
      point: {
        required,
        pointCheck
      }
    },
    forecast: {
      name: {
        required
      },
      data: {
        $each: {
          value: {
            required,
            decimal,
            betweenValue: between(0.0, 1.0)
          },
          point: {
            required,
            pointDuplicateCheck
          }
        }
      }
    }
  },

  computed: {
    newrowErrors () {
      const errors = []
      if (!this.$v.newrow.value.$dirty) {
        return errors
      }
      !this.$v.newrow.value.decimal && errors.push('должно быть вещественное число')
      !this.$v.newrow.value.required && errors.push('должно быть определенно')
      !this.$v.newrow.value.betweenValue && errors.push('только значения от 0,0 до 1,0')
      return errors
    },
    newrowPtErrors () {
      const errors = []
      if (!this.$v.newrow.point.$dirty) {
        return errors
      }
      !this.$v.newrow.point.pointCheck && errors.push('точка уже задана')
      !this.$v.newrow.point.required && errors.push('должно быть определенно')
      return errors
    },
    fnameErrors () {
      const errors = []
      if (!this.$v.forecast.name.$dirty) {
        return errors
      }
      !this.$v.forecast.name.required && errors.push('название должно быть задано')
      return errors
    },

    deleteEnabled () {
      return this.forecast.id > 0
    },
    downloadEnabled () {
      return this.forecast.data.length > 0 && this.forecast.id > 0
    },

    axesdata () {
      return {
        datasets: [
          {
            label: 'прогноз',
            data: this.forecast.data.map(n => ({ x: n.point, y: Number(n.value) })).sort((a, b) => a.x.localeCompare(b.x)),
            backgroundColor: 'rgba(20, 255, 0, 0.3)',
            borderColor: 'rgba(100, 255, 0, 1)',
            borderWidth: 2,
            stepped: true
          }
        ]
      }
    },

    chartOptions: () => CHART_OPTIONS
  },

  watch: {
    'forecast.name' (v) {
      if (this.forecastNameWatch) {
        this.saveChanges()
      }
      this.forecastNameWatch = true
    },
    'forecast.data': {
      handler (v) {
        if (this.forecastWatch) {
          this.saveChanges()
        }
        this.forecastWatch = true
      },
      deep: true
    }
  },

  created () {
    this.forecast = this.element
  },

  methods: {
    addRow () {
      this.$v.newrow.$touch()
      if (this.$v.newrow.$invalid) {
        return
      }
      this.forecast.data.push({
        point: this.newrow.point,
        value: this.newrow.value
      })
      this.newrow.point = nextTimePoint(this.newrow.point)
      //
      this.forecast.data = this.forecast.data.sort((a, b) => a.point.localeCompare(b.point))
    },
    deleteRow (index) {
      this.forecast.data.splice(index, 1)
    },

    geterrors_forpoint (item) {
      const errors = []
      if (!item.$dirty) {
        return errors
      }
      !item.pointDuplicateCheck && errors.push('точка уже задана')
      !item.required && errors.push('должно быть определенно')
      return errors
    },
    geterrors_forvalue (item) {
      const errors = []
      if (!item.$dirty) {
        return errors
      }
      !item.decimal && errors.push('должно быть вещественное число')
      !item.required && errors.push('должно быть определенно')
      !item.betweenValue && errors.push('только значения от 0,0 до 1,0')
      return errors
    },

    saveChanges () {
      clearTimeout(this.postdelay)
      this.$v.forecast.$touch()
      if (this.$v.forecast.$invalid) {
        return
      }
      this.postdelay = setTimeout(() => {
        this.postdelay = undefined
        this.$v.forecast.$touch()
        if (this.$v.forecast.$invalid) {
          return
        }
        if (this.forecast.data.length === 0) {
          return
        }
        /* eslint-disable no-console */
        console.log('>> фиксация на сервере')
        /* eslint-enable no-console */
        if (this.forecast.id < 0) {
          /* eslint-disable no-console */
          console.log('>> новый прогноз')
          /* eslint-enable no-console */
          this.$axios.$post(API_ENERGY_SERVICE_FORECAST + '/' + this.element.fc_type,
            {
              name: this.forecast.name,
              data: this.forecast.data
            }, { progress: false })
            .then((v) => {
              this.forecast.id = v.id
              // !!! запустить интерполяцию
            })
            .catch((error) => {
              /* eslint-disable no-console */
              if (error.response) {
                console.error('ошибка %d: %s', error.response.status, error.response.data)
              }
              /* eslint-enable no-console */
            })
        } else {
          /* eslint-disable no-console */
          console.log('>> обновление прогноза')
          /* eslint-enable no-console */
        }
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
