<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Título'
  },
  count: {
    type: [String, Number],
    required: true,
    default: 0
  },
  color: {
    type: String,
    default: 'gray'
  },
  icon: {
    type: String,
    default: 'user'
  }
})

const colorStyles = computed(() => {
  const styles = {
    purple: {
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      border: 'border-l-4 border-purple-500'
    },
    indigo: {
      iconBg: 'bg-indigo-100',
      iconText: 'text-indigo-600',
      border: 'border-l-4 border-indigo-500'
    },
    blue: {
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      border: 'border-l-4 border-blue-500'
    },
    green: {
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      border: 'border-l-4 border-green-500'
    },
    gray: {
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      border: 'border-l-4 border-gray-400'
    }
  }
  return styles[props.color] || styles.gray
})
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between items-center"
    :class="colorStyles.border">
    <div>
      <p class="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-1">
        {{ title }}
      </p>
      <p class="text-3xl font-extrabold text-gray-900">
        {{ count }}
      </p>
    </div>

    <div class="h-14 w-14 rounded-full flex items-center justify-center" :class="colorStyles.iconBg">
      <i :class="[`fas fa-${icon}`, colorStyles.iconText, 'text-xl']"></i>
    </div>
  </div>
</template>