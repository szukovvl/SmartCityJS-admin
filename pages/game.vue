<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card
      flat
      tile
    >
      <v-toolbar
        flat
        tile
        outlined
        short
      >
        <v-icon
          v-if="$store.state.game.hasAdmin"
          class="mx-6"
          color="light-green accent-4"
        >
          mdi-shield-account-outline
        </v-icon>
        <v-icon
          v-else-if="$store.state.game.info.administrationLocked"
          class="mx-6"
          color="amber"
        >
          mdi-lock-outline
        </v-icon>
        <v-icon
          v-else
          class="mx-6"
        >
          mdi-lock-open-outline
        </v-icon>
        <v-badge
          class="mx-6"
          :content="$store.state.game.info.gamersCount"
          overlap
          bottom
          bordered
          color="light-green accent-4"
          :value="$store.state.game.info.gamersCount !== 0"
        >
          <v-icon
            :color="$store.state.game.info.gamersCount !== 0 ? 'light-green accent-4' : ''"
          >
            mdi-card-account-details-outline
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="$store.state.game.info.guestsCount"
          overlap
          bottom
          bordered
          color="light-green accent-4"
          :value="$store.state.game.info.guestsCount !== 0"
        >
          <v-icon
            :color="$store.state.game.info.guestsCount !== 0 ? 'light-green accent-4' : ''"
          >
            mdi-account-multiple-outline
          </v-icon>
        </v-badge>
        <v-spacer />
        <v-icon
          v-if="$store.state.game.errorEvent !== undefined"
          class="mx-6"
          color="amber accent-4"
        >
          mdi-alert-circle-outline
        </v-icon>
        <v-icon
          v-if="!$store.state.game.isConnected"
          class="mx-6"
          color="red"
        >
          mdi-connection
        </v-icon>
      </v-toolbar>
      <v-expansion-panels
        v-model="panels"
        class="mt-1"
        accordion
        multiple
        flat
        tile
      >
        <v-expansion-panel>
          <v-expansion-panel-header class="teal lighten-5">
            Подготовка игрового сценария
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-select
                v-model="gametime"
                :items="gameTimes"
                hint="выберите из списка продолжительность игровых суток (ЧЧ:ММ)"
                persistent-hint
                dense
                :readonly="!$store.state.game.hasAdmin"
              />
            </div>
            <div class="mt-4">
              Начальное распределение объектов по игрокам
            </div>
            <v-divider class="info" />
            <v-row class="mt-2">
              <v-col
                v-for="(station, index) in mainstations"
                :key="station.identy"
              >
                <GamerAreaComponent :title="'Игрок ' + (index + 1)" :gamer-index="index" :mainstation="station" />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-btn
          v-if="noGameScene && $store.state.game.hasAdmin"
          class="ma-2"
          color="success"
          @click="doBeginGameScenes"
        >
          Начать игровой сценарий
        </v-btn>
        <v-expansion-panel>
          <v-expansion-panel-header class="teal lighten-5">
            Сцена 1
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="mt-4">
              регистрация игроков
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>
import GamerAreaComponent from '~/components/gamecontrol/gamer-area.vue'
import { nextTimePoint } from '~/assets/datetime'
import {
  ESO_MAINSTATION_TYPE,

  GAME_STATUS_NONE
} from '~/assets/helpers'

export default {
  name: 'GamePage',

  components: { GamerAreaComponent },

  data: () => ({
    panels: [0],
    gametime: '02:00'
  }),

  computed: {
    gameTimes () {
      const times = []
      let itemTime = '00:10'
      while (itemTime <= '04:00') {
        times.push(itemTime)
        itemTime = nextTimePoint(itemTime, 10)
      }
      return times
    },
    mainstations () {
      return this.$store.state.game.gameResources[ESO_MAINSTATION_TYPE]
    },
    noGameScene () {
      return this.$store.state.game.gameStatus === GAME_STATUS_NONE
    }
  },

  created () {
    if (process.client) {
      this.$store.dispatch('game/setAdministratorMode')
      this.$store.dispatch('game/loadGameResources')
    }
  },

  methods: {
    doBeginGameScenes () {
      this.panels = [1]
    }
  }
}
</script>
