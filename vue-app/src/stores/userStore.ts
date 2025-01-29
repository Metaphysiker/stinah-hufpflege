import { Ref, ref } from "vue";
import { defineStore } from "pinia";
import { IUser } from "@/interfaces/IUser";

export const useUserStore = defineStore("userStore", () => {
  const currentUser: Ref<IUser | undefined> = ref(undefined);
  return { currentUser };
});
