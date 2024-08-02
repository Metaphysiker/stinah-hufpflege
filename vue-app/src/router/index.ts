import { createMemoryHistory, createRouter } from "vue-router";
import HorsesOverviewView from "../views/HorsesOverviewView.vue";
import { inject } from "vue";
import { AxiosStatic } from "axios";
import { AuthenticationService } from "@/services/AuthenticationService";
import LoginView from "@/views/LoginView.vue";
const routes = [
  { path: "/", name: "home", component: HorsesOverviewView },
  { path: "/horses-overview", component: HorsesOverviewView },
  { path: "/login", name: "login", component: LoginView },
];

const router = createRouter({
  history: createMemoryHistory(),
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
