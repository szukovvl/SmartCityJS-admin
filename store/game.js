//
import {
  WS_GAME_CONTROLLER_SERVICE,

  API_ENERGY_SERVICE_FIND,
  API_TARIFFS_SERVICE,

  GAME_EVENT_STATUS,
  GAME_EVENT_LOCK_CONTROLLER,
  GAME_EVENT_ERROR,
  GAME_EVENT_SCENES_DATA,
  GAME_EVENT_SCENE_NEXT,
  GAME_EVENT_SCENE_PREV,
  GAME_EVENT_CANCEL_GAME_SCENES,
  GAME_EVENT_START_GAME_SCENES,
  GAME_EVENT_SCENE_IDENTIFY,
  GAME_EVENT_SCENE_CHOICE,
  GAME_EVENT_SCENE_AUCTION_PREPARE,
  GAME_EVENT_SCENE_AUCTION,
  GAME_EVENT_SCENE_AUCTION_SETTINGS,
  GAME_EVENT_SCENE_AUCTION_SALE,
  GAME_EVENT_SCENE_AUCTION_PUT_LOT,
  GAME_EVENT_SCENE_AUCTION_CANCEL_LOT,
  GAME_EVENT_SCENE_AUCTION_TIME_LOT,
  GAME_EVENT_GAME_SCENE_SCHEME,
  GAME_EVENT_GAME_SCHEMA_DATA,
  GAME_EVENT_GAME_PROCESS_START,
  GAME_EVENT_GAME_PROCESS_DATA,

  GAME_STATUS_NONE,
  GAME_STATUS_SCENE_1,
  GAME_STATUS_SCENE_2,
  GAME_STATUS_SCENE_3,
  GAME_STATUS_SCENE_4,
  GAME_STATUS_SCENE_5,
  GAME_PROCESS,

  ENERGYSYSTEM_OBJECT_TYPES
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
    const lconn = connection
    connection = undefined
    context.commit('game/setConnetted', false)
    /* eslint-disable no-console */
    console.error(event)
    /* eslint-enable no-console */
    lconn.close()
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
function initGameResources () {
  const res = { }
  ENERGYSYSTEM_OBJECT_TYPES.forEach(e => (res[e.value] = []))
  return res
}

function sendEventMessage (event, message) {
  if (connection !== undefined) {
    connection.send(JSON.stringify({
      type: event,
      payload: message
    }))
  }
}
//
export const state = () => ({
  isConnected: false,
  errorEvent: undefined,
  gameStatus: GAME_STATUS_NONE,
  sceneNumber: 0,
  lotTime: 0,
  hasAdmin: false,
  info: {
    administrationLocked: false,
    gamersCount: 0,
    guestsCount: 0
  },
  gameResources: initGameResources(),
  restApiError: undefined,
  tariffs: undefined,
  scenesData: [],
  choiceAll: [],
  gamersCohice: [],
  auction: {},
  schemeData: [],
  scheme: [],
  prepareData: [],
  processData: []
})

//
function internalSetState (state, data) {
  state.info = {
    administrationLocked: data.data.administration,
    gamersCount: data.data.gamers,
    guestsCount: data.data.guests
  }
  state.gameStatus = data.data.status

  internalTranslateScene(state, state.gameStatus)
}

function internalTranslateScene (state, srvstatus) {
  state.gameStatus = srvstatus

  switch (state.gameStatus) {
    case GAME_STATUS_NONE:
      state.sceneNumber = 0
      break
    case GAME_STATUS_SCENE_1:
      state.sceneNumber = 1
      break
    case GAME_STATUS_SCENE_2:
      state.sceneNumber = 2
      break
    case GAME_STATUS_SCENE_3:
      state.sceneNumber = 3
      break
    case GAME_STATUS_SCENE_4:
      state.sceneNumber = 4
      break
    case GAME_STATUS_SCENE_5:
      state.sceneNumber = 5
      break
    case GAME_PROCESS:
      break
    default:
      /* eslint-disable no-console */
      console.warn('internalTranslateScene - необработанное', srvstatus)
      /* eslint-enable no-console */
  }
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
        /* eslint-disable no-console */
        console.warn('GAME_EVENT_ERROR', data)
        /* eslint-enable no-console */
        break
      case GAME_EVENT_SCENE_IDENTIFY:
        internalTranslateScene(state, GAME_STATUS_SCENE_1)
        break
      case GAME_EVENT_SCENE_CHOICE:
        state.choiceAll = data.data.items
        state.gamersCohice = data.data.gamers
        internalTranslateScene(state, GAME_STATUS_SCENE_2)
        break
      case GAME_EVENT_SCENE_AUCTION_PREPARE:
        state.auction = data.data
        internalTranslateScene(state, GAME_STATUS_SCENE_3)
        break
      case GAME_EVENT_SCENE_AUCTION:
        state.auction = data.data
        internalTranslateScene(state, data.data.status)
        break
      case GAME_EVENT_SCENE_AUCTION_SALE:
        state.auction = data.data
        internalTranslateScene(state, GAME_STATUS_SCENE_4)
        break
      case GAME_EVENT_SCENE_AUCTION_TIME_LOT:
        state.lotTime = data.data
        break
      case GAME_EVENT_GAME_SCENE_SCHEME:
        state.schemeData = data.data
        internalTranslateScene(state, GAME_STATUS_SCENE_5)
        break
      case GAME_EVENT_GAME_SCHEMA_DATA:
        state.scheme = data.data
        break
      case GAME_EVENT_SCENES_DATA:
        state.scenesData = data.data
        break
      case GAME_EVENT_GAME_PROCESS_DATA:
      case GAME_EVENT_GAME_PROCESS_START:
        state.prepareData = data.data
        break
      default:
        /* eslint-disable no-console */
        console.warn('translateEvent - необработанное', data)
        /* eslint-enable no-console */
    }
  },

  setRestApiError (state, data) {
    state.restApiError = data
  },
  setGameResources (state, data) {
    state.gameResources[data.type] = data.data
  },
  setTariffsData (state, data) {
    state.tariffs = data
  },
  setGamerConsumers (state, data) {
    if (state.scenesData !== undefined) {
      const scene = state.scenesData.find(e => e.mainstation === data.key)
      if (scene !== undefined) {
        scene.consumers = data.consumers
      }
    }
  }
}

