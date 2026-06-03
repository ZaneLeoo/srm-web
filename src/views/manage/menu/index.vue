<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { Button, Popconfirm, Tag } from 'ant-design-vue';
import { useBoolean } from '@sa/hooks';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import { fetchDeleteMenu, fetchGetMenuTree } from '@/service/api';
import { $t } from '@/locales';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();

const treeData = ref<Api.SystemManage.Menu[]>([]);
const loading = ref(false);

async function getData() {
  loading.value = true;
  const { data } = await fetchGetMenuTree();
  treeData.value = data || [];
  loading.value = false;
}

const columns: any[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', align: 'center', width: 60 },
  {
    key: 'title',
    title: $t('page.manage.menu.menuName'),
    dataIndex: 'title',
    minWidth: 160
  },
  {
    key: 'type',
    title: $t('page.manage.menu.menuType'),
    dataIndex: 'type',
    align: 'center',
    width: 80,
    customRender: ({ record }: { record: Api.SystemManage.Menu }) => {
      const tagMap: Record<number, string> = { 1: 'default', 2: 'processing', 3: 'error' };
      const label = $t(menuTypeRecord[record.type] as App.I18n.I18nKey);
      return <Tag color={tagMap[record.type]}>{label}</Tag>;
    }
  },
  {
    key: 'name',
    title: $t('page.manage.menu.routeName'),
    dataIndex: 'name',
    minWidth: 120
  },
  {
    key: 'path',
    title: $t('page.manage.menu.routePath'),
    dataIndex: 'path',
    minWidth: 120
  },
  {
    key: 'permission',
    title: $t('page.manage.menu.permission'),
    dataIndex: 'permission',
    minWidth: 140
  },
  {
    key: 'icon',
    title: $t('page.manage.menu.icon'),
    dataIndex: 'icon',
    align: 'center',
    width: 80
  },
  {
    key: 'sort',
    dataIndex: 'sort',
    title: $t('page.manage.menu.order'),
    align: 'center',
    width: 60
  },
  {
    key: 'parentId',
    dataIndex: 'parentId',
    title: $t('page.manage.menu.parentId'),
    width: 60,
    align: 'center'
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: $t('page.manage.menu.menuStatus'),
    align: 'center',
    width: 80,
    customRender: ({ record }: { record: Api.SystemManage.Menu }) => {
      if (record.status === null || record.status === undefined) return null;
      const tagMap: Record<number, string> = { 1: 'success', 0: 'warning' };
      const label = $t(enableStatusRecord[record.status]);
      return <Tag color={tagMap[record.status]}>{label}</Tag>;
    }
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 200,
    customRender: ({ record }: { record: Api.SystemManage.Menu }) => (
      <div class="flex-center justify-end gap-8px">
        {record.type === 1 && (
          <Button type="primary" ghost size="small" onClick={() => handleAddChildMenu(record)}>
            {$t('page.manage.menu.addChildMenu')}
          </Button>
        )}
        <Button type="primary" ghost size="small" onClick={() => handleEdit(record)}>
          {$t('common.edit')}
        </Button>
        <Popconfirm title={$t('common.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
          <Button danger ghost size="small">
            {$t('common.delete')}
          </Button>
        </Popconfirm>
      </div>
    )
  }
];

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleDelete(id: number) {
  await fetchDeleteMenu(id);
  getData();
}

const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };
  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';
  editingData.value = { ...item };
  openModal();
}

getData();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ACard
      :title="$t('page.manage.menu.title')"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch card-wrapper sm:flex-1-hidden"
    >
      <template #extra>
        <ASpace>
          <AButton type="primary" @click="handleAdd">
            {{ $t('common.add') }}
          </AButton>
          <AButton @click="getData">
            {{ $t('common.refresh') }}
          </AButton>
        </ASpace>
      </template>
      <ATable
        :columns="columns"
        :data-source="treeData"
        :loading="loading"
        row-key="id"
        size="small"
        :default-expand-all-rows="true"
        children-column-name="children"
        class="h-full"
        :pagination="false"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </ACard>
  </div>
</template>

<style scoped></style>
