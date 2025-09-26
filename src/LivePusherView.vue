<template>
  <div class="live-pusher-main">
    <div class="main-left">
      <div class="main-left-top">
        <div class="main-left-top-title card-title">
          <div class="title-text">
            {{ t('Video Source') }}
          </div>
        </div>
        <LiveScenePanel />
      </div>
      <div class="main-left-bottom">
        <div class="main-left-bottom-header">
          <div class="main-left-bottom-title">
            {{ t('Live tool') }}
          </div>
          <div
            class="main-left-bottom-fold"
            @click="isToolsExpanded = !isToolsExpanded"
          >
            <span
              class="arrow-icon"
              :class="{ expanded: isToolsExpanded, collapsed: !isToolsExpanded }"
            />
            <span>{{ isToolsExpanded ? t('Close') : t('Expand') }}</span>
          </div>
        </div>
        <div
          v-if="isToolsExpanded"
          class="main-left-bottom-tools"
        >
          <CoGuestButton />
        </div>
      </div>
    </div>
    <div class="main-center">
      <div class="main-center-top">
        <div class="main-center-top-left">
          {{ currentLive?.liveName || liveParams.liveName }}
          <LiveSettingButton
            v-if="localLiveStatus === LiveStatus.IDLE && loginUserInfo?.userId"
            :liveName="liveParams.liveName"
            @confirm="handleLiveSettingConfirm"
          />
        </div>
        <div class="main-center-top-right">
          {{ audienceCount }} {{ t('People watching') }}
        </div>
      </div>
      <div class="main-center-center">
        <StreamMixer />
      </div>
      <div class="main-center-bottom">
        <div class="main-center-bottom-content">
          <div class="main-center-bottom-left">
            <MicVolumeSetting />
            <SpeakerVolumeSetting />
            <div class="main-center-bottom-tools">
              <CoGuestButton />
              <SettingButton />
              <OrientationSwitch />
              <LayoutSwitch />
            </div>
          </div>
          <div class="main-center-bottom-right">
            <TUIButton
              v-if="localLiveStatus === LiveStatus.IDLE"
              type="primary"
              :disabled="loading"
              @click="handleCreateLive"
            >
              <IconLiveLoading
                v-if="loading"
                class="loading-icon"
              />
              <IconLiveStart v-else />
              {{ t('Start live') }}
            </TUIButton>
            <TUIButton
              v-else
              color="red"
              :disabled="loading"
              @click="handleEndLive"
            >
              <IconLiveLoading
                v-if="loading"
                class="loading-icon"
              />
              <IconEndLive v-else />
              {{ t('End live') }}
            </TUIButton>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="main-right">
      <div class="main-right-top">
        <div class="main-right-top-title card-title">
          <div class="title-text">
            {{ t('Online viewers') }}
          </div>
          <div class="title-count">
            ({{ audienceCount }})
          </div>
        </div>
        <LiveAudienceList height="calc(100% - 40px)" />
      </div>
      <div class="main-right-bottom">
        <div class="main-right-bottom-header">
          <div class="main-right-bottom-title card-title">
            {{ t('Barrage list') }}
          </div>
        </div>
        <div class="message-list-container">
          <BarrageList />
        </div>
        <div class="message-input-container">
          <BarrageInput
            height="56px"
            :disabled="!isInLive"
            :placeholder="isInLive ? '' : t('Live not started')"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue';
import TUIRoomEngine, { TUISeatMode } from '@tencentcloud/tuiroom-engine-js';
import { TUIButton, useUIKit, TUIToast, IconLiveStart, IconEndLive, IconLiveLoading, TUIMessageBox } from '@tencentcloud/uikit-base-component-vue3';
import {
  LiveScenePanel,
  LiveAudienceList,
  BarrageList,
  BarrageInput,
  useLiveState,
  LiveStatus,
  useLiveAudienceState,
  useLoginState,
  StreamMixer,
  useDeviceState,
} from 'tuikit-atomicx-vue3';
import CoGuestButton from './component/CoGuestButton.vue';
import LayoutSwitch from './component/LayoutSwitch.vue';
import LiveSettingButton from './component/LiveSettingButton.vue';
import MicVolumeSetting from './component/MicVolumeSetting.vue';
import OrientationSwitch from './component/OrientationSwitch.vue';
import SettingButton from './component/SettingButton.vue';
import SpeakerVolumeSetting from './component/SpeakerVolumeSetting.vue';
import { ERROR_MESSAGE } from './constants';

const { t } = useUIKit();
const props = defineProps<{
  liveId?: string;
  liveName?: string;
  seatMode?: TUISeatMode;
}>();
const isToolsExpanded = ref(true);
const { loginUserInfo } = useLoginState();
const { localLiveStatus, currentLive, createLive, endLive, joinLive } = useLiveState();
const { audienceCount } = useLiveAudienceState();
const { openLocalMicrophone } = useDeviceState();
const isInLive = computed(() => localLiveStatus.value === LiveStatus.Live);
const loading = ref(false);
const liveParamsEditForm = ref({
  liveName: '',
});
const liveParams = computed(() => ({
  liveId: props.liveId || `live_${loginUserInfo.value?.userId}`,
  liveName: liveParamsEditForm.value.liveName || props.liveName || loginUserInfo.value?.userName || loginUserInfo.value?.userId || '',
  seatMode: props.seatMode || TUISeatMode.kApplyToTake,
}));
const handleLiveSettingConfirm = (form: { liveName: string }) => {
  liveParamsEditForm.value = form;
};

