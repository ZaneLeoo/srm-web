import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<number, App.I18n.I18nKey> = {
  1: 'page.manage.common.status.enable',
  0: 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const menuTypeRecord: Record<number, string> = {
  1: 'page.manage.menu.type.directory',
  2: 'page.manage.menu.type.menu',
  3: 'page.manage.menu.type.button'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeOptions: CommonType.Option<string | number>[] = [];
