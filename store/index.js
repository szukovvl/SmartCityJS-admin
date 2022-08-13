//
import {
  API_COMMON_INFO_SERVICE,
  WS_API_INFO_SERVICE
} from '~/assets/helpers'

//
function serviceCommonInfo (ctx) {
  ctx.$axios.$get(API_COMMON_INFO_SERVICE, { progress: false })
    .then((v) => {
      setTimeout(() => { serviceCommonInfo(ctx) }, 800)
      ctx.commit('setCommonInfoData', v)
    })
    .catch(() => {
      setTimeout(() => { serviceCommonInfo(ctx) }, 5000)
    })
}

function wsServiceCommonInfo (ctx) {
  const connection = new WebSocket('ws://' + (location !== undefined ? location.host : '127.0.0.1') + WS_API_INFO_SERVICE)

  connection.onmessage = function (event) {
    const v = JSON.parse(event.data)
    if (v.type === 'SOLAR_SLICE' || v.type === 'WIND_SLICE') {
      ctx.commit('setTimeSlice', v)
    }
    // const date = new Date()
    // date.setTime(v.timestamp)
  }

  connection.onopen = () => {
    ctx.commit('setWsServiceConnected', true)
  }

  connection.onerror = function (event) {
    ctx.commit('setWsServiceConnected', false)
    /* eslint-disable no-console */
    console.error(event)
    /* eslint-enable no-console */
    connection.close()
  }

  connection.onclose = () => {
    ctx.commit('setWsServiceConnected', false)
    /* eslint-disable no-console */
    console.warn('wsSocket информационного сервиса закрыт.')
    /* eslint-enable no-console */
    setTimeout(() => { wsServiceCommonInfo(ctx) }, 10000)
  }
}

//
export const state = () => ({
  commonInfo: undefined,
  serviceConnected: false,
  wsServiceConnected: false,
  timeSlices: {},
  lastSlice: undefined
})

export const getters = {}

export const mutations = {
  setCommonInfoData (state, data) {
    state.commonInfo = data
  },
  setServiceConnected (state, data) {
    state.serviceConnected = data
  },
  setWsServiceConnected (state, data) {
    state.wsServiceConnected = data
  },
  setTimeSlice (state, data) {
    if (state.timeSlices[data.data.key] === undefined) {
      state.timeSlices[data.data.key] = []
    }
    state.timeSlices[data.data.key].push(data)
    while (state.timeSlices[data.data.key].length > 200) {
      state.timeSlices[data.data.key].shift()
    }
    state.lastSlice = data
  }
}

export const actions = {
  initializeClientApp (ctx) {
    this.$axios.interceptors.request.use(function (config) {
      return config
    }, function (error) {
      ctx.commit('setServiceConnected', false)
      return Promise.reject(error)
    })

    this.$axios.interceptors.response.use(function (response) {
      ctx.commit('setServiceConnected', true)
      return response
    }, function (error) {
      if (error.response.status === 504) {
        ctx.commit('setServiceConnected', false)
      }
      return Promise.reject(error)
    })

    setTimeout(() => { serviceCommonInfo(this) }, 1000)
    setTimeout(() => { wsServiceCommonInfo(this) }, 1000)
  }
}
