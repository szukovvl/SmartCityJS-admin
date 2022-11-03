<template>
  <v-row class="mt-2">
    <v-col
      v-for="(data, index) in scheme"
      :key="data.root.address"
    >
      <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        {{ 'Игрок ' + (index + 1) }}
      </div>
      <GamerAreaComponent :data="data" />
    </v-col>
  </v-row>
</template>

<script>
import GamerAreaComponent from '~/components/gameprocess/gamer-area.vue'

export default {
  name: 'GameGlobalComponent',

  components: { GamerAreaComponent },

  data: () => ({
  }),

  computed: {
    scheme () {
      const items = this.$store.state.game.prepareData
      return items !== undefined ? items : []
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.game.prepareData.length === 0) {
        this.$store.dispatch('game/requestProcessData')
      }
    }
  }
}
</script>
