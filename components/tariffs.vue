<template>
  <v-card>
    <v-card-title>Тарифы на электрическую энергию</v-card-title>
    <v-card-text>
      <p>
        Оптовый рынок электрической энергии и мощности (ОРЭМ) – сфера обращения особых товаров (электрической энергии и мощности)
        в рамках Единой энергетической системы России в границах единого экономического пространства Российской Федерации.
        Правовые основы функционирования оптового рынка устанавливаются Федеральным законом от
        26.03.2003 № 35-ФЗ «Об электроэнергетике», Правилами оптового рынка электрической энергии и мощности
        (постановление Правительства Российской Федерации от 27.12.2010 №1172) и иными нормативными правовыми актами,
        предусмотренными правилами оптового рынка.
      </p>
      <p>
        Ценообразование тарифов на электрическую энергию для потребителей формируются на основании стоимости электроэнергии
        (далее - ЭЭ) на:
      </p>
      <body>
        <ul>
          <li>
            оптовом рынке (стоимость производства ЭЭ или стоимость установленная в результате "торгов" между потребителем и генерацией. Нерегулируемая. Доля 40% );
          </li>
          <li>
            тарифа на услуги передачи ЭЭ (надбавка к стоимости ЭЭ на оптовом рынке устанавливается государством, так называемые "котловые". Регулируемая. Доля 55%);
          </li>
          <li>
            сбытовой надбавки продавца ЭЭ на розничном рынке (величина надбавки к стоимости ЭЭ на оптовом рынке устанавливается государством. Регулируемая. Доля 4,9%);
          </li>
          <li>
            прочие услуги инфраструктуры рынка ЭЭ (величина установлена государством. Регулируемая. Доля 0,1%).
          </li>
        </ul>
      </body>
      <p>&nbsp;</p>
      <v-row class="d-inline-flex">
        <v-col>
          <p>
            Администратор системы самостоятельно устанавливает тариф
            <span class="blue--text text--accent-4"><b>T0</b></span>
            на электрическую энергию для оптового
            рынка для региона где проходит игра, руководствуясь информацией о ее стоимости на оптовых рынках
            РФ (например с ресурса
            <a href="https://enerone.ru/analytics/ore_prices/" target="_blank">https://enerone.ru/analytics/ore_prices/</a>>
            или
            <a href="WWW.atsenergo.ru" target="_blank">WWW.atsenergo.ru</a>).
            Далее Программа автоматически рассчитывает тарифы для конечных потребителей (Завод, Больница, Микрорайон).
          </p>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="trade_price"
            class="right-input"
            type="number"
            hint="Стоимость ЭЭ на оптовом рынке (Т0), руб./МВт*ч"
            persistent-hint
            suffix="руб./МВт*ч"
            dense
            step="0.01"
            :error-messages="trade_priceErrors"
            @input="$v.trade_price.$touch()"
            @blur="$v.trade_price.$touch()"
          />
        </v-col>
      </v-row>
      <div class="d-inline-flex">
        <v-card
          class="ma-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Сбытовая надбавка продавца ЭЭ (Т<sup>СН</sup>):
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                уровень мощности до 670 кВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>small</sub>: {{ sales_allowance.tch_small }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень мощности от 670 кВт до 10 мВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>medium</sub>: {{ sales_allowance.tch_avg }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень мощности свыше 10 мВт,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>large</sub>: {{ sales_allowance.tch_large }}</b></span> руб./МВт*ч;
              </li>
              <li>
                усредненная Сбытовая надбавка продавца ЭЭ,
                <span class="blue--text text--accent-4"><b>Т<sup>СН</sup><sub>средний</sub>: {{ sales_allowance.tch_mid }}</b></span> руб./МВт*ч;
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="ma-1"
          outlined
        >
          <v-card-subtitle class="font-weight-bold">
            Тариф (котловой) услуги передачи  ЭЭ (Т<sup>К</sup>):
          </v-card-subtitle>
          <v-card-text>
            <ul>
              <li>
                уровень напряжения ВН (110 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>ВН</sub>: {{ tariff.tk_high }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения СН 1 (35 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>СН1</sub>: {{ tariff.tk_avg_1 }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения СН 2 (3 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>СН2</sub>: {{ tariff.tk_avg_2 }}</b></span> руб./МВт*ч;
              </li>
              <li>
                уровень напряжения НН (0,4 кВ),
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>НН</sub>: {{ tariff.tk_low }}</b></span> руб./МВт*ч;
              </li>
              <li>
                Усредненный Тариф (котловой) услуги передачи  ЭЭ,
                <span class="blue--text text--accent-4"><b>Т<sup>К</sup><sub>средний</sub>: {{ tariff.tk_mid }}</b></span> руб./МВт*ч;
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
    <v-card-title>Технологическое присоединение к электрическим сетям</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="tech_price"
        class="right-input"
        type="number"
        hint="Цена за технологическое присоедиения, руб/МВт"
        persistent-hint
        suffix="руб"
        dense
        step="0.01"
        :error-messages="tech_priceErrors"
        @input="$v.tech_price.$touch()"
        @blur="$v.tech_price.$touch()"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal } from 'vuelidate/lib/validators'
import { roundToTwoAsStr } from '~/assets/helpers'

Vue.use(Vuelidate)

const checkGtZeroDec = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'TariffsComponent',

  data: () => ({
    trade_price: undefined,
    tech_price: undefined,

    tariff: {
      tk_high: undefined,
      tk_avg_1: undefined,
      tk_avg_2: undefined,
      tk_low: undefined,
      tk_mid: undefined
    },
    sales_allowance: {
      tch_small: undefined,
      tch_avg: undefined,
      tch_large: undefined,
      tch_mid: undefined
    }
  }),

  validations: {
    trade_price: { required, decimal, checkGtZeroDec },
    tech_price: { required, decimal, checkGtZeroDec }
  },

  computed: {
    trade_priceErrors () {
      const errors = []
      if (!this.$v.trade_price.$dirty) {
        return errors
      }
      !this.$v.trade_price.decimal && errors.push('Задается вещественным числом')
      !this.$v.trade_price.checkGtZeroDec && errors.push('Не может быть отрицательным')
      !this.$v.trade_price.required && errors.push('Необходимо определить')
      return errors
    },
    tech_priceErrors () {
      const errors = []
      if (!this.$v.tech_price.$dirty) {
        return errors
      }
      !this.$v.tech_price.decimal && errors.push('Задается вещественным числом')
      !this.$v.tech_price.checkGtZeroDec && errors.push('Не может быть отрицательным')
      !this.$v.tech_price.required && errors.push('Необходимо определить')
      return errors
    }
  },

  watch: {
    trade_price (v) {
      this.doCalcTariffs(v)
    }
  },

  created () {
    /* eslint-disable no-console */
    console.info('tariff: created')
    /* eslint-enable no-console */
    this.doCalcTariffs(undefined)
  },

  methods: {
    doCalcTariffs (v) {
      const val = Number(v)
      if (Number.isNaN(val)) {
        this.tariff.tk_high = 0.0
        this.tariff.tk_avg_1 = this.tariff.tk_high
        this.tariff.tk_avg_2 = this.tariff.tk_high
        this.tariff.tk_low = this.tariff.tk_high
        this.tariff.tk_mid = this.tariff.tk_high
        //
        this.sales_allowance.tch_small = this.tariff.tk_high
        this.sales_allowance.tch_avg = this.tariff.tk_high
        this.sales_allowance.tch_large = this.tariff.tk_high
        this.sales_allowance.tch_mid = this.tariff.tk_high
      } else {
        this.tariff.tk_high = val * 0.55
        this.tariff.tk_avg_1 = this.tariff.tk_high * 1.55
        this.tariff.tk_avg_2 = this.tariff.tk_high * 2.21
        this.tariff.tk_low = this.tariff.tk_high * 2.31
        this.tariff.tk_mid = (this.tariff.tk_high + this.tariff.tk_avg_1 + this.tariff.tk_avg_2 + this.tariff.tk_low) / 4.0
        //
        this.sales_allowance.tch_small = (val * 0.049) * 2.61
        this.sales_allowance.tch_avg = (val * 0.049) * 1.12
        this.sales_allowance.tch_large = val * 0.049
        this.sales_allowance.tch_mid = (this.sales_allowance.tch_small + this.sales_allowance.tch_avg + this.sales_allowance.tch_large) / 3.0
      }
      //
      this.tariff.tk_high = roundToTwoAsStr(this.tariff.tk_high)
      this.tariff.tk_avg_1 = roundToTwoAsStr(this.tariff.tk_avg_1)
      this.tariff.tk_avg_2 = roundToTwoAsStr(this.tariff.tk_avg_2)
      this.tariff.tk_low = roundToTwoAsStr(this.tariff.tk_low)
      this.tariff.tk_mid = roundToTwoAsStr(this.tariff.tk_mid)
      //
      this.sales_allowance.tch_small = roundToTwoAsStr(this.sales_allowance.tch_small)
      this.sales_allowance.tch_avg = roundToTwoAsStr(this.sales_allowance.tch_avg)
      this.sales_allowance.tch_large = roundToTwoAsStr(this.sales_allowance.tch_large)
      this.sales_allowance.tch_mid = roundToTwoAsStr(this.sales_allowance.tch_mid)
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
