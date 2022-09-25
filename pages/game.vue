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
      <div class="d-flex justify-center">
        <v-btn
          v-if="!noGameScene && $store.state.game.hasAdmin"
          class="ma-2"
          color="warning"
          @click="doCancelGameScenes"
        >
          Прервать игровой сценарий
        </v-btn>
      </div>
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
                v-for="(data, index) in scenesData"
                :key="data.mainstation"
              >
                <GamerAreaComponent :title="'Игрок ' + (index + 1)" :gamer-index="index" :item-scene-data="data" />
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
        <v-expansion-panel v-if="currentScene > 0">
          <v-expansion-panel-header class="teal lighten-5">
            Определение игроков
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="mt-2">
              <v-col
                v-for="(data, index) in scenesData"
                :key="data.mainstation"
              >
                <div class="blue-grey lighten-5 pa-2 text-center">
                  {{ 'Игрок ' + (index + 1) }}
                </div>
                <GamerCardComponent :gamer-card="data" />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="currentScene > 1">
          <v-expansion-panel-header class="teal lighten-5">
            Выбор потребителей игроками
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <GamersChoiceView />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="currentScene > 2">
          <v-expansion-panel-header class="teal lighten-5">
            Подготовка к аукциону
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <AuctionParametersCard />
            <AuctionLotsViewer />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="currentScene > 3">
          <v-expansion-panel-header class="teal lighten-5">
            Аукцион
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <AuctionSaleViewer />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-stepper
        v-if="!noGameScene"
        v-model="scenestep"
        vertical
        flat
      >
        <v-stepper-header>
          <v-stepper-step
            :complete="currentScene > 1"
            step="1"
          >
            регистрация
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="currentScene > 2"
            step="2"
          >
            присоединение потребителей
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="currentScene > 3"
            step="3"
          >
            подготовка к аукциону
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="currentScene > 4"
            step="4"
          >
            аукцион
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="currentScene > 6"
            step="6"
          >
            схема ЭС
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="currentScene > 7"
            step="7"
          >
            анализ
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="8">
            игра
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
      <v-card-text class="d-flex">
        <v-btn
          v-if="prevSceneEnabled"
          class="ma-2"
          color="success"
          @click="doPrevScene"
        >
          Назад
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="nextSceneEnabled"
          class="ma-2"
          color="success"
          @click="doNextScene"
        >
          Далее
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import GamerAreaComponent from '~/components/gamecontrol/gamer-area.vue'
import GamerCardComponent from '~/components/gamecontrol/gamer-card.vue'
import GamersChoiceView from '~/components/gamecontrol/gamers-choice.vue'
import AuctionParametersCard from '~/components/gamecontrol/auction-parameters.vue'
import AuctionLotsViewer from '~/components/gamecontrol/auction-lots.vue'
import AuctionSaleViewer from '~/components/gamecontrol/auction-sale.vue'
import { nextTimePoint } from '~/assets/datetime'
import {
  GAME_STATUS_NONE,
  GAME_STATUS_SCENE_1
} from '~/assets/helpers'

export default {
  name: 'GamePage',

  components: {
    GamerAreaComponent,
    GamerCardComponent,
    GamersChoiceView,
    AuctionParametersCard,
    AuctionLotsViewer,
    AuctionSaleViewer
  },

  data: () => ({
    panels: [0],
    gametime: '01:00',
    scenestep: 0
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
    scenesData () {
      const items = this.$store.state.game.scenesData
      return items != null ? items : []
    },
    noGameScene () {
      return this.$store.state.game.gameStatus === GAME_STATUS_NONE
    },
    currentScene () {
      return this.$store.state.game.sceneNumber
    },
    prevSceneEnabled () {
      return !this.noGameScene && this.$store.state.game.hasAdmin && this.$store.state.game.gameStatus !== GAME_STATUS_SCENE_1
    },
    nextSceneEnabled () {
      return !this.noGameScene && this.$store.state.game.hasAdmin
    }
  },

  watch: {
    currentScene (v) {
      this.scenestep = v
      if (v !== 0) {
        this.panels = [v]
      }
    },
    noGameScene (v) {
      if (v) {
        this.panels = [0]
      }
    }
  },

  created () {
    if (process.client) {
      this.$store.dispatch('game/loadGameResources')
      this.$store.dispatch('game/setAdministratorMode')
    }
    this.scenestep = this.currentScene
    if (this.noGameScene) {
      this.panels = [0]
    } else {
      this.panels = [this.currentScene]
    }
  },

  methods: {
    doBeginGameScenes () {
      this.$store.dispatch('game/startGameScenes', {
        gameday: this.gametime
      })
    },
    doCancelGameScenes () {
      this.$store.dispatch('game/cancelGameScenes')
    },
    doNextScene () {
      this.$store.dispatch('game/nextGameScene')
    },
    doPrevScene () {
      alert('пока заглушка')
    }
  }
}
</script>
