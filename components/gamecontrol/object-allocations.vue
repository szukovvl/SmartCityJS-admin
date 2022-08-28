<template>
  <v-card
    outlined
    tile
  >
    <div v-if="gamerObjectsPreset">
      <div
        v-for="item in gamerObjects"
        :key="item.itemgroup.value"
      >
        <div class="text-subtitle-2 teal lighten-5 pa-2 mb-2">
          Потребители {{ item.itemgroup.text }}
        </div>
        <div class="d-flex flex-wrap">
          <div
            v-for="consumer in item.items"
            :key="consumer.identy"
            class="d-flex flex-nowrap text-body-2"
          >
            <ConsumerCardComponent :consumer="consumer" />
          </div>
        </div>
      </div>
    </div>
    <v-card-text v-else>
      объектов нет
    </v-card-text>
    <v-btn
      v-if="noGameScene && $store.state.game.hasAdmin"
      class="ma-2 text-capitalize"
      color="primary"
      plain
      @click="buildConsumers()"
    >
      Распределить объекты ЭЭ
    </v-btn>

    <v-dialog
      v-model="showDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-toolbar-title>Объекты &laquo;{{ title }}&raquo;</v-toolbar-title>
          <v-spacer />
          <v-btn
            dark
            text
            @click="doApply"
          >
            Принять
          </v-btn>
          <v-btn
            icon
            dark
            @click="doCancel"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text
          v-for="itemgroup in allByTypes"
          :key="itemgroup.itemgroup.value"
        >
          <div v-if="itemgroup.items.length !== 0">
            <div class="text-subtitle-2 teal lighten-5 pa-2 mb-2">
              Потребители {{ itemgroup.itemgroup.text }}
            </div>
            <div class="d-flex flex-wrap">
              <div
                v-for="consumer in itemgroup.items"
                :key="consumer.identy"
                class="d-flex flex-nowrap"
              >
                <v-checkbox
                  v-model="consumer.usedefault"
                  color="success"
                  hide-details
                />
                <ConsumerCardComponent :consumer="consumer.data" />
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ConsumerCardComponent from '~/components/gamecontrol/consumer-card.vue'
import {
  ESO_CONSUMER_TYPE,
  CONSUMER_BY_TYPES,
  GAME_STATUS_NONE
} from '~/assets/helpers'

export default {
  name: 'ObjectAllocationControl',

  components: { ConsumerCardComponent },

  props: {
    title: {
      type: String,
      required: true
    },
    gamerIndex: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    showDialog: false,
    allByTypes: []
  }),

  computed: {
    gamerObjects () {
      const gamerItems = this.$store.state.game.gamerAreas[this.gamerIndex].consumers
      const all = this.$store.state.game.gameResources[ESO_CONSUMER_TYPE]
      let res = []
      if (gamerItems.length !== 0) {
        res = CONSUMER_BY_TYPES.map(e => ({
          itemgroup: e,
          items: all.filter(el => el.data.consumertype === e.value && gamerItems.includes(el.devaddr))
        }))
      }
      return res.filter(e => e.items.length !== 0)
    },
    gamerObjectsPreset () {
      return this.gamerObjects.length !== 0
    },
    noGameScene () {
      return this.$store.state.game.gameStatus === GAME_STATUS_NONE
    }
  },

  methods: {
    buildConsumers () {
      let excludedItems = []
      for (let index = 0; index < this.$store.state.game.gamerAreas.length; index++) {
        if (index !== this.gamerIndex) {
          excludedItems = excludedItems.concat(this.$store.state.game.gamerAreas[index].consumers)
        }
      }
      const usedItems = this.$store.state.game.gamerAreas[this.gamerIndex].consumers

      const allItems = this.$store.state.game.gameResources[ESO_CONSUMER_TYPE]
        .filter(e => !excludedItems.includes(e.devaddr))
      this.allByTypes = CONSUMER_BY_TYPES.map(e => ({
        itemgroup: e,
        items: allItems.filter(el => el.data.consumertype === e.value)
          .map(item => ({ usedefault: usedItems.includes(item.devaddr), data: item }))
      }))

      this.showDialog = true
    },
    consumerUseChanged (consumer, usedefault) {
      consumer.usedefault = usedefault
    },
    doApply () {
      this.showDialog = false
      let usedObjects = []
      this.allByTypes.forEach((e) => {
        usedObjects = usedObjects.concat(e.items.filter(item => item.usedefault).map(item => item.data.devaddr))
      })
      this.$store.dispatch('game/setGamerConsumersByIndex', { data: usedObjects, index: this.gamerIndex })
      this.allByTypes = []
    },
    doCancel () {
      this.showDialog = false
      this.allByTypes = []
    }
  }
}
</script>
