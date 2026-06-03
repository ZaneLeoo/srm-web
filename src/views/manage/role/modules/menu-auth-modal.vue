<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import { fetchAssignRoleMenus, fetchGetMenuTree, fetchGetRoleMenus } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

const tree = ref<DataNode[]>([]);

function recursiveTransform(data: Api.SystemManage.MenuTree[]): DataNode[] {
  return data.map(item => {
    const { id: key, title: label } = item;

    if (item.children) {
      return {
        key,
        title: label,
        children: recursiveTransform(item.children)
      };
    }

    return {
      key,
      title: label
    };
  });
}

async function getTree() {
  const { error, data } = await fetchGetMenuTree();

  if (!error) {
    tree.value = recursiveTransform(data);
  }
}

const checkedKeys = ref<number[]>([]);

async function getCheckedKeys() {
  const { error, data } = await fetchGetRoleMenus(props.roleId);

  if (!error) {
    checkedKeys.value = data.map(m => m.id);
  }
}

async function handleSubmit() {
  await fetchAssignRoleMenus(props.roleId, checkedKeys.value);

  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

async function init() {
  await getTree();
  await getCheckedKeys();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <AModal v-model:open="visible" :title="title" class="w-480px">
    <ATree v-model:checked-keys="checkedKeys" :tree-data="tree" checkable :height="280" class="h-280px" />
    <template #footer>
      <AButton size="small" class="mt-16px" @click="closeModal">
        {{ $t('common.cancel') }}
      </AButton>
      <AButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
    </template>
  </AModal>
</template>

<style scoped></style>
