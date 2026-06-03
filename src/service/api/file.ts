import { request } from '../request';

/** 上传文件（multipart/form-data） */
export function fetchUploadFile(file: File, module?: string, bizId?: number) {
  const formData = new FormData();
  formData.append('file', file);
  if (module) formData.append('module', module);
  if (bizId !== undefined) formData.append('bizId', String(bizId));
  return request<Api.File.FileRecord>({
    url: '/api/v1/base/files/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

/** 下载文件（返回 blob） */
export function fetchDownloadFile(id: number) {
  return request<Blob>({
    url: `/api/v1/base/files/${id}`,
    method: 'get',
    // @ts-expect-error responseType blob needed for file download
    responseType: 'blob'
  });
}

/** 删除文件 */
export function fetchDeleteFile(id: number) {
  return request<null>({
    url: `/api/v1/base/files/${id}`,
    method: 'delete'
  });
}

/** 按业务查询文件列表 */
export function fetchGetFileList(params: { module: string; bizId?: number; current?: number; size?: number }) {
  return request<Api.File.FileList>({
    url: '/api/v1/base/files',
    method: 'get',
    params
  });
}
