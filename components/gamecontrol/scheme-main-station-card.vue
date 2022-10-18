<template>
  <v-card>
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
      &laquo;{{ mainstation.identy !== undefined ? mainstation.identy : '' }}&raquo;
    </v-card-title>
  </v-card>
</template>

<script>
import { ESO_MAINSTATION_TYPE } from '~/assets/helpers'

export default {
  name: 'SchemeMainStationCadr',

  props: {
    address: {
      type: Number,
      required: true,
      default: 0
    }
  },

  data: () => ({
  }),

  computed: {
    mainstation () {
      const items = this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
        .find(e => e.devaddr === this.address)
      return items !== undefined ? items : { }
    }
  }
}
</script>
