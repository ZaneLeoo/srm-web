<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, menuTypeOptions } from '@/constants/business';
import { fetchCreateMenu, fetchGetAllMenus, fetchUpdateMenu } from '@/service/api';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';
import IconPicker from '@/components/common/IconPicker.vue';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = AntDesign.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, resetFields } = useAntdForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  'parentId' | 'type' | 'name' | 'title' | 'path' | 'component' | 'icon' | 'permission' | 'sort' | 'status'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    parentId: 0,
    type: 1,
    name: '',
    title: '',
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 0,
    status: 1
  };
}

type RuleKey = Extract<keyof Model, 'name' | 'title' | 'type' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  title: defaultRequiredRule,
  type: defaultRequiredRule,
  status: defaultRequiredRule
};

const parentOptions = ref<CommonType.Option<number>[]>([]);

async function getParentOptions() {
  const { error, data } = await fetchGetAllMenus();

  if (!error) {
    // Only show directories (type=1) as parent options
    parentOptions.value = data.filter(m => m.type === 1).map(m => ({ label: m.title, value: m.id }));
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'addChild' && props.rowData) {
    model.value.parentId = props.rowData.id;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  if (props.operateType === 'add' || props.operateType === 'addChild') {
    await fetchCreateMenu(model.value);
  } else if (props.operateType === 'edit' && props.rowData) {
    await fetchUpdateMenu(props.rowData.id, model.value);
  }

  window.$message?.success($t('common.updateSuccess'));
  closeModal();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    resetFields();
    getParentOptions();
  }
});
</script>

<template>
  <AModal v-model:open="visible" :title="title" width="560px">
    <AForm ref="formRef" :model="model" :rules="rules" :label-col="{ span: 6 }" class="pr-20px">
      <AFormItem :label="$t('page.manage.menu.parentId')" name="parentId">
        <ASelect
          v-model:value="model.parentId"
          :options="parentOptions"
          :placeholder="$t('page.manage.menu.form.parentId')"
          clearable
        />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.menuType')" name="type">
        <ARadioGroup v-model:value="model.type">
          <ARadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
            {{ $t(item.label as any) }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.menuName')" name="title">
        <AInput v-model:value="model.title" :placeholder="$t('page.manage.menu.form.menuName')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.routeName')" name="name">
        <AInput v-model:value="model.name" :placeholder="$t('page.manage.menu.form.routeName')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.routePath')" name="path">
        <AInput v-model:value="model.path" :placeholder="$t('page.manage.menu.form.routePath')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.component')" name="component">
        <AInput v-model:value="model.component" :placeholder="$t('page.manage.menu.form.component')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.permission')" name="permission">
        <AInput v-model:value="model.permission" :placeholder="$t('page.manage.menu.form.permission')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.icon')" name="icon">
        <IconPicker v-model="model.icon" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.order')" name="sort">
        <AInputNumber v-model:value="model.sort" class="w-full" :placeholder="$t('page.manage.menu.form.order')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.menu.menuStatus')" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
            {{ $t(item.label as any) }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
    </AForm>
    <template #footer>
      <ASpace justify="end" :size="16">
        <AButton @click="closeModal">{{ $t('common.cancel') }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</AButton>
      </ASpace>
    </template>
  </AModal>
</template>

<style scoped></style>
