<template>
  <v-card
    flat
    tile
  >
    <div class="text-subtitle-2 blue-grey lighten-4 py-1">
      {{ snidx }}: Подсеть {{ subnet.identy }}
    </div>

    <v-row>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.energy"
            class="right-input"
            type="number"
            hint="Мощность подсети в МВт"
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
            Задается положительным числом и определяет максимально возможную нагрузку на данную подсеть.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.lossfactor"
            class="right-input"
            type="number"
            hint="Потери в сети"
            persistent-hint
            dense
            step="0.01"
            :error-messages="lossfactorErrors"
            @input="$v.data.lossfactor.$touch()"
            @blur="$v.data.lossfactor.$touch()"
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
            Задается положительным числом и определяет потери в данной подсети.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.highload"
            class="right-input"
            type="number"
            hint="Порог высокой нагрузки"
            persistent-hint
            dense
            step="0.01"
            :error-messages="highloadErrors"
            @input="$v.data.highload.$touch()"
            @blur="$v.data.highload.$touch()"
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
            Задается положительным числом и определяет порог значения мощности высокой нагрузки.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.criticalload"
            class="right-input"
            type="number"
            hint="Порог критической нагрузки"
            persistent-hint
            dense
            step="0.01"
            :error-messages="criticalloadErrors"
            @input="$v.data.criticalload.$touch()"
            @blur="$v.data.criticalload.$touch()"
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
            Задается положительным числом и определяет порог значения мощности критической нагрузки (перегрузка подсети).
            Превышение заданного порога критической нагрузки в течении некоторого времени,
            приведет к отключению подсети.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.blackouttime"
            class="right-input"
            type="number"
            hint="Время действия критической нагрузки до блэкаута"
            persistent-hint
            suffix="сек."
            dense
            step="10"
            :error-messages="blackouttimeErrors"
            @input="$v.data.blackouttime.$touch()"
            @blur="$v.data.blackouttime.$touch()"
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
            Задается положительным числом и определяет максимально допустимое время действия критической нагрузки,
            после которого произойдет блэкаут.
            Авария в энергосистеме — нарушение нормального режима всей или значительной части энергетической системы,
            связанное с повреждением оборудования, временным недопустимым ухудшением качества электрической энергии или
            перерывом в электроснабжении потребителей.
            Аварии в энергосистемах часто называют словом <span class="light-blue--text text--lighten-3"><b>блэкаут</b></span>
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.tariff"
            class="right-input"
            type="number"
            hint="Стоимость одного коловатта транспортируемой энергии"
            persistent-hint
            suffix="руб."
            dense
            step="0.1"
            :error-messages="tariffErrors"
            @input="$v.data.tariff.$touch()"
            @blur="$v.data.tariff.$touch()"
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
            Задается положительным числом и определяет стоимость одного киловатта транспортированной энергии в данной подсети
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal, integer, between } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

const checkGreatZeroDecimal = value => value !== undefined && value !== null && value >= 0.0
const checkGreatZeroInt = value => value !== undefined && value !== null && value >= 0

function loadStateCheck (value) {
  return this.data.criticalload > this.data.highload
}

export default {
  name: 'SubnetObjet',

  props: {
    subnet: {
      type: Object,
      required: true
    },
    snidx: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    data: undefined,
    data_enabled: false
  }),

  validations: {
    data: {
      energy: { required, decimal, checkGreatZeroDecimal },
      lossfactor: {
        required,
        betweenValue: between(0.7, 1.0)
      },
      highload: {
        required,
        betweenValue: between(0.5, 1.0),
        loadStateCheck
      },
      criticalload: {
        required,
        betweenValue: between(0.5, 1.0),
        loadStateCheck
      },
      blackouttime: { required, integer, checkGreatZeroInt },
      tariff: { required, decimal, checkGreatZeroDecimal }
    }
  },

  computed: {
    energyErrors () {
      const errors = []
      if (!this.$v.data.energy.$dirty) {
        return errors
      }
      !this.$v.data.energy.decimal && errors.push('Задается вещественным числом')
      !this.$v.data.energy.checkGreatZeroDecimal && errors.push('Не может быть отрицательным')
      !this.$v.data.energy.required && errors.push('Необходимо определить')
      return errors
    },
    lossfactorErrors () {
      const errors = []
      if (!this.$v.data.lossfactor.$dirty) {
        return errors
      }
      !this.$v.data.lossfactor.betweenValue && errors.push('Только значения от 0,7 до 1,0')
      !this.$v.data.lossfactor.required && errors.push('Необходимо определить')
      return errors
    },
    highloadErrors () {
      const errors = []
      if (!this.$v.data.highload.$dirty) {
        return errors
      }
      !this.$v.data.highload.betweenValue && errors.push('Только значения от 0,5 до 1,0')
      !this.$v.data.highload.loadStateCheck && errors.push('Не должно превышать установленный порог критической перегрузки')
      !this.$v.data.highload.required && errors.push('Необходимо определить')
      return errors
    },
    criticalloadErrors () {
      const errors = []
      if (!this.$v.data.criticalload.$dirty) {
        return errors
      }
      !this.$v.data.criticalload.betweenValue && errors.push('Только значения от 0,5 до 1,0')
      !this.$v.data.criticalload.loadStateCheck && errors.push('Не должно быть меньше нормального значения мощности')
      !this.$v.data.criticalload.required && errors.push('Необходимо определить')
      return errors
    },
    blackouttimeErrors () {
      const errors = []
      if (!this.$v.data.blackouttime.$dirty) {
        return errors
      }
      !this.$v.data.blackouttime.integer && errors.push('Задается целым числом')
      !this.$v.data.blackouttime.checkGreatZeroInt && errors.push('Не может быть отрицательным')
      !this.$v.data.blackouttime.required && errors.push('Необходимо определить')
      return errors
    },
    tariffErrors () {
      const errors = []
      if (!this.$v.data.tariff.$dirty) {
        return errors
      }
      !this.$v.data.tariff.decimal && errors.push('Задается вещественным числом: целая часть рубли, дробная часть копейки')
      !this.$v.data.tariff.checkGreatZeroDecimal && errors.push('Не может быть отрицательным')
      !this.$v.data.tariff.required && errors.push('Необходимо определить')
      return errors
    }
  },

  watch: {
    data: {
      handler (v) {
        if (this.data_enabled) {
          this.doSaveChanges()
        }
        this.data_enabled = true
      },
      deep: true
    }
  },

  created () {
    this.data = this.subnet.data
  },

  methods: {
    doSaveChanges () {
      this.$v.data.$touch()
      if (this.$v.data.$invalid) {
        return
      }
      this.$emit('onSaveChanges', this.subnet)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
