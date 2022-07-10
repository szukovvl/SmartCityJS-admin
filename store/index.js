//
import { API_COMMON_INFO_SERVICE } from '~/assets/helpers'
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
//
export const state = () => ({
  commonInfo: undefined,
  serviceConnected: false
})

export const getters = {}

export const mutations = {
  setCommonInfoData (state, data) {
    state.commonInfo = data
  },
  setServiceConnected (state, data) {
    state.serviceConnected = data
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
  }
}
