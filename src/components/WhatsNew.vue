<template>
    <el-dialog
      :model-value="isShow"
      :title="title"
      width="35%"
      top="5vh"
    >
        <div v-html="whatsNewContent"></div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">關閉</el-button>
            <el-button type="primary" @click="handleCloseAndDisable">
            不要再跳出
            </el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
defineProps(['title', 'isShow']);
const emit = defineEmits(['close-dialog', 'disable-whats-new']);
import MarkdownIt from "markdown-it";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import contentBody from "@/options/whatsNew/0_5_5";

const markdown = new MarkdownIt({
    html: true,
}).use(MarkdownItHighlightjs, {inline: true});
const whatsNewContent = markdown.render(contentBody);

function handleCloseAndDisable() {
    emit('close-dialog');
    emit('disable-whats-new');
}

function handleClose() {
    emit('close-dialog');
}
</script>