<template>
  <div class="community-builds">
    <h1>Community Builds</h1>

    <div class="button-container">
      <a
        href="https://jcarlosorte.github.io/drunagor-turn-tracker/"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        Drunagor Turn Tracker
      </a>
      <a
        href="https://valkrad.com/initiative/"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
      >
        Valkrad Initiative
      </a>
    </div>
  </div>
</template>

<style scoped>
.community-builds {
  text-align: center;
  padding: 2rem;
}

.button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.5rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #2f45f5;
  color: #ffffff;
}
.btn-primary:hover {
  background-color: #1e30c8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #705cff;
  color: #ffffff;
}
.btn-secondary:hover {
  background-color: #584acc;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
