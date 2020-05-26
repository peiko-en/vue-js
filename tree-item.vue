<template>
  <div class="item-child">
    <div
      class="child-name"
      :class="{
        'head-name': main,
        active: item.uuid === $store.getters['category/uuid']
      }"
      :title="item.name"
      @click="postItem(item)"
    >
      {{ item.name }}
    </div>
    <div v-for="(itemChild, index) in item.children" :key="index">
      <div
        class="child-name"
        :class="{ active: itemChild.uuid === $store.getters['category/uuid'] }"
        :title="itemChild.name"
        @click="postItem(itemChild)"
      >
        {{ itemChild.name }}
      </div>
      <tree-item
        v-for="(i, index) in itemChild.children"
        :key="index"
        :item="i"
        :main="false"
        @getItem="getItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeItem",
  props: ["item", "main"],
  methods: {
    getItem(item) {
      this.postItem(item)
    },
    postItem(item) {
      console.log(item)
      this.$emit("getItem", item)
    }
  }
}
</script>

<style scoped lang="sass">
.child-name
    cursor: pointer
    font-style: normal
    font-weight: normal
    font-size: 14px
    line-height: 140%
    color: #646C9A
    width: 100%
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    display: block
    &:hover
      text-decoration: underline
      .item-child, div
        text-decoration: none!important
    &.active
      text-decoration: none
      background-color: #f0f3ff
</style>
