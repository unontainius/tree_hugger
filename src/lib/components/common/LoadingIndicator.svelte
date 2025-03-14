<script>
  import { loading, loadingMessage } from '$lib/stores/loadingStore';
</script>

{#if $loading}
  <div class="loading-overlay">
    <div id="container">
      <div id="ring"></div>
      <div id="ring"></div>
      <div id="ring"></div>
      <div id="ring"></div>
      <div id="h3">{$loadingMessage}</div>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  #container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

#h3 {
  margin-top: 220px;
  color: white;
}

#ring {
  width: 190px;
  height: 190px;
  border: 1px solid transparent;
  border-radius: 50%;
  position: absolute;
}

#ring:nth-child(1) {
  border-bottom: 8px solid rgb(255, 141, 249);
  animation: rotate1 2s linear infinite;
}

@keyframes rotate1 {
  from {
    transform: rotateX(50deg) rotateZ(110deg);
  }

  to {
    transform: rotateX(50deg) rotateZ(470deg);
  }
}

#ring:nth-child(2) {
  border-bottom: 8px solid rgb(255,65,106);
  animation: rotate2 2s linear infinite;
}

@keyframes rotate2 {
  from {
    transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg);
  }

  to {
    transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg);
  }
}

#ring:nth-child(3) {
  border-bottom: 8px solid rgb(0,255,255);
  animation: rotate3 2s linear infinite;
}

@keyframes rotate3 {
  from {
    transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg);
  }

  to {
    transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg);
  }
}

#ring:nth-child(4) {
  border-bottom: 8px solid rgb(252, 183, 55);
  animation: rotate4 2s linear infinite;
}

@keyframes rotate4 {
  from {
    transform: rotateX(70deg) rotateZ(270deg);
  }

  to {
    transform: rotateX(70deg) rotateZ(630deg);
  }
}
</style> 