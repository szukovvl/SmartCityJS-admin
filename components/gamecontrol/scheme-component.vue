<template>
  <v-row class="mt-2">
    <v-col
      v-for="(data, index) in schemeData"
      :key="data.gamerkey"
    >
      <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        {{ getCommandName(data, 'Игрок ' + (index + 1)) }}
      </div>
      <div>
        <SchemeOesView :data="scheme.find(e => e.address == data.gamerkey)" />
        <SchemeView :data="scheme.find(e => e.address == data.gamerkey)" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import SchemeView from '~/components/gamecontrol/scheme-view.vue'
import SchemeOesView from '~/components/gamecontrol/scheme-oes-view.vue'

export default {
  name: 'SchemeComponent',

  components: { SchemeOesView, SchemeView },

  data: () => ({
  }),

  computed: {
    schemeData () {
      const items = this.$store.state.game.schemeData
      return items !== undefined ? items : []
    },
    scheme () {
      const items = this.$store.state.game.scheme
      return items !== undefined ? items : []
    },
    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.game.schemeData === undefined ||
      this.$store.state.game.scheme === undefined ||
      this.$store.state.game.schemeData.length === 0 ||
      this.$store.state.game.scheme.length === 0) {
        this.$store.dispatch('game/requestSchemesData')
      }
      if (this.scenesData.length === 0) {
        this.$store.dispatch('game/requestScanesData')
      }
    }
  },

  methods: {
    getCommandName (data, defname) {
      const scene = this.scenesData.find(e => e.mainstation === data.gamerkey)
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
