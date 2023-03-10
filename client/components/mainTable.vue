<template>
  <v-container>

    <v-data-table
      dense
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      :show-expand="accessRules === 'Admin'"
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="name"
      class="elevation-1"
      loading="true"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>Система доступа к дверям</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="accessRules === 'Admin'"
            dark
            color="green"
            @click="linkCreate"
          >
            Добавить сотрудника
          </v-btn>
        </v-toolbar>
      </template>




      <template
        v-if="accessRules === 'Admin'"
        v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">

          <!--  -->
          <v-btn
            dark
            color="green"
            @click="editForm(item)"
            >
            Изменить сотрудника
          </v-btn>
          <v-btn
            dark
            color="red"
            class="ml-5 my-3"
            @click="dialogDelete = true"
            >
            Удалить сотрудника
          </v-btn>

          <!--  -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Удалить пользователя {{ item.name }}?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="checkAdminDelet(item)">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </td>
      </template>

    <!-- Наглядные true false -->
      <template v-for="chip in chips" v-slot:[`item.${chip.value}`]="{ item }">

        <v-chip :key="chip.id"
            :color="getColor(item[chip.value])"
          >
          <!-- {{ item[chip.value] }}
          {{ Boolean(item[chip.value]) }} -->
          <v-icon v-if="item[chip.value] === 'true'">
            mdi-baby-face-outline
          </v-icon>
          <v-icon v-else color="black">
            mdi-baby-face
          </v-icon>
          <!-- {{ item.name }}
          {{ chip.value }} -->
          </v-chip>

      </template>
</v-data-table>
    {{ testFiled }}
    <br>
    <!-- {{ headers[1].value }} -->



    <template>
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          :timeout="2000"
        >
          {{ snackText }}
        </v-snackbar>
      </template>
<!-- диалог редактирования -->
      <template
        v-if="accessRules === 'Admin'"
        >
          <v-row justify="center">
            <v-dialog
              v-model="dialogEditForm"
              max-width="1050px"
              >
              <v-card>
                <edit-item
                :userRow="editedItem"
                v-if="dialogEditForm"
                @closeForm="closeEditForm"
                ></edit-item>
              </v-card>
            </v-dialog>
          </v-row>
      </template>



  </v-container>
</template>

<script>
  import EditItem from './EditItem.vue'

  export default {
    name: 'MainTable',

    components: {
      EditItem,
    },

    data() {
      return {
        accessRules: '',
        headers: [],
        items: [],
        chips: [],

        dialogDelete: false,
        dialogEditForm: false,
        snackbar: false,
        snackText: '',
        snackbarColor: 'red',

        // inputPassword: '',
        showIcon: false,

        editedItem: {},
        editedUser: {
          name: '',
          id: '',
          index: '',
        },

        expanded: [],

        testFiled: '',

      }
    },

    watch: {
    },

    methods: {
      // получить цвет
      getColor (access) {
        if (access === "true") return 'green'
        else return 'red'
      },

      linkCreate() {
        try {
          if (this.accessRules === 'Admin') {
            this.$nuxt.$router.push('/reg')
            // console.log('Переход на REg')
          }
        } catch (error) {
          console.log('linkCreate Error')
        }

      },

      // Диалог редактирования
      async editForm(userRow) {
        try {
          if (this.accessRules === 'Admin') {
            this.editedItem = await this.$axios.$get(`http://localhost:3666/api/user/edit/${userRow.userID}`, { headers: { 'authorization': localStorage.getItem('token') }})
            this.openEditForm()
          }
        } catch (error) {
          console.log('Ошибка редактирования пользователя')
          console.log(error)
        }

      },

      closeEditForm() {
        this.editedItem = {}
        this.dialogEditForm = false
        this.initialize()
      },

      openEditForm() {

        this.dialogEditForm = true
      },


      // диалог удаления
      async checkAdminDelet(userRow) {
        try {
          if (this.accessRules === 'Admin') {
            await this.$axios.$delete(`http://localhost:3666/api/user/${userRow.userID}`, { headers: { 'authorization': localStorage.getItem('token') }})
            this.snackText = 'Пользователь удалён'
            this.closeDelete()
          }
        } catch (error) {
          console.log('Ошибка при удалении пользователя')
          this.snackText = 'Ошибка'
          this.closeDelete()
        }
      },


      // отмена удаления
      closeDelete() {
        this.dialogDelete = false
        this.initialize()
      },

      // Инициализация
      async initialize() {
        this.accessRules = localStorage.getItem('userRole')
        // const tableData = {}
        if (this.accessRules === 'Admin') {
          this.getAdminData()
        } else {
          this.getUserData()
        }
        // console.log(tableData)
      },
      // получение таблицы Админа
      async getAdminData() {
        const tableData = await this.$axios.$get('http://localhost:3666/api/user/tableData', { headers: { 'authorization': localStorage.getItem('token') }})
        this.headers = tableData.headers
        this.items = tableData.items
        this.chips = tableData.chips
      },
      // получение таблицы пользователя
      async getUserData() {
        const tableData = await this.$axios.$get(`http://localhost:3666/api/user/oneRow/${localStorage.getItem('userID')}`, { headers: { 'authorization': localStorage.getItem('token') }})
        this.headers = tableData.headers
        this.items = tableData.items
        this.chips = tableData.chips
      },
    },
    async beforeCreate() {

    },
    async mounted () {

      // получение данных таблицы
      this.initialize()


    }


  }
</script>
