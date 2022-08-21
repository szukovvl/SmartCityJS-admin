<template>
  <v-card
    class="teal lighten-5"
    flat
    tile
  >
    <v-card-text class="font-weight-bold">
      {{ line.identy }}
    </v-card-text>
    <p class="px-4">
      Мощность подсети <b>{{ energy }}</b>, МВт
    </p>
    <p class="px-4">
      Потери в подсети <b>{{ lossfactor }}</b>
    </p>
    <p class="px-4">
      Транспорт энергии <b>{{ tariff }}</b> руб/МВт
    </p>
  </v-card>
</template>

<script>
import {
  formatValueLocale,
  roundToTwoAsStr
} from '~/assets/helpers'

export default {
  name: 'SubnetControl',

  props: {
    line: {
      type: Object,
      required: true
    },
    tariffData: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
  }),

  computed: {
    energy () {
      return formatValueLocale(this.line.data.energy, 1)
    },
    lossfactor () {
      return formatValueLocale(this.line.data.lossfactor)
    },
    tariff () {
      return roundToTwoAsStr(this.tariffData)
    }
  }
}
</script>
