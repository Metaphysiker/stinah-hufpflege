<script setup lang="ts" generic="T extends IDto">
import { IDto } from "@/interfaces/IDto";

const props = defineProps({
  interfaceName: {
    required: true,
    type: String,
  },
});
</script>
