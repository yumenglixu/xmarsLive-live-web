<template>
  <div class="device-setting">
    <TUIIcon
      class="device-icon"
      :icon="speakerIsOn ? IconSpeakerOn : IconSpeakerOff"
      @click="switchSpeaker(!speakerIsOn)"
    />
    <TUISlider
      v-if="speakerIsOn"
      v-model="speakerVolume"
      class="device-slider"
      :min="0"
      :max="100"
      @change="handleSpeakerVolumeChange"
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
import { TUIIcon, TUISlider, IconSpeakerOn, IconSpeakerOff } from '@tencentcloud/uikit-base-component-vue3';
import { useDeviceState } from 'tuikit-atomicx-vue3';

const { outputVolume, setOutputVolume } = useDeviceState();
const speakerVolume = ref(outputVolume.value);
const speakerIsOn = ref(true);
const templateSpeakerVolume = ref(outputVolume.value);

const switchSpeaker = (open: boolean) => {
  speakerIsOn.value = open;
  if (!open) {
    templateSpeakerVolume.value = outputVolume.value;
    setOutputVolume(0);
  } else {
    setOutputVolume(templateSpeakerVolume.value);
  }
};

const handleSpeakerVolumeChange = (value: number) => {
  if (value !== outputVolume.value) {
    setOutputVolume(value);
  }
};

watch(outputVolume, (newVal) => {
  speakerVolume.value = newVal;
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

  .device-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
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