const handleCreateLive = async () => {
  try {
    if (loading.value) {
      return;
    }
    if (!loginUserInfo.value?.userId) {
      TUIToast.info({
        message: t('Please login first'),
      });
      return;
    }
    loading.value = true;
    await TUIRoomEngine.callExperimentalAPI(
      JSON.stringify({
        api: 'enableUnlimitedRoom',
        params: {
          enable: true,
        },
      }),
    );
    await createLive({
      liveId: liveParams.value.liveId,
      liveName: liveParams.value.liveName,
      notice: '',
      isMessageDisableForAllUser: false,
      isGiftEnabled: true,
      isLikeEnabled: true,
      isPublicVisible: true,
      isSeatEnabled: true,
      keepOwnerOnSeat: true,
      seatLayoutTemplateId: currentLive.value?.layoutTemplate || 0,
      seatMode: liveParams.value.seatMode,
      coverUrl: '',
      backgroundUrl: '',
      categoryList: [],
      activityStatus: 0,
      maxSeatCount: 0,
    });
    joinLive({
      liveId: liveParams.value.liveId,
    });
    loading.value = false;
    openLocalMicrophone();
  } catch (error: any) {
    loading.value = false;
    const message = t(ERROR_MESSAGE[error.code as keyof typeof ERROR_MESSAGE] || 'Failed to create live');
    TUIToast.error({ message });
    throw error;
  }
};
const handleEndLive = async () => {
  if (loading.value) {
      return;
    }
    await TUIMessageBox.confirm({
      title: t('You are currently live streaming. Do you want to end it?'),
      callback: async (action) => {
        if (action === 'confirm') {
          try {
          loading.value = true;
          await endLive();
          loading.value = false;
          } catch (error: any) {
            const message = t(ERROR_MESSAGE[error.code as keyof typeof ERROR_MESSAGE] || 'Failed to end live');
            TUIToast.error({ message });
            loading.value = false;
          }
        }
      },
    });
};
</script>

<style lang="scss" scoped>
@import './style/index.scss';

.live-pusher-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 6px;
  overflow: auto;
  margin-top: 16px;
  border-radius: 8px;
  @include scrollbar;

  .main-left {
    width: 20%;
    max-width: 320px;
    height: 100%;
    color: $text-color1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .main-left-top {
      flex: 1;
      background-color: var(--bg-color-operate);
      padding: 16px;
      .main-left-top-title {
        display: flex;
        align-items: center;
        color: $text-color1;
        height: 40px;
        box-sizing: border-box;
        margin-bottom: 16px;

        .title-text {
          @include text-size-16;
        }
      }
    }
    .main-left-bottom {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: var(--bg-color-operate);
      padding: 16px;

      .main-left-bottom-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .main-left-bottom-fold {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          color: $text-color2;
          @include text-size-12;
        }
      }

      .main-left-bottom-title {
        @include text-size-16;
      }

      .main-left-bottom-tools {
        @include dividing-line('top');
        margin-top: 16px;
        display: flex;
      }
    }
  }
  .main-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    .main-center-top {
      box-sizing: border-box;
      padding: 0 16px;
      width: 100%;
      height: 56px;
      background-color: var(--bg-color-operate);
      color: $text-color1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .main-center-top-left {
        @include text-size-16;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .main-center-top-right {
        @include text-size-12;
      }
    }
    .main-center-center {
      flex: 1;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--bg-color-operate);
      color: #131417;
    }
    .main-center-bottom {
      width: 100%;
      background-color: var(--bg-color-operate);
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      box-sizing: border-box;
      flex-direction: column;

      .main-center-bottom-header {
        @include text-size-14;
      }
      .main-center-bottom-content {
        display: flex;
        justify-content: space-between;
        height: 72px;

        .main-center-bottom-left {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          .main-center-bottom-tools {
            display: flex;
          }
        }
        .main-center-bottom-right {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .main-right {
    height: 100%;
    width: 20%;
    max-width: 320px;
    color: $text-color1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 200px;

    .main-right-top {
      background-color: var(--bg-color-operate);
      color: $text-color1;
      height: 30%;
      padding: 16px;

      .main-right-top-title {
        display: flex;
        align-items: center;
        color: $text-color1;
        height: 40px;
        box-sizing: border-box;

        .title-text {
          @include text-size-16;
        }

        .title-count {
          font-weight: 400;
          color: $text-color2;
        }
      }
    }
    .main-right-bottom {
      flex: 1;
      background-color: var(--bg-color-operate);
      color: $text-color1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 16px;

      .main-right-bottom-header {
        display: flex;
        flex-direction: column;
      }

      .message-list-container {
        flex: 1;
        max-height: calc(100% - 58px - 47.5px);
      }
    }
  }
}

.arrow-icon {
  box-sizing: border-box;
  display: inline-block;
  @include icon-size-12;
  transition: transform 0.2s ease-in-out;
  mask-image: url('./icons/arrow.svg');
  background-color: $text-color2;

  &.expanded {
    transform: rotate(0deg);
  }
  &.collapsed {
    transform: rotate(180deg);
  }
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-title {
  @include text-size-16;
  @include dividing-line;
}
</style>
