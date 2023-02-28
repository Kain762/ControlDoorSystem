<template>
  <v-form v-model="valid" v-if="showContent">
    <v-container fluid>
      <form>
        <v-row>
          <v-spacer></v-spacer>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="login"
              :rules="nameRules"
              :counter="30"
              label="Логин"
              required
              @keyup.native.enter="submitForm"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            :rules="nameRules"
            :counter="30"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="Пароль"
            required
            @click:append="show1 = !show1"
            @keyup.native.enter="submitForm"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            @click="submitForm"
            :disabled="!valid"
            >
            Войти
          </v-btn>
          <!-- //////////////////////////////////// -->
          <!-- тест -->
          <v-btn
            @click="testCheck"
            >
            Проверить
          </v-btn>
          <!-- ///////////////////////////////////////////// -->
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      {{ testFiled }}
      </form>

    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'LoginPage',
  data: () => ({
      showContent: false,
      show1: false,
      valid: false,
      login: '',
      password: '',
      testFiled: '',
      nameRules: [
        v => !!v || 'Поле пустое',
        v => v.length <= 30 || 'Не более 30-ти символов',
      ],
    }),
    methods: {
      async submitForm() {
        // console.log(`${log}: ${pass}`)
        if(this.valid){
          try {
            const submitRes = await this.$axios.$post('http://localhost:3666/api/login/', {
              login: this.login,
              password: this.password,
            })
            console.log(submitRes)
            localStorage.setItem('token', submitRes.token);
            this.$nuxt.$router.push({path: '/main'})
          } catch (error) {
              localStorage.setItem('token', undefined)
              console.log(`Введенные данные не верны \n${error}`)
              this.testFiled = 'Неверные данные'
          }
        }

      },
      // Тестовая функция
      testCheck() {
        this.testFiled = localStorage.getItem('token')
      },
      // проверка авторизации
      async autoAuth() {
        try {
          const token = localStorage.getItem('token')

          if(token && token != 'undefined') {
            const postConfig = {
              method: 'post',
              url: 'http://localhost:3666/api/login/checkAuth/',
              headers: { 'authorization': token},
            }
            const authAccess = await this.$axios(postConfig)
            await localStorage.setItem('userID', authAccess.data.id)
            await localStorage.setItem('userRole', authAccess.data.role)
            // setTimeout(() => {this.$nuxt.$options.router.push({path: '/main'})}, 200)
            // document.location.href = '/main'
            console.log('пользователь авторизован')
            await this.$nuxt.$router.push('/main')
          } else {
            this.showContent = true
          }



        } catch (error) {
          console.log('Ошибка авторизации ' + error)
          localStorage.removeItem('token')
          localStorage.removeItem('userID')
          localStorage.removeItem('userRole')
        }
      },
    },

    async mounted() {
      this.autoAuth()
    },
  }

</script>
