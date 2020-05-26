<template>
  <div class="auction--lot__row">
    <div
      v-for="item of dataLotsLocal"
      :key="item.id"
      ref="lots"
      class="lot listFilter-item"
      :class="{ visibleItem: lotVisible }"
    >
      <div class="lot--img">
        <div
          class="link__lot pointer"
          title="Картинка лота"
          @click.prevent="openLot(item.id)"
        >
          <img :src="item.image" alt="" />
        </div>
        <div
          class="label"
          :class="{
            'status--green': item.status == 30,
            'status--blue': item.status == 0,
            'status--red': item.status == 40,
            'status--yellow': item.status == 10
          }"
        >
          {{ item.status_name }}
        </div>
      </div>
      <div class="lot--desc">
        <div class="lot--location">
          <i class="fas fa-map-marker-alt"></i>
          <div class="location--name">
            {{ item.location }}
          </div>
        </div>
        <div class="lot--name">
          <a
            class="name gray"
            :href="'/item/lot?id=' + item.id"
            @click.prevent="openLot(item.id)"
          >
            {{ item.name }}
          </a>
        </div>
        <div
          class="lot--timer"
          :class="{
            'bg-l--green': item.status == 30,
            'bg-l--blue': item.status == 0,
            'bg-l--red': item.status == 40,
            'bg-l--yellow': item.status == 10
          }"
        >
          <div
            v-if="item.status == 30 || item.status == 40"
            class="label medium-small text mb5"
          >
            Аукцион завершен:
            <span class="text dark medium-small">{{
              item.time_end | formatDateDot
            }}</span>
          </div>
          <div v-else class="label small dark text mb5">
            Время до начала аукциона:
          </div>
          <countdown
            v-if="item.time_end * 1000 >= timeServer"
            :time="item.time_end * 1000 - timeServer"
          >
            <template slot-scope="props">
              <div class="timer--row time">
                <div class="tab time-days">
                  {{ props.days }}
                </div>
                <div class="tab time-hours">
                  {{ props.hours }}
                </div>
                <div class="tab time-minutes">
                  {{ props.minutes }}
                </div>
                <div class="tab time-seconds">
                  {{ props.seconds }}
                </div>
              </div>
            </template>
          </countdown>
          <div v-else class="timer--row">
            <div class="tab time-days">
              --
            </div>
            <div class="tab time-hours">
              --
            </div>
            <div class="tab time-minutes">
              --
            </div>
            <div class="tab time-seconds">
              --
            </div>
          </div>
        </div>
        <div class="lot--footer">
          <div class="lot--footer-left">
            <div class="lot--price">
              <div class="price">
                {{ item.price }}
              </div>
              <div class="curr">
                evo
              </div>
            </div>
            <div class="lot--bet">
              {{ item.bets }}
            </div>
          </div>
          <div class="lot--footer-right">
            <a
              :href="'/item/lot?id=' + item.id"
              class="to-lot-btn"
              @click.prevent="openLot(item.id)"
            >
              <i class="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lot",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dataLots: { type: Array }
  },
  data: () => ({
    dataLotsLocal: [],
    timeServer: new Date(),
    lots: [],
    lotVisible: false
  }),
  watch: {
    dataLots(e) {
      this.dataLotsLocal = e
      this.lotVisible = false
      setTimeout(() => {
        this.lotVisible = true
      }, 300)
    }
  },
  mounted() {
    this.apiTimeServer()
    this.lotVisible = true
    this.$nextTick(() => this.socketEvents())
  },
  updated() {
    this.transitionLots()
  },
  methods: {
    transitionLots() {
      let d = 1
      if (this.$refs.lots !== undefined) {
        this.$refs.lots.forEach(i => {
          i.style.transitionDelay = `${d++ * 60}ms`
        })
      }
    },
    socketEvents() {
      this.$socket.$subscribe("lot", message => {
        console.log("hello socket")
        let data = JSON.parse(message)
        if (this.dataLots.length) {
          this.dataLots.forEach((value, index) => {
            if (value.id === data.model.id) {
              this.dataLots[index].time_end = data.model.time_end
            }
          })
        }
        this.timeServer = data.model.server_time
      })
    },
    openLot(lot) {
      this.$router.push({ path: "/item/lot", query: { id: lot } })
      console.log(this.$router)
    },
    apiTimeServer() {
      this.$api.post("/public/time").then(response => {
        this.timeServer = response.data.time + response.metadata.requestDuration
      })
    }
  }
}
</script>

<style scoped></style>
