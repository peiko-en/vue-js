<template>
  <div
    class="artist-card"
    @click="openProfile"
  >
    <div class="artist-card__top">
      <base-image
        :src="background"
        :alt="'artist-card-background'"
        class="artist-card__back"
      />
      <div
        class="artist-card__image-container"
      >
        <base-image
          :src="logo"
          :alt="'artist-card-ava'"
          class="artist-card__image"
        />
      </div>
    </div>
    <div class="artist-card__bottom">
      <nuxt-link
        :to="`/profile/${item.username}`"
        class="artist-card__link"
      >
        <div class="artist-card__fullname">
          {{ item.fullName }}
        </div>
      </nuxt-link>
      <nuxt-link
        :to="`/profile/${item.id}`"
        class="artist-card__link"
      >
        <div class="artist-card__username">
          @{{ item.username }}
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    logo: null,
    background: null,
  }),
  created() {
    this.fetchLogo();
    this.fetchBackground();
  },
  methods: {
    fetchLogo() {
      if (this.item.logo) {
        try {
          this.logo = `${process.env.IMAGES_URL}file/avatar/${this.item.logo}`;
        } catch (error) {
          this.logo = this.generageImgDataUrl(this.item.id);
        }
      } else {
        this.logo = this.generageImgDataUrl(this.item.id);
      }
    },
    fetchBackground() {
      if (this.item.background) {
        try {
          this.background = `${process.env.IMAGES_URL}file/background/${this.item.background}`;
        } catch (error) {
          this.background = this.generageImgDataUrl(this.item.id);
        }
      } else {
        this.background = this.generageImgDataUrl(this.item.id);
      }
    },
    openProfile() {
      this.$router.push(`/profile/${this.item.username}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.artist-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0px 10px 20px -9px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  display: grid;
  grid-template-rows: 1fr 95px;
  cursor: pointer;
  &__top {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  &__bottom {
    background: #0d0d0d;
    display: grid;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
    align-items: center;
    padding: 15px 0;
  }
  &__image-container {
    position: absolute;
    width: 130px;
    height: 133px;
    border: 1px solid #ccff00;
    box-sizing: border-box;
    border-radius: 74px;
    padding: 5px;
  }
  &__image {
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
  }
  &__back {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__fullname {
    font-family: $PressGothic;
    font-size: 30px;
    line-height: 41px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #ffffff;
  }
  &__username {
    font-family: $Gruppo;
    font-size: 20px;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #ccff00;
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
  }
  &__link {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
