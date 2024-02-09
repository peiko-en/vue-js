<template>
  <div>
    <v-data-table
      :headers="selectedTH"
      :items="dataTable"
      :pagination.sync="pagination"
      :total-items="total_items"
      :loading="loading"
      class="table__tamplate-2 theme--light"
      no-data-text="Немає даних"
    >
      <template v-slot:items="props">
        <td v-show="showHideColl(0)" class="icon">
          <div>
            <v-tooltip v-if="props.item.status == 1" right>
              <v-icon
                slot="activator"
                style="color: white; background-color: #19B200;"
              >
                done
              </v-icon>
              <span>Активний</span>
            </v-tooltip>

            <v-tooltip v-else right>
              <v-icon
                slot="activator"
                style="color: white; background-color: #F24949;"
              >
                priority_high
              </v-icon>
              <span>Не активний</span>
            </v-tooltip>
          </div>
        </td>
        <td v-show="showHideColl(1)">{{ props.item.number }}</td>
        <td v-show="showHideColl(2)" class="text-xs-left wrap-text wm200p">
          <v-tooltip top max-width="320px">
            <div class="wrap-text">{{ props.item.name }}</div>
            <span slot="activator">{{
              props.item.name | truncate(50, "...")
            }}</span>
          </v-tooltip>
        </td>
        <td v-show="showHideColl(3)" class="text-xs-left">
          <v-tooltip top max-width="320px">
            <div class="wrap-text">{{ props.item.supplier_name }}</div>
            <span slot="activator">{{
              props.item.supplier_name | truncate(30, "...")
            }}</span>
          </v-tooltip>
        </td>
        <td v-show="showHideColl(4)" class="text-xs-left">
          <v-tooltip top max-width="320px">
            <div class="wrap-text">{{ props.item.company_entity_name }}</div>
            <span slot="activator">{{
              props.item.company_entity_name | truncate(50, "...")
            }}</span>
          </v-tooltip>
        </td>
        <td v-show="showHideColl(5)" class="text-xs-left">
          {{ props.item.date_start | formatDateDot }} -
          {{ props.item.date_end | formatDateDot }}
        </td>
        <td v-show="showHideColl(6)" class="text-xs-left">
          <span v-if="props.item.all_location">Всі локації</span>
          <c_chips v-else :id="props.item.locations" :items="location" />
        </td>
        <td v-show="showHideColl(7)" class="text-xs-left">
          <span v-if="props.item.all_location">Всі кост-центри</span>
          <c_chips v-else :id="props.item.costCenters" :items="costCenters" />
        </td>
        <td v-show="showHideColl(8)" class="justify-center action__td">
          <v-menu
            offset-x
            bottom
            nudge-bottom="40"
            nudge-left="-40"
            left
            content-class="action__td__drop"
          >
            <v-btn slot="activator" icon>
              <v-icon>more_horiz</v-icon>
            </v-btn>
            <v-list v-hide-empty>
              <span>Дії</span>
              <v-list-tile
                v-show="
                  $root.rbac.updateContract || $root.rbac.viewOnlyContract
                "
              >
                <v-list-tile-title @click="editItem(props.item)">
                  Деталі
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                v-if="props.item.status"
                v-show="$root.rbac.statusContract"
              >
                <v-list-tile-title @click="statusDeactivateBtn(props.item)">
                  Деактивувати
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-else v-show="$root.rbac.statusContract">
                <v-list-tile-title @click="statusActivateBtn(props.item)">
                  Активувати
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogStatus" max-width="400px">
      <v-card>
        <v-card-title class="headline">{{ dialogStatusHead }}</v-card-title>
        <v-card-text>
          {{ dialogStatusText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <button class="button button__blue" @click="dialogStatus = false">
            Скасувати
          </button>
          <button class="button button__yellow" @click="dialogStatusAction()">
            Підтвердити
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "TableContracts",
  props: ["updateList", "selectedTH"],
  data: () => ({
    headers: [
      { text: "Статус", value: "name", sortable: false, label: "Статус" },
      { text: "№ договору", value: "number", label: "№ договору" },
      { text: "Назва", value: "name", label: "Назва" },
      { text: "Постачальник", value: "supplier_id", label: "Постачальник" },
      {
        text: "Юридична особа",
        value: "company_entity_id",
        label: "Юридична особа"
      },
      { text: "Період", value: "period", sortable: false, label: "Період" },
      { text: "Локації", value: "location", sortable: false, label: "Локації" },
      {
        text: "Кост-центри",
        value: "cost-centr",
        sortable: false,
        label: "Кост-центри"
      },
      { text: "", value: "name", sortable: false, label: "Налаштування" }
    ],
    loading: false,
    total_items: 0,
    pagination: {
      sortBy: "id",
      rowsPerPage: 10,
      page: 1
    },
    dataTable: [],
    dialogStatus: false,
    dialogStatusHead: "",
    dialogStatusText: "",
    dialogStatusAct: {},
    location: [],
    costCenters: []
  }),
  computed: {
    ...mapGetters("params", ["search"])
  },
  watch: {
    pagination: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    updateList(e) {
      if (e) {
        this.getDataFromApi()
      }
    },
    search() {
      this.getDataFromApi()
    },
    loading(e) {
      this.$loadingBus.$emit("loading", e)
    }
  },
  created() {
    this.initData()
    this.tableColl()
  },
  methods: {
    statusActivateBtn(e) {
      this.dialogStatusHead = "Активувати договір?"
      this.dialogStatusText = "Ви впевнені, що хочете активувати договір?"
      this.dialogStatusAct = e
      this.dialogStatus = true
    },
    statusDeactivateBtn(e) {
      this.dialogStatusHead = "Деактивувати договір?"
      this.dialogStatusText = "Ви впевнені, що хочете деактивувати договір?"
      this.dialogStatusAct = e
      this.dialogStatus = true
    },
    dialogStatusAction() {
      this.changeStatus(this.dialogStatusAct)
      this.dialogStatus = false
    },
    showHideColl(id) {
      let result = false
      this.selectedTH.forEach(e => {
        if (e.index == id) {
          result = true
        }
      })
      return result
    },
    tableColl() {
      this.$emit("headerColl", this.headers)
    },
    changeStatus(e) {
      this.$api
        .post("/contract/change-status", { id: e.id, status: !e.status })
        .then(response => {
          if (response.data.success) {
            this.getDataFromApi()
          }
        })
    },
    initData() {
      this.loading = true
      this.$api
        .post("/graphql", {
          query: `
                        query{
                              supplier(perPage: 1000){
                                items{
                                  id
                                  name
                                }
                              }
                              companyEntity(perPage: 1000){
                                items{
                                  id
                                  short_name
                                  status
                                }
                              }
                               costCenter(perPage: 1000){

                                items{
                                  name
                                  id
                                }
                              }
                              location(page: 1 perPage: 1000){
                                totalCount
                                items{
                                  id
                                  company_id
                                  name
                                }
                              }
                            }`
        })
        .then(response => {
          this.supplier = response.data.data.supplier.items
          let companyEntity = response.data.data.companyEntity.items
          companyEntity.forEach(function(value, index) {
            if (value.status != 1) {
              companyEntity[index].disabled = true
            } else {
              companyEntity[index].disabled = false
            }
          })
          this.companyEntity = companyEntity
          this.location = response.data.data.location.items
          this.costCenters = response.data.data.costCenter.items
          this.loading = false
          this.$emit("initData", {
            supplier: this.supplier,
            companyEntity: this.companyEntity
          })
        })
    },
    getDataFromApi() {
      this.loading = true
      let url = "/graphql"
      let order = "DESC"
      if (this.pagination.descending) {
        order = "ASC"
      }
      this.$api
        .post(url, {
          query:
            `
                        query{
                              contract(page: ` +
            this.pagination.page +
            ` perPage: ` +
            this.pagination.rowsPerPage +
            ` order: "` +
            order +
            `" orderBy: "` +
            this.pagination.sortBy +
            `" search:"` +
            this.search +
            `"){
                                totalCount
                                 items{
                                  id
                                  company_id
                                  name
                                  number
                                  status
                                  supplier_id
                                  supplier_name
                                  company_entity_id
                                  company_entity_name
                                  date_start
                                  date_end
                                  location_id
                                  comment
                                  cost_centers{
                                    id
                                    contract_id
                                    cost_center_id
                                  }
                                  locations{
                                      id
                                      contract_id
                                      location_id
                                  }
                                  all_location
                                  history{
                                    email
                                    role
                                  }
                                  supplier{
                                    id
                                    name
                                  }
                                }
                              }

                            }`
        })
        .then(response => {
          let data = response.data.data.contract.items
          data.forEach(function(value, index) {
            data[index].costCenters = value.cost_centers.map(function(value) {
              return value.cost_center_id
            })
            data[index].locations = value.locations.map(function(value) {
              return value.location_id
            })
          })
          this.dataTable = data

          this.total_items = response.data.data.contract.totalCount
          this.loading = false
        })
      this.$emit("listUpdated", false)
    },
    editItem(item) {
      this.$emit("editItem", item)
    }
  }
}
</script>

<style scoped></style>
