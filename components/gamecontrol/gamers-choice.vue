<template>
  <div>
    <v-card flat>
      <v-card-subtitle>
        Доступные потребители
      </v-card-subtitle>
      <v-card-text
        v-if="allconsumers.length !== 0"
        class="ma-0 pa-0"
      >
        <div
          v-for="item in allconsumers"
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
        нет доступных потребителей
      </v-card-text>
      <v-row class="mt-2">
        <v-col
          v-for="(data, index) in scenesData"
          :key="data.mainstation"
        >
          <div class="blue-grey lighten-5 pa-2 text-center">
            {{ getCommandName(data, 'Игрок ' + (index + 1)) }}
          </div>
          <GamerChoiceView :gamer-key="data.mainstation" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import OesShortCard from '~/components/gamecontrol/oes-short-card.vue'
import GamerChoiceView from '~/components/gamecontrol/gamer-choice-view.vue'
import {
  ESO_CONSUMER_TYPE,

  CONSUMER_BY_TYPES
} from '~/assets/helpers'

export default {
  name: 'GamersChoiceView',

  components: { OesShortCard, GamerChoiceView },

  data: () => ({
  }),

  computed: {
    allconsumers () {
      const consumers = this.$store.state.game.gameResources
      const allitems = this.$store.state.game.choiceAll
      let res = []
      if (allitems !== undefined && consumers !== undefined && consumers[ESO_CONSUMER_TYPE] !== undefined) {
        res = CONSUMER_BY_TYPES.map(e => ({
          itemgroup: e,
          items: consumers[ESO_CONSUMER_TYPE].filter(el => allitems.includes(el.devaddr) && el.data.consumertype === e.value)
        }))
      }
      return res.filter(e => e.items.length !== 0)
    },
    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
    }
  },

  methods: {
    getCommandName (data, defname) {
      return data.sceneidentify !== undefined &&
        data.sceneidentify.commandname !== undefined &&
        data.sceneidentify.commandname !== null &&
        data.sceneidentify.commandname.trim()
        ? data.sceneidentify.commandname
        : defname
    }
  }
}
</script>
