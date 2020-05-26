<template>
  <el-select
    v-model="localModel"
    placeholder="Выберете"
    class="select-transporant"
  >
    <el-option
      v-for="item in localItems"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: "SelectFilter",
  // eslint-disable-next-line vue/require-prop-types
  props: ["model", "items"],
  data: () => ({
    localModel: "",
    filterSelect: [
      {
        value: "soon",
        label: "Актуальные"
      },
      {
        value: "name",
        label: "Название от А до Я"
      },
      {
        value: "-name",
        label: "Название от Я до A"
      },
      {
        value: "time_end",
        label: "Дата"
      },
      {
        value: "-price_current",
        label: "Сначала дорогие"
      },
      {
        value: "price_current",
        label: "Сначала дешевые"
      }
    ],
    localItems: []
  }),
  watch: {
    localModel(e) {
      this.$emit("modelFilter", e)
    }
  },
  created() {
    this.localModel = this.model
    if (this.items == undefined) {
      this.localItems = this.filterSelect
    }
  }
}
</script>

<style scoped></style>
