import router from "../router"
const state = {
  modalCategory: false,
  uuid: "",
  showProduct: false,
  breadcrumb: [],
  searchCatalog: ""
}
const actions = {
  setUUID({ commit }, { ctx }) {
    commit("setUUIDMut", ctx)
  },
  setModalCategory({ commit }, { ctx }) {
    commit("setModalCategoryMut", ctx)
  },
  setShowProduct({ commit }, { ctx }) {
    commit("setShowProductMut", ctx)
  },
  setBreadcrumb({ commit }, { ctx }) {
    commit("setBreadcrumbMut", ctx)
  },
  setBreadcrumbCut({ commit }, { ctx }) {
    commit("setBreadcrumbMutCut", ctx)
  },
  setSearchCatalog({ commit }, { ctx, update }) {
    commit("setSearchCatalogMutation", { ctx, update })
  }
}
const mutations = {
  setUUIDMut(state, ctx) {
    if (ctx !== "") {
      state.searchCatalog = ""
    }
    if (ctx == "forceRestart") {
      state.uuid = ""
      state.searchCatalog = ""
    } else {
      state.uuid = ctx
    }
  },
  setModalCategoryMut(state, ctx) {
    state.showProduct = true
    if (ctx === false) {
      state.modalCategory = false
    } else {
      state.modalCategory = !state.modalCategory
    }
  },
  setShowProductMut(state, ctx) {
    state.showProduct = ctx
  },
  setBreadcrumbMut(state, ctx) {
    if (!ctx) {
      state.breadcrumb = []
    } else {
      state.breadcrumb.unshift(ctx)
    }
  },
  setBreadcrumbMutCut(state, ctx) {
    if (ctx !== false) {
      state.breadcrumb.forEach((item, index) => {
        if (item.id == ctx.id) {
          state.breadcrumb.splice(index + 1, 10)
        }
      })
    } else {
      state.breadcrumb = []
    }
  },
  setSearchCatalogMutation(state, ctx) {
    if (ctx.update == undefined) {
      if (router.history.current.path === "/catalog") {
        state.uuid = ""
        state.breadcrumb = []
        state.searchCatalog = ctx.ctx
      } else {
        router.push("/catalog")
        state.uuid = ""
        state.breadcrumb = []
        state.searchCatalog = ctx.ctx
      }
    } else {
      state.searchCatalog = ctx.ctx
    }
  }
}
const getters = {
  modalCategory: state => {
    return state.modalCategory
  },
  uuid: state => {
    return state.uuid
  },
  showProduct: state => {
    return state.showProduct
  },
  breadcrumb: state => {
    return state.breadcrumb
  },
  searchCatalog: state => {
    return state.searchCatalog
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
