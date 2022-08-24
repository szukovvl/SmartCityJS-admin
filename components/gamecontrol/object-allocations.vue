<template>
  <v-card
    outlined
    tile
  >
    <v-card-text>объектов нет</v-card-text>
    <v-btn
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
            <ConsumerCardComponent
              v-for="consumer in itemgroup.items"
              :key="consumer.identy"
              :consumer="consumer"
              @consumerUseChanged="consumerUseChanged"
            />
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
  CONSUMER_BY_TYPES
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
