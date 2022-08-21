<template>
  <v-card
    outlined
    tile
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="#00F"
      >
        <v-icon dark>
          mdi-space-station
        </v-icon>
      </v-avatar>
      &laquo;{{ mainstation !== undefined ? mainstation.identy : '' }}&raquo;
      <v-icon
        class="ml-4"
        :color="stationlaunched ? 'indigo accent-4' : 'amber darken-3'"
      >
        {{ stationlaunched ? 'mdi-rocket-launch-outline' : 'mdi-power-standby' }}
      </v-icon>
      <v-spacer />
      <v-btn
        class="mx-2"
        outlined
        fab
        small
        color="teal"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider
      class="info"
      style="opacity: 0.35"
    />
    <v-card-text class="d-flex flex-wrap justify-space-around">
      <p>
        Мощность надежного источника энергии <b>{{ externalEnergy }}</b>, МВт
      </p>
      <p>
        экологический выброс СО2 <b>{{ carbon }}</b>, гCO2экв/кВт*час
      </p>
    </v-card-text>
    <v-divider
      class="info"
      style="opacity: 0.35"
    />
    <v-card-text class="font-weight-bold">
      подсети ввода
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-space-around">
      <SubnetControl
        v-for="line in inputLines"
        :key="line.identy"
        class="ma-1"
        :line="line"
        :tariff-data="$store.state.game.tariffs !== undefined ? $store.state.game.tariffs.tariff.tk_avg_1 : 0"
      />
    </v-card-text>
    <v-divider
      class="info"
      style="opacity: 0.35"
    />
    <v-card-text class="font-weight-bold">
      подсети вывода
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-space-around">
      <SubnetControl
        v-for="line in outputLines"
        :key="line.identy"
        class="ma-1"
        :line="line"
        :tariff-data="$store.state.game.tariffs !== undefined ? $store.state.game.tariffs.tariff.tk_avg_1 : 0"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import SubnetControl from '~/components/gamecontrol/subnet-card.vue'
import {
  formatValueLocale
} from '~/assets/helpers'

export default {
  name: 'MainStationMonitorControl',

  components: { SubnetControl },

  props: {
    mainstation: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    stationlaunched: false
  }),

  computed: {
    inputLines () {
      return this.mainstation !== undefined ? this.mainstation.data.inputs : []
    },
    outputLines () {
      return this.mainstation !== undefined ? this.mainstation.data.outputs : []
    },
    externalEnergy () {
      return formatValueLocale(this.mainstation.data.external_energy, 1)
    },
    carbon () {
      return formatValueLocale(this.mainstation.data.carbon, 2)
    }
  }
}
</script>
