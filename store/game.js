//
import {
  WS_GAME_CONTROLLER_SERVICE,

  GAME_EVENT_STATUS,
  GAME_EVENT_LOCK_CONTROLLER,
  GAME_EVENT_ERROR,

  GAME_STATUS_NONE
} from '~/assets/helpers'
//
let connection

function wsGameController (context) {
  connection = new WebSocket('ws://' + (location !== undefined ? location.host : '127.0.0.1') + WS_GAME_CONTROLLER_SERVICE)

  connection.onmessage = function (event) {
    context.commit('game/translateEvent', JSON.parse(event.data))
  }

  connection.onopen = () => {
    context.commit('game/setConnetted', true)
  }

  connection.onerror = function (event) {
    connection = undefined
    context.commit('game/setConnetted', false)
    /* eslint-disable no-console */
    console.error(event)
    /* eslint-enable no-console */
    connection.close()
  }

  connection.onclose = () => {
    connection = undefined
    context.commit('game/setConnetted', false)
    /* eslint-disable no-console */
    console.warn('wsSocket контроллера игрового сервиса закрыт.')
    /* eslint-enable no-console */
    setTimeout(() => { wsGameController(context) }, 10000)
  }
}
//
export const state = () => ({
  isConnected: false,
  errorEvent: undefined,
  gameStatus: GAME_STATUS_NONE,
  hasAdmin: false,
  info: {
    administrationLocked: false,
    gamersCount: 0,
    guestsCount: 0
  }
})

//
function internalSetState (state, data) {
  state.info = {
    administrationLocked: data.data.administration,
    gamersCount: data.data.gamers,
    guestsCount: data.data.guests
  }
  state.gameStatus = data.data.status
}

export const mutations = {
  setConnetted (state, data) {
    state.isConnected = data
    if (!data) {
      state.hasAdmin = false
    }
    if (data) {
      state.errorEvent = undefined
    }
  },
  translateEvent (state, data) {
    state.errorEvent = undefined
    switch (data.type) {
      case GAME_EVENT_STATUS:
        internalSetState(state, data)
        break
      case GAME_EVENT_LOCK_CONTROLLER:
        if (data.data.accepted) {
          state.hasAdmin = true
        } else {
          state.hasAdmin = false
        }
        break
      case GAME_EVENT_ERROR:
        state.errorEvent = data
        break
    }
  }
}

export const actions = {
  initializeGameController (context) {
    setTimeout(() => { wsGameController(this) }, 1000)
  },

  setAdministratorMode (context, data) {
    if (connection !== undefined && !context.state.hasAdmin) {
      connection.send(JSON.stringify({ type: GAME_EVENT_LOCK_CONTROLLER }))
    }
  }
}
