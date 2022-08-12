<template>
  <v-container fluid>
    <div
      v-for="item in items"
      :key="item.key"
      class="d-inline-flex"
    >
      <component :is="item.template" :state="item.data" />
    </div>
    <div class="mt-4">
      <SolarCellsControl />
    </div>
    <div class="mt-4">
      <WindTurbinesControl />
    </div>
  </v-container>
</template>

<script>
import StandControl from '~/components/hard/stand-control.vue'
import WindControl from '~/components/hard/wind-control.vue'
import SunControl from '~/components/hard/sun-control.vue'
import SolarCellsControl from '~/components/hard/solar-cells.vue'
import WindTurbinesControl from '~/components/hard/wind-turbines.vue'

export default {
  name: 'HardPage',

  components: { StandControl, WindControl, SunControl, SolarCellsControl, WindTurbinesControl },

  data: () => ({
    connection: undefined
  }),

  computed: {
    items () {
      const data = this.$store.state.commonInfo
      return data !== undefined
        ? [
            { key: 'stand', data: data.standStatus, template: StandControl },
            { key: 'sun', data: data.sunData, template: SunControl },
            { key: 'wind', data: data.windData, template: WindControl }
          ]
        : [
            { key: 'stand', data: { isError: false, stopped: true }, template: StandControl },
            { key: 'sun', data: { isOn: false, isError: false, power: 0, stopped: true }, template: SunControl },
            { key: 'wind', data: { isOn: false, isError: false, power: 0, stopped: true }, template: WindControl }
          ]
    }
  },

  created () {
    if (!this.$isServer) {
      /* eslint-disable no-console */
      this.connection = new WebSocket('ws://localhost:3000/api/ws/1_0/topics/common')
      console.log(this.connection)
      this.connection.onmessage = function (event) {
        console.log(event)
      }

      this.connection.onopen = function (event) {
        console.log(event)
        console.log('Successfully connected to the echo websocket server...')
      }

      this.connection.onerror = function (event) {
        console.error(event)
      }

      this.connection.onclose = function (event) {
        console.log('connection close ...')
      }
      /* eslint-enable no-console */
    }
  },
  beforeDestroy () {
  }
}
</script>
