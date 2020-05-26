<template>
  <div>
    <div class="chipsBox">
      <div v-if="useArr">
        <div
          v-for="(item, index) in id"
          v-show="index < 2"
          :key="index"
          class="chipsBox_item"
        >
          <v-tooltip top max-width="320px">
            <div class="wrap-text">{{ itemsName[item] }}</div>
            <span slot="activator">{{
              itemsName[item] | truncate(20, "...")
            }}</span>
          </v-tooltip>
        </div>
        <v-menu v-if="id.length > 2" z-index="120">
          <template v-slot:activator="{ on }">
            <span v-if="id.length > 2" style="cursor: pointer" v-on="on">
              ще {{ id.length - 2 }}
            </span>
          </template>
          <div class="dialog-item">
            <div v-for="(item, index) in id" v-show="index >= 2" :key="index">
              {{ itemsName[item] }}
            </div>
          </div>
        </v-menu>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in idObject"
          v-show="index < 2"
          :key="index"
          class="chipsBox_item"
        >
          <v-tooltip top max-width="320px">
            <div class="wrap-text">{{ item.name }}</div>
            <span slot="activator">{{ item.name | truncate(20, "...") }}</span>
          </v-tooltip>
        </div>
        <v-menu v-if="idObject.length > 2" z-index="120">
          <template v-slot:activator="{ on }">
            <span v-if="idObject.length > 2" style="cursor: pointer" v-on="on">
              и еще {{ idObject.length - 2 }}
            </span>
          </template>
          <div class="dialog-item">
            <div
              v-for="(item, index) in idObject"
              v-show="index >= 2"
              :key="index"
            >
              {{ item.name }}
            </div>
          </div>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CChips",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    id: {
      type: Array,
      default: () => []
    },
    useArr: {
      type: Boolean,
      default: true
    },
    idObject: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: "name"
    }
  },
  data: () => ({
    itemsName: []
  }),
  watch: {
    items() {
      let rObj = {}
      if (this.items.length) {
        this.items.forEach(e => {
          rObj[e.id] = e[this.name]
        })
        this.itemsName = rObj
      }
    }
  },
  created() {
    let rObj = {}
    if (this.items.length) {
      this.items.forEach(e => {
        rObj[e.id] = e[this.name]
      })
      this.itemsName = rObj
    }
  }
}
</script>

<style scoped lang="sass">
.chipsBox
    position: relative
.dialog-item
    max-width: 250px
    z-index: 9
    display: flex
    align-items: center
    justify-content: flex-start
    flex-wrap: wrap
    background-color: white
    border-radius: 4px
    width: 100%
    padding: 10px
    box-shadow: 0px 0px 8px 0px #8086ab
    max-height: 450px
    overflow-y: auto
    div
        cursor: pointer
        display: flex
        background-color: #F0F3FF
        color: #646C9A
        border-radius: 4px
        margin: 3px
        padding: 3px 5px
        align-items: center
        transition: 0.3s
        &:hover
            background-color: #e2e8ff
</style>
