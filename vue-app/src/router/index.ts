import { createRouter, createWebHistory } from "vue-router";
import HorsesOverviewView from "../views/HorsesOverviewView.vue";
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

export default router;
