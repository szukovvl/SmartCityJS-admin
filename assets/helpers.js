//
export const CONSUMER_BY_TYPES = [
  { text: '1-й категории', value: 'HOSPITAL' },
  { text: '2-й категории', value: 'INDUSTRY' },
  { text: '3-й категории', value: 'DISTRICT' }
]

export const ALTERNATION_BY_TYPES = [
  { text: 'солнечная', value: 'SOLAR' },
  { text: 'ветровая', value: 'WIND' }
]

//
const REST_API_URL = '/api'
export const API_COMMON_INFO_SERVICE = REST_API_URL + '/common'
export const API_ENERGY_SERVICE_FIND = REST_API_URL + '/energy/find'
export const API_ENERGY_SERVICE_DATA = REST_API_URL + '/energy/data'
export const API_ENERGY_SERVICE_FORECAST = REST_API_URL + '/energy/forecast'
export const API_ENERGY_SERVICE_INTERPOLATE = REST_API_URL + '/energy/interpolate'
export const API_FORECAST_SERVICE = REST_API_URL + '/forecast'
export const API_FORECAST_SERVICE_INTERPOLATION = REST_API_URL + '/forecast/interpolate'
export const API_FORECAST_SERVICE_RANDOMIZE = REST_API_URL + '/forecast/random'

//
export const DELAY_BEFORE_SAVE_CHANGES = 500
