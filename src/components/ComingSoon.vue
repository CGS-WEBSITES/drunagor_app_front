<template>
  <div class="coming-soon-container">
    <div class="loader">
      <v-icon class="icon" size="x-large">mdi-hammer</v-icon>
      <v-icon class="icon">mdi-hand-saw</v-icon>
      <v-icon class="icon">mdi-excavator</v-icon>
    </div>
    <p>Coming Soon.</p>
    <p>Stay tuned!</p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.coming-soon-container {
  text-align: center;
}

.loader {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.loader .icon {
  font-size: 2rem;
  animation: bounce 1.5s infinite ease-in-out;
}

.loader .icon:nth-child(2) {
  animation-delay: 0.2s;
}

.loader .icon:nth-child(3) {
  animation-delay: 0.4s;
}

.message {
  font-size: 1.5rem;
  color: #495057;
}

/* Keyframes for bouncing animation */
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
}
</style>