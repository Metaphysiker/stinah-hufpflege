<script setup lang="ts">
import { IAuthRequest } from "@/interfaces/IAuthRequest";
import router from "@/router";
import { AuthenticationService } from "@/services/AuthenticationService";
import { AxiosStatic } from "axios";
import { inject, ref } from "vue";
const email = ref("");
const password = ref("");
const axios: AxiosStatic | undefined = inject("axios");
const authenticationService = new AuthenticationService(axios);

const login = () => {
  const authRequest: IAuthRequest = {
    email: email.value,
    password: password.value,
  };
  authenticationService
    .login(authRequest)
    .then((response) => {
      if (axios) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
        router.push("/");
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.data);
    });
};
</script>

<template>
  <v-card>
    <v-card-text>
      <v-card-title>Login</v-card-title>
      <v-text-field v-model="email" label="Email" />
      <v-text-field v-model="password" label="Password" type="password" />
      <v-btn @click="login()">Login</v-btn>
    </v-card-text>
  </v-card>
</template>
