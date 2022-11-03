<template>
  <div class="d-flex align-center">
    <div class="d-flex align-center flex-nowrap ma-2">
      <div>Затраты</div>
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

    <div class="d-flex align-center flex-nowrap ma-2">
      <div>Приход</div>
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
      <div>Потребление</div>
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
      <div>Генерация</div>
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
      <div>Выброс CO2</div>
      <div class="mx-2 px-2">
        <div>
          {{ carbonTotal }}, гCO2экв/кВт*ч
        </div>
        <div class="indigo--text text--accent-4">
          {{ carbon }}, гCO2экв/кВт
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roundToTwoAsStr, formatValueLocale } from '~/assets/helpers'

export default {
  name: 'InformationPanel',

  props: {
    data: {
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
      return roundToTwoAsStr(this.data.credit_total)
    },
    credit () {
      return roundToTwoAsStr(this.data.credit)
    },
    debitTotal () {
      return roundToTwoAsStr(this.data.debit_total)
    },
    debit () {
      return roundToTwoAsStr(this.data.debit)
    },
    energyTotal () {
      return formatValueLocale(this.data.energy_total)
    },
    energy () {
      return formatValueLocale(this.data.energy)
    },
    generationTotal () {
      return formatValueLocale(this.data.generation_total)
    },
    generation () {
      return formatValueLocale(this.data.generation)
    },
    carbonTotal () {
      return formatValueLocale(this.data.carbon_total)
    },
    carbon () {
      return formatValueLocale(this.data.carbon)
    }
  },

  created () {
  }
}
</script>
