<template>
  <v-card>
    <v-card-text>
      {{ state }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'StandControl',

  props: {
    state: {
      type: Object,
      required: true
    }
  },

  data: () => ({})
}
</script>
