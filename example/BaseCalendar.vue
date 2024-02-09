<template>
  <div
    class="base-calendar"
    :class="{ 'base-calendar_green': isGreen }"
  >
    <div class="base-calendar__header">
      <div
        class="base-calendar__arrow"
        :class="'icon-Arrow-left'"
        @click="previousMonth"
      />
      <div class="calendar-year-date">{{ `${months[month]} ${year}` }}</div>
      <div
        class="base-calendar__arrow"
        :class="'icon-Arrow-right'"
        @click="nextMonth"
      />
    </div>
    <table class="base-calendar__table">
      <tbody>
        <!-- Week days -->
        <tr class="base-calendar__week base-calendar__week_labels">
          <th
            v-for="(item, index) of labels"
            :key="'week-day-' + index"
            class="base-calendar__label"
          >
            {{ item }}
          </th>
        </tr>
        <!-- MONTH -->
        <tr
          v-for="(week, indexWeek) of createCalendar()"
          :key="'week-' + indexWeek"
          class="base-calendar__week"
        >
          <th
            v-for="(day, indexDay) of week"
            :key="'week-' + indexWeek + '-day-' + indexDay"
            class="base-calendar__cell"
          >
            <div
              class="base-calendar__day"
              :class="[
                { 'base-calendar__day_today': isToday(day) },
                { 'base-calendar__day_selected': isSelected(day) },
                { 'base-calendar__day_disabled': isDisabled(day) },
                { 'base-calendar__day_disabled-min': isDisabledGray(day) },
                { 'base-calendar__day_hidden': !day },
              ]"
              @click="selectDate(day)"
            >
              {{ day }}
            </div>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 1,
    },
    isGreen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    todayDate: new Date(),
    date: new Date(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),

    index: 0,
    selectedDays: [],
    disabledDays: [],
  }),
  mounted() {
    this.date.setDate(15);
    this.selectedDays = this.model.map((tmstmp) => new Date(tmstmp));
  },
  methods: {
    isToday(day) {
      return (
        this.todayDate.getDate() === day
        && this.todayDate.getMonth() === this.month
        && this.todayDate.getFullYear() === this.year
      );
    },
    isSelected(day) {
      return this.selectedDays.find((date) => {
        if (!date) {
          return false;
        }
        if (date.getDate() === day
        && date.getMonth() === this.month
        && date.getFullYear() === this.year) {
          return true;
        }
        return false;
      }) !== undefined;
    },
    isDisabledGray(day) {
      if (this.month < this.todayDate.getMonth() || this.year < this.todayDate.getFullYear()) {
        return true;
      }
      if (day < this.todayDate.getDate() && this.month === this.todayDate.getMonth() && this.year === this.todayDate.getFullYear()) {
        return true;
      }
      return false;
    },
    isDisabled(day) {
      return this.disabled.find((date) => {
        if (date.getDate() === day && date.getMonth() === this.month && date.getFullYear() === this.year) {
          return true;
        }
        return false;
      }) !== undefined;
    },
    createCalendar() {
      const mon = this.month;
      const d = new Date(this.year, mon);
      const month = [];
      let week = [];
      // spaces before
      for (let i = 0; i < this.getDay(d); i += 1) {
        week.push('');
      }
      while (d.getMonth() === mon) {
        week.push(d.getDate());
        if (this.getDay(d) % 7 === 6) {
          month.push(week);
          week = [];
        }
        d.setDate(d.getDate() + 1);
      }
      // spaces after
      if (this.getDay(d) !== 0) {
        for (let i = this.getDay(d); i < 7; i += 1) {
          week.push('');
        }
      }
      month.push(week);
      return month;
    },

    getDay(date) {
      let day = date.getDay();
      if (day === 0) day = 7;
      return day - 1;
    },
    previousMonth() {
      this.date.setMonth(this.date.getMonth() - 1);
      this.month = this.date.getMonth();
      this.year = this.date.getFullYear();
    },
    nextMonth() {
      this.date.setMonth(this.date.getMonth() + 1);
      this.month = this.date.getMonth();
      this.year = this.date.getFullYear();
    },
    selectDate(day) {
      if (this.isSelected(day)) {
        const index = this.selectedDays.map((item) => {
          if (item.getDate() === day
            && item.getMonth() === this.month
            && item.getFullYear() === this.year) {
            return true;
          }
          return false;
        }).indexOf(true);
        if (index !== -1) {
          this.selectedDays.splice(index, 1);
          this.$emit('input', this.selectedDays.map((d) => d.getTime()));
          return;
        }
      }
      if (this.count === 1) {
        this.selectedDays = [];
      }
      if (this.count >= 1 && this.selectedDays.length >= this.count) {
        return;
      }
      const date = new Date();
      date.setDate(day);
      date.setMonth(this.month);
      date.setFullYear(this.year);

      this.selectedDays.push(date);
      this.$emit('input', this.selectedDays.map((d) => d.getTime()));
      this.index += 1;
      this.index = this.index >= this.count ? 0 : this.index;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-calendar {
  background: #E1E2E3;
  border-radius: 12px;
  font-family: "Orbitron", sans-serif;
  font-size: 14px;
  line-height: 160%;
  align-items: center;
  text-align: center;
  color: #000;
  padding: 20px;
  user-select: none;
  @media(max-width: 575px) {
    background: #F4F4F4;
    padding: 10px;
  }
  th {
    font-weight: 500;
  }
  &_green {
    background: #ccff00;
  }
  &__header {
    height: 34px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 20px auto 20px;
    justify-items: center;
    align-items: center;
  }
  &__arrow {
    font-size: 50px;
  }
  &__week {
    height: 45px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    align-items: center;
    &_labels {
      font-family: "Orbitron", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 160%;
      color: #697172;
    }
  }
  &__table {
    width: 100%;
    height: 100%;
  }
  &__cell {
    display: grid;
    font-family: "Orbitron", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 160%;
    letter-spacing: 0.03em;
  }
  &__day {
    line-height: 45px;
    height: 45px;
    border-radius: 15px;
    box-sizing: border-box;
    @media(max-width: 575px) {
      height: 40px;
      line-height: 40px;
    }
    &:hover {
      border: 2px solid #000;
      line-height: 41px;
    }
    &_today {
      border: 2px solid #898a8a;
    }
    &_selected {
      border: 2px solid #000;
      background: #000;
      color: #fff;
      line-height: 41px;
       @media(max-width: 575px) {
        line-height: 36px;
       }
    }
    &_hidden {
      display: none;
    }
    &_disabled {
      background: #CCCCCC;
      pointer-events: none;
    }
    &_disabled-min {
      color: #898a8a;
      opacity: 0.7;
      pointer-events: none;
    }
  }
}

.calendar-year-date {
  font-family: "Orbitron", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  text-align: center;
  letter-spacing: 0.01em;
}
</style>
