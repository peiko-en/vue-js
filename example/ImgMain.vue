<template>
  <img
    v-lazy-load
    class="img-main"
    :data-srcset="srcSet"
    sizes="50vw"
    :style="{ objectFit }"
  >
</template>

<script>
import qs from 'qs'

export default {
  name: 'ImgMain',
  props: {
    alt: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    },
    objectFit: {
      type: String,
      default: 'contain'
    },
    size: {
      type: Object,
      default: null
    }
  },
  imageBreakpoints: [
    { width: 320, heigth: 320 },
    { width: 640, heigth: 480 },
    { width: 1280, heigth: 720 },
    { width: 1920, heigth: 1080 }
  ],
  computed: {
    isConstructorImage () {
      return this.url.includes(process.env.API_URL)
    },
    srcSet () {
      return this.$options.imageBreakpoints.map((breakpoint) => {
        const imageUrl = new URL(this.url)

        if (this.isConstructorImage) {
          return `${imageUrl}&${qs.stringify(breakpoint)} ${breakpoint.width}w`
        }

        const { width, heigth } = this.size ?? breakpoint
        return `${process.env.IMG_SET_URL}/${width}x${heigth}${imageUrl.pathname} ${breakpoint.width}w`
      })
    }
  }
}
</script>

<style scoped>
img, picture, .img-main {
  width: 100%;
  height: 100%;
}
</style>
