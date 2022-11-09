<template>
  <div class="d-flex align-center">
    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon
        color="green"
      >
        mdi-sprout-outline
      </v-icon>
      <div class="mx-2 px-2">
        <div>
          {{ carbonTotal }}, гCO2экв/кВт*ч
        </div>
        <div class="indigo--text text--accent-4">
          {{ carbon }}, гCO2экв/кВт
        </div>
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon
        color="orange"
      >
        mdi-power-plug-outline
      </v-icon>
      <div class="mx-2 px-2">
        <div>
          {{ energyTotal }}, МВт*ч
        </div>
        <div class="indigo--text text--accent-4">
          {{ energy }}, МВт
        </div>
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon
        color="blue"
      >
        mdi-lightning-bolt
      </v-icon>
      <div class="mx-2 px-2">
        <div>
          {{ generationTotal }}, МВт*ч
        </div>
        <div class="indigo--text text--accent-4">
          {{ generation }}, МВт
        </div>
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon
        color="indigo"
      >
        mdi-piggy-bank-outline
      </v-icon>
      <div class="mx-2 px-2">
        <div>
          {{ debitTotal }}
        </div>
        <div class="indigo--text text--accent-4">
          {{ debit }}
        </div>
      </div>
      <div>
        <v-icon>
          mdi-currency-rub
        </v-icon>
      </div>
    </div>

    <div class="d-flex align-center flex-nowrap ma-2">
      <v-icon
        color="indigo"
      >
        mdi-credit-card-refund-outline
      </v-icon>
      <div class="mx-2 px-2">
        <div>
          {{ creditTotal }}
        </div>
        <div class="indigo--text text--accent-4">
          {{ credit }}
        </div>
      </div>
      <div>
        <v-icon>
          mdi-currency-rub
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { roundToTwoAsStr, formatValueLocale } from '~/assets/helpers'

export default {
  name: 'InformationPanel',

  props: {
    dataset: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
    creditTotal () {
      return roundToTwoAsStr(this.dataset.cumulative_total !== undefined ? this.dataset.cumulative_total.credit : 0)
    },
    credit () {
      return roundToTwoAsStr(this.dataset.instant_values !== undefined ? this.dataset.instant_values.credit : 0)
    },
    debitTotal () {
      return roundToTwoAsStr(this.dataset.cumulative_total !== undefined ? this.dataset.cumulative_total.debit : 0)
    },
    debit () {
      return roundToTwoAsStr(this.dataset.instant_values !== undefined ? this.dataset.instant_values.debit : 0)
    },
    energyTotal () {
      return formatValueLocale(this.dataset.cumulative_total !== undefined ? this.dataset.cumulative_total.energy : 0)
    },
    energy () {
      return formatValueLocale(this.dataset.instant_values !== undefined ? this.dataset.instant_values.energy : 0)
    },
    generationTotal () {
      return formatValueLocale(this.dataset.cumulative_total !== undefined ? this.dataset.cumulative_total.generation : 0)
    },
    generation () {
      return formatValueLocale(this.dataset.instant_values !== undefined ? this.dataset.instant_values.generation : 0)
    },
    carbonTotal () {
      return formatValueLocale(this.dataset.cumulative_total !== undefined ? this.dataset.cumulative_total.carbon : 0)
    },
    carbon () {
      return formatValueLocale(this.dataset.instant_values !== undefined ? this.dataset.instant_values.carbon : 0)
    }
  },

  created () {
  },

  methods: {
  }
}
</script>
