<template>
  <v-card
    class="card-with-border"
    flat
  >
    <div class="d-inline-flex align-center">
      <v-card-title class="d-flex flex-nowrap text-no-wrap">
        <v-avatar
          class="mr-2"
          tile
          color="yellow darken-3"
        >
          <v-icon dark>
            mdi-timeline-question-outline
          </v-icon>
        </v-avatar>
        &laquo;#{{ hub.address }}&raquo;
      </v-card-title>
    </div>
    <div>
      {{ hub }}
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'SchemeUnknownCadr',

  props: {
    hub: {
      type: Object,
      required: true,
      default () {
        return { }
      }
    }
  },

  data: () => ({
  })
}
</script>

<style>
.card-with-border.v-sheet.v-card {
  border: 2px solid #F9A825;
  border-radius: 8px;
}
</style>
