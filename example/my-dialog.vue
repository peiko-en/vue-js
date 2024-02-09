<template>
  <v-dialog
    v-model="model"
    persistent
    :width="width"
    :fullscreen="$store.getters['params/mobileView']"
  >
    <v-card>
      <v-card-title>
        <slot name="header">
          <span class="headline">{{ headline }}</span>
        </slot>
        <v-spacer />
        <v-flex xs1 sm1>
          <v-btn flat icon color="" @click="$emit('buttonOne', item)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <slot name="body">
            <div>
              <slot name="text">{{ text }}</slot>
            </div>
          </slot>
        </v-layout>
      </v-container>

      <slot name="footer">
        <v-card-actions>
          <v-spacer v-for="time in spacer" :key="time" />
          <button
            v-if="buttonOne.name != ''"
            class="button"
            :class="buttonOne.class"
            flat
            @click="$emit('buttonOne', item)"
          >
            {{ buttonOne.name }}
          </button>
          <button
            v-if="buttonTwo.name != ''"
            class="button"
            :class="buttonTwo.class"
            flat
            @click="$emit('buttonTwo', item)"
          >
            {{ buttonTwo.name }}
          </button>
          <button
            v-if="buttonThree.name != ''"
            class="button"
            :class="buttonThree.class"
            flat
            @click="$emit('buttonThree', item)"
          >
            {{ buttonThree.name }}
          </button>
        </v-card-actions>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MyDialog",
  props: {
    model: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 500
    },
    headline: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    spacer: {
      type: Number,
      default: 1
    },
    buttonOne: {
      type: Object,
      default: () => ({ name: "", class: "button__yellow" })
    },
    buttonTwo: {
      type: Object,
      default: () => ({ name: "", class: "button__yellow" })
    },
    buttonThree: {
      type: Object,
      default: () => ({ name: "", class: "button__yellow" })
    },
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="sass"></style>
