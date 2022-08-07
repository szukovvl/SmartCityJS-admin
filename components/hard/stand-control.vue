<template>
  <v-card
    class="ma-1"
    outlined
  >
    <v-card-title>
      <v-avatar
        class="mr-2"
        tile
        color="light-green accent-4"
      >
        <v-icon dark>
          mdi-nas
        </v-icon>
      </v-avatar>
      &laquo;Стэнд&raquo;
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
        <p class="px-0 ma-0 py-2">
          <span class="light-blue--text text--lighten-3"><b>Стэнд</b></span> – программируемый ПЛК,
          управляющий стэндом.
        </p>
      </v-tooltip>
      <v-icon
        class="ml-4"
        :color="launched ? 'indigo accent-4' : 'amber darken-3'"
      >
        {{ launched ? 'mdi-rocket-launch-outline' : 'mdi-power-standby' }}
      </v-icon>
    </v-card-title>
    <v-card-text class="amber lighten-3">
      <div class="d-inline-flex">
        <v-menu
          v-model="showMenu"
          bottom
          offset-y
        >
          <template #activator="{}">
            <v-text-field
              v-model="selPort"
              class="mr-4"
              hint="Порт подключения блока управления"
              persistent-hint
              placeholder="выберите порт подключения"
              dense
              clearable
              readonly
              append-icon="mdi-menu-down"
              :loading="portsLoading"
              @click:clear="portClear"
              @click:append="doLoadPorts"
              @focus="doLoadPorts"
            />
          </template>
          <v-list
            :disabled="portItems[0].port === undefined"
          >
            <v-list-item-group
              v-model="selPortIndex"
              color="primary"
            >
              <v-list-item
                v-for="item in portItems"
                :key="item.key"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-text-field
          v-model="restartingWait"
          class="right-input"
          type="number"
          hint="задержка при перезапуске сервиса"
          persistent-hint
          suffix="мс"
          dense
          step="100"
          :error-messages="check_for_errors($v.restartingWait)"
          @input="$v.restartingWait.$touch()"
          @blur="$v.restartingWait.$touch()"
        />
        <v-tooltip
          right
          max-width="400"
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
          <p class="px-0 ma-0 py-2">
            <span class="red--text text--lighten-1"><b>ВНИМАНИЕ !</b></span>
            Данный параметр определяет временную задержку перед запускам сервиса, после его останова
            во время обработки команды API "перезапустить".
          </p>
        </v-tooltip>
      </div>
    </v-card-text>
    <v-card-text
      v-if="errorsMsg.length !== 0"
      class="ma-0 pa-0"
    >
      <v-alert
        type="error"
        dense
        prominent
        max-width="600"
      >
        <div
          v-for="(item, index) in errorsMsg"
          :key="'_net_error_' + index"
        >
          <v-divider
            v-if="index !== 0"
            class="my-3"
          />
          <div>
            {{ item }}
          </div>
        </div>
      </v-alert>
    </v-card-text>
    <v-card-subtitle>
      Управление сервисом
    </v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-center">
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="indigo accent-4"
          :disabled="launched"
          @click="onStart"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="teal"
          :disabled="!launched"
          @click="onRestart"
        >
          <v-icon>mdi-replay</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          outlined
          fab
          small
          color="amber darken-3"
          :disabled="!launched"
          @click="onStop"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { required, integer, between } from 'vuelidate/lib/validators'
import {
  API_STAND_SERVICE_START,
  API_STAND_SERVICE_STOP,
  API_STAND_SERVICE_RESTART,
  API_STAND_SERVICE_CONTROLDATA,
  API_STAND_SERVICE_PORTNAMES,
  DELAY_BEFORE_SAVE_CHANGES
} from '~/assets/helpers'

Vue.use(Vuelidate)

const notfoundPorts = [{ key: '_EMPTY_PORT_', text: 'порты не найдены', port: undefined }]

