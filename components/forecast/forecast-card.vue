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
        color="amber"
        :disabled="!deleteEnabled"
        @click="setRandom"
      >
        <v-icon>
          mdi-arrange-send-to-back
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="red"
        :disabled="!deleteEnabled"
        @click="$emit('doRemoveItem', forecast.id)"
      >
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
        :href="exportService"
        :disabled="!downloadEnabled"
      >
        <v-icon>
          mdi-file-download-outline
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
        @click="doUploadDile()"
      >
        <v-icon>
          mdi-file-upload-outline
        </v-icon>
      </v-btn>
      <input
        id="file_points"
        ref="file_points"
        type="file"
        visibility="hidden"
        @change="handleFileUpload()"
      >
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
                    step="0.02"
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
                    step="0.02"
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
    <div class="text-center">
      <v-bottom-sheet
        v-model="error_sheet"
      >
        <v-sheet
          class="text-center pa-2"
        >
          <v-alert
            dense
            outlined
            type="error"
          >
            {{ upload_error }}
          </v-alert>
        </v-sheet>
      </v-bottom-sheet>
    </div>
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

import {
  DELAY_BEFORE_SAVE_CHANGES,
  API_ENERGY_SERVICE_FORECAST,
  API_FORECAST_SERVICE,
  API_FORECAST_SERVICE_INTERPOLATION,
  API_FORECAST_SERVICE_RANDOMIZE,
  API_FORECAST_UPLOAD_SERVICE,
  API_FORECAST_EXPORT_SERVICE
} from '~/assets/helpers'

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
    postdelay: undefined,
    interpolate: [],
    file_points: undefined,
    error_sheet: false,
    upload_error: undefined
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
            data: this.forecast.data.map(n => n).sort(),
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
    },

    chartOptions: () => CHART_OPTIONS,

    exportService () {
      return API_FORECAST_EXPORT_SERVICE + '/' + this.forecast.id
    }
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
    if (this.forecast.data !== undefined && this.forecast.data.length !== 0) {
      const lastpoint = this.forecast.data[this.forecast.data.length - 1]
      this.newrow.point = nextTimePoint(String(lastpoint.point))
      this.newrow.value = lastpoint.value
    }
  },
  mounted () {
    this.getInterpolations()
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
        if (this.forecast.id < 0) {
          this.$axios.$post(API_ENERGY_SERVICE_FORECAST + '/' + this.element.fc_type,
            {
              name: this.forecast.name,
              data: this.forecast.data
            }, { progress: false })
            .then((v) => {
              this.forecast.id = v.id
              this.getInterpolations()
            })
            .catch((error) => {
              /* eslint-disable no-console */
              if (error.response) {
                console.error('ошибка %d: %s', error.response.status, error.response.data)
              }
              /* eslint-enable no-console */
            })
        } else {
          this.$axios.$put(API_FORECAST_SERVICE + '/' + this.element.id,
            {
              name: this.forecast.name,
              data: this.forecast.data
            }, { progress: false })
            .then((v) => {
              this.getInterpolations()
            })
            .catch((error) => {
              /* eslint-disable no-console */
              if (error.response) {
                console.error('ошибка %d: %s', error.response.status, error.response.data)
              }
              /* eslint-enable no-console */
            })
        }
      }, DELAY_BEFORE_SAVE_CHANGES)
    },
    getInterpolations () {
      if (this.forecast.id < 0) {
        return
      }
      this.$axios.$get(API_FORECAST_SERVICE_INTERPOLATION + '/' + this.forecast.id, { progress: false })
        .then((v) => {
          this.interpolate = v.items
        })
        .catch((error) => {
          this.interpolate = []
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
    },
    setRandom () {
      if (this.forecast.id < 0) {
        return
      }
      this.interpolate = []
      this.$axios.$get(API_FORECAST_SERVICE_RANDOMIZE + '/' + this.forecast.id, { progress: false })
        .then((v) => {
          this.forecast.data = v.data
        })
        .catch((error) => {
          this.interpolate = []
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
        })
    },

    handleFileUpload () {
      this.file_points = this.$refs.file_points.files[0]
      this.$refs.file_points.value = ''

      const formData = new FormData()
      formData.append('points_file', this.file_points)
      this.$axios.$post(API_FORECAST_UPLOAD_SERVICE + '/' + this.forecast.id, formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          progress: false
        })
        .then((v) => {
          if (v.points.length !== 0) {
            this.forecastWatch = false
            this.forecast.data = v.points
            this.interpolate = v.interpolation.items
          }
          if (v.errormsg !== undefined) {
            this.upload_error = v.errormsg
            this.error_sheet = true
          }
        })
        .catch((error) => {
          if (error.response) {
            this.upload_error = 'Сервер вернул ошибку ' + error.response.status + ': ' + error.response.data
            /* eslint-disable no-console */
            console.error('ошибка %d: %s', error.response.status, error.response.data)
            /* eslint-enable no-console */
          }
          this.error_sheet = true
        })

      this.file_points = undefined
    },
    doUploadDile () {
      this.$refs.file_points.click()
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}

#file_points {
  display: none;
}

/* input[type="file"] {
  position: absolute;
  top: -500px;
} */
</style>
