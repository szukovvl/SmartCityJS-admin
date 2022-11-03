<template>
  <v-card outlined>
    {{ device.identy }}
  </v-card>
</template>

<script>
export default {
  name: 'UnusedDeviceCard',

  props: {
    device: {
      type: Object,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  }),

  computed: {
  },

  created () {
  }
}
</script>
