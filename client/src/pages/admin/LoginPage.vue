<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-col gap-y-[20px]">
      <h3>Авторизация</h3>
      <input class="input-style" placeholder="Введите логин" type="text" v-model="user.username" />
      <input class="input-style" placeholder="Введите пароль" type="text" v-model="user.password" />
      <button @click="handleLogin()">Войти</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

<style scoped>
.btn-style {
  @apply px-[15px] py-[5px] rounded-[16px] border border-[#694DF9] transition-colors duration-300 hover:text-[#694DF9];
}
</style>