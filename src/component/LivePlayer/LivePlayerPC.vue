<template>
  <div
    id="liveContainer"
    class="live-player-pc"
  >
    <div class="main-left">
      <div class="main-left-top">
        <IconArrowStrokeBack
          class="icon-back"
          size="20"
          @click="handleLeaveLive"
        />
        <Avatar
          :src="currentLive?.liveOwner.avatarUrl"
          :size="32"
          :style="{ border: '1px solid var(--uikit-color-white-7)' }"
        />
        <span> {{ currentLive?.liveOwner.userName || currentLive?.liveOwner.userId }}</span>
        <div
          class="follow-user"
          @click="handleFollowUser"
        >
          <div
            v-if="!isFollowed"
            class="follow"
          >
            {{ t('Follow') }}
          </div>
          <div
            v-else
            class="followed"
          >
            <IconFollowed />
          </div>
        </div>
      </div>
      <div class="main-left-center">
        <LiveCoreView />
      </div>
    </div>
    <div class="main-right">
      <div class="main-right-top">
        <div class="main-right-top-title card-title">
          <div class="title-text">
            {{ t('Online viewers') }}
          </div>
          <div class="title-count">
            ({{ audienceList.length }})
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
            height="48px"
            :disabled="!isInLive"
            :placeholder="isInLive ? '' : t('Live not started')"
          />
        </div>
      </div>
    </div>
  </div>
  <TUIDialog
    :visible="leaveLiveDialogVisible"
    :center="true"
    :content="leaveLiveText"
    @close="handleLeaveLive"
  >
    <template #footer>
      <div>
        <TUIButton @click="handleLeaveLive">
          {{ t('Confirm') }}
        </TUIButton>
      </div>
    </template>
  </TUIDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps, onUnmounted, defineEmits, watch } from 'vue';
import { TUIRoomEvents } from '@tencentcloud/tuiroom-engine-js';
import {
  IconArrowStrokeBack,
  TUIButton,
  TUIDialog,
  TUIMessageBox,
  useUIKit,
  IconFollowed,
} from '@tencentcloud/uikit-base-component-vue3';
import {
  LiveAudienceList,
  BarrageList,
  BarrageInput,
  useLiveAudienceState,
  LiveCoreView,
  LiveStatus,
  useLiveState,
  Avatar,
  useRoomEngine
} from 'tuikit-atomicx-vue3';
import { isFollowed, getFollowInfo, followUser, unfollowUser } from './followUser';

const { t } = useUIKit();
const { audienceList } = useLiveAudienceState();
const { localLiveStatus, currentLive, joinLive, leaveLive } = useLiveState();
const isInLive = computed(() => localLiveStatus.value === LiveStatus.Live);
const roomEngine = useRoomEngine();

const props = defineProps<{
  liveId: string;
}>();

const leaveLiveDialogVisible = ref(false);
const leaveLiveText = ref('');

const emit = defineEmits(['leaveLive']);

onMounted(async () => {
  await handleJoinLive();
  roomEngine.instance?.on(TUIRoomEvents.onAutoPlayFailed, handleAutoPlayFailed);
});

watch(localLiveStatus, (liveStatus) => {
  if (liveStatus === LiveStatus.Ended) {
    showLeaveLiveDialog(t('Live has ended'));
  } else if (liveStatus === LiveStatus.IDLE) {
    showLeaveLiveDialog(t('You have been kicked out from live room'));
  }
});

watch(
  currentLive,
  async () => {
    const userId = currentLive.value?.liveOwner.userId;
    if (userId) {
      await getFollowInfo(userId);
    }
  },
  { deep: true },
);

onUnmounted(async () => {
  if (localLiveStatus.value !== LiveStatus.Ended) {
    await leaveLive();
  }
  roomEngine.instance?.off(TUIRoomEvents.onAutoPlayFailed, handleAutoPlayFailed);
});

function handleLeaveLive() {
  leaveLiveDialogVisible.value = false;
  emit('leaveLive');
}

async function handleJoinLive() {
  if (props.liveId && props.liveId.trim()) {
    try {
      await joinLive({ liveId: props.liveId });
    } catch (error) {
      console.error('Failed to join live room, error:', error);
      showLeaveLiveDialog(t('Failed to join live room'));
    }
  } else {
    console.error('liveId is empty');
    showLeaveLiveDialog(t('LiveId is empty'));
  }
}

async function handleFollowUser() {
  const userId = currentLive.value?.liveOwner.userId;
  if (!userId) {
    return;
  }
  if (isFollowed.value) {
    await unfollowUser(userId);
  } else {
    await followUser(userId);
  }
}

function showLeaveLiveDialog(text: string) {
  if (leaveLiveDialogVisible.value || text.trim().length === 0) {
    return;
  }

  leaveLiveText.value = text;
  leaveLiveDialogVisible.value = true;
}

function handleAutoPlayFailed() {
  TUIMessageBox.alert({
    content: t('Content is ready. Click the button to start playback'),
    confirmText: t('Play'),
  });
}
</script>

<style lang="scss" scoped>
@import './../../style/index.scss';

.live-player-pc {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  gap: 6px;
  overflow: hidden;
  background-color: black;
  border-radius: 8px;
  @include scrollbar;
}

.main-left {
  flex: 1;
  display: flex;
  overflow: hidden;
  margin-left: 16px;
  flex-direction: column;
  background-color: var(--bg-color-operate);

  .main-left-top {
    display: flex;
    height: 56px;
    gap: 10px;
    padding-left: 16px;
    align-items: center;

    span {
      color: $text-color1;
      overflow: hidden;
      max-width: 180px;
      text-overflow: ellipsis;
    }

    .icon-back {
      &:hover {
        cursor: pointer;
      }
    }

    .follow-user {
      display: flex;
      width: 65px;
      max-width: 100px;
      height: 32px;
      border-radius: 16px;
      background-color: #4086FF;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      &:hover {
        background-color: #2B6AD6;
        cursor: pointer;
      }

      .follow {
        @include text-size-14;
      }

      .followed {
        background-color: gray;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    }
  }

  .main-left-center {
    position: relative;
    flex: 1;
    min-width: 0;
    min-height: 0;
    background-color: black;
    overflow: hidden;
    border: 1px solid var(--bg-color-operate);
  }
}

.main-right {
  height: 100%;
  width: 20%;
  min-width: 160px;
  max-width: 360px;
  color: $text-color1;
  display: flex;
  margin-right: 16px;
  flex-direction: column;
  gap: 6px;

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

.card-title {
  @include text-size-16;
  @include dividing-line;
}
</style>
