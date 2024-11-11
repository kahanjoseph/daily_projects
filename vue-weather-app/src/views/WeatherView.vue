<script setup>
import {useQuery, useQueryClient} from '@tanstack/vue-query'
import {computed, ref, watch, watchEffect} from 'vue';
import AddressForm from "@/components/AddressForm.vue";
import WeatherForcastTable from "@/components/WeatherForcastTable.vue";

const address = ref('');
const addressSet = computed(() => !!address.value)

const getTodos = async (address) => {
  const response = await fetch(address);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const getWeather = async (lat, lon) => {
  const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const { isPending, isFetching, isError, data: map_query_result, error } = useQuery({
  queryKey: ['map_data'],
  queryFn: () => getTodos(`https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`),
  addressSet,
})

const lat = computed(() => map_query_result.value?.results[0]?.geometry?.location?.lat)
const lng = computed(() => map_query_result.value?.results[0]?.geometry?.location?.lng)
const enabled = computed(() => !!map_query_result.value?.results[0]?.place_id)

// Query to get related data based on place_id
const { isLoading: weather_loading, isError: weather_error, data: weather_data } = useQuery({
  queryKey: ['weatherData'],
  queryFn: () => getWeather(lat.value, lng.value),
  enabled, // The query will not execute until `enabled == true`
})

const queryClient = useQueryClient();

// Watch for changes to the `address` and invalidate the query
watch(address, () => {
  queryClient.invalidateQueries(['map_data']);
}, { immediate: true });

watch([lat, lng], () => {
  queryClient.invalidateQueries(['weatherData']);
}, { immediate: true });
</script>

<template>
  <div class="bg-white mx-auto max-w-7xl sm:px-6 lg:px-8">
    <AddressForm :address="address" @update:address="val => address = val"/>
    <p v-if="isPending || isFetching">Loading...</p>
    <p v-else-if="isError">An error occurred: {{ error.message }}</p>
    <div v-else>
      <h2 class="text-center text-2xl font-semibold mt-4">{{map_query_result?.results[0]?.formatted_address}}</h2>
      <p v-if="!weather_error && !weather_loading">
        <WeatherForcastTable :stats="stats" :weather="weather_data.daily"/>
      </p>
    </div>
  </div>
</template>
