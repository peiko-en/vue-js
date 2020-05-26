<template>
  <div
    v-show="$route.name !== 'order__page'"
    class="basket"
    :class="{
      open: basketModal,
      fullscreen: $store.getters['params/mobileView']
    }"
  >
    <div
      class="basket__icon svg-container"
      :class="{
        plus: countProduct,
        pulse:
          (cardProduct.length && !basketModal) ||
          (newBasketProduct.length && !basketModal)
      }"
      @click="basketModalFunc"
    >
      <div
        v-if="cardProduct.length || newBasketProduct.length"
        class="basket__icon__count"
        :class="{ big: newBasketProduct.length > 99 }"
      >
        {{ newBasketProduct.length }}
      </div>
      <svg class="circle" xmlns="http://www.w3.org/2000/svg">
        <g>
          <ellipse
            class="foreground"
            ry="24"
            rx="24"
            cy="25"
            cx="25"
            stroke-width="2"
          />
        </g>
      </svg>
      <v-icon v-if="basketModal" color="#fff">close</v-icon>
      <svg
        v-else
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 1C0 1.55 0.45 2 1 2H2L5.6 9.59L4.25 12.03C3.52 13.37 4.48 15 6 15H17C17.55 15 18 14.55 18 14C18 13.45 17.55 13 17 13H6L7.1 11H14.55C15.3 11 15.96 10.59 16.3 9.97L19.88 3.48C19.9643 3.32843 20.0075 3.15747 20.0054 2.98406C20.0034 2.81064 19.956 2.64077 19.8681 2.49126C19.7803 2.34175 19.6549 2.21778 19.5043 2.13162C19.3538 2.04546 19.1834 2.00009 19.01 2H4.21L3.54 0.570001C3.45963 0.399307 3.3323 0.255042 3.17291 0.154095C3.01352 0.0531475 2.82867 -0.000302861 2.64 1.29085e-06H1C0.45 1.29085e-06 0 0.450001 0 1ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z"
          fill="#FAFAFA"
        />
      </svg>
    </div>
    <div class="bascet__modal">
      <my-dialog
        :model="myDialog"
        :button-one="btnClose"
        :button-two="btnApprove"
        :item="dialogItem"
        :text="dialogText"
        :headline="dialogHeadline"
        @buttonOne="buttonOne"
        @buttonTwo="buttonTwo"
      >
        <p slot="text">{{ dialogText }}</p>
      </my-dialog>
      <div class="basket__head" :class="{ newOrder: idProduct.order_id == 0 }">
        <div class="caption">
          {{ !historyModal ? "Кошик замовлень" : "Історія змін" }}
        </div>
        <div class="select__order">
          <div class="name input-box inputBasket m-0">
            <v-select
              ref="orderInOrder"
              attach
              solo
              :items="orders"
              :class="{ orderInOrder: orederInorder }"
              :value="idProduct"
              :menu-props="{
                closeOnClick: !orederInorder,
                closeOnContentClick: true,
                openOnClick: true,
                value: orederInorder
              }"
              :clearable="$route.name !== 'order-add-product'"
              :readonly="$route.name === 'order-add-product'"
              :searchable="false"
              item-text="order_id"
              item-value="order_id"
              return-object
              persistent-hint
              full-width
              hide-selected
              :hint="
                idProduct.order_id !== 0
                  ? `${
                      idProduct.location_name.length > 15
                        ? idProduct.location_name.slice(0, 15) + '..'
                        : idProduct.location_name
                    },${
                      idProduct.cost_center_name.length > 15
                        ? idProduct.cost_center_name.slice(0, 10) + '..'
                        : idProduct.cost_center_name
                    }`
                  : ''
              "
              @change="idProductChange"
            >
              <span slot="prepend-inner">{{
                idProduct.order_id !== 0 ? "Замовлення №:" : "Нове замовлення"
              }}</span>
              <template v-slot:prepend-item>
                <div
                  v-if="idProduct.order_id !== 0"
                  class="inputBasket__itemList"
                >
                  <div class="v-list__tile" @click="createNewBasket">
                    <v-btn small flat icon class="m-0 mr-2" color="#FCBD00">
                      <v-icon>add</v-icon>
                    </v-btn>
                    Створити нове замовлення
                  </div>
                </div>
              </template>
              <template slot="item" slot-scope="data">
                Замовл. № {{ data.item.order_id | truncate(10, "..") }},
                {{ data.item.location_name | truncate(10, "..") }},
                {{ data.item.cost_center_name | truncate(10, "..") }},
                {{ data.item.total_sum }} грн.
              </template>
            </v-select>
          </div>
        </div>
        <v-icon
          v-if="basketModal && $store.getters['params/mobileView']"
          class="modal-close"
          color="#000"
          @click="basketModalFunc"
        >
          close
        </v-icon>
      </div>
      <div ref="basketBody" class="basket__body">
        <transition key="list" name="modalBody" mode="out-in">
          <div v-if="!historyModal" class="basket__body__top">
            <span></span>
            <span>Товар</span>
            <span>Ціна (за од.)</span>
            <span>Кількість</span>
            <span>Сума</span>
            <span>del</span>
          </div>
          <div
            v-else
            key="list2"
            class="basket__body__top basket__body__top__history"
          >
            <span>Дата</span>
            <span>Користувач</span>
            <span>Дія</span>
          </div>
        </transition>
        <transition name="modalBody" mode="out-in">
          <div
            v-if="!historyModal && basketModal"
            key="list"
            class="basket__body__wrap"
          >
            <div
              v-for="(item, index) of newBasketProductComputed"
              v-show="newBasketProduct.length"
              :key="index"
              class="item-row"
              :class="{
                active: rowBG === item.id && item.newProduct,
                blur:
                  loadProduct &&
                  quantityChangeID !== item.id &&
                  !item.lastUpdate,
                activeBG:
                  (rowBG !== item.id && quantityChangeID == item.id) ||
                  item.lastUpdate
              }"
            >
              <div class="status">
                <v-tooltip max-width="150px" left>
                  <v-icon
                    v-if="
                      !item.newProduct &&
                        (item.changeQuantity == undefined ||
                          item.changeQuantity == false)
                    "
                    slot="activator"
                    style="color: white; background-color: #19B200;"
                  >
                    done
                  </v-icon>
                  <v-icon
                    v-if="item.newProduct"
                    slot="activator"
                    style="color: white; background-color: #C5CBE3;"
                  >
                    done
                  </v-icon>
                  <v-icon
                    v-if="!item.newProduct && item.changeQuantity == true"
                    slot="activator"
                    style="color: white; background-color: #FCBD00;"
                  >
                    priority_high
                  </v-icon>
                  <span
                    v-if="
                      !item.newProduct &&
                        (item.changeQuantity == undefined ||
                          item.changeQuantity == false)
                    "
                  >
                    Товар знаходиться у замовленні
                  </span>
                  <span v-if="item.newProduct">
                    Товар не перенесений у замовлення
                  </span>
                  <span v-if="!item.newProduct && item.changeQuantity == true">
                    Кількість цього товару у замовленні відрізняється від
                    кількості у корзині замовлення
                  </span>
                </v-tooltip>
              </div>
              <div class="img-name">
                <img :src="item.img" alt="Зображення товару" />
                <div class="name">
                  <v-tooltip top max-width="320px">
                    <div class="wrap-text">{{ item.name }}</div>
                    <span slot="activator" class="ellipsis d-block">{{
                      item.name
                    }}</span>
                  </v-tooltip>
                  <!--                                    <v-tooltip max-width="150px" left>-->
                  <!--                                        <span slot="activator">{{item.name |  truncate(70, '...')}}</span>-->
                  <!--                                        <span>{{item.name}}</span>-->
                  <!--                                    </v-tooltip>-->
                </div>
              </div>
              <div class="price">
                <b>{{ item.price }} грн</b>
              </div>
              <div class="count">
                <input
                  v-model="item.quantity"
                  class="input-default"
                  type="number"
                  :disabled="loadProduct"
                  @input="quantityModal"
                  @mouseout="quantity(item, index, $event.target.value)"
                  @change="quantity(item, index, $event.target.value)"
                />
              </div>
              <div class="summ">
                <b>{{ item.total_sum }} грн</b>
              </div>
              <div class="action">
                <i
                  v-if="item.newProduct"
                  class="icon icon-delete"
                  @click="deleteItemCardProduct(item, index)"
                ></i>
                <i
                  v-else
                  class="icon icon-delete"
                  @click="deleteItemCardProduct(item, index)"
                ></i>
              </div>
            </div>
          </div>
          <div
            v-if="historyModal"
            key="hist"
            class="basket__body__wrap"
            :class="{ history: historyModal }"
          >
            <div
              v-for="(item, index) of historyBasket.items"
              :key="index"
              class="item-row item-row__history"
            >
              <div class="date">
                {{ item.created_at | formatDateDotWithTime }}
              </div>
              <div class="user ellipsis">
                <v-tooltip max-width="150px" left>
                  <span slot="activator">{{
                    item.username | truncate(50, "...")
                  }}</span>
                  <span>{{ item.username }}</span>
                </v-tooltip>
              </div>
              <div class="action__user ellipsis">
                <v-tooltip
                  v-if="item.message.length > 50"
                  max-width="150px"
                  left
                >
                  <span slot="activator">{{
                    item.message | truncate(50, "...")
                  }}</span>
                  <span>{{ item.message }}</span>
                </v-tooltip>
                <span v-else>{{ item.message }}</span>
              </div>
            </div>
            <scroll-loader v-if="loadMore" :loader-method="historyUpdate" />
          </div>
        </transition>
      </div>
      <div class="basket__footer">
        <div class="basket__footer__row">
          <div class="basket__footer__row__col"></div>
          <div class="basket__footer__row__col">
            <div
              v-if="!$store.getters['params/mobileView']"
              class="countOrders"
            >
              <span class="label">Кiлькiсть:</span>
              <span class="val">
                {{
                  cardProduct.length || newBasketProduct.length
                    ? newBasketProduct.length
                    : "0"
                }}
                товарiв
              </span>
            </div>
            <div class="summ">
              <span class="label">Загальна сума:</span>
              <span class="val">
                <b>{{ idProduct.total }} грн</b>
              </span>
            </div>
          </div>
        </div>
        <div class="basket__footer__row">
          <div class="basket__footer__row__col">
            <div
              class=" button button__red"
              :class="{ 'mini-delete': $store.getters['params/mobileView'] }"
              @click="clearBasket"
            >
              Скинути змiни
            </div>
          </div>
          <div class="basket__footer__row__col">
            <div
              class="button button__purple-outline"
              :class="{
                'mini-list': $store.getters['params/mobileView'],
                history: !historyModal
              }"
              @click="historyModal = !historyModal"
            >
              {{ historyModal ? "Список товарiв" : "Iсторiя змiн" }}
            </div>
            <create_order
              v-if="
                !idProduct.order_id > 0 &&
                  newBasketProduct.length > 0 &&
                  !loadAddProduct &&
                  !changeInputBlock
              "
              :id="undefined"
              :dialog="dialogCreate"
              :products="newBasketProduct"
              :model="model"
              :update="false"
              :non-catalog="false"
              @closeDialog="closeDialogCreate"
            >
              <v-menu slot="default" offset-y content-class="menu-default">
                <template v-slot:activator="{ on }">
                  <div
                    class="button btn-add-order button__yellow upload"
                    :class="{
                      'mini-add': $store.getters['params/mobileView'],
                      cancel: orederInorder
                    }"
                    v-on="on"
                    @click="$nextTick(() => (orederInorder = false))"
                  >
                    {{ orederInorder ? "Отмена" : "Додати до замовлення" }}
                    <v-icon class="ml-2 pos-right">
                      {{ !orederInorder ? "more_horiz" : "close" }}
                    </v-icon>
                  </div>
                </template>
                <v-list v-if="!orederInorder">
                  <v-list-tile
                    class="upload-fileItem"
                    @click="dialogCreate = !dialogCreate"
                  >
                    Створити нове замовлення
                  </v-list-tile>
                  <v-list-tile
                    class="upload-fileItem"
                    @click="$nextTick(() => (orederInorder = true))"
                  >
                    Додати до iснуючого замовлення
                  </v-list-tile>
                </v-list>
              </v-menu>
            </create_order>
            <div
              v-if="changeInputBlock"
              class="button button__green load active"
            >
              <div class="btn-load active">
                <i></i>
                <i></i>
                <i></i>
              </div>
              Збереження
            </div>
            <div
              v-if="loadAddProduct"
              class="button button__purple"
              :class="{
                'mini-add': $store.getters['params/mobileView'],
                'load active': this.loadAddProduct
              }"
            >
              <div class="btn-load" :class="{ active: changeInputBlock }">
                <i></i>
                <i></i>
                <i></i>
              </div>
              Оновлення
            </div>
            <div
              v-if="
                idProduct.order_id > 0 &&
                  newBasketProduct.length > 0 &&
                  !loadAddProduct &&
                  !changeInputBlock
              "
              class="button button__yellow"
              :class="{ 'mini-add': $store.getters['params/mobileView'] }"
              @click="addProduct"
              v-text="
                productNoSynchronization
                  ? 'Додати в замовлення'
                  : 'Перейти до замовлення'
              "
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import create_order from "@/views/orders/create-order"

