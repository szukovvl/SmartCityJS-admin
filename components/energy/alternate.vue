<template>
  <v-card flat>
    <v-row
      class="d-flex align-center"
      no-gutters
    >
      <v-col cols="1">
        <v-avatar
          tile
          color="#008000"
        >
          <v-icon dark>
            {{ avatars[element.data.generation_type] }}
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-card-title class="pa-0">
          &laquo;{{ einfoes[element.data.generation_type].title }}&raquo;
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
            <p class="px-0 ma-0 py-2" v-html="einfoes[element.data.generation_type].info" />
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
            v-model="data.energy"
            class="right-input"
            type="number"
            hint="Мощность генерации в МВт"
            persistent-hint
            suffix="МВт"
            dense
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
            Задается положительным числом и определяет статическую генерацию или используется как базовая величина.
            В данной реализации,
            фактическая мощность определяется произведением действующего значения устройства регистрации и статической мощности.
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
        <div class="d-flex">
          <v-text-field
            v-model="data.highload"
            class="right-input"
            type="number"
            hint="Порог высокой нагрузки"
            persistent-hint
            dense
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
        <div class="d-flex">
          <v-text-field
            v-model="data.criticalload"
            class="right-input"
            type="number"
            hint="Порог критической нагрузки"
            persistent-hint
            dense
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
            Задается положительным числом и определяет порог значения мощности критической нагрузки (перегрузка генератора).
            Превышение заданного порога критической нагрузки в течении некоторого времени,
            приведет к отключению генератора.
            Используется в случае активного переключателя превышения порога нормального значения мощности.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.blackouttime"
            class="right-input"
            type="number"
            hint="Время действия критической нагрузки до блэкаута"
            persistent-hint
            suffix="сек."
            dense
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
            hint="Стоимость одного коловатта генерации"
            persistent-hint
            suffix="руб."
            dense
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
            Задается положительным числом и определяет стоимость одного киловатта сгенерированной энергии
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-select
            v-model="data.mode"
            :items="generationMode"
            hint="Режим использования"
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
            Определяет режим использования устройства хранения энергии.
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
import {
  DELAY_BEFORE_SAVE_CHANGES,
  API_ENERGY_SERVICE_DATA,
  GENERATION_USAGE_MODES
} from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGreatZeroDecimal = value => value !== undefined && value !== null && value >= 0.0
const checkGreatZeroInt = value => value !== undefined && value !== null && value >= 0

function loadStateCheck (value) {
  return this.data.criticalload > this.data.highload
}

export default {
  name: 'AlternateObjet',

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    avatars: {
      SOLAR: 'mdi-solar-power-variant-outline',
      WIND: 'mdi-wind-power-outline'
    },
    einfoes: {
      SOLAR: {
        title: 'Солнечная электростанция',
        info: `<span class="light-blue--text text--lighten-3"><b>Солнечная электростанция (СЭС)</b></span> – инженерное сооружение,
        преобразующее солнечную радиацию в электрическую энергию.
        Способы преобразования солнечной энергии различны и зависят от конструкции электростанции.`
      },
      WIND: {
        title: 'Ветряная электростанция',
        info: `<span class="light-blue--text text--lighten-3"><b>Ветряная электростанция (ВЭС)</b></span> – несколько ветроэлектрических установок,
        собранных в одном или нескольких местах и объединённых в единую сеть.
        Крупные ветровые электростанции могут состоять из 100 и более ветрогенераторов.
        Иногда ветровые электростанции называют ветряными парками (ветропарками).`
      }
    },
    data: undefined,
    postdelay: undefined,

    data_enabled: false
  }),

  validations: {
    data: {
      energy: { required, decimal, checkGreatZeroDecimal },
      carbon: { required, decimal, checkGreatZeroDecimal },
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
    carbonErrors () {
      const errors = []
      if (!this.$v.data.carbon.$dirty) {
        return errors
      }
      !this.$v.data.carbon.decimal && errors.push('Задается вещественным числом')
      !this.$v.data.carbon.checkGreatZeroDecimal && errors.push('Не может быть отрицательным')
      !this.$v.data.carbon.required && errors.push('Необходимо определить')
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
    },

    generationMode: () => GENERATION_USAGE_MODES
  },

  watch: {
    data: {
      handler (v) {
        if (this.data_enabled) {
          this.saveChanges()
        }
        this.data_enabled = true
      },
      deep: true
    }
  },

  created () {
    this.data = this.element.data
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
            carbon: this.data.carbon,
            highload: this.data.highload,
            criticalload: this.data.criticalload,
            blackouttime: this.data.blackouttime,
            tariff: this.data.tariff,
            mode: this.data.mode
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
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
