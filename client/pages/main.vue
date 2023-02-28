<template>
  <v-container fluid v-if="showContent">
    <v-btn
      @click="logOut"
    >Сменить пользователя</v-btn>
    <main-table></main-table>
  </v-container>
</template>

<script>
  import mainTable from "../components/mainTable.vue"

  export default {
    name: 'MainPage',
    components: {
      mainTable,
    },
    data() {
      return {
        showContent: false,
      }
    },
    methods: {
      // проверка авторизации
      async checkAuth() {
        try {
          const token = localStorage.getItem('token')

          // проверка на отсутствие токена
          if (token === 'undefined' || !token) {
            console.log('Токен отсутствует')
            this.logOut()
            // если токена нет, то отправка на логин
          } else {
            // если токен есть, то отправляем его на сервер
            const postConfig = {
              method: 'post',
              url: 'http://localhost:3666/api/login/checkAuth/',
              headers: { 'authorization': token },
            }
            const authAccess = await this.$axios(postConfig)
            // если токен верный, то получаем ответом данные юзера, и сохраняем их
            localStorage.setItem('userID', authAccess.data.id)
            localStorage.setItem('userRole', authAccess.data.role)
            this.showContent = true
            }

        } catch (error) {
          console.log('Ошибка авторизации')
          this.logOut()
        }
      },

      // Разлогирование
      logOut() {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        localStorage.removeItem('userRole')
        this.$nuxt.$router.push('/login')
      },
    },

    async mounted() {
      this.checkAuth()

    },

  }
</script>
