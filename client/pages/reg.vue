<template>
    <v-container>
      <create-form v-if="showContent"></create-form>
    </v-container>
</template>

<script>
  import createForm from '../components/createForm.vue'

  export default {
    components: {
      createForm,
    },
    data() {
      return {
        showContent: false,
      }
    },

    methods: {
      async checkAuth() {
        try {
          const token = localStorage.getItem('token')

          // проверка на отсутствие токена
          if (token === 'undefined' || !token) {
            console.log('Токен отсутствует')
            this.authError()
            // если токена нет, то отправка на логин
          } else {
            // если токен есть, то отправляем его на сервер
            const authAccess = await this.$axios.$post('http://localhost:3666/login/checkAuth/', {}, { headers: { 'authorization': token }})
            // если токен верный, то получаем ответом данные юзера, и сохраняем их?, но проверям на админа
            if (authAccess.role === 'Admin') {
              localStorage.setItem('userID', authAccess.id)
              localStorage.setItem('userRole', authAccess.role)
              this.showContent = true
            } else {
              console.log('Нет прав администратора')
              this.authError()
            }
          }

        } catch (error) {
          console.log('Ошибка авторизации')
          this.authError()
        }
      },
      // релог при ошибке авторизации
      authError() {
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

