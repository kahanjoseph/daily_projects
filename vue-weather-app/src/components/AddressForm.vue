<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['update:address']);
const localAddress = ref(props.address);

</script>

<template>
  <div>
    <label for="address" class="block text-sm/6 font-medium text-gray-900">Address</label>
    <div class="mt-2">
      <input v-model="localAddress" type="text" name="address" id="address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" placeholder="08701" />
    </div>
  </div>
  <button @click="() => {emits('update:address', localAddress);}" type="button" class="w-full mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
</template>
