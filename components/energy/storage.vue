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
            mdi-battery-charging-70
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-card-title class="pa-0">
          &laquo;{{ einfoes.title }}&raquo;
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
            <p class="px-0 ma-0 py-2" v-html="einfoes.info" />
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
            hint="Емкость хранилища, МВт*час"
            persistent-hint
            suffix="МВт*час"
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
            Задается положительным числом и определяет емкость устройства хранения энергии.
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
            v-model="data.performance"
            class="right-input"
            type="number"
            hint="Показатель эффективности системы хранения"
            persistent-hint
            suffix="гCO2экв/кВт*час"
            dense
            :error-messages="performanceErrors"
            @input="$v.data.performance.$touch()"
            @blur="$v.data.performance.$touch()"
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
            Задается положительным числом и определяет потери аккумулятора.
            (<span class="green--text text--accent-3"><i>Углеродный след</i></span>).
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.peckertexponent"
            class="right-input"
            type="number"
            hint="Экспонента Пекерта"
            persistent-hint
            dense
            :error-messages="peckertexponentErrors"
            @input="$v.data.peckertexponent.$touch()"
            @blur="$v.data.peckertexponent.$touch()"
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
            Количество электроэнергии, которое можно извлечь из аккумулятора,
            зависит от тока разряда аккумулятора.
            То есть при слишком большом токе разряда аккумулятор разряжается очень быстро и отдает меньше электроэнергии.
            Эффект этот был замечен довольно давно, но первым, кто попробовал учесть его количественно,
            был <span class="light-blue--text text--lighten-3"><b>Пекерт (Peukert)</b></span>, который модифицировал формулу, внеся показатель,
            который теперь называют <span class="light-blue--text text--lighten-3"><b>экспонента Пекерта (Peukert's exponent)</b></span>.
            Обычно экспонента Пекерта принимает значения от 1,1 до 1,3.
            Задается положительным числом.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.outpower"
            class="right-input"
            type="number"
            hint="Нормалььно значение отдаваемой мощности"
            persistent-hint
            dense
            :error-messages="outpowerErrors"
            @input="$v.data.outpower.$touch()"
            @blur="$v.data.outpower.$touch()"
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
            Определяет границу нормального значения отдаваемой мощности потребителю.
            Задается положительным числом.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-switch
            v-model="data.overload_enabled"
            :label="data.overload_enabled ? 'Разрешено превышать границу нормального значения мощности' : 'Запрещено превышать границу нормального значения мощности'"
            dense
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
            Превышении границы нормального значения мощности приводит к более быстрой разрядки аккумулятора и
            ухудшает показатель эффективности устройства хранения.
          </v-tooltip>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex">
          <v-text-field
            v-model="data.maxdischarge"
            class="right-input"
            type="number"
            hint="Максимальная разрядка хранилища"
            persistent-hint
            dense
            :error-messages="maxdischargeErrors"
            @input="$v.data.maxdischarge.$touch()"
            @blur="$v.data.maxdischarge.$touch()"
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
            Определяет границу максимально допустимой разрядки аккумулятора от его начальной емкости.
            Задается положительным числом.
            <span class="red--text text--lighten-1"><i>Обязательно к заполнению.</i></span>
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-text-field
            v-model="data.undercharging"
            class="right-input"
            type="number"
            hint="Недозарядка при повторном использовании"
            persistent-hint
            dense
            :error-messages="underchargingErrors"
            @input="$v.data.undercharging.$touch()"
            @blur="$v.data.undercharging.$touch()"
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
            Определяет границу недозарядки аккумулятора от его начальной емкости перед повторным использованием.
            Задается положительным числом.
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
        <div class="d-flex">
          <v-select
            v-model="data.chargebehavior"
            :items="storageCharge"
            hint="Восстановление хранилища"
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
            Определяет каким образом хранилище будет восстанавливаться.
          </v-tooltip>
        </div>
        <div class="d-flex">
          <v-select
            v-model="data.initstate"
            :items="initState"
            hint="Начальное состояние в игровом сценарии"
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
            Определяет состояние хранилище перед началом игрового сценария.
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
  GENERATION_USAGE_MODES,
  ENERGYSTORAGE_CHARGEBEHAVIORS,
  ENERGYSTORAGE_STATES
} from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGreatZeroDecimal = value => value !== undefined && value !== null && value >= 0.0
const checkGreatZeroInt = value => value !== undefined && value !== null && value >= 0

function loadStateCheck (value) {
  return this.data.criticalload > this.data.outpower
}
function outPowerCheck (value) {
  return this.data.outpower > this.data.maxdischarge
}
function underchargingCheck (value) {
  return this.data.undercharging > this.data.maxdischarge
}

