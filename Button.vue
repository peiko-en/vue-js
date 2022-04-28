<template>
  <component
    :is="tag"
    v-ripple="'rgba(255, 255, 255, 0.35)'"
    v-bind="attrs"
    @click="$emit('click')"
  >
    <div class="prefix">
      <slot name="prefix" />
    </div>
    <span :data-lokalise="t_text !== ''" :data-key="t_text !== '' ? t_text : ''">
      {{ text }}
    </span>
    <div class="after">
      <slot name="after" />
    </div>
  </component>
</template>

<script>
export default {
  name: 'Button',
  props: {
    to: {
      type: [String, Object],
      default: ''
    },
    gold: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Click'
    },
    // eslint-disable-next-line vue/prop-name-casing
    t_text: {
      type: String,
      default: ''
    },
    colorBG: {
      type: String,
      default: 'transparent'
    },
    color: {
      type: String,
      default: 'black'
    },
    maxWidth: {
      type: String,
      default: '100%'
    },
    outline: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: ''
    },
    borderWidth: {
      type: String,
      default: '1px'
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tag () {
      return this.to ? 'nuxt-link' : 'button'
    },
    attrs () {
      const {
        outline,
        gold,
        borderWidth,
        colorBG,
        color,
        maxWidth,
        borderColor,
        to,
        disable,
        tag
      } = this

      const commonAttrs = {
        class: ['button', { outline, gold, disabled: disable }],
        style: {
          borderWidth,
          backgroundColor: colorBG,
          color,
          maxWidth,
          borderColor
        }
      }

      return {
        'nuxt-link': { ...commonAttrs, to },
        button: { ...commonAttrs }
      }[tag]
    }
  }
}
</script>
<style lang="scss" scoped>
  .button{
    position: relative;
    font-family: Montserrat, sans-serif;
    width: 100%;
    border-radius: 0;
    cursor: pointer;
    transition: .3s linear all;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    &.outline{
      color: $black;
      border: 1px solid $black;
      &:hover {
        color: white !important;
        background-color: $black !important;
        opacity: 1 !important;
      }
    }
    &.disabled{
      pointer-events: none;
      border-color: $grey1 !important;
      background-color: transparent !important;
      color: $grey1 !important;
      .after {
        opacity: 0.4;
      }
      &:hover {
        border-color: $grey1 !important;
        background-color: transparent !important;
        color: $grey1 !important;
      }
    }
    &.gold {
      background: linear-gradient(90.96deg, #DBA47B 0%, #DCA77D 8.01%, #DFB082 13.89%, #E5C08B 19.07%, #EDD797 23.84%, #F1E19D 25.62%, #F1E19D 26.14%, #F1E19D 41.32%, #D9A277 45.81%, #D9A277 47.64%, #D6A075 47.8%, #C29466 48.98%, #B68D5D 50.17%, #B28B5A 51.37%, #A88253 52.79%, #997449 55.76%, #946F45 58.18%, #946F45 58.27%, #987146 62.06%, #9D764A 66.61%, #AC8555 72.11%, #B28B5A 73.81%, #B78E5D 75.02%, #D09A6E 81.95%, #DFA278 88.29%, #E4A57B 93.47%, #EEA278 96.59%, #F3A177 100%);
      background-color: transparent;
    }
    .prefix{
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
    .after {
      margin-left: 10px;
      display: flex;
      align-items: center;
      svg {
        transition: .3s linear all;
        path {
          transition: .3s linear all;
        }
      }
    }
  }
</style>
