<template>
  <div class="column">
    <lot :data-lots="lots" />
    <div class="w100 row centered mt30">
      <nuxt-link class="light big button" to="/auction">
        Смотреть весь аукцион
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import lot from "@/components/lot"
export default {
  name: "Recommend",
  components: {
    lot
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["dataLots"],
  data: () => ({
    lots: []
  }),
  mounted() {
    this.apiLoad()
  },
  methods: {
    apiLoad() {
      this.$api.post("/item/recommend").then(response => {
        console.log(response.data.lots)
        this.lots = response.data.lots
      })
    }
  }
}
</script>

<style scoped></style>