export default {
  name: 'StorageObjet',

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    einfoes: {
      title: 'Хранение энергии',
      info: `Накопление энергии — аккумуляция энергии для её использования в дальнейшем.
      Устройство, хранящее энергию, обычно называют аккумулятором или батареей.
      Типичным примером устройства накопления энергии (энергонакопителя) является аккумуляторная батарея,
      в которой хранится химическая энергия, легко преобразуемая в электричество.
      Виды хранения энергии: механическое накопление, гидроэлектричество,
      гидроаккумулирующая электростанция, технология накопления энергии сжатого воздуха, технология накопления энергии маховиком,
      накопление гравитационной потенциальной энергии твердых масс, газовые хранилища.
      В игровом сценарии рассматривается устройство химического хранения энергии.`
    },
    data: undefined,
    postdelay: undefined,

    data_enabled: false
  }),

  validations: {
    data: {
      energy: { required, decimal, checkGreatZeroDecimal },
      carbon: { required, decimal, checkGreatZeroDecimal },
      criticalload: {
        required,
        betweenValue: between(0.5, 1.0),
        loadStateCheck
      },
      blackouttime: { required, integer, checkGreatZeroInt },
      tariff: { required, decimal, checkGreatZeroDecimal },

      performance: {
        required,
        betweenValue: between(0.5, 1.0)
      },
      peckertexponent: {
        required,
        betweenValue: between(0.8, 1.8)
      },
      outpower: {
        required,
        betweenValue: between(0.35, 1.0),
        outPowerCheck,
        loadStateCheck
      },
      maxdischarge: {
        required,
        betweenValue: between(0.02, 0.35),
        outPowerCheck
      },
      undercharging: {
        required,
        betweenValue: between(0.4, 1.0),
        underchargingCheck
      }
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

    performanceErrors () {
      const errors = []
      if (!this.$v.data.performance.$dirty) {
        return errors
      }
      !this.$v.data.performance.betweenValue && errors.push('Только значения от 0,5 до 1,0')
      !this.$v.data.performance.required && errors.push('Необходимо определить')
      return errors
    },
    peckertexponentErrors () {
      const errors = []
      if (!this.$v.data.peckertexponent.$dirty) {
        return errors
      }
      !this.$v.data.peckertexponent.betweenValue && errors.push('Только значения от 0,8 до 1,8')
      !this.$v.data.peckertexponent.required && errors.push('Необходимо определить')
      return errors
    },
    outpowerErrors () {
      const errors = []
      if (!this.$v.data.outpower.$dirty) {
        return errors
      }
      !this.$v.data.outpower.betweenValue && errors.push('Только значения от 0,35 до 1,0')
      !this.$v.data.outpower.outPowerCheck && errors.push('Должно быть больше допустимой разрядки')
      !this.$v.data.outpower.loadStateCheck && errors.push('Не должно превышать значения перегрузки')
      !this.$v.data.outpower.required && errors.push('Необходимо определить')
      return errors
    },
    maxdischargeErrors () {
      const errors = []
      if (!this.$v.data.maxdischarge.$dirty) {
        return errors
      }
      !this.$v.data.maxdischarge.betweenValue && errors.push('Только значения от 0,02 до 0,35')
      !this.$v.data.maxdischarge.outPowerCheck && errors.push('Не должно быть больше нормального значения мощности')
      !this.$v.data.maxdischarge.required && errors.push('Необходимо определить')
      return errors
    },
    underchargingErrors () {
      const errors = []
      if (!this.$v.data.undercharging.$dirty) {
        return errors
      }
      !this.$v.data.undercharging.betweenValue && errors.push('Только значения от 0,4 до 1,0')
      !this.$v.data.undercharging.underchargingCheck && errors.push('Должно быть больше допустимой разрядки')
      !this.$v.data.undercharging.required && errors.push('Необходимо определить')
      return errors
    },

    generationMode: () => GENERATION_USAGE_MODES,
    storageCharge: () => ENERGYSTORAGE_CHARGEBEHAVIORS,
    initState: () => ENERGYSTORAGE_STATES
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
            criticalload: this.data.criticalload,
            blackouttime: this.data.blackouttime,
            tariff: this.data.tariff,

            performance: this.data.performance,
            peckertexponent: this.data.peckertexponent,
            outpower: this.data.outpower,
            overload_enabled: this.data.overload_enabled,
            maxdischarge: this.data.maxdischarge,
            undercharging: this.data.undercharging,
            mode: this.data.mode,
            chargebehavior: this.data.chargebehavior,
            initstate: this.data.initstate
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
