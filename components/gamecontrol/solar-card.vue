<template>
  <v-card
    flat
    tile
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="#008000"
      >
        <v-icon dark>
          mdi-solar-power-variant-outline
        </v-icon>
      </v-avatar>
      &laquo;{{ generator.identy }}&raquo;
    </v-card-title>
    <div>
      <p class="px-4">
        Мощность генерации <b>{{ energy }}</b> МВт
      </p>
      <p class="px-4">
        Экологический выброс СО2 <b>{{ carbon }}</b> гCO2экв/кВт*час
      </p>
      <p class="px-4">
        Порог высокой нагрузки <b>{{ highload }}</b>
      </p>
      <p class="px-4">
        Порог критической нагрузки <b>{{ criticalload }}</b>
      </p>
      <p class="px-4">
        Время действия критической нагрузки до блэкаута <b>{{ generator.data.blackouttime }}</b> сек.
      </p>
      <p class="px-4">
        Режим использования <b>{{ generatorMode.text }}</b>
      </p>
      <p class="px-4">
        Стоимость генерации <b>{{ tariff }}</b> руб/кВт
      </p>
    </div>
  </v-card>
</template>

<script>
import {
  formatValueLocale,
  roundToTwoAsStr,

  GENERATION_USAGE_MODES
} from '~/assets/helpers'

export default {
  name: 'SolarCardComponent',

  props: {
    generator: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    energy () {
      return formatValueLocale(this.generator.data.energy)
    },
    carbon () {
      return formatValueLocale(this.generator.data.carbon)
    },
    highload () {
      return formatValueLocale(this.generator.data.highload)
    },
    criticalload () {
      return formatValueLocale(this.generator.data.criticalload)
    },
    generatorMode () {
      return GENERATION_USAGE_MODES.find(e => e.value === this.generator.data.mode)
    },
    tariff () {
      return roundToTwoAsStr(
        this.$store.state.game.tariffs !== undefined
          ? this.$store.state.game.tariffs.t_alternative.sun
          : 0)
    }
  },

  created () {
  },

  methods: {
  }
}
</script>
