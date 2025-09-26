<template>
  <div class="device-setting">
    <AudioIcon
      :size="16"
      :audioVolume="audioVolume"
      :isMuted="microphoneStatus === DeviceStatus.Off"
      @click="switchMicrophoneStatus"
    />
    <TUISlider
      v-if="microphoneStatus !== DeviceStatus.Off"
      v-model="microphoneVolume"
      class="device-slider"
      :min="0"
      :max="100"
      @change="handleMicrophoneVolumeChange"
    />
    <TUISlider
      v-else
      class="device-slider"
      :min="0"
      :max="100"
      disabled
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TUISlider, TUIToast, useUIKit } from '@tencentcloud/uikit-base-component-vue3';
import { DeviceError, DeviceStatus, useDeviceState } from 'tuikit-atomicx-vue3';
import AudioIcon from '../base-component/AudioIcon.vue';

const { t } = useUIKit();

const {
  captureVolume,
  setCaptureVolume,
  microphoneStatus,
  openLocalMicrophone,
  closeLocalMicrophone,
  microphoneLastError,
  audioVolume,
} = useDeviceState();

const microphoneVolume = ref(captureVolume.value);

const handleMicrophoneVolumeChange = (value: number) => {
  if (value !== captureVolume.value) {
    setCaptureVolume(value);
  }
};

const switchMicrophoneStatus = () => {
  if (microphoneLastError.value !== DeviceError.NoError) {
    switch (microphoneLastError.value) {
      case DeviceError.NoDeviceDetected:
        TUIToast.error({
          message: t('No device detected'),
        });
        break;
      case DeviceError.NoSystemPermission:
        TUIToast.error({
          message: t('No system permission'),
        });
        break;
      case DeviceError.NotSupportCapture:
        TUIToast.error({
          message: t('Not support capture'),
        });
        break;
      default:
        break;
    }
  }
  if (microphoneStatus.value === DeviceStatus.On) {
    closeLocalMicrophone();
  } else {
    openLocalMicrophone();
  }
};

watch(captureVolume, (newVal) => {
  microphoneVolume.value = newVal;
});
</script>

<style lang="scss" scoped>
@import '../style/index.scss';

.device-setting {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-color-bubble-reciprocal);
  padding: 0 8px;
  border-radius: 6px;
  height: 40px;

  .device-slider {
    flex: 1;
    width: 46px;

    :deep(.slider-thumb) {
      width: 8px;
      height: 8px;
    }

    :deep(.slider-thumb-disabled) {
      border-color: var(--slider-color-empty);
    }
  }
}
</style>
