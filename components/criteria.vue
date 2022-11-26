<template>
  <v-card>
    <v-card-title>
      Критерии оценки игры
    </v-card-title>
    <v-card-subtitle>
      За каждый игровой период (сек/мин/час) происходит расчет эффективности ЭЭС (Электроэнергетической системы)
      по критериям &laquo;К&raquo; (&laquo;Баланса мощности энергосистемы&raquo;, &laquo;Экономическая эффективность&raquo;, &laquo;Экологичность&raquo;.
    </v-card-subtitle>
    <v-card-subtitle>
      Критерии оценки  результатов <code>К<sub>оценки</sub>> = К<sub>БМ</sub> + К<sub>ЭЭ</sub> +К<sub>СО2</sub>> = 60% + 40% + 10% = 100%</code>.
      Игрок набравший Коценки - победитель.
    </v-card-subtitle>
    <v-card-subtitle class="font-weight-bold">
      Баланс мощности
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <p>
        Главным условием обеспечения надежного электроснабжения потребителей является
        соблюдение в каждый момент времени баланса мощности системы, т. е.
        выполнение условия равенства потребительской нагрузки (спроса) и мощности,
        с которой в данный момент времени работают все электростанции (предложения).
        Для соблюдения баланса мощности в ЭЭС необходимо иметь в каждый момент времени
        определенные запасы энергетических ресурсов (резерв энергии) и дополнительные энергетические мощности.
      </p>
      <p>
        <sup>(1)</sup> п. 4.4.2 &laquo;Методические рекомендации по проектированию развития энергосистем&raquo;
        СО 153-34.20.118-2003 Рекомендуется принимать значения необходимого резерва мощности процентом от
        максимума нагрузки Европейская секция ЕЭС - 17% (ОЭС Сибири - 12%; ОЭС Востока - 22%).
        п. 4.7. Баланс мощности считается удовлетворительным, если дефицит (избыток)
        (с учетом балансовых перетоков) не превышает половины мощности наиболее крупного агрегата объединения.
      </p>
      <p>
        Баланс мощностей – это тоже, что и закон сохранения энергии,
        но для электрической цепи. Баланс мощностей - сумма мощностей потребляемых приемниками (Pпр),
        равна сумме мощностей отдаваемых источниками (Pисп), <code>Рпр = Рист</code>.
      </p>
      <p>
        Администратор системы самостоятельно устанавливает значимость критерия &laquo;БАЛАНС МОЩНОСТИ&raquo; энергосистемы,
        руководствуясь сценарием игры.
      </p>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-row class="d-inline-flex align-center">
        <v-col>
          Баланс мощности (эффективность) для 1 часа работы  электроэнергетической системы (К<sub>БМ</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="data.power_balance"
            class="right-input"
            type="number"
            suffix="%"
            dense
            :error-messages="check_for_errors($v.data.power_balance)"
            @input="$v.data.power_balance.$touch()"
            @blur="$v.data.power_balance.$touch()"
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>БМ</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            v-model="data.coef_power_balance.k1"
            class="right-input"
            type="number"
            hint="мощность потребления равна мошности генерации баланс (Рпр/Рист = 0)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_power_balance.k1)"
            @input="$v.data.coef_power_balance.k1.$touch()"
            @blur="$v.data.coef_power_balance.k1.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_power_balance.k2"
            class="right-input"
            type="number"
            hint="мощность потребления больше мощности генерации баланс отрицательный (Рпр/Рист < 0)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_power_balance.k2)"
            @input="$v.data.coef_power_balance.k2.$touch()"
            @blur="$v.data.coef_power_balance.k2.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_power_balance.k3"
            class="right-input"
            type="number"
            hint="мощность потребления меньше мошности генерации баланс положительный (Рпр/Рист ≦ 0) (17%)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_power_balance.k3)"
            @input="$v.data.coef_power_balance.k3.$touch()"
            @blur="$v.data.coef_power_balance.k3.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_power_balance.k4"
            class="right-input"
            type="number"
            hint="баланс положительный (Рпр/Рист < 0) (потребления меньше генерации 12%)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_power_balance.k4)"
            @input="$v.data.coef_power_balance.k4.$touch()"
            @blur="$v.data.coef_power_balance.k4.$touch()"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-subtitle class="font-weight-bold">
      Экономическая эффективность
    </v-card-subtitle>
    <v-card-text>
      <p>
        Приходная часть  деньги собранные с потребителя
      </p>
      <p>
        Результатом финансовой деятельности энергетического предприятия является прибыль.
        Прибыль — превышение дохода над расходами. Обратная величина называется убытком.
        С экономической точки зрения прибыль — разница между денежными поступлениями и денежными расходами.
        Прибыль — характеризует экономический эффект, полученный в результате деятельности предприятия.
        Рентабельность — это экономический показатель, который показывает, насколько эффективно используются ресурсы.
      </p>
      <v-row class="d-inline-flex align-center">
        <v-col>
          Экономическая эффективность для 1 часа работы  электроэнергетической системы (К<sub>ЭЭ</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="data.economic"
            class="right-input"
            type="number"
            suffix="%"
            dense
            :error-messages="check_for_errors($v.data.economic)"
            @input="$v.data.economic.$touch()"
            @blur="$v.data.economic.$touch()"
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>ЭЭ</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            v-model="data.coef_economic.k1"
            class="right-input"
            type="number"
            hint="приходная часть равна расходной части баланс (Пприход/Зрасход = 0)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_economic.k1)"
            @input="$v.data.coef_economic.k1.$touch()"
            @blur="$v.data.coef_economic.k1.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_economic.k2"
            class="right-input"
            type="number"
            hint="приходная часть меньше расходной части баланс (Пприход/Зрасход < 0)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_economic.k2)"
            @input="$v.data.coef_economic.k2.$touch()"
            @blur="$v.data.coef_economic.k2.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_economic.k3"
            class="right-input"
            type="number"
            hint="приходная часть больше расходной части баланс (Пприход/Зрасход > 0)"
            persistent-hint
            dense
            step="0.01"
            :error-messages="check_for_errors($v.data.coef_economic.k3)"
            @input="$v.data.coef_economic.k3.$touch()"
            @blur="$v.data.coef_economic.k3.$touch()"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-subtitle class="font-weight-bold">
      Экологичность
    </v-card-subtitle>
    <v-card-text>
      <p>
        Негативного воздействия на окружающую среду источника энергии
      </p>
      <p>
        Администратор системы самостоятельно устанавливает значимость критерия &laquo;ЭКОЛОГИЧЕСКАЯ ЭФФЕКТИВНОСТЬ&raquo;
        энергосистемы, руководствуясь сценарием игры.
      </p>
      <v-row class="d-inline-flex align-center">
        <v-col>
          Экономическая эффективность для 1 часа работы  электроэнергетической системы (К<sub>CO2</sub>)
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="data.ecology"
            class="right-input"
            type="number"
            suffix="%"
            dense
            :error-messages="check_for_errors($v.data.ecology)"
            @input="$v.data.ecology.$touch()"
            @blur="$v.data.ecology.$touch()"
          />
        </v-col>
      </v-row>
      <p>
        Коэффициенты критерии оценки (К<sub>CO2</sub>)
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <v-text-field
            v-model="data.coef_ecology.k1"
            class="right-input"
            type="number"
            hint="величина выброс СО2 от 0 до 200 (кг)"
            persistent-hint
            dense
            step="0.001"
            :error-messages="check_for_errors($v.data.coef_ecology.k1)"
            @input="$v.data.coef_ecology.k1.$touch()"
            @blur="$v.data.coef_ecology.k1.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_ecology.k2"
            class="right-input"
            type="number"
            hint="величина выброс СО2 от 200 до 800 (кг)"
            persistent-hint
            dense
            step="0.001"
            :error-messages="check_for_errors($v.data.coef_ecology.k2)"
            @input="$v.data.coef_ecology.k2.$touch()"
            @blur="$v.data.coef_ecology.k2.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_ecology.k3"
            class="right-input"
            type="number"
            hint="величина выброс СО2 от 800 и более (кг)"
            persistent-hint
            dense
            step="0.001"
            :error-messages="check_for_errors($v.data.coef_ecology.k3)"
            @input="$v.data.coef_ecology.k3.$touch()"
            @blur="$v.data.coef_ecology.k3.$touch()"
          />
        </v-col>
        <!-- v-col>
          <v-text-field
            v-model="data.coef_ecology.k4"
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Дизель Генерация - 930"
            persistent-hint
            dense
            step="0.001"
            :error-messages="check_for_errors($v.data.coef_ecology.k4)"
            @input="$v.data.coef_ecology.k4.$touch()"
            @blur="$v.data.coef_ecology.k4.$touch()"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="data.coef_ecology.k5"
            class="right-input"
            type="number"
            hint="выброс гСО2-экв на 1 кВт*ч для ЭЭ на Хранилище - 798,9"
            persistent-hint
            dense
            step="0.001"
            :error-messages="check_for_errors($v.data.coef_ecology.k5)"
            @input="$v.data.coef_ecology.k5.$touch()"
            @blur="$v.data.coef_ecology.k5.$touch()"
          />
        </v-col -->
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import { API_CRITERIA_SERVICE, DELAY_BEFORE_SAVE_CHANGES } from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGtZeroDec = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'CriteriaComponent',

  data: () => ({
    data: {
      power_balance: undefined,
      coef_power_balance: {
        k1: undefined,
        k2: undefined,
        k3: undefined,
        k4: undefined
      },
      economic: undefined,
      coef_economic: {
        k1: undefined,
        k2: undefined,
        k3: undefined
      },
      ecology: undefined,
      coef_ecology: {
        k1: undefined,
        k2: undefined,
        k3: undefined,
        k4: undefined,
        k5: undefined
      }
    },
    data_enabled: false,
    taimerHandler: undefined
  }),

  validations: {
    data: {
      power_balance: { required, decimal, checkGtZeroDec },
      coef_power_balance: {
        k1: { required, decimal, checkGtZeroDec },
        k2: { required, decimal, checkGtZeroDec },
        k3: { required, decimal, checkGtZeroDec },
        k4: { required, decimal, checkGtZeroDec }
      },
      economic: { required, decimal, checkGtZeroDec },
      coef_economic: {
        k1: { required, decimal, checkGtZeroDec },
        k2: { required, decimal, checkGtZeroDec },
        k3: { required, decimal, checkGtZeroDec }
      },
      ecology: { required, decimal, checkGtZeroDec },
      coef_ecology: {
        k1: { required, decimal, checkGtZeroDec },
        k2: { required, decimal, checkGtZeroDec },
        k3: { required, decimal, checkGtZeroDec },
        k4: { required, decimal, checkGtZeroDec },
        k5: { required, decimal, checkGtZeroDec }
      }
    }
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
    this.loadCriteria()
  },

  methods: {
    check_for_errors (field) {
      const errors = []
      if (!field.$dirty) {
        return errors
      }
      !field.decimal && errors.push('Задается вещественным числом')
      !field.required && errors.push('Необходимо определить')
      !field.checkGtZeroDec && errors.push('Не может быть отрицательным')
      return errors
    },

    saveChanges () {
      clearTimeout(this.taimerHandler)
      this.taimerHandler = undefined

      this.$v.data.$touch()
      if (this.$v.data.$invalid) {
        return
      }

      this.taimerHandler = setTimeout(() => {
        this.taimerHandler = undefined
        this.$v.data.$touch()
        if (this.$v.data.$invalid) {
          return
        }
        this.$axios.$put(API_CRITERIA_SERVICE, this.data, { progress: false })
          // .then((v) => {})
          .catch((error) => {
            /* eslint-disable no-console */
            if (error.response) {
              console.error('ошибка %d: %s', error.response.status, error.response.data)
            }
            /* eslint-enable no-console */
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    },
    loadCriteria () {
      this.$axios.$get(API_CRITERIA_SERVICE, { progress: false })
        .then((v) => {
          this.data = v
        })
        .catch((error) => {
          /* eslint-disable no-console */
          if (error.response) {
            console.error('ошибка %d: %s', error.response.status, error.response.data)
          }
          /* eslint-enable no-console */
          this.data_enabled = true
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
