<template>
  <v-card flat>
    <v-card-subtitle>
      Параметры аукциона
    </v-card-subtitle>
    <v-card-text>
      <div class="d-flex flex-row">
        <v-text-field
          v-model="params.startingcost"
          class="right-input mr-2"
          type="number"
          hint="начальная стоимость аренды объекта в сутки"
          persistent-hint
          suffix="руб."
          dense
          :readonly="isReadonly"
          :error-messages="checkDecFieldErrors($v.params.startingcost)"
          @input="$v.params.startingcost.$touch()"
          @blur="$v.params.startingcost.$touch()"
        />
        <v-text-field
          v-model="params.lotwaiting"
          class="right-input mr-2"
          type="number"
          hint="время ожидания продажи лота в секундах"
          persistent-hint
          suffix="с"
          dense
          :readonly="isReadonly"
          :error-messages="checkIntFieldErrors($v.params.lotwaiting)"
          @input="$v.params.lotwaiting.$touch()"
          @blur="$v.params.lotwaiting.$touch()"
        />
        <v-text-field
          v-model="params.auctionstep"
          class="right-input"
          type="number"
          hint="шаг аукциона в процентах от начальной стоимости объекта"
          persistent-hint
          suffix="%"
          dense
          :readonly="isReadonly"
          :error-messages="checkIntFieldErrors($v.params.auctionstep)"
          @input="$v.params.auctionstep.$touch()"
          @blur="$v.params.auctionstep.$touch()"
        />
      </div>
    </v-card-text>
    <v-card-text
      v-if="!isReadonly"
      class="d-flex justify-end"
    >
      <v-btn
        class="ma-2"
        color="info"
        :disabled="!paramsChanged"
        @click="applyParameters"
      >
        Принять изменения
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, decimal, between, integer } from 'vuelidate/lib/validators'

Vue.use(Vuelidate)

const checkGtZeroDec = value => value !== undefined && value !== null && value >= 0.0

export default {
  name: 'AuctionParametersCard',

  data: () => ({
    params: {
      startingcost: undefined,
      lotwaiting: undefined,
      auctionstep: undefined
    },
    paramsChanged: false
  }),

  validations: {
    params: {
      startingcost: { required, decimal, checkGtZeroDec },
      lotwaiting: {
        required,
        integer,
        betweenValue: between(10, 60)
      },
      auctionstep: {
        required,
        integer,
        betweenValue: between(5, 50)
      }
    }
  },

  computed: {
    isReadonly () {
      return !this.$store.state.game.hasAdmin
    },
    auctionParams () {
      return this.$store.state.game.auction !== undefined && this.$store.state.game.auction.settings !== undefined
        ? this.$store.state.game.auction.settings
        : {
            startingcost: undefined,
            lotwaiting: undefined,
            auctionstep: undefined
          }
    }
  },

  watch: {
    auctionParams (v) {
      this.params = Object.assign({}, v)
    },
    params: {
      handler (v) {
        this.checkForChanges()
      },
      deep: true
    }
  },

  created () {
    if (process.client) {
      this.params = this.auctionParams
      this.$store.dispatch('game/requestActionData')
    }
  },

  methods: {
    applyParameters () {
      /* eslint-disable no-console */
      console.log('передать изменения')
      /* eslint-enable no-console */
    },
    checkForChanges () {
      this.paramsChanged = !Object
        .keys({ ...this.params, ...this.auctionParams })
        .every(key => Number(this.params[key]) === Number(this.auctionParams[key]))
    },

    checkIntFieldErrors (field) {
      const errors = []
      if (!field.$dirty) {
        return errors
      }
      !field.betweenValue && errors.push(
        `Только значения от ${field.$params.betweenValue.min} до ${field.$params.betweenValue.max}`
      )
      !field.integer && errors.push('Задается целым числом')
      !field.required && errors.push('Необходимо определить')
      return errors
    },
    checkDecFieldErrors (field) {
      const errors = []
      if (!field.$dirty) {
        return errors
      }
      !field.decimal && errors.push('Задается вещественным числом')
      !field.required && errors.push('Необходимо определить')
      !field.checkGtZeroDec && errors.push('Не может быть отрицательным')
      return errors
    }
  }
}
</script>

<style scoped>
  ::v-deep(.right-input) input {
    text-align: right
  }
</style>
