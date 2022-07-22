<template>
  <v-container
    fluid
    class="pa-0 ma-0"
  >
    <v-navigation-drawer
      app
      permanent
      fixed
      clipped
      mini-variant
      mini-variant-width="76"
      stateless
      color="#EEEEEE"
    >
      <v-tabs
        v-model="currenttab"
        active-class="white"
        background-color="#EEEEEE"
        vertical
      >
        <v-tab
          v-for="itemtab in tabitems"
          :key="'key_' + itemtab.name"
        >
          <v-icon
            left
            size="28"
          >
            mdi-{{ itemtab.icon }}
          </v-icon>
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>

    <v-tabs-items v-model="currenttab">
      <v-tab-item
        v-for="itemtab in tabitems"
        :key="'key_' + itemtab.name"
      >
        <component :is="itemtab.component" />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import Forecast from '~/components/forecast.vue'
import PowerSystemComponent from '~/components/power-system.vue'
import CriteriaComponent from '~/components/criteria.vue'
import TechnologyComponent from '~/components/technology.vue'
import TariffsComponent from '~/components/tariffs.vue'

export default {
  name: 'IndexPage',

  components: { Forecast, PowerSystemComponent, CriteriaComponent, TechnologyComponent, TariffsComponent },

  data: () => ({
    currenttab: null,
    tabitems: [
      { name: 'powersystem', icon: 'lan', component: PowerSystemComponent },
      { name: 'forecast', icon: 'weather-partly-cloudy', component: Forecast },
      { name: 'trademark', icon: 'scale-unbalanced', component: CriteriaComponent },
      { name: 'technology', icon: 'paperclip', component: TechnologyComponent },
      { name: 'auction', icon: 'currency-rub', component: TariffsComponent }
    ]
  }),

  computed: {
  }
}
</script>
