<template>
  <v-card flat>
    <v-row
      class="d-flex align-center"
      no-gutters
    >
      <v-col cols="1">
        <v-avatar
          tile
          color="#00F"
        >
          <v-icon dark>
            mdi-space-station
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-card-title class="pa-0">
          &laquo;Главная подстанция&raquo;
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
            <p class="px-0 ma-0 py-2" v-html="einfoes" />
            <!--eslint-enable-->
          </v-tooltip>
          &nbsp;{{ element.identy }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.external_energy"
            class="right-input"
            type="number"
            hint="Внешняя энергия в МВт"
            persistent-hint
            suffix="МВт"
            dense
            :error-messages="external_energyErrors"
            @input="$v.data.external_energy.$touch()"
            @blur="$v.data.external_energy.$touch()"
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
            Задается положительным числом и определяет количество энергии от внешней энергосети.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.carbon"
            class="right-input"
            type="number"
            hint="Экология (выброс CO2)"
            persistent-hint
            suffix="гCO2экв/кВт*час"
            dense
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
          </v-tooltip>
        </div>
      </v-col>
      <v-col>&nbsp;</v-col>
    </v-row>

    <v-card-text class="ps-0">
      <v-row>
        <v-col>
          <div class="indigo darken-3 white--text text-h6 text-center font-weight-medium py-1 mb-2">
            Энерговвод
          </div>
          <div
            v-for="(item, index) in element.data.inputs"
            :key="item.identy"
          >
            <div v-if="index !== 0">
              &nbsp;
            </div>
            <SubnetObjet :subnet="item" :snidx="index + 1" @onSaveChanges="onSaveChanges" />
          </div>
        </v-col>
        <v-col>
          <div class="indigo darken-3 white--text text-h6 text-center font-weight-medium py-1 mb-2">
            Подсети потребителей
          </div>
          <div
            v-for="(item, index) in element.data.outputs"
            :key="item.identy"
          >
            <div v-if="index !== 0">
              &nbsp;
            </div>
            <SubnetObjet :subnet="item" :snidx="index + 1" @onSaveChanges="onSaveChanges" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import SubnetObjet from '~/components/energy/subnet.vue'
import {
  DELAY_BEFORE_SAVE_CHANGES,
  API_ENERGY_SERVICE_DATA
} from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGreatZeroDecimal = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'MainStationObjet',

  components: { SubnetObjet },

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    einfoes: `<span class="light-blue--text text--lighten-3"><b>Электрическая подстанция</b></span> – электроустановка,
    предназначенная для приема, преобразования и распределения электрической энергии,
    состоящая из трансформаторов или других преобразователей электрической энергии, устройств управления,
    распределительных и вспомогательных устройств.`,

    data: undefined,
    external_energy_enabled: false,
    carbon_enabled: false
  }),

  validations: {
    data: {
      external_energy: { required, decimal, checkGreatZeroDecimal },
      carbon: { required, decimal, checkGreatZeroDecimal }
    }
  },

  computed: {
    external_energyErrors () {
      const errors = []
      if (!this.$v.data.external_energy.$dirty) {
        return errors
      }
      !this.$v.data.external_energy.decimal && errors.push('Задается вещественным числом')
      !this.$v.data.external_energy.checkGreatZeroDecimal && errors.push('Не может быть отрицательным')
      !this.$v.data.external_energy.required && errors.push('Необходимо определить')
      return errors
    },
    carbonErrors () {
      const errors = []
      if (!this.$v.data.carbon.$dirty) {
        return errors
      }
      !this.$v.data.carbon.decimal && errors.push('Задается вещественным числом')
      !this.$v.data.carbon.checkGreatZeroDecimal && errors.push('Не может быть отрицательным')
      !this.$v.data.carbon.required && errors.push('Необходимо определить')
      return errors
    }
  },

  watch: {
    'data.external_energy' (v) {
      if (this.external_energy_enabled) {
        this.onSaveChanges()
      }
      this.external_energy_enabled = true
    },
    'data.carbon' (v) {
      if (this.carbon_enabled) {
        this.onSaveChanges()
      }
      this.carbon_enabled = true
    }
  },

  created () {
    this.data = this.element.data
  },

  methods: {
    onSaveChanges (subnet) {
      clearTimeout(this.postdelay)
      this.postdelay = setTimeout(() => {
        this.postdelay = undefined
        const transmitted = {
          external_energy: this.data.external_energy,
          carbon: this.data.carbon,
          inputs: this.element.data.inputs.map(e => ({
            energy: e.data.energy,
            lossfactor: e.data.lossfactor,
            highload: e.data.highload,
            criticalload: e.data.criticalload,
            blackouttime: e.data.blackouttime
          })),
          outputs: this.element.data.outputs.map(e => ({
            energy: e.data.energy,
            lossfactor: e.data.lossfactor,
            highload: e.data.highload,
            criticalload: e.data.criticalload,
            blackouttime: e.data.blackouttime
          }))
        }
        this.$axios.$put(API_ENERGY_SERVICE_DATA + '/' + this.element.identy, transmitted, { progress: false })
          // .then((v) => {})
          .catch((error) => {
            /* eslint-disable no-console */
            if (error.response) {
              console.error('ошибка %d: %s', error.response.status, error.response.data)
            }
            /* eslint-enable no-console */
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
