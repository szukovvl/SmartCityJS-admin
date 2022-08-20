<template>
  <v-card outlined>
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="#00F"
      >
        <v-icon dark>
          mdi-space-station
        </v-icon>
      </v-avatar>
      &laquo;Стэнд&raquo;
      <v-icon
        class="ml-4"
        :color="stationlaunched ? 'indigo accent-4' : 'amber darken-3'"
      >
        {{ stationlaunched ? 'mdi-rocket-launch-outline' : 'mdi-power-standby' }}
      </v-icon>
      <v-spacer />
      <v-btn
        class="mx-2"
        outlined
        fab
        small
        color="teal"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'MainStationMonitorControl',

  data: () => ({
    stationlaunched: false
  })
}
</script>
