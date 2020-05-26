<template>
  <div class="passwordBox">
    <div class="title text dark medium mb50">
      Введите код
    </div>
    <div class="password">
      <label>
        <input
          v-for="(item, index) of size"
          :key="item"
          ref="inputCode"
          minlength="0"
          type="number"
          class="item"
          @keyup="del($event, index)"
          @input="passwordMessage"
        />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerificationCode",
  props: {
    size: {
      type: Number,
      default: 6
    }
  },
  data: () => ({
    pass: [],
    finalPass: ""
  }),
  watch: {
    pass() {
      this.$nextTick(() => this.checkPass())
    }
  },
  methods: {
    del(code, index) {
      console.log(code, index)
      if (code.key == "Backspace") {
        code.target.value = ""
        this.pass.splice(index, 1)
        if (code.target.previousElementSibling) {
          code.target.previousElementSibling.focus()
        }
      }
    },
    passwordMessage(code) {
      let codeInput = new RegExp("^\\d{1}$")
      console.log(codeInput.test(+code.target.value))
      if (codeInput.test(+code.target.value) && code.target.value.length <= 1) {
        if (code.target.value) {
          this.pass = []
          this.$refs.inputCode.forEach((num, index) => {
            if (num.value) {
              this.pass.push(num.value)
            }
            console.log(this.pass, index)
          })
          if (code.target.nextElementSibling) {
            code.target.nextElementSibling.focus()
          }
        }
      } else {
        code.target.value = ""
      }
    },
    checkPass() {
      this.finalPass = this.pass.join("")
      this.$emit("getPassword", this.finalPass)
    }
  }
}
</script>

<style lang="less" scoped>
.passwordBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .password {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 10px;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    .item {
      background: #ffffff;
      width: 44px;
      height: 50px;
      padding: 5px;
      font-size: 18px;
      text-align: center;
      border: 1px solid #b2dbfd;
      box-sizing: border-box;
      border-radius: 2px;
      transition: 0.2s linear;
      &:focus {
        transition: 0.2s linear;
        box-shadow: 0px 0px 6px 0px #55c2fe;
      }
    }
  }
}
</style>
