<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions } from '@/constants/business';
import { fetchCreateUser, fetchGetAllRoles, fetchUpdateUser } from '@/service/api';
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: AntDesign.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
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
  const titles: Record<AntDesign.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.User, 'username' | 'nickname' | 'phone' | 'email' | 'roleIds' | 'status'> & {
  password: string;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    username: '',
    password: '',
    nickname: '',
    phone: '',
    email: '',
    roleIds: [],
    status: 1
  };
}

type RuleKey = Extract<keyof Model, 'username' | 'password' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  username: defaultRequiredRule,
  password: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
const roleOptions = ref<CommonType.Option<number>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    roleOptions.value = data.map((item: { id: number; name: string }) => ({
      label: item.name,
      value: item.id
    }));
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const { password, ...userData } = model.value;

  if (props.operateType === 'add') {
    await fetchCreateUser({ ...userData, password });
    window.$message?.success($t('common.addSuccess'));
  } else if (props.operateType === 'edit' && props.rowData) {
    await fetchUpdateUser(props.rowData.id, userData);
    window.$message?.success($t('common.updateSuccess'));
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    resetFields();
    getRoleOptions();
  }
});
</script>

<template>
  <ADrawer v-model:open="visible" :title="title" :width="360">
    <AForm ref="formRef" layout="vertical" :model="model" :rules="rules">
      <AFormItem :label="$t('page.manage.user.userName')" name="username">
        <AInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.userName')" />
      </AFormItem>
      <AFormItem v-if="operateType === 'add'" :label="$t('page.manage.user.form.password')" name="password">
        <AInput v-model:value="model.password" type="password" :placeholder="$t('page.manage.user.form.password')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.user.nickName')" name="nickname">
        <AInput v-model:value="model.nickname" :placeholder="$t('page.manage.user.form.nickName')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.user.userPhone')" name="phone">
        <AInput v-model:value="model.phone" :placeholder="$t('page.manage.user.form.userPhone')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.user.userEmail')" name="email">
        <AInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
      </AFormItem>
      <AFormItem :label="$t('page.manage.user.userStatus')" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="Number(item.value)">
            {{ $t(item.label) }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="$t('page.manage.user.userRole')" name="roleIds">
        <ASelect
          v-model:value="model.roleIds"
          mode="multiple"
          :options="roleOptions"
          :placeholder="$t('page.manage.user.form.userRole')"
        />
      </AFormItem>
    </AForm>
    <template #footer>
      <ASpace :size="16">
        <AButton @click="closeDrawer">{{ $t('common.cancel') }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</AButton>
      </ASpace>
    </template>
  </ADrawer>
</template>

<style scoped></style>