export default {
  name: 'StandControl',

  props: {
    state: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    axioError: undefined,
    portItems: notfoundPorts,
    control: undefined,
    enableChanges: false,
    delayChanges: undefined,
    showMenu: false,
    portsLoading: false,
    selPortIndex: undefined
  }),

  validations: {
    restartingWait: {
      required,
      integer,
      betweenValue: between(1000, 10000)
    }
  },

  computed: {
    launched () {
      return this.state.status === 'LAUNCHED'
    },
    errorsMsg () {
      const errors = []
      this.axioError !== undefined && errors.push(this.axioError)
      this.state.errorMsg !== undefined && errors.push(this.state.errorMsg)
      return errors
    },

    restartingWait: {
      get () {
        return this.control !== undefined
          ? this.control.restartingWait
          : undefined
      },
      set (newvalue) {
        this.control !== undefined
          ? this.control.restartingWait = newvalue
          : this.control = { restartingWait: newvalue }
      }
    },
    selPort: {
      get () {
        return this.control !== undefined
          ? this.control.port
          : undefined
      },
      set (newvalue) {
        this.control !== undefined
          ? this.control.port = newvalue
          : this.control = { port: newvalue }
      }
    }
  },

  watch: {
    control: {
      handler (v) {
        if (this.enableChanges) {
          this.doUpdateControl()
        }
        this.enableChanges = true
      },
      deep: true
    },
    selPortIndex (idx) {
      if (idx !== undefined) {
        this.selPort = this.portItems[idx].port
      }
    }
  },

  created () {
    this.doLoadControlBlock()
  },

  methods: {
    check_for_errors (field) {
      const errors = []
      if (!field.$dirty) {
        return errors
      }
      !field.integer && errors.push('Задается целым числом')
      !field.betweenValue && errors.push('Может принимать значения от 1000 до 10000 мс')
      !field.required && errors.push('Необходимо определить')
      return errors
    },

    doLoadControlBlock () {
      this.$axios.$get(API_STAND_SERVICE_CONTROLDATA, { progress: false })
        .then((v) => {
          this.axioError = undefined
          this.enableChanges = false
          if (v.port === undefined) {
            v.port = undefined
          }
          this.control = v
        })
        .catch((error) => {
          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - управление сервисом стэнда'
          }
        })
    },
    doUpdateControl () {
      clearTimeout(this.delayChanges)
      this.delayChanges = undefined
      this.$v.restartingWait.$touch()
      if (this.$v.restartingWait.$invalid) {
        return
      }

      this.clearTimeout = setTimeout(() => {
        this.delayChanges = undefined
        const restdata = { restartingWait: this.control.restartingWait }
        if (this.control.port !== undefined) {
          restdata.port = this.control.port
        }
        this.$axios.$put(API_STAND_SERVICE_CONTROLDATA, restdata, { progress: false })
          // .then((v) => { })
          .catch((error) => {
            if (error.response) {
              this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
            } else {
              this.axioError = 'ошибка выполнения API - управление сервисом стэнда'
            }
          })
      }, DELAY_BEFORE_SAVE_CHANGES)
    },

    executeServiceApi (url) {
      this.$axios.$put(url, undefined, { progress: false })
        .then((v) => {
          this.axioError = undefined
        })
        .catch((error) => {
          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - управление сервисом стэнда'
          }
        })
    },
    onStart () {
      this.executeServiceApi(API_STAND_SERVICE_START)
    },
    onRestart () {
      this.executeServiceApi(API_STAND_SERVICE_RESTART)
    },
    onStop () {
      this.executeServiceApi(API_STAND_SERVICE_STOP)
    },

    portClear () {
      this.control.port = undefined
    },
    doLoadPorts () {
      if (this.portsLoading) {
        return
      }
      this.portsLoading = true
      this.portItems = notfoundPorts
      this.selPortIndex = undefined

      this.$axios.$get(API_STAND_SERVICE_PORTNAMES, { progress: false })
        .then((v) => {
          if (v !== undefined && v.length !== 0) {
            this.portItems = v.map((item) => {
              return {
                key: 'PORT_' + item,
                text: item,
                port: item
              }
            })
          }
          this.portsLoading = false
          this.showMenu = true
        })
        .catch((error) => {
          this.portsLoading = false
          this.showMenu = true

          if (error.response) {
            this.axioError = `ошибка ${error.response.status}: ${error.response.data}`
          } else {
            this.axioError = 'ошибка выполнения API - сервисы стэнда'
          }
        })
    }
  }
}
</script>

<style scoped>
::v-deep(.right-input) input {
  text-align: right
}
</style>
