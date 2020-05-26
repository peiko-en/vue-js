<template>
  <div v-on-click-outside="hide" class="categoryBox">
    <button
      v-if="
        $root.rbac.viewCatalog &&
          $store.getters['user/currentUser'].company_id !== 0
      "
      class="button__category"
      :class="{ active: $store.getters['category/modalCategory'] }"
      @click="$store.dispatch('category/setModalCategory', { ctx: true })"
    >
      Каталог Товарів
      <v-icon>folder</v-icon>
    </button>
    <button v-else class="button__category disabled">
      Каталог Товарів
      <v-icon>folder</v-icon>
    </button>
    <div
      v-if="!$store.getters['params/mobileView']"
      class="filterCatalog"
      :class="{ open: $store.getters['category/modalCategory'] }"
    >
      <div class="parent" v-if="categoryData.length">
        <div
          v-for="(item, index) of categoryData"
          :key="index"
          class="item"
          :class="{ open: isOpenCategory === index }"
          @mouseover="getChildren(item.children, index, false)"
        >
          <div
            class="name ellipsis"
            :title="item.name"
            @click="goToCatalog(item)"
          >
            {{ item.name }}
          </div>
          <v-icon
            v-if="item.has_child"
            @click="getChildren(item.children, index, false)"
          >
            keyboard_arrow_right
          </v-icon>
        </div>
      </div>
      <div
        v-if="categoryData.length"
        v-masonry
        transition-duration="0s"
        item-selector=".item"
        class="children"
      >
        <div
          v-for="(item, index) in children"
          :key="index"
          v-masonry-tile
          class="item"
        >
          <div class="parent-child">
            <tree-item :item="item" :main="true" @getItem="getItem" />
          </div>
        </div>
      </div>
      <div v-if="!categoryData.length" class="noCategory">
        <span>немає доступних категорій</span>
      </div>
    </div>
    <div
      v-else
      class="filterCatalogMobile"
      :class="{ open: $store.getters['category/modalCategory'] }"
    >
      <v-btn
        v-if="!categoryData.length"
        flat
        icon
        color="#F24949"
        class="close"
        @click="$store.dispatch('category/setModalCategory', { ctx: true })"
      >
        <v-icon>close</v-icon>
      </v-btn>
      <div
        v-for="(item, index) of categoryData"
        :key="index"
        class="item item-parent"
        :class="{ open: isOpenCategory === index }"
      >
        <div class="item-top">
          <div class="name" @click="goToCatalog(item)">{{ item.name }}</div>
          <v-icon
            v-if="item.has_child"
            @click="getChildren(item.children, index, true)"
          >
            keyboard_arrow_right
          </v-icon>
        </div>
        <div v-if="isOpenCategory === index" class="child">
          <div v-for="(i, index) in children" :key="index" class="item">
            <div class="parent-child">
              <tree-item :item="i" :main="true" @getItem="getItem" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!categoryData.length" class="noCategory">
        <span>немає доступних категорій</span>
      </div>
    </div>
  </div>
</template>

<script>
import TreeItem from "./tree-item"
export default {
  name: "Category",
  components: { TreeItem },
  data: () => ({
    isOpenCategory: -1,
    categoryData: [],
    children: [],
    uuid: ""
  }),
  computed: {
    companyChange() {
      return this.$store.getters["user/currentUser"].company_id
    }
  },
  watch: {
    companyChange() {
      this.getCategory()
    },
    uuid(e) {
      this.$store.dispatch("category/setUUID", { ctx: e })
    },
    $route(to, from) {
      if (to.fullPath !== "/catalog") {
        this.$store.dispatch("category/setSearchCatalog", {
          ctx: "",
          update: false
        })
        this.$store.dispatch("category/setModalCategory", { ctx: false })
      }
    }
  },
  created() {
    this.$loadingBus.$on("updateBreadcrum", this.categoryProduct)
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    hide() {
      if (!this.$store.getters["params/mobileView"]) {
        this.$store.dispatch("category/setModalCategory", { ctx: false })
      }
    },
    categoryProduct(item) {
      this.$store.dispatch("category/setBreadcrumb", { ctx: false })
      this.categoryData.forEach(e => {
        this.treeCategotyID(e, item.category_id)
      })
    },
    treeCategotyID(ctx, id) {
      if (ctx.has_child === "1" && ctx.children !== undefined) {
        ctx.children.forEach(i => {
          if (i.id === id) {
            this.goToCatalog(i)
          } else {
            this.treeCategotyID(i, id)
          }
        })
      }
    },
    treeCategory(ctx, parentId) {
      if (ctx.id === parentId) {
        this.$store.dispatch("category/setBreadcrumb", { ctx: ctx })
      }
      if (ctx.has_child === "1" && ctx.children !== undefined) {
        ctx.children.forEach(item => {
          if (item.id === parentId) {
            this.$store.dispatch("category/setBreadcrumb", { ctx: item })
            this.categoryData.forEach(e => {
              this.treeCategory(e, item.parent_id)
            })
          } else if (item.has_child === "1") {
            this.treeCategory(item, parentId)
          }
        })
      }
    },
    goToCatalog(item) {
      this.$store.dispatch("category/setBreadcrumb", { ctx: false })
      this.$store.dispatch("category/setBreadcrumb", { ctx: item })
      this.categoryData.forEach(e => {
        this.treeCategory(e, item.parent_id)
      })
      this.uuid = item.uuid
      this.$store.dispatch("category/setModalCategory", { ctx: false })
      if (this.$route.fullPath !== "/catalog") {
        this.$router.push("/catalog")
      }
    },
    getItem(item) {
      this.goToCatalog(item)
    },
    getCategory() {
      let obj = {}
      if (this.location_id && this.order_id !== undefined) {
        obj = { location_id: this.location_id, order_id: this.order_id }
      } else if (this.order_id !== undefined) {
        obj = { order_id: this.order_id }
      } else if (this.location_id) {
        obj = { location_id: this.location_id }
      }
      obj.add_product = this.$route.name === "order-add-product";
      this.$api.post("/categories", obj).then(response => {
        this.categoryData = response.data.category.tree
      })
    },
    getChildren(child, index, toggle) {
      this.children = child
      if (index === this.isOpenCategory && toggle) {
        this.isOpenCategory = -1
      } else {
        this.isOpenCategory = index
      }
      this.$nextTick(() => this.$redrawVueMasonry())
    }
  }
}
</script>
