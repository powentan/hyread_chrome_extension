<template>
    <el-dialog
      :model-value="isShow"
      :title="title"
      width="50%"
    >
        <div v-html="whatsNewContent"></div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">關閉</el-button>
            <el-button type="primary" @click="handleCloseAndDisable">
            知道了
            </el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
defineProps(['title', 'isShow']);
const emit = defineEmits(['close-dialog', 'disable-whats-new']);
import MarkdownIt from "markdown-it";
import contentBody from "@/options/whatsNew/0_4_5";

const markdown = MarkdownIt();
const whatsNewContent = markdown.render(contentBody);

function handleCloseAndDisable() {
    emit('close-dialog');
    emit('disable-whats-new');
}

function handleClose() {
    emit('close-dialog');
}
</script>