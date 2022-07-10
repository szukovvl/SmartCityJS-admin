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
      />
      <v-spacer />
      <v-btn
        icon
        color="green"
        :disabled="!dataChanged || forecast.data.length === 0"
      >
        <v-icon>
          mdi-check
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="red"
        :disabled="!deleteEnabled"
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
                  />
                </td>
                <td>
                  <v-text-field
                    v-model="item.value"
                    dense
                    class="right-input"
                    type="number"
                  />
                </td>
                <td>
                  <v-btn
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
          <!--BarChart :chart-data="chartData" :options="chartOptions" :height="400" /-->
          <client-only>
            <ForecastChart :chart-data="chartData" :options="chartOptions" :height="400" />
          </client-only>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal, between } from 'vuelidate/lib/validators'
import ForecastChart from '~/components/forecast/forecast-chart.vue'
import { nextTimePoint } from '~/assets/datetime'

Vue.use(Vuelidate)

function pointCheck (value) {
  if (this.forecast !== undefined && this.forecast.data !== undefined) {
    return this.forecast.data.find(e => e.point === value) === undefined
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
    }
  },

  data: () => ({
    newrow: {
      point: '00:00',
      value: 0
    },
    forecast: undefined,
    dataChanged: false,
    forecastWatch: false,
    scrolloptions: {
      duration: 900,
      offset: 0
    },
    scrolltarget: Number(9999),
    chartData: {
      labels: [
        '2019-06',
        '2019-07',
        '2019-08',
        '2019-09',
        '2019-10',
        '2019-11',
        '2019-12',
        '2020-01',
        '2020-02',
        '2020-03'
      ],
      datasets: [
        {
          label: 'Visualizaciones',
          data: [2, 1, 16, 3, 4, 5, 0, 0, 4, 12, 2],
          backgroundColor: 'rgba(20, 255, 0, 0.3)',
          borderColor: 'rgba(100, 255, 0, 1)',
          borderWidth: 2
        }
      ]
    },
    chartOptions: {
      responsive: true,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Google analytics data',
        fontSize: 24,
        fontColor: '#6b7280'
      },
      tooltips: {
        backgroundColor: '#17BF62'
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 7,
              min: 0,
              stepSize: 1
            },
            gridLines: {
              display: true
            }
          }
        ]
      }
    }
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

    deleteEnabled () {
      return this.forecast.id > 0
    },
    downloadEnabled () {
      return this.forecast.data.length > 0 && this.forecast.id > 0
    }
  },

  watch: {
    'forecast.name' (v) {
      /* eslint-disable no-console */
      console.log('>> название изменено', v)
      /* eslint-enable no-console */
    },
    'forecast.data': {
      handler (v) {
        if (this.forecastWatch) {
          this.dataChanged = true
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
      this.forecast.data.push(this.newrow)
      this.newrow = {
        point: nextTimePoint(this.newrow.point),
        value: this.newrow.value
      }
      this.$vuetify.goTo(this.scrolltarget, this.scrolloptions)
    },
    deleteRow (index) {
      this.forecast.data.splice(index, 1)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
