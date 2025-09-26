<template>
  <div class="live-pusher-container">
    <LivePusherView />
  </div>
</template>

<script lang="ts" setup>
import LivePusherView from '../LivePusherView.vue'
</script>

<style lang="scss" scoped>
.live-pusher-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-topbar);
  color: var(--text-color-primary);
  overflow: auto;
  padding: 16px;
  box-sizing: border-box;
}
</style>
