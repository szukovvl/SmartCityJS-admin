<template>
  <v-row class="mt-2">
    <v-col
      v-for="(data, index) in scheme"
      :key="data.root.address"
    >
      <div class="d-flex align-center text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        <div>
          {{ getCommandName(data, 'Игрок ' + (index + 1)) }}
        </div>
        <v-spacer />
        <div
          v-if="getGameSeconds(data.root.address) !== 0"
        >
          <v-icon
            small
            dark
          >
            mdi-alarm
          </v-icon>
          {{ secondsAsString(getGameSeconds(data.root.address)) }}
        </div>
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
    },
    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.game.prepareData.length === 0) {
        this.$store.dispatch('game/requestProcessData')
      }
      if (this.scenesData.length === 0) {
        this.$store.dispatch('game/requestScanesData')
      }
    }
  },

  methods: {
    getGameSeconds (key) {
      const item = this.$store.state.game.datasets.find(e => e.key === key)
      return item !== undefined ? item.seconds : 0
    },
    secondsAsString (seconds) {
      const dataobj = new Date(0, 0, 0, 0, 0, 0)
      dataobj.setSeconds(seconds)
      return dataobj.toLocaleTimeString()
    },
    getCommandName (data, defname) {
      const scene = this.scenesData.find(e => e.mainstation === data.root.address)
      return scene !== undefined &&
        scene.sceneidentify !== undefined &&
        scene.sceneidentify.commandname !== undefined &&
        scene.sceneidentify.commandname !== null &&
        scene.sceneidentify.commandname.trim()
        ? scene.sceneidentify.commandname
        : defname
    }
  }
}
</script>
