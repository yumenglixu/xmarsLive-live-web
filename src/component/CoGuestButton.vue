<template>
  <div
    class="custom-icon-container"
    @click="handleCoGuest"
  >
    <span
      v-if="receivedCoGuestUserList.length > 0"
      class="unread-count"
    >{{ receivedCoGuestUserList.length }}</span>
    <span class="custom-icon co-guest-icon" />
    <span class="custom-text co-guest-text">{{ t('CoGuest') }}</span>
  </div>
  <TUIDialog
    :title="t('CoGuest')"
    :visible="coGuestPanelVisible"
    :custom-classes="['co-guest-dialog']"
    @close="coGuestPanelVisible = false"
    @confirm="coGuestPanelVisible = false"
    @cancel="coGuestPanelVisible = false"
  >
    <CoGuestPanel class="co-guest-panel" />
    <template #footer>
      <div />
    </template>
  </TUIDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUIKit, TUIDialog } from '@tencentcloud/uikit-base-component-vue3';
import { CoGuestPanel, useCoGuestState } from 'tuikit-atomicx-vue3';

const { t } = useUIKit();
const { receivedCoGuestUserList } = useCoGuestState();

const coGuestPanelVisible = ref(false);

const handleCoGuest = () => {
  coGuestPanelVisible.value = true;
};
</script>

<style lang="scss" scoped>
@import '../style/index.scss';

.custom-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 56px;
  height: 56px;
  cursor: pointer;
  color: $text-color1;
  border-radius: 12px;
  position: relative;

  .unread-count {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--text-color-error);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .custom-icon {
    @include icon-size-24;
  }
  .custom-text {
    @include text-size-12;
  }

  &:hover {
    box-shadow: 0 0 10px 0 var(--bg-color-mask);
    .custom-icon {
      background-color: $icon-hover-color;
    }
    .custom-text {
      color: $icon-hover-color;
    }
  }
}

.co-guest-icon {
  mask-image: url('../icons/co-guest-icon.svg');
}

.co-guest-panel {
  height: 560px;
}

:deep(.co-guest-dialog) {
  width: 520px;
}
</style>
