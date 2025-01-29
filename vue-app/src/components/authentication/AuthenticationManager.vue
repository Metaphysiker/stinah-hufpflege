<script setup lang="ts">
import { LocalStorageHelper } from "@/helpers/LocalStorageHelper";
import { IUser } from "@/interfaces/IUser";
import { AuthenticationService } from "@/services/AuthenticationService";
import { useUserStore } from "@/stores/userStore";
import { AxiosStatic } from "axios";
import { storeToRefs } from "pinia";
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const axios: AxiosStatic | undefined = inject("axios");
const authentificationService = new AuthenticationService(axios);
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const router = useRouter();
const localStorageHelper = new LocalStorageHelper();
onMounted(() => {
  handleLogin();
});

const handleLogin = () => {
  loadCurrentUser().then((user) => {
    console.log("User", user);
    if (user) {
      checkIfUserIsLoggedIn(user).then((isLoggedIn) => {
        if (isLoggedIn) {
          currentUser.value = user;
        } else {
          redirectToLogin();
        }
      });
    } else {
      redirectToLogin();
    }
  });
};

const loadCurrentUser = (): Promise<IUser | undefined> => {
  return new Promise<IUser | undefined>((resolve) => {
    if (currentUser.value) resolve(currentUser.value);
    const userFromLocalStorage = localStorageHelper.getCurrentUser();
    console.log("User from local storage", userFromLocalStorage);
    if (userFromLocalStorage) {
      resolve(userFromLocalStorage);
    } else {
      resolve(undefined);
    }
  });
};

const checkIfUserIsLoggedIn = (user: IUser): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    authentificationService.isLoggedIn(user).then((response) => {
      if (response) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const redirectToLogin = () => {
  router.push("/login");
};

const showUser = ref(false);
</script>
<template>
  <v-card v-if="showUser">
    <v-card-text>
      <div v-if="currentUser">
        {{ currentUser.email }} <br />
        {{ currentUser.username }} <br />
        {{ currentUser.token }}
      </div>
      <div v-if="!currentUser">Nicht angemeldet</div>
    </v-card-text>
  </v-card>
</template>
