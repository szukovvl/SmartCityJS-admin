<template>
  <v-card outlined>
    <v-card-title class="d-flex flex-nowrap text-no-wrap blue-grey--text">
      <v-avatar
        class="mr-2"
        tile
        color="blue-grey"
      >
        <v-icon dark>
          mdi-space-station
        </v-icon>
      </v-avatar>
      &laquo;{{ oes.identy !== undefined ? oes.identy : '' }}&raquo;
    </v-card-title>
    <div class="ma-1 d-flex">
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="green"
        >
          mdi-sprout-outline
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="orange"
        >
          mdi-power-plug-outline
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="blue"
        >
          mdi-lightning-bolt-outline
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="blue"
        >
          mdi-lightning-bolt
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="indigo--text"
        >
          mdi-piggy-bank-outline
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
      <div class="d-flex flex-nowrap mt-2 ml-2">
        <v-icon
          small
          color="indigo--text"
        >
          mdi-credit-card-refund-outline
        </v-icon>
        <div class="ml-1 small-text">
          <div>0,00</div>
          <div class="indigo--text text--accent-4">
            0,00
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'GeneratorCard',

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
    oes () {
      return this.device.oes !== undefined ? this.device.oes : { }
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: small;
}
</style>
