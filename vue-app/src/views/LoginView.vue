<script setup lang="ts">
import { LocalStorageHelper } from "@/helpers/LocalStorageHelper";
import { Translator } from "@/helpers/Translator";
import { IAuthRequest } from "@/interfaces/IAuthRequest";
import router from "@/router";
import { AuthenticationService } from "@/services/AuthenticationService";
import { useUserStore } from "@/stores/userStore";
import { AxiosStatic } from "axios";
import { storeToRefs } from "pinia";
import { inject, ref } from "vue";
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
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

  let emailOrUsername = email.value;
  emailOrUsername = translator.translateBack(capitalize(emailOrUsername));

  const authRequest: IAuthRequest = {
    email: emailOrUsername,
    password: password.value,
  };
  authenticationService
    .login(authRequest)
    .then((user) => {
      localStorageHelper.setCurrentUser(user);
      currentUser.value = user;
      if (axios) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
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

const capitalize = (string: string) => {
  string = string.toLowerCase();
  return String(string[0]).toUpperCase() + String(string).slice(1);
};
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
      <v-text-field v-model="email" label="Email oder Username" />
      <v-text-field v-model="password" label="Password" type="password" />
      <v-btn @click="login()">Login</v-btn>
      <v-divider class="my-2"> </v-divider>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">Vorhandene Logins</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>stinah oder info@stinah.ch</td>
          </tr>
          <tr>
            <td>hufpflege</td>
          </tr>
          <tr>
            <td>zahnpflege</td>
          </tr>
          <tr>
            <td>gesundheit</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
