<template>
  <v-card flat>
    <v-row
      class="d-flex align-center"
      no-gutters
    >
      <v-col cols="1">
        <v-avatar
          tile
          color="amber darken-3"
        >
          <v-icon dark>
            mdi-home-lightning-bolt
          </v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-card-title class="pa-0">
          &laquo;Мини-подстанция&raquo;
          <v-tooltip
            right
            max-width="600"
          >
            <template #activator="{ on, attrs }">
              <v-icon
                class="align-self-start"
                color="blue"
                small
                v-bind="attrs"
                v-on="on"
              >
                mdi-help-circle-outline
              </v-icon>
            </template>
            <!-- eslint-disable vue/no-v-html -->
            <p class="px-0 ma-0 py-2" v-html="einfoes" />
            <!--eslint-enable-->
          </v-tooltip>
          &nbsp;{{ element.identy }}
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="ps-0">
      <div
        v-for="(item, index) in element.data.outputs"
        :key="item.identy"
      >
        <div v-if="index !== 0">
          &nbsp;
        </div>
        <SubnetObjet :subnet="item" :snidx="index + 1" @onSaveChanges="onSaveChanges" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import SubnetObjet from '~/components/energy/subnet.vue'
import {
  DELAY_BEFORE_SAVE_CHANGES,
  API_ENERGY_SERVICE_DATA
} from '~/assets/helpers'

export default {
  name: 'DistributorObjet',

  components: { SubnetObjet },

  props: {
    element: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    einfoes: `<span class="light-blue--text text--lighten-3"><b>Электрическая подстанция</b></span> – электроустановка,
    предназначенная для приема, преобразования и распределения электрической энергии,
    состоящая из трансформаторов или других преобразователей электрической энергии, устройств управления,
    распределительных и вспомогательных устройств.`,

    postdelay: undefined
  }),

  methods: {
    onSaveChanges (subnet) {
      clearTimeout(this.postdelay)
      this.postdelay = setTimeout(() => {
        this.postdelay = undefined
        const transmitted = this.element.data.outputs.map(e => ({
          energy: e.data.energy,
          lossfactor: e.data.lossfactor,
          highload: e.data.highload,
          criticalload: e.data.criticalload,
          blackouttime: e.data.blackouttime
        }))
        this.$axios.$put(API_ENERGY_SERVICE_DATA + '/' + this.element.identy, transmitted, { progress: false })
          // .then((v) => {})
          .catch((error) => {
            /* eslint-disable no-console */
            if (error.response) {
              console.error('ошибка %d: %s', error.response.status, error.response.data)
            }
            /* eslint-enable no-console */
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    }
  }
}
</script>
