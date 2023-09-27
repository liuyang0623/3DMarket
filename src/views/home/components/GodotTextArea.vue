<template>
  <div class="editor-textarea">
    <textarea class="editor-text"  />
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped>
.editor-textarea {
  width: 19em;
  height: 6em;
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 999;
}
.editor-text {
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: none;
}
</style>
