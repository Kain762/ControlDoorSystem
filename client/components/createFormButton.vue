<template>
  <!-- Блок кнопок -->
    <v-row class="justify-center mt-3 mb-5">
      <v-btn
        class="ml-5 green"
        elevation="4"
        :disabled="!checkForm ? true : false"
        @click="createUser"
      >
        Регистрация
      </v-btn>
      <v-btn
        class="ml-5 red"
        elevation="4"
        @click="closeForm"
      >
        Отмена
      </v-btn>
    </v-row>
</template>

<script>
  export default {
    name: 'CreateFormButton',

    props: {
      userData: Object,
    },

    data() {
      return {

      }
    },

    methods: {
      closeForm() {
        this.$nuxt.$router.push('/main')
      },
      // отправить данные на создание юзера
      async createUser() {
        try {
          await this.$axios.$post('http://localhost:3666/api/user/', {
            name: this.userData.name,
            login: this.userData.login,
            password: this.userData.password,
            role: this.userData.role,
            chip: this.userData.chip,
            doors: this.userData.doorAccess,
          })} catch (error) {
          alert(`ERRORR!!! ${error.detail}`)
          return
        }
          alert(`Пользователь ${this.userData.name} успешно создан`)
          this.closeForm()

      },
    },

    computed: {
      checkForm() {
        return Boolean(this.userData.name &&
                      this.userData.login &&
                      this.userData.password &&
                      this.userData.role &&
                      this.userData.chip)
      }
    },
  }
</script>

