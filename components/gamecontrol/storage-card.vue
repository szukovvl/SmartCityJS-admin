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
      &laquo;{{ storage.identy }}&raquo;
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
          {{ storage.data.overload_enabled
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
        Время действия критической нагрузки до блэкаута <b>{{ storage.data.blackouttime }}</b> сек.
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
    storage: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    energy () {
      return formatValueLocale(this.storage.data.energy)
    },
    carbon () {
      return formatValueLocale(this.storage.data.carbon)
    },
    performance () {
      return formatValueLocale(this.storage.data.performance)
    },
    peckertexponent () {
      return formatValueLocale(this.storage.data.peckertexponent)
    },
    outpower () {
      return formatValueLocale(this.storage.data.outpower)
    },
    maxdischarge () {
      return formatValueLocale(this.storage.data.maxdischarge)
    },
    undercharging () {
      return formatValueLocale(this.storage.data.undercharging)
    },
    criticalload () {
      return formatValueLocale(this.storage.data.criticalload)
    },
    storageMode () {
      return GENERATION_USAGE_MODES.find(e => e.value === this.storage.data.mode)
    },
    chargebehavior () {
      return ENERGYSTORAGE_CHARGEBEHAVIORS.find(e => e.value === this.storage.data.chargebehavior)
    },
    initstate () {
      return ENERGYSTORAGE_STATES.find(e => e.value === this.storage.data.initstate)
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
