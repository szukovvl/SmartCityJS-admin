<template>
  <div>
    <v-card
      v-if="aregiven.length !== 0"
      flat
    >
      <v-card-subtitle>
        Даны организатором
      </v-card-subtitle>
      <v-card-text class="d-flex flex-wrap ma-0 pa-0">
        <div
          v-for="item in aregiven"
          :key="item.identy"
        >
          <OesShortCard :consumer="item" />
        </div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle>
        Выбраны игроком
      </v-card-subtitle>
      <v-card-text
        v-if="gamerchosen.length !== 0"
        class="d-flex flex-wrap ma-0 pa-0"
      >
        <div
          v-for="item in aregiven"
          :key="item.identy"
        >
          <OesShortCard :consumer="item" />
        </div>
      </v-card-text>
      <v-card-text v-else>
        ничего не выбрано ...
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import OesShortCard from '~/components/gamecontrol/oes-short-card.vue'
import {
  ESO_CONSUMER_TYPE
} from '~/assets/helpers'

export default {
  name: 'GamerChoiceView',

  components: { OesShortCard },

  props: {
    gamerKey: {
      type: Number,
      required: true
    }
  },

  data: () => ({
  }),

  computed: {
    gameResources () {
      return this.$store.state.game.gameResources
    },
    gamerScene () {
      return this.$store.state.game.scenesData !== undefined
        ? this.$store.state.game.scenesData.find(e => e.mainstation === this.gamerKey)
        : undefined
    },
    aregiven () { // даны организатором
      return this.gamerScene !== undefined && this.gameResources !== undefined && this.gameResources[ESO_CONSUMER_TYPE] !== undefined
        ? this.gamerScene.consumers !== undefined
          ? this.gameResources[ESO_CONSUMER_TYPE].filter(e => this.gamerScene.consumers.includes(e.devaddr))
          : []
        : []
    },
    gamerchosen () { // выбраны игроком
      return this.gamerScene !== undefined && this.gameResources !== undefined && this.gameResources[ESO_CONSUMER_TYPE] !== undefined
        ? this.gamerScene.gamerchosen !== undefined
          ? this.gameResources[ESO_CONSUMER_TYPE].filter(e => this.gamerScene.gamerchosen.includes(e.devaddr))
          : []
        : []
    }
  }
}
</script>
