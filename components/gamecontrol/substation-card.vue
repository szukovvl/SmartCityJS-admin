<template>
  <v-card
    outlined
    tile
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="amber darken-3"
      >
        <v-icon dark>
          mdi-home-lightning-bolt
        </v-icon>
      </v-avatar>
      &laquo;{{ station !== undefined ? station.identy : '' }}&raquo;
    </v-card-title>
    <v-divider
      class="info"
      style="opacity: 0.35"
    />
    <v-card-text class="d-flex flex-wrap justify-space-around">
      <SubnetControl
        v-for="line in outputLines"
        :key="line.identy"
        class="ma-1"
        :line="line"
        :tariff-data="$store.state.game.tariffs !== undefined ? $store.state.game.tariffs.tariff.tk_low : 0"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import SubnetControl from '~/components/gamecontrol/subnet-card.vue'

export default {
  name: 'SubstationCardControl',

  components: { SubnetControl },

  props: {
    station: {
      type: Object,
      default: undefined
    }
  },

  data: () => ({
  }),

  computed: {
    outputLines () {
      return this.station !== undefined ? this.station.data.outputs : []
    }
  }
}
</script>
