import { createRouter, createWebHistory } from "vue-router";
import HorsesOverviewView from "../views/HorsesOverviewView.vue";
import { inject } from "vue";
import { AxiosStatic } from "axios";
import { AuthenticationService } from "@/services/AuthenticationService";
import LoginView from "@/views/LoginView.vue";
import TreatmentsOveriewview from "@/views/TreatmentsOveriewview.vue";
import FilesOverviewView from "@/views/FilesOverviewView.vue";

const routes = [
  { path: "/horses", component: HorsesOverviewView },
  { path: "/treatments", component: TreatmentsOveriewview },
  { path: "/files", component: FilesOverviewView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/", name: "home", component: HorsesOverviewView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const axios: AxiosStatic | undefined = inject("axios");
  const authentificationService = new AuthenticationService(axios);
  const canAccess = await canUserAccess(authentificationService);
  if (to.name !== "login" && !canAccess) return "/login";
});

async function canUserAccess(authentificationService: AuthenticationService) {
  try {
    const response = await authentificationService.isLoggedIn();
    return response;
  } catch (error) {
    return false;
  }
}

export default router;
