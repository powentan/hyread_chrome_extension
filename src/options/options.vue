<template>
  <el-container>
    <el-header><h1>HyRead圖書匯出設定頁面</h1></el-header>
    <el-main>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="匯出設定" name="exportingConfig">
          <el-row :gutter="10">
            <el-col :span="2" class="w-50 m-2">預設匯出到</el-col>
            <el-col :span="6">
              <el-select v-model="settings.exportDefault" class="w-50 m-2" placeholder="Select">
                <el-option
                  v-for="item in exportOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>

          <el-row v-if="settings.exportDefault === 'readwise'" :gutter="10">
            <el-col :span="2">Access Token</el-col>
            <el-col :span="6">
              <el-input v-model="settings.readwise.accessToken" placeholder="Access Token" />
            </el-col>
            <el-col :span="3">
              <el-link href="https://readwise.io/access_token" target="_blank">
                取得Access Token<el-icon><Link /></el-icon>
              </el-link>
            </el-col>
          </el-row>

          <el-row v-else-if="settings.exportDefault === 'file'" :gutter="10">
            <el-col :span="2">匯出目錄</el-col>
            <el-col :span="6">
              <el-input v-model="settings.fileExport.folder" placeholder="Chrome預設下載目錄之子目錄" />
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="2">匯出標題前綴</el-col>
            <el-col :span="6">
              <el-input v-model="settings.annotation.titlePrefix" placeholder="EX: [筆記] 我的書名" />
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="2">匯出格式</el-col>
            <el-col :span="6">
              <el-select v-model="settings.fileExport.format" class="m-2" placeholder="匯出格式">
                <el-option 
                  v-for="item in fileExportFormats"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>

        </el-tab-pane>

        <!-- <el-tab-pane label="匯出格式" name="export_format">
        </el-tab-pane> -->

      </el-tabs>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="handleSaveSettings">儲存設定</el-button>
    </el-footer>
  </el-container>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus';
import { ExtensionSettings } from '@/domain/model/settings';
import { ExportingType, FormatType } from '@/domain/repo/exporting';
import { onBeforeMount, reactive } from 'vue';
import { ElNotification } from 'element-plus';
import ExtensionSettingsManager from "@/infra/adapter/extension_settings";

let settings: ExtensionSettings = reactive({
  exportDefault: ExportingType.File,
  readwise: {
    accessToken: '',
  },
  fileExport: {
    folder: '',
    format: FormatType.default,
  },
  annotation: {
    titlePrefix: ''
  },
});

let activeName = 'exportingConfig';
const exportOptions = [
  {
    label: '檔案',
    value: 'file',
  },
  {
    label: 'readwise reader',
    value: 'readwise',
  },
];
 const fileExportFormats = [
    {
      label: '預設格式',
      value: 'default',
    },
    {
      label: '類HyRead格式',
      value: 'hyread',
    },
    {
    label: 'HQ&A',
    value: 'hq&a',
  },
];
const settingsManager = new ExtensionSettingsManager();

function handleClick(tab: TabsPaneContext, event: Event) {
  console.log(tab, event);
}

function handleSaveSettings(event: Event) {
  console.log(event);
  console.log(settings);

  settingsManager.set(settings, () => {
    ElNotification.success({
      title: '設定儲存成功',
      // message: `settings ${JSON.stringify(settings)}`,
      position: 'top-left',
    });
  });
}

onBeforeMount(async () => {
  let _settings: ExtensionSettings = await settingsManager.get();
  console.log(_settings);
  if(_settings.exportDefault)
    settings.exportDefault = _settings.exportDefault;
  if(_settings.readwise)
    settings.readwise = _settings.readwise;
  if(_settings.fileExport)
    settings.fileExport = _settings.fileExport;
  if(_settings.annotation)
    settings.annotation = _settings.annotation;
});
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
</style>