<script setup>
import { Primitive } from 'radix-vue'
import { buttonVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    validator: (value) => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value)
  },
  size: {
    type: String,
    validator: (value) => ['default', 'sm', 'lg', 'icon'].includes(value)
  },
  asChild: { type: Boolean, default: false },
})
</script>

<template>
  <Primitive
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </Primitive>
</template>