export default {
  name: "Basket",
  components: {
    create_order
  },
  props: [],
  data: () => ({
    loading: false,
    historyModal: false,
    value: "номер замовлення",
    idSelect: 0,
    inputDisable: false,
    countProduct: false,
    rowBG: -1,
    rowBGCount: 0,
    myDialog: false,
    btnClose: { name: "Скасувати", class: "button__blue" },
    btnApprove: { name: "Підтвердити", class: "button__yellow" },
    dialogText: "",
    dialogItem: {},
    dialogHeadline: "",
    myDialogAction: "",
    quantityModalChange: 1,
    dialogCreate: false,
    update: false,
    model: {
      delivery_date: "",
      company_entity_id: "",
      location_id: "",
      cost_center_id: "",
      contract_id: "",
      budget_id: "",
      comment: ""
    },
    arrDelete: [],
    loadProduct: false,
    loadAddProduct: false,
    changeInputBlock: false,
    pageHistory: 1,
    loadMore: true,
    orederInorder: false,
    productNoSynchronization: false
  }),
  computed: {
    ...mapGetters("basket", [
      "cardProduct",
      "orders",
      "idProduct",
      "newBasketProduct",
      "quantityChangeID",
      "basketModal",
      "historyBasket"
    ]),
    ...mapGetters("user", ["currentUser"]),
    newBasketProductComputed() {
      return this.newBasketProduct.map(e => {
        setTimeout(() => (e.lastUpdate = false), 2000)
        return e
      })
    }
  },
  watch: {
    $route(e) {
      if (e.path == "catalog") {
        this.setBasketModal({
          ctx: true
        })
      } else {
        this.setBasketModal({
          ctx: false
        })
      }
    },
    newBasketProductComputed(arr) {
      this.productNoSynchronization = arr.find(function(element) {
        if (element.newProduct || element.changeQuantity) {
          return true
        }
      })
      if (arr.length < this.cardProduct.length) {
        this.productNoSynchronization = true
      }
    },
    loading(e) {
      this.$loadingBus.$emit("updateBasket", e)
    },
    newBasketProduct(e) {
      this.historyUpdate()
      this.countProductFunc()
      this.rowBGFunc(e)
      this.loadBasket()
      this.pageHistory = 1
      this.historyModal = false
    },
    cardProduct() {
      this.countProductFunc()
    },
    historyModal() {
      this.scrollDownBasket()
    },
    basketModal(e) {
      if (e) this.scrollDownBasket()
    }
  },
  created() {
    this.historyUpdate()
    this.$loadingBus.$on("cartFreez", this.cartFreez)
  },
  methods: {
    ...mapActions("basket", [
      "setIdProduct",
      "setNewBasketProduct",
      "setAddProductBul",
      "setQuantityChangeID",
      "setProductMut",
      "setBasketModal",
      "setHistoryBasket",
      "setHistoryBasketPage"
    ]),
    ...mapMutations("basket", ["clearNewBasket"]),
    historyUpdate() {
      if (this.historyBasket.totalCount == undefined) {
        this.loadMore = true
      } else {
        if (this.historyBasket.totalCount > this.historyBasket.items.length) {
          this.loadMore = true
        } else {
          this.loadMore = false
        }
        this.setHistoryBasketPage({
          ctx: {
            page: ++this.pageHistory
          }
        })
      }
    },
    basketModalFunc() {
      if (this.basketModal) {
        this.setBasketModal({
          ctx: false
        })
      } else {
        this.setBasketModal({
          ctx: true
        })
      }
    },
    quantityModal(item) {
      this.changeInputBlock = true
      let sum = []
      sum.push(+item.target.value)
      let input_sum = sum.reduce((a, b) => a + b, 0)
      if (isNaN(input_sum)) {
        item.target.value = +1
        this.quantityModalChange = 1
      } else {
        if (input_sum == 0) {
          this.quantityModalChange = 1
        } else {
          this.quantityModalChange = input_sum
        }
      }
    },
    quantity(e, i, r) {
      r = +r
      let newProduct = false
      let changeQuantity = false
      if (e.newProduct) {
        newProduct = true
      }
      if (!e.newProduct) {
        changeQuantity = true
      }
      if (r !== e.quantity) {
        this.socketEmitFreez(true)

        this.setQuantityChangeID({
          ctx: e.id
        })
        setTimeout(() => {
          this.setQuantityChangeID({
            ctx: 0
          })
        }, 2000)
        let total_sum = +e.price * +this.quantityModalChange
        this.setNewBasketProduct({
          ctx: {
            name: e.name,
            total_sum: total_sum.toFixed(2),
            index: i,
            id: e.id,
            addId: e.addId,
            lastUpdate: e.lastUpdate,
            quantity: this.quantityModalChange,
            val: true,
            price: e.price,
            img: e.img,
            newProduct: newProduct,
            changeQuantity: changeQuantity
          }
        })
        this.$api
          .post("/cart/update-product", {
            order_id: this.idProduct.order_id,
            product_id: e.id,
            id: e.addId,
            quantity: this.quantityModalChange
          })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            // if (response.data.success) {
            this.socketEmit()
            // }
          })
        this.changeInputBlock = false
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    deleteItemCardProduct(item) {
      this.myDialog = true
      this.myDialog = true
      this.dialogHeadline = "Підтвердіть дію"
      this.dialogText = "Ви впевнені, що хочете видалити товар з кошика?"
      this.myDialogAction = "deleteItemCardProduct"
      this.dialogItem = item
    },
    buttonOne() {
      if (this.myDialogAction == "deleteItemCardProduct") {
        this.myDialog = false
        // this.getDataFromApi();
        this.myDialogAction = ""
      }
    },
    addProduct() {
      if (this.changeInputBlock) {
        this.changeInputBlock = false
      } else {
        this.socketEmitFreez(true)
        this.$api
          .post("/cart/update-cart", {
            order_id: this.idProduct.order_id,
            id: this.idProduct.id
          })
          .then(response => {
            if (response.data.success) {
              this.socketEmit()
              this.$router.push("/order/" + this.idProduct.order_id)
            }
            this.setNewBasketProduct({
              ctx: []
            })
          })
      }
    },
    buttonTwo(e, i) {
      if (this.myDialogAction == "deleteItemCardProduct") {
        let dellete
        this.cardProduct.filter(e => {
          if (e.product.id == this.dialogItem.id) return (dellete = e)
        })
        this.arrDelete.push(dellete)
        this.deleteItemNewBasket(e, i)
        this.myDialog = false
        this.myDialogAction = ""
      }
    },
    deleteItemNewBasket(e, i) {
      this.socketEmitFreez(true)
      this.setNewBasketProduct({
        ctx: {
          index: i,
          id: e.id,
          quantity: e.quantity,
          val: false,
          price: e.price
        }
      })
      this.$api
        .post("/cart/delete-product", {
          order_id: this.idProduct.order_id,
          id: e.addId,
          product_id: e.id
        })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          // if(response.data.success){
          this.socketEmit()
          // }
        })
    },
    clearBasket() {
      this.historyModal = false
      this.socketEmitFreez(true)
      let obj = {
        order_id: this.idProduct.order_id,
        id: this.idProduct.id
      }
      if (
        this.idProduct.order_id == undefined ||
        this.idProduct.order_id == 0
      ) {
        obj = {
          order_id: 0,
          id: 0
        }
      }
      // eslint-disable-next-line no-unused-vars
      this.$api.post("/cart/clear-cart", obj).then(response => {
        // if(response.data.success){
        this.socketEmit()
        // }
      })
      this.clearNewBasket()
      this.arrDelete = []
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    socketEmit() {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: true
      })
    },
    createNewBasket() {
      this.setIdProduct({
        ctx: {
          order_id: 0
        }
      })
    },
    idProductChange(e) {
      if (this.orederInorder) {
        this.$api
          .post("/cart/new-to-old-cart", {
            old_id: e.id
          })
          .then(response => {
            if (response.data.success) {
              this.pageHistory = 1
              if (e == undefined) {
                e = {
                  order_id: 0
                }
              }
              this.arrDelete = []
              this.setIdProduct({
                ctx: e
              })
              this.setNewBasketProduct({
                ctx: []
              })
            }
            this.orederInorder = false
          })
      } else {
        this.pageHistory = 1
        if (e === undefined) {
          e = {
            order_id: 0
          }
        }
        this.arrDelete = []
        this.setIdProduct({
          ctx: e
        })
        this.setNewBasketProduct({
          ctx: []
        })
      }
    },
    countProductFunc() {
      if (this.cardProduct.length > 0 || this.newBasketProduct.length > 0) {
        this.countProduct = true
        setTimeout(() => {
          this.countProduct = false
        }, 2000)
      }
    },
    async loadBasket() {
      this.loadProduct = true
      this.loadAddProduct = true
      // eslint-disable-next-line no-unused-vars
      let e = new Promise((resolve, reject) => {
        setTimeout(() => resolve(false), 2000)
      })
      this.loadProduct = await e
      this.loadAddProduct = await e
    },
    rowBGFunc(e) {
      if (e.length > this.rowBGCount) {
        this.rowBGCount = e.length
        let id = e.map(i => i.id)
        id = id.pop()
        this.rowBG = id
        this.scrollDownBasket()
        setTimeout(() => (this.rowBG = -1), 2500)
      } else {
        this.rowBG = 0
        this.rowBGCount = e.length
      }
    },
    scrollDownBasket() {
      this.pageHistory = 1
      this.setHistoryBasketPage({
        ctx: {
          page: 1
        }
      })
      setTimeout(() => {
        if (
          this.$refs.basketBody.querySelector(".basket__body__wrap") !== null
        ) {
          this.$refs.basketBody.querySelector(".basket__body__wrap").scrollTop =
            this.$refs.basketBody.querySelector(".basket__body__wrap")
              .scrollHeight +
            180 +
            70
        }
      }, 500)
    },
    closeDialogCreate(e) {
      this.dialogCreate = e
      this.initialize()
      this.update = false
    },
    initialize() {
      this.user = {
        email: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        position: "",
        role: "",
        password: "",
        repeatPassword: "",
        role_name: "",
        all_location: false,
        isActive: true,
        activeTill: "",
        companyEntity: "",
        locations: [],
        cost_centers: []
      }
    },
    cartFreez(e) {
      if (e.order_id == this.idProduct.order_id) {
        this.loadAddProduct = e.freez
      }
    },
    socketEmitFreez(freez) {
      this.$socket.emit("userCartAction", {
        order_id: this.idProduct.order_id,
        user_id: this.currentUser.id,
        update: false,
        freez: freez
      })
    }
  }
}
</script>

<style>
.modalBody-enter-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.modalBody-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.modalBody-enter,
.modalBody-leave-to {
  transform: translateX(0px);
  opacity: 0;
}
</style>