export const actions = {
  initializeGameController (context) {
    setTimeout(() => { wsGameController(this) }, 1000)
  },

  setAdministratorMode (context, data) {
    if (!context.state.hasAdmin) {
      sendEventMessage(GAME_EVENT_LOCK_CONTROLLER)
    }
  },
  startGameScenes (context, data) {
    sendEventMessage(GAME_EVENT_START_GAME_SCENES, JSON.stringify({
      gameday: data.gameday,
      data: context.state.scenesData
    }))
  },
  cancelGameScenes (context, data) {
    if (context.state.gameStatus !== GAME_STATUS_NONE && context.state.hasAdmin) {
      sendEventMessage(GAME_EVENT_CANCEL_GAME_SCENES)
    }
  },
  nextGameScene (context) {
    if (context.state.gameStatus !== GAME_STATUS_NONE && context.state.hasAdmin) {
      sendEventMessage(GAME_EVENT_SCENE_NEXT)
    }
  },
  prevGameScene (context) {
    if (context.state.gameStatus !== GAME_STATUS_NONE && context.state.hasAdmin) {
      sendEventMessage(GAME_EVENT_SCENE_PREV)
    }
  },

  loadGameResources (context, data) {
    ENERGYSYSTEM_OBJECT_TYPES.forEach(item =>
      this.$axios.$get(API_ENERGY_SERVICE_FIND + '/' + item.value, { progress: false })
        .then((v) => {
          context.commit('setGameResources', { type: item.value, data: v })
        })
        .catch((error) => {
          let msg
          if (error.response) {
            msg = 'ошибка ' + error.response.status + ': ' + error.response.data
          } else {
            msg = 'ошибка REST API'
          }
          context.commit('setRestApiError', msg)
        })
    )

    this.$axios.$get(API_TARIFFS_SERVICE, { progress: false })
      .then((v) => {
        context.commit('setTariffsData', v)
      })
      .catch((error) => {
        let msg
        if (error.response) {
          msg = 'ошибка ' + error.response.status + ': ' + error.response.data
        } else {
          msg = 'ошибка REST API'
        }
        context.commit('setRestApiError', msg)
      })

    setTimeout(sendEventMessage(GAME_EVENT_SCENES_DATA), 100)
  },

  clearRestApiError (context, data) {
    context.commit('game/setRestApiError', undefined)
  },

  setGamerConsumers (context, data) {
    context.commit('setGamerConsumers', data)
  },
  requestActionData (context, data) {
    sendEventMessage(GAME_EVENT_SCENE_AUCTION)
  },
  setActionParams (context, data) {
    sendEventMessage(GAME_EVENT_SCENE_AUCTION_SETTINGS, JSON.stringify(data))
  },
  auctionPutLot (context, data) {
    sendEventMessage(GAME_EVENT_SCENE_AUCTION_PUT_LOT)
  },
  auctionCancelLot (context, data) {
    sendEventMessage(GAME_EVENT_SCENE_AUCTION_CANCEL_LOT)
  },
  requestSchemesData (context, data) {
    sendEventMessage(GAME_EVENT_GAME_SCENE_SCHEME)
    sendEventMessage(GAME_EVENT_GAME_SCHEMA_DATA)
  },
  requestProcessData (context, data) {
    sendEventMessage(GAME_EVENT_GAME_PROCESS_DATA)
  }
}
