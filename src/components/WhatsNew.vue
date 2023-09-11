<template>
    <el-dialog
      :model-value="isShow"
      :title="title"
      width="30%"
    >
        <slot name="body"/>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="handleClose">關閉</el-button>
            <el-button type="primary" @click="handleClose">
            知道了
            </el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
defineProps(['title', 'isShow']);
const emit = defineEmits(['close-dialog']);

function handleClose() {
    emit('close-dialog');
}
</script>