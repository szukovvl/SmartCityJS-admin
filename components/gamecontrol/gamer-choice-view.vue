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
        class="ma-0 pa-0"
      >
        <div
          v-for="item in gamerchosen"
          :key="item.itemgroup.value"
        >
          <div class="text-subtitle-2 teal lighten-5 pa-2 mb-2">
            Потребители {{ item.itemgroup.text }}
          </div>
          <div class="d-flex flex-wrap">
            <div
              v-for="consumer in item.items"
              :key="consumer.identy"
              class="d-flex flex-nowrap "
            >
              <OesShortCard :consumer="consumer" />
            </div>
          </div>
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
  ESO_CONSUMER_TYPE,
  CONSUMER_BY_TYPES
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
      const choosen = this.$store.state.game.gamersCohice
      let res
      if (choosen !== undefined) {
        res = choosen.find(e => e.key === this.gamerKey)
        if (res !== undefined) {
          res = res.items // получен массив адресов устройств
        }
      }

      const consumers = this.gameResources
      if (res !== undefined && consumers !== undefined && consumers[ESO_CONSUMER_TYPE] !== undefined) {
        res = CONSUMER_BY_TYPES.map(e => ({
          itemgroup: e,
          items: consumers[ESO_CONSUMER_TYPE].filter(el => res.includes(el.devaddr) && el.data.consumertype === e.value)
        }))
      }
      return res !== undefined ? res.filter(e => e.items.length !== 0) : []
    }
  }
}
</script>
