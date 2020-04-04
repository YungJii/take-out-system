import { createStore } from 'redux'
import message from './reducers.js'
const store = createStore(message)

export default store