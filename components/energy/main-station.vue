<template>
  <v-card flat>
    <v-card-title class="ps-0">
      Главная подстанция {{ element.identy }}
    </v-card-title>

    <v-card-text class="ps-0">
      {{ element }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MainStationObjet',

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({})
}
</script>
