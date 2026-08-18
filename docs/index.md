---
title: 验证码预览器
---

<script setup>
import CaptchaPreview from './components/CaptchaPreview.vue'
</script>

<div class="ippure-orb ippure-orb-1"></div>
<div class="ippure-orb ippure-orb-2"></div>

# 验证码预览器

<template>
  <CaptchaPreview />
</template>

<style>
.ippure-orb-1 {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 219, 235, 0.3), transparent 70%);
  filter: blur(100px);
  top: -100px;
  left: -100px;
  z-index: 0;
  pointer-events: none;
}

.ippure-orb-2 {
  position: fixed;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 219, 235, 0.2), transparent 70%);
  filter: blur(100px);
  bottom: -80px;
  right: -80px;
  z-index: 0;
  pointer-events: none;
}
</style>
