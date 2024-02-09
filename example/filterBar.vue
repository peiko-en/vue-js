<template>
  <div class="filters column">
    <div class="column filterSticky scroll__custom">
      <div v-loading="loadingFilter" class="section">
        <div class="section--name">
          Активные фильтры:
        </div>
        <div class="filter-cheaps-row">
          <el-tag
            v-for="tag in tagsCategory"
            :key="tag.name"
            closable
            type="info"
            color="#e5eef9"
            @close="tagsFilter(tag, true)"
          >
            {{ tag.name }}
          </el-tag>
          <el-tag
            v-for="tag in tagsDate"
            :key="tag.name"
            closable
            type="info"
            color="#e5eef9"
            @close="dateCheck(tag, true)"
          >
            {{ tag.name }}
          </el-tag>
          <el-tag
            v-for="tag in tagsCity"
            :key="tag.name"
            closable
            type="info"
            color="#e5eef9"
            @close="closeTagCity(tag, true)"
          >
            {{ tag.name }}
          </el-tag>
          <el-tag
            v-if="
              !tags.length &&
                !tagsCategory.length &&
                !tagsDate.length &&
                !tagsCity.length
            "
          >
            нету активных
          </el-tag>
        </div>
        <div class="mt20">
          <div v-if="tags.length" class="clear-filter-btn">
            <i class="fas fa-times"></i>
            <span class="ml10 filter_clear" @click="tags = []">
              Сбросить все
            </span>
          </div>
        </div>
      </div>
      <div v-loading="loadingFilter" class="section mt30">
        <div class="section--name">
          Регион:
        </div>
        <div class="mt20 mb25">
          <searchCountry
            :id="$store.state.filterAuction.city"
            @cityFilter="cityFilter"
          />
        </div>
        <div class="section--name">
          категории:
        </div>
        <div class="mt20">
          <el-select
            v-model="filterCategoryModel"
            clearable
            class="w100 select-default"
            placeholder="Выберет категорию"
            @change="tagsFilter"
          >
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div v-loading="loadingFilter" class="section mt30">
        <div class="section--name">
          Цена:
        </div>
        <div class="slider-wrap" :style="{ opacity: loadingFilter ? 0 : 1 }">
          <el-slider
            id="slider"
            v-model="rangeFilterValue"
            range
            :min="0"
            :max="price.max"
            @change="sliderFunc"
          />
          <div class="row values">
            <div class="value">
              <input
                type="number"
                class="range-value mr20 min_price"
                :value="rangeFilterValue[0]"
                @input="rangeFilterPrice($event, rangeFilterValue[1])"
              />
            </div>
            <div class="value">
              <input
                type="number"
                class="range-value mr20 max_price"
                :value="rangeFilterValue[1]"
                @input="rangeFilterPrice($event, rangeFilterValue[0])"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="section mt30">
        <div class="section--name">
          СТАТУС ЛОТА:
        </div>
        <div v-loading="loadingFilter" class="column mt25">
          <el-checkbox-group v-model="checkedStatus">
            <div class="column">
              <el-checkbox
                v-for="(item, index) in satatusLot"
                :key="index"
                class="mb15"
                :label="item"
                @change="dateCheck(item, false, 'checkedStatus')"
              >
                {{ item.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="section mt30">
        <div class="section--name">
          ВРЕМЯ ДО ОКОНЧАНИЯ АУКЦИОНА:
        </div>
        <div v-loading="loadingFilter" class="column mt25">
          <el-checkbox-group v-model="checkedEnding">
            <div class="column">
              <el-checkbox
                v-for="(item, index) in endingLot"
                :key="index"
                class="mb15"
                :label="item"
                @change="dateCheck(item, false, 'checkedEnding')"
              >
                {{ item.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <div class="section mt30">
        <div class="section--name">
          Дата:
        </div>
        <div v-loading="loadingFilter" class="column mt25">
          <el-checkbox-group v-model="checkedDate">
            <div class="column">
              <el-checkbox
                v-for="(item, index) in dateOptions"
                :key="index"
                class="mb15"
                :label="item"
                @change="dateCheck(item, false, 'checkedDate')"
              >
                {{ item.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchCountry from "./searchCountry"
import { mapGetters } from "vuex"
export default {
  name: "FilterBar",
  components: {
    searchCountry
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ["category", "price", "loadingFilter"],
  data: () => ({
    rangeFilterValue: [0, 1000],
    tags: [],
    tagsCategory: [],
    tagsCity: [],
    filterCategoryModel: 1,
    checkedDate: [],
    checkedEnding: [],
    checkedStatus: [],
    dateOptions: [
      { name: "Завершающиеся", id: -1 },
      { name: "За сегодня", id: 1 },
      { name: "За вчера", id: 2 },
      { name: "За 7 дней", id: 7 }
    ],
    endingLot: [
      { name: "В течение 24-х часов", id: 24 },
      { name: "В течение 3-х дней", id: 72 },
      { name: "В течение 7-и дней", id: 168 },
      { name: "В течении 2-х недель", id: 336 }
    ],
    satatusLot: [
      { name: "Активный", id: 0 },
      { name: "Скоро начнется", id: 10 },
      { name: "Завершенный", id: 30 }
    ],
    tagsDate: []
  }),
  computed: {
    ...mapGetters("filterAuction", ["stateGetter"])
  },
  watch: {
    filterCategoryModel(e) {
      this.$store.dispatch("filterAuction/set_category", { ctx: e })
    },
    category() {
      this.tagsFilter()
    },
    checkedDate(e) {
      if (e.length) {
        e.forEach(item => {
          if (item.id !== undefined)
            this.$store.dispatch("filterAuction/set_checkDate", {
              ctx: item.id
            })
        })
      } else this.$store.dispatch("filterAuction/set_checkDate", "")
    },
    checkedStatus(e) {
      if (e.length) {
        e.forEach(item => {
          if (item.id !== undefined)
            this.$store.dispatch("filterAuction/set_statusLot", {
              ctx: item.id
            })
        })
      } else this.$store.dispatch("filterAuction/set_statusLot", "")
    },
    checkedEnding(e) {
      if (e.length) {
        e.forEach(item => {
          if (item.id !== undefined)
            this.$store.dispatch("filterAuction/set_endIn", {
              ctx: item.id
            })
        })
      } else this.$store.dispatch("filterAuction/set_endIn", "")
    },
    price() {
      this.rangeFilterValue = [this.price.min, this.price.max]
      this.$store.dispatch("filterAuction/set_priceMax", {
        ctx: this.price.max
      })
      this.$store.dispatch("filterAuction/set_priceMin", {
        ctx: 0
      })
    }
  },
  mounted() {
    this.queryParams()
    if (this.stateGetter.checkDate !== "") {
      // eslint-disable-next-line no-unused-vars
      this.dateOptions.forEach((item, index) => {
        if (this.stateGetter.checkDate == item.id) {
          this.checkedDate.push(item)
          this.dateCheck(item, false, "checkedDate")
        }
      })
    }
    if (this.stateGetter.endIn !== "") {
      // eslint-disable-next-line no-unused-vars
      this.endingLot.forEach((item, index) => {
        if (this.stateGetter.endIn == item.id) {
          this.checkedEnding.push(item)
          this.dateCheck(item, false, "checkedEnding")
        }
      })
    }
    if (this.stateGetter.statusLot !== "") {
      // eslint-disable-next-line no-unused-vars
      this.satatusLot.forEach((item, index) => {
        if (this.stateGetter.statusLot == item.id) {
          this.checkedStatus.push(item)
          this.dateCheck(item, false, "checkedStatus")
        }
      })
    }
    this.filterCategoryModel = this.stateGetter.category
  },
  methods: {
    queryParams() {
      if (this.$route.query.category !== "") {
        this.$store.dispatch("filterAuction/set_category", {
          ctx: this.$route.query.category
        })
      }
      if (this.$route.query.statusLot !== "") {
        this.$store.dispatch("filterAuction/set_statusLot", {
          ctx: this.$route.query.statusLot
        })
      }
      if (this.$route.query.checkDate !== "") {
        this.$store.dispatch("filterAuction/set_checkDate", {
          ctx: this.$route.query.checkDate
        })
      }
    },
    dateCheck(e, close, nameArr) {
      let arr = this[nameArr]
      let spl = () => {
        this.tagsDate.forEach((item, index) => {
          if (item.id == e.id) {
            this.tagsDate.splice(index, 1)
          }
        })
      }
      if (!close) {
        if (arr.length) {
          arr.forEach((item, index) => {
            if (item.id == e.id) {
              this.tagsDate.push(...arr)
            } else {
              this.tagsDate.forEach((item, index) => {
                arr.forEach(a => {
                  if (a.id == item.id) {
                    this.tagsDate.splice(index, 1)
                  }
                })
              })
              arr.splice(index, 1)
              this.tagsDate.push(...arr)
            }
          })
        } else {
          spl()
        }
      } else {
        this.checkedStatus.forEach((item, index) => {
          if (item.id == e.id) {
            this.checkedStatus.splice(index, 1)
            this.$store.dispatch("filterAuction/set_statusLot", {
              ctx: ""
            })
          }
        })
        this.checkedDate.forEach((item, index) => {
          if (item.id == e.id) {
            this.checkedDate.splice(index, 1)
            this.$store.dispatch("filterAuction/set_checkDate", {
              ctx: ""
            })
          }
        })
        this.checkedEnding.forEach((item, index) => {
          if (item.id == e.id) {
            this.checkedEnding.splice(index, 1)
            this.$store.dispatch("filterAuction/set_endIn", {
              ctx: ""
            })
          }
        })
        spl()
      }
    },
    tagsFilter(e, clear) {
      if (clear == true && clear !== undefined) {
        this.filterCategoryModel = ""
      }
      this.tagsCategory = []
      let tagsCategory = this.category.map(i => {
        return {
          name: i.name,
          id: i.id,
          alias: i.alias
        }
      })
      tagsCategory.forEach(i => {
        if (i.id == this.filterCategoryModel) {
          this.tagsCategory.push(i)
        }
      })
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    rangeFilterPrice(e, a) {
      let arr = []
      if (e < a) {
        arr = [e.target.value, a]
        this.$store.dispatch("filterAuction/set_priceMax", {
          ctx: arr[1]
        })
        this.$store.dispatch("filterAuction/set_priceMin", {
          ctx: arr[0]
        })
      } else {
        arr = [a, e.target.value]
        this.$store.dispatch("filterAuction/set_priceMax", {
          ctx: arr[0]
        })
        this.$store.dispatch("filterAuction/set_priceMin", {
          ctx: arr[1]
        })
      }
      this.rangeFilterValue = arr
    },
    sliderFunc(e) {
      this.$store.dispatch("filterAuction/set_priceMax", {
        ctx: e[1]
      })
      this.$store.dispatch("filterAuction/set_priceMin", {
        ctx: e[0]
      })
    },
    // eslint-disable-next-line no-unused-vars
    cityFilter(id, city) {
      if (id) {
        this.$store.dispatch("filterAuction/set_city", {
          ctx: id
        })
        this.tagsCity = []
        this.tagsCity.push(city)
      } else {
        this.closeTagCity()
      }
    },
    closeTagCity() {
      this.$store.dispatch("filterAuction/set_city", {
        ctx: ""
      })
      this.tagsCity = []
    }
  }
}
</script>

<style scoped></style>
