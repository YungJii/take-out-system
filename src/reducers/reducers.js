const defaultState = {
    shouldFresh: false
  }
  
  export default (state = defaultState, action) => {
    var nStore = JSON.parse(JSON.stringify(state))
    switch (action.type) {
      case 'FRESHLIST':
        nStore.shouldFresh = action.fresh
        return nStore
      case 'REFRESHLIST':
        nStore.shouldFresh = action.fresh
        return nStore
      default:
        return state
    }

    // if (action.type === 'FRESHLIST') {
    //     let nStore = JSON.parse(JSON.stringify(state))
    //     nStore.shouldFresh = action.fresh
    //     return nStore
    // }
    // if (action.type === 'REFRESHLIST') {
    //     let nStore = JSON.parse(JSON.stringify(state))
    //     nStore.shouldFresh = action.fresh
    //     return nStore
    // }
    // return state
  }
    