<template>
  <v-card>
    <v-card-title>Тарифы на электрическую энергию</v-card-title>
    <v-card-text>
      <p>
        Оптовый рынок электрической энергии и мощности (ОРЭМ) –
        сфера обращения особых товаров (электрической энергии и мощности)
        в рамках Единой энергетической системы России в границах единого экономического пространства Российской Федерации.
        Правовые основы функционирования оптового рынка устанавливаются Федеральным законом от 26.03.2003 № 35-ФЗ «Об электроэнергетике»,
        Правилами оптового рынка электрической энергии и мощности
        (постановление Правительства Российской Федерации от 27.12.2010 №1172)
        и иными нормативными правовыми актами, предусмотренными правилами оптового рынка.
      </p>
      <v-row class="d-inline-flex">
        <v-col>
          <p>
            Тарифы на электрическую энергию для потребителей формируются на основании цены за электроэнергию на оптовом рынке.
          </p>
          <p>
            Администратор системы самостоятельно устанавливает тариф
            <span class="blue--text text--accent-4"><b>T0</b></span>
            на электрическую энергию для оптового рынка,
            руководствуясь информацией о стоимости электрической энергии на оптовых рынках РФ.
          </p>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="trade_price"
            class="right-input"
            type="number"
            hint="Цена электроэнергии на оптовом рынке, руб/МВт*час"
            persistent-hint
            suffix="руб"
            dense
            step="0.01"
            :error-messages="trade_priceErrors"
            @input="$v.trade_price.$touch()"
            @blur="$v.trade_price.$touch()"
          />
        </v-col>
      </v-row>
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

Vue.use(Vuelidate)

const checkGtZeroDec = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'TariffsComponent',

  data: () => ({
    trade_price: undefined,
    tech_price: undefined
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

  created () {
    /* eslint-disable no-console */
    console.info('tariff: created')
    /* eslint-enable no-console */
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
