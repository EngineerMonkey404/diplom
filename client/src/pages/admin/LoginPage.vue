<template>
  <div class="flex justify-center items-center">
    <div>
      <InputText placeholder="Введите логин" type="text" v-model="user.username" />
      <InputText placeholder="Введите пароль" type="text" v-model="user.password" />
      <button @click="handleLogin()">Войти</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import { httpClient } from '../../axiosInstance';
import { useRouter } from 'vue-router';
import { useCookies } from "vue3-cookies";

const user = ref({
  username: '',
  password: '',
})

const router = useRouter()
const { cookies } = useCookies()

async function handleLogin() {
  try {
    const role = (await httpClient.post('/auth/login', user.value)).data.role
    if (role === 'admin') {
      cookies.set("role", "admin")
      router.push('/admin')
    }
  } catch(err) {
    user.value = { username: '', password: '' }
  }
}
</script>