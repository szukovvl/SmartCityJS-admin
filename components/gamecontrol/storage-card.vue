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
          mdi-battery-charging-70
        </v-icon>
      </v-avatar>
      &laquo;{{ generator.identy }}&raquo;
    </v-card-title>
    <div>
      <p class="px-4">
        Емкость хранилища <b>{{ energy }}</b> МВт*час
      </p>
      <p class="px-4">
        Экологический выброс СО2 <b>{{ carbon }}</b> гCO2экв/кВт*час
      </p>
      <p class="px-4">
        Показатель эффективности системы хранения <b>{{ performance }}</b>
      </p>
      <p class="px-4">
        Экспонента Пекерта <b>{{ peckertexponent }}</b>
      </p>
      <p class="px-4">
        Нормалььно значение отдаваемой мощности <b>{{ outpower }}</b>
      </p>
      <p class="px-4">
        <b>
          {{ generator.data.overload_enabled
            ? 'Разрешено превышать границу нормального значения мощности'
            : 'Запрещено превышать границу нормального значения мощности' }}
        </b>
      </p>
      <p class="px-4">
        Максимальная разрядка хранилища <b>{{ maxdischarge }}</b>
      </p>
      <p class="px-4">
        Недозарядка при повторном использовании <b>{{ undercharging }}</b>
      </p>
      <p class="px-4">
        Порог критической нагрузки <b>{{ criticalload }}</b>
      </p>
      <p class="px-4">
        Время действия критической нагрузки до блэкаута <b>{{ generator.data.blackouttime }}</b> сек.
      </p>
      <p class="px-4">
        Режим использования <b>{{ storageMode.text }}</b>
      </p>
      <p class="px-4">
        Восстановление хранилища <b>{{ chargebehavior.text }}</b>
      </p>
      <p class="px-4">
        Начальное состояние в игровом сценарии <b>{{ initstate.text }}</b>
      </p>
      <p class="px-4">
        Стоимость электроэнергии <b>{{ tariff }}</b> руб/кВт
      </p>
    </div>
  </v-card>
</template>

<script>
import {
  formatValueLocale,
  roundToTwoAsStr,

  GENERATION_USAGE_MODES,
  ENERGYSTORAGE_CHARGEBEHAVIORS,
  ENERGYSTORAGE_STATES
} from '~/assets/helpers'

export default {
  name: 'StorageCardComponent',

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
    performance () {
      return formatValueLocale(this.generator.data.performance)
    },
    peckertexponent () {
      return formatValueLocale(this.generator.data.peckertexponent)
    },
    outpower () {
      return formatValueLocale(this.generator.data.outpower)
    },
    maxdischarge () {
      return formatValueLocale(this.generator.data.maxdischarge)
    },
    undercharging () {
      return formatValueLocale(this.generator.data.undercharging)
    },
    criticalload () {
      return formatValueLocale(this.generator.data.criticalload)
    },
    storageMode () {
      return GENERATION_USAGE_MODES.find(e => e.value === this.generator.data.mode)
    },
    chargebehavior () {
      return ENERGYSTORAGE_CHARGEBEHAVIORS.find(e => e.value === this.generator.data.chargebehavior)
    },
    initstate () {
      return ENERGYSTORAGE_STATES.find(e => e.value === this.generator.data.initstate)
    },
    tariff () {
      return roundToTwoAsStr(
        this.$store.state.game.tariffs !== undefined
          ? this.$store.state.game.tariffs.t_alternative.storage
          : 0)
    }
  },

  created () {
  },

  methods: {
  }
}
</script>
