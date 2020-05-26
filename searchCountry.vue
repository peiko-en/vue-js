<template>
  <el-select
    v-model="city_id"
    class="w100 select-default"
    filterable
    remote
    reserve-keyword
    clearable
    :remote-method="remoteMethod"
    :loading="loading"
    placeholder="Начните писать регион"
  >
    <el-option
      v-for="(item, index) in cityFilter"
      :key="index"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
export default {
  name: "SearchCountry",
  // eslint-disable-next-line vue/require-prop-types
  props: ["id"],
  data() {
    return {
      city_id: "",
      cityFilter: [],
      loading: false
    }
  },
  watch: {
    id(e) {
      if (e) {
        this.city_id = +e
        this.cityFilter = this.$store.state.filterAuction.country.filter(
          item => {
            if (item.id == e) {
              return item
            }
          }
        )
      } else {
        this.city_id = ""
      }
    },
    city_id(id) {
      let item = this.forCity(id)
      this.$emit("cityFilter", +id, item)
    }
  },
  mounted() {
    this.city_id = this.id
    this.$store.dispatch("filterAuction/fetch")
    if (this.$route.query.city !== "" && this.$route.query.city !== undefined) {
      this.$store.dispatch("filterAuction/set_city", {
        ctx: this.$route.query.city
      })
    } else {
      this.cityFilter = this.$store.state.filterAuction.country.filter(item => {
        if (item.id == this.id) {
          return item
        }
      })
    }
  },
  methods: {
    forCity(id) {
      let item = {}
      if (!this.cityFilter.length) {
        this.$store.state.filterAuction.country.forEach(city => {
          if (city.id == id) {
            item = city
          }
        })
      } else {
        this.cityFilter.forEach(city => {
          if (city.id == id) {
            item = city
          }
        })
      }
      return item
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.cityFilter = this.$store.state.filterAuction.country.filter(
            item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            }
          )
        }, 200)
      } else {
        this.cityFilter = []
      }
    }
  }
}
</script>

<style scoped></style>
