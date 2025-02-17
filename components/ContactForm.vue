<script setup lang="ts">
import type { FormError } from "#ui/types";

const props = withDefaults(defineProps<{ page: string; id?: string }>(), {
  id: "contact-form",
});

type FormState = {
  name: string;
  phone: string;
};

const formState = reactive<FormState>({
  name: "",
  phone: "",
});

const validate = (state: FormState): FormError[] => {
  const errors = [];

  if (!state.name) {
    errors.push({ path: "name", message: "Будь ласка, вкажіть ім'я" });
  }

  if (!state.phone) {
    errors.push({
      path: "phone",
      message: "Будь ласка, вкажіть номер телефону",
    });
  }

  if (!/^\d{10,12}$/.test(state.phone.replace(/\D/g, ""))) {
    errors.push({
      path: "phone",
      message: "Введіть коректний номер телефону",
    });
  }

  if (/[a-zA-Z]/.test(state.phone)) {
    errors.push({
      path: "phone",
      message: "Номер телефону не повинен містити літер",
    });
  }

  return errors;
};

const { status, refresh: submitForm } = useAsyncData(
  "submit-contact-form",
  async () => {
    await $fetch("/api/contact-form", {
      method: "POST",
      body: {
        name: formState.name,
        phone: formState.phone,
        page: props.page,
      },
    });
  },
  {
    immediate: false,
  },
);

const messageSent = computed(() => status.value === "success");
</script>

<template>
  <UForm
    :state="formState"
    :validate="validate"
    class="p-5 flex flex-col gap-4 shadow-xl rounded-2xl bg-white max-w-[340px] w-full"
    :validate-on="['submit']"
    :disabled="true"
    @submit="submitForm"
  >
    <UFormGroup name="name">
      <UInput
        :id="`${id}-name`"
        v-model:model-value="formState.name"
        placeholder="Ваше ім’я"
        size="lg"
        :disabled="messageSent"
      />
    </UFormGroup>

    <UFormGroup name="phone">
      <UInput
        :id="`${id}-phone`"
        v-model:model-value="formState.phone"
        placeholder="Ваш номер телефону"
        size="lg"
        mask="+38 (###) ###-##-##"
        type="tel"
        :disabled="messageSent"
      />
    </UFormGroup>

    <UButton v-if="messageSent" block disabled>
      Заявку надіслано!<br />
      Дякуємо за звернення
    </UButton>
    <UButton
      v-else
      icon="i-heroicons-phone"
      trailing
      block
      type="submit"
      :loading="status === 'pending'"
    >
      Передзвоніть мені
    </UButton>
  </UForm>
</template>
