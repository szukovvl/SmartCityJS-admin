<template>
  <v-app dark>
    <v-app-bar
      class="justify-space-between"
      app
      clipped-right
      clipped-left
    >
      <v-img
        class="mr-4"
        src="logo-rus.png"
        max-height="50"
        max-width="128"
        contain
        alt="SmartCity «Администрирование»"
      />

      <v-spacer />

      <v-card
        class="card-with-border d-flex mx-6 pb-2 pt-4 pr-4"
        flat
      >
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'INDUSTRY')"
          overlap
          offset-x="0"
          :color="'INDUSTRY' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'INDUSTRY' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
          >
            mdi-factory
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'HOSPITAL')"
          overlap
          offset-x="0"
          :color="'HOSPITAL' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'HOSPITAL' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
          >
            mdi-hospital-building
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'DISTRICT')"
          overlap
          offset-x="0"
          :color="'DISTRICT' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'DISTRICT' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
          >
            mdi-home-city
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'DISTRIBUTOR')"
          overlap
          offset-x="0"
          :color="'DISTRIBUTOR' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'DISTRIBUTOR' in commonElements ? 'amber darken-3' : 'blue-grey lighten-2'"
          >
            mdi-home-lightning-bolt
          </v-icon>
        </v-badge>
      </v-card>

      <v-card
        class="card-with-border d-flex mr-6 pb-2 pt-4 pr-4"
        flat
      >
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'STORAGE')"
          overlap
          offset-x="0"
          :color="'STORAGE' in commonElements ? '#008000' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'STORAGE' in commonElements ? '#008000' : 'blue-grey lighten-2'"
          >
            mdi-battery-charging-70
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'GENERATOR')"
          overlap
          offset-x="0"
          :color="'GENERATOR' in commonElements ? '#008000' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'GENERATOR' in commonElements ? '#008000' : 'blue-grey lighten-2'"
          >
            mdi-engine-outline
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'WIND')"
          overlap
          offset-x="0"
          :color="'WIND' in commonElements ? '#008000' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'WIND' in commonElements ? '#008000' : 'blue-grey lighten-2'"
          >
            mdi-wind-power-outline
          </v-icon>
        </v-badge>
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'SOLAR')"
          overlap
          offset-x="0"
          :color="'SOLAR' in commonElements ? '#008000' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'SOLAR' in commonElements ? '#008000' : 'blue-grey lighten-2'"
          >
            mdi-solar-power-variant-outline
          </v-icon>
        </v-badge>
      </v-card>

      <v-card
        class="card-with-border d-flex mr-6 pb-2 pt-4 pr-4"
        flat
      >
        <v-badge
          class="mx-6"
          :content="getFieldValue(commonElements, 'MAINSUBSTATION')"
          overlap
          offset-x="0"
          :color="'MAINSUBSTATION' in commonElements ? '#00F' : 'blue-grey lighten-2'"
        >
          <v-icon
            size="28"
            :color="'MAINSUBSTATION' in commonElements ? '#00F' : 'blue-grey lighten-2'"
          >
            mdi-space-station
          </v-icon>
        </v-badge>
      </v-card>

      <v-spacer />
      <v-card
        class="d-inline-flex pt-4"
        flat
        outlined
        color="transparent"
      >
        <v-badge
          dot
          overlap
          left
          offset-x="0"
          :value="stateSunEmulator.isError"
          color="red"
        >
          <v-icon
            :class="stateSunEmulator.stopped ? 'blink mr-2' : 'mr-2'"
            size="28"
            :color="sunIsOn ? 'lime darken-3' : 'blue-grey lighten-2'"
          >
            mdi-white-balance-sunny
          </v-icon>
        </v-badge>
        <p>{{ sunPower }}</p>
      </v-card>
      <v-card
        class="d-inline-flex pt-4 ml-12"
        flat
        outlined
        color="transparent"
      >
        <v-badge
          dot
          overlap
          left
          offset-x="0"
          :value="stateWindEmulator.isError"
          color="red"
        >
          <v-icon
            class="mr-2"
            size="28"
            :color="windIsOn ? 'lime darken-3' : 'blue-grey lighten-2'"
          >
            mdi-weather-windy
          </v-icon>
        </v-badge>
        <p>{{ windPower }}</p>
      </v-card>
      <v-card
        class="d-inline-flex pt-2 ml-12"
        flat
        outlined
        color="transparent"
      >
        <v-badge
          dot
          overlap
          left
          offset-x="0"
          :value="stateStand.isError"
          color="red"
        >
          <v-icon
            :class="stateStand.stopped ? 'blink mr-2' : 'mr-2'"
            size="28"
            color="lime darken-3"
          >
            mdi-nas
          </v-icon>
        </v-badge>
      </v-card>
    </v-app-bar>

    <v-navigation-drawer
      app
      permanent
      fixed
      clipped
      right
      mini-variant
      stateless
    >
      <v-list dense>
        <v-list-item
          v-for="item in commands"
          :key="'key_' + item.name"
          :to="item.url"
          color="blue lighten-1"
        >
          <v-list-item-content>
            <v-list-item-icon>
              <v-icon left>
                mdi-{{ item.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      style="font-size:10pt"
      app
      outlined
    >
      <a
        href="http://new.novatorlab.ru/"
        target="_blank"
        rel="noopener noreferrer"
      >
        ООО «Новатор Лаб»
      </a>, {{ new Date().getFullYear() }}
      <v-spacer />
      <v-icon
        v-if="connectionFail"
        class="red pa-1"
        size="14"
        color="white"
      >
        mdi-connection
      </v-icon>
    </v-footer>
  </v-app>
</template>

<script>
import { GAME_PROCESS } from '~/assets/helpers'
//
export default {
  name: 'DefaultLayout',

  data () {
    return {
      commands: [
        {
          name: 'objectsettings',
          icon: 'gamepad-circle-down',
          url: '/'
        },
        {
          name: 'gamesettings',
          icon: 'teddy-bear',
          url: '/game'
        },
        {
          name: 'hardsettings',
          icon: 'cog-outline',
          url: '/hard'
        }
      ]
    }
  },

  computed: {
    connectionFail () {
      return !this.$store.state.serviceConnected
    },
    commonElements () {
      const v = this.$store.state.commonInfo
      if (v !== undefined && v.elements !== undefined) {
        return v.elements
      }
      return {}
    },
    stateSunEmulator () {
      const v = this.$store.state.commonInfo
      if (v !== undefined) {
        return {
          isOn: v.sunData.on && v.sunData.power !== 0,
          isError: 'errorMsg' in v.sunData,
          power: v.sunData.power,
          stopped: v.sunData.status === 'STOPPED'
        }
      }
      return {
        isOn: false,
        isError: false,
        power: 0,
        stopped: true
      }
    },
    stateWindEmulator () {
      const v = this.$store.state.commonInfo
      if (v !== undefined) {
        return {
          isOn: v.windData.on && v.windData.power !== 0,
          isError: 'errorMsg' in v.windData,
          power: v.windData.power,
          stopped: v.windData.status === 'STOPPED'
        }
      }
      return {
        isOn: false,
        isError: false,
        power: 0,
        stopped: true
      }
    },
    stateStand () {
      const v = this.$store.state.commonInfo
      if (v !== undefined) {
        return {
          isError: 'errorMsg' in v.standStatus,
          stopped: v.standStatus.status === 'STOPPED'
        }
      }
      return {
        isError: false,
        stopped: true
      }
    },

    gameDatasets () {
      return this.$store.state.game.datasets !== undefined ? this.$store.state.game.datasets : []
    },
    sunIsOn () {
      return this.$store.state.game.gameStatus === GAME_PROCESS || this.stateSunEmulator.isOn
    },
    sunPower () {
      if (this.$store.state.game.gameStatus === GAME_PROCESS) {
        if (this.gameDatasets.length !== 0) {
          return Math.round(this.gameDatasets.map(e => e.sunpower).reduce((a, b) => (a + b)) / this.gameDatasets.length)
        }
      }
      return this.stateSunEmulator.power
    },
    windIsOn () {
      return this.$store.state.game.gameStatus === GAME_PROCESS || this.stateWindEmulator.isOn
    },
    windPower () {
      if (this.$store.state.game.gameStatus === GAME_PROCESS) {
        if (this.gameDatasets.length !== 0) {
          return Math.round(this.gameDatasets.map(e => e.windpower).reduce((a, b) => (a + b)) / this.gameDatasets.length)
        }
      }
      return this.stateWindEmulator.power
    }
  },

  created () {
    if (process.client) {
      this.$store.dispatch('initializeClientApp')
      this.$store.dispatch('game/initializeGameController')
    }
  },
  mounted () {
  },

  methods: {
    getFieldValue (v, f) {
      if (f in v) {
        return v[f]
      }
      return '0'
    }
  }
}
</script>

<style scoped>
.card-with-border.v-sheet.v-card {
  border: thin solid #E0E0E0;
  background-color: transparent;
}

.blink {
    -webkit-animation: blink 1s step-end infinite;
            animation: blink 1s step-end infinite;
}
@-webkit-keyframes blink { 70% { visibility: hidden; }}
        @keyframes blink { 70% { visibility: hidden; }}
</style>
