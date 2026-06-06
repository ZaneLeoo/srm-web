<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'IconPicker' });

const model = defineModel<string>({ default: '' });

const visible = ref(false);
const keyword = ref('');
const icons = ref<string[]>([]);
const loading = ref(false);

const commonIcons = [
  'carbon:cloud-service-management',
  'carbon:user-role',
  'ic:round-manage-accounts',
  'material-symbols:route',
  'ic:baseline-cloud-upload',
  'carbon:home',
  'carbon:settings',
  'carbon:document',
  'carbon:inventory-management',
  'carbon:shopping-cart',
  'carbon:chart-line',
  'carbon:star-filled',
  'carbon:notification',
  'carbon:search',
  'carbon:add',
  'carbon:edit',
  'carbon:delete',
  'carbon:view',
  'mdi:account-group',
  'mdi:warehouse',
  'mdi:truck-delivery',
  'mdi:store',
  'mdi:file-document',
  'mdi:cog',
  'mdi:bell',
  'ant-design:appstore-outlined',
  'ant-design:team-outlined',
  'ant-design:shopping-outlined',
  'ant-design:profile-outlined',
  'ic:baseline-assessment',
];

async function search() {
  const q = keyword.value.trim();
  if (!q) {
    icons.value = commonIcons;
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(q)}&limit=40`);
    const data = await res.json();
    icons.value = (data.icons || []).slice(0, 60);
  } catch {
    // fallback: filter locally
    icons.value = commonIcons.filter(i => i.includes(q));
  } finally {
    loading.value = false;
  }
}

function open() {
  visible.value = true;
  keyword.value = '';
  search();
}

function select(icon: string) {
  model.value = icon;
  visible.value = false;
}

watch(visible, () => {
  if (!visible.value) keyword.value = '';
});
</script>

<template>
  <div class="icon-picker-trigger" @click="open">
    <div v-if="model" class="flex items-center gap-2">
      <Icon :icon="model" class="text-20px" />
      <span class="text-sm text-gray-600">{{ model }}</span>
    </div>
    <span v-else class="text-sm text-gray-400">点击选择图标</span>
    <Icon icon="mdi:chevron-down" class="text-16px text-gray-400" />
  </div>

  <AModal v-model:open="visible" title="选择图标" width="1300px" :footer="null">
    <div class="mb-4">
      <AInput v-model:value="keyword" placeholder="搜索图标..." @press-enter="search" @input="search" allow-clear>
        <template #prefix><Icon icon="carbon:search" /></template>
      </AInput>
    </div>
    <div v-if="model" class="mb-3 flex items-center gap-2 text-sm text-gray-500">
      当前：<Icon :icon="model" class="text-20px" /><span>{{ model }}</span>
      <AButton type="link" size="small" danger @click="model = ''">清除</AButton>
    </div>
    <div v-if="loading" class="flex justify-center py-12">
      <ASpin />
    </div>
    <div v-else class="icon-grid max-h-600px overflow-y-auto">
      <div
        v-for="icon in icons"
        :key="icon"
        class="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-300 transition-all"
        :class="{ 'border-blue-400 bg-blue-50': model === icon }"
        @click="select(icon)"
      >
        <Icon :icon="icon" class="text-28px" />
        <span class="text-10px text-gray-500 text-center truncate w-full">{{ icon.split(':')[1] || icon }}</span>
      </div>
      <div v-if="icons.length === 0 && !loading" class="col-span-full text-center py-8 text-gray-400">
        没有找到图标
      </div>
    </div>
  </AModal>
</template>

<style scoped>
.icon-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s;
}
.icon-picker-trigger:hover {
  border-color: #4096ff;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}
</style>
