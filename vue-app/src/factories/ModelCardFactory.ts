import HorseCard from "@/components/horses/HorseCard.vue";
import { Component } from "vue";

export class ModelCardFactory {
  static createComponent(type: string): Component {
    switch (type) {
      case "IHorse":
        return HorseCard;
      default:
        throw new Error("Unknown type");
    }
  }
}
