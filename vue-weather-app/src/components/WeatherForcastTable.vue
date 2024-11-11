
<template>
  <dl class="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-8">
    <div v-for="day in weather" :key="day.dt" class="grid grid-cols-1 items-center justify-between  gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
      <dt class="text-sm/6 font-medium text-gray-500 text-center">{{  dayNames[new Date(day.dt * 1000).getDay()] }}</dt>
      <div class="flex justify-center align-middle min-h-24 items-center"><dd class="w-full flex-none text-xs font-medium tracking-tight text-gray-900 text-center">{{ day.summary }}</dd></div>
      <dd class="w-full flex-none text-lg font-medium tracking-tight text-gray-900 text-center">{{ `${convertToF(day.temp?.max)}&deg; ${convertToF(day.temp?.min)}&deg;` }}</dd>
    </div>
  </dl>
</template>

<script setup>
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const convertToF = (celcius) => {
  return Math.round(celcius * (9 / 5) + 32);
}

const props = defineProps({
  stats: Array,
  weather: Array,
})
</script>
