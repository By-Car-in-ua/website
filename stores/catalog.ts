import { defineStore } from "pinia";
import type { VehiclesFilters, VehiclesSearchSchema } from "@bycar-in-ua/sdk";

export const useCatalogStore = defineStore("catalog", () => {
  const filters = ref<Required<Omit<VehiclesFilters, "status">>>({
    price: {
      from: 0,
      to: 9999999,
    },
    brand: [],
    bodyType: [],
    engineType: [],
    drive: [],
  });

  const pagination = reactive<NonNullable<VehiclesSearchSchema["pagination"]>>({
    page: 1,
    limit: 15,
  });

  const { $bycarApi } = useNuxtApp();

  const { status, data, refresh } = useAsyncData(
    `search-cars`,
    () => $bycarApi.searchVehicles({ filters: filters.value, pagination }),
    {
      default: () => ({
        items: [],
        meta: { currentPage: 1, totalPages: 0, itemsPerPage: 0, totalItems: 0 },
      }),
      watch: [filters, pagination],
    },
  );

  const pending = computed(() => status.value === "pending");

  const updateFilters = async (
    field: string,
    value: string | string[] | number | number[],
  ) => {
    filters.value = { ...filters.value, [field]: value };
    pagination.page = 1;
  };

  return {
    filters,
    pagination,
    pending,
    data,
    refresh,
    updateFilters,
  };
});
