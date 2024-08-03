<script setup lang="ts">
import { LocalStorageHelper } from "@/helpers/LocalStorageHelper";
import { Translator } from "@/helpers/Translator";
import { IAuthRequest } from "@/interfaces/IAuthRequest";
import router from "@/router";
import { AuthenticationService } from "@/services/AuthenticationService";
import { AxiosStatic } from "axios";
import { inject, ref } from "vue";
const localStorageHelper = new LocalStorageHelper();
const email = ref("");
const password = ref("");
const axios: AxiosStatic | undefined = inject("axios");
const authenticationService = new AuthenticationService(axios);
const translator = new Translator();
const loading = ref(false);
const login = () => {
  errors.value = [];
  loading.value = true;
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
        localStorageHelper.setJWTToken(response.token);
        router.push("/");
      }
    })
    .catch((error) => {
      if (error.response.data) {
        if (error.response.data == "User not found") {
          errors.value.push(translator.translate("userNotFound"));
        } else {
          errors.value.push(translator.translate("wrongPassword"));
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const errors = ref<string[]>([]);
</script>

<template>
  <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
  <v-card>
    <v-card-text>
      <v-card-title>Login</v-card-title>
      <v-alert v-if="errors.length > 0" color="warning" class="my-2">
        <p v-for="error of errors">
          {{ error }}
        </p>
      </v-alert>
      <v-text-field v-model="email" label="Email" />
      <v-text-field v-model="password" label="Password" type="password" />
      <v-btn @click="login()">Login</v-btn>
    </v-card-text>
  </v-card>
</template>
