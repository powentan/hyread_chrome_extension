<template>
  <el-container>
    <el-header><h1>HyRead圖書匯出設定頁面</h1></el-header>
    <el-main>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="匯出設定" name="exportingConfig">
          <el-row >
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

          <el-row v-if="settings.exportDefault === 'readwise'" >
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

          <el-row v-else-if="settings.exportDefault === 'file'" >
            <el-col :span="2">匯出目錄</el-col>
            <el-col :span="6">
              <el-input v-model="settings.fileExport.folder" placeholder="Chrome預設下載目錄之子目錄" />
            </el-col>
          </el-row>

          <el-row >
            <el-col :span="2">匯出標題前綴</el-col>
            <el-col :span="6">
              <el-input v-model="settings.annotation.titlePrefix" placeholder="EX: [筆記] 我的書名" />
            </el-col>
          </el-row>

          <el-row >
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

          <template v-for="color in annotationColors" v-if="settings.fileExport.format === 'annotation-color'">
            <el-row>
              <el-col :span="2">{{ color.label }}</el-col>
              <el-col :span="6">
                <el-input v-model="settings.fileExport.colorMap[color.key as keyof AnnotationColor]" :placeholder="color.label" />
              </el-col>
            </el-row>
          </template>

        </el-tab-pane>

        <!-- <el-tab-pane label="匯出格式" name="export_format">
        </el-tab-pane> -->

      </el-tabs>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="handleSaveSettings">儲存設定</el-button>
    </el-footer>

    <el-dialog
      v-model="showWhatsNew"
      title="Tips"
      width="30%"
    >
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showWhatsNew= false">關閉</el-button>
          <el-button type="primary" @click="showWhatsNew = false">
            知道了
          </el-button>
        </span>
      </template>
    </el-dialog>

  </el-container>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
import type { TabsPaneContext } from 'element-plus';
import { ExtensionSettings, defaultExtensionSettings } from '@/domain/model/settings';
import { ExportingType, FormatType } from '@/domain/repo/exporting';
import ExtensionSettingsManager from "@/infra/adapter/extension_settings";
import { AnnotationColor } from '@/domain/model/settings';

let settings: ExtensionSettings = reactive(defaultExtensionSettings);
let showWhatsNew = ref(false);

let activeName = 'exportingConfig';
const exportOptions = [
  {
    label: '檔案',
    value: ExportingType.File,
  },
  {
    label: 'readwise reader',
    value: ExportingType.Readwise,
  },
];
const fileExportFormats = [
    {
      label: '預設格式',
      value: FormatType.default,
    },
    {
      label: '類HyRead格式',
      value: FormatType.hyRead,
    },
    {
      label: 'HQ&A',
      value: FormatType.hqa,
    },
    {
      label: '畫線顏色',
      value: FormatType.color,
    },
];
const annotationColors = [
    {
      label: '顏色1(藍色)',
      key: 'color1',
    },
    {
      label: '顏色2(紅色)',
      key: 'color2',
    },
    {
      label: '顏色3(黃色)',
      key: 'color3',
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
      position: 'top-left',
    });
  });
}

onBeforeMount(async () => {
  let _settings: ExtensionSettings = await settingsManager.get();
  console.log(_settings);
  Object.assign(settings, _settings);

  const version = chrome.runtime.getManifest().version;
  // show what's new page if it is a new version
  // showWhatsNew = ref(_settings.version !== version);
  showWhatsNew.value = true;
});
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  font-size: 14px;
  align-items: center;
  display: inline-flex;
  margin-right: 10px;
}
</style>
