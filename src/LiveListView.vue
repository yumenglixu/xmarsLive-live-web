<template>
  <div class="live-list-view">
    <div
      v-if="!isMobile"
      class="live-list-text"
    >
      <span>{{ t('Online Live') }}</span>
    </div>
    <LiveList @live-room-click="handleLiveRoomClick" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import { useUIKit } from '@tencentcloud/uikit-base-component-vue3';
import { LiveList } from 'tuikit-atomicx-vue3';
import { isMobile } from './utils/environment';
import type { LiveInfo } from 'tuikit-atomicx-vue3';

const { t } = useUIKit();

const emit = defineEmits<{
  (e: 'live-room-click', liveInfo: LiveInfo): void;
}>();

function handleLiveRoomClick(liveInfo: LiveInfo) {
  emit('live-room-click', liveInfo);
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';

.live-list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 10px;
  align-items: center;
}

.live-list-text {
  color: $text-color1;
  @include text-size-16;
  text-align: left;
  width: 100%;

  span {
    padding-left: 16px;
  }
}
</style>
