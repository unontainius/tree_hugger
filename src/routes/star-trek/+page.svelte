<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    let { data }: { data: PageData } = $props();

    function engage() {
        console.log('Engage');
        goto('/');
    }
</script>

  <!-- LCARS Header -->
  <header class="lcars-header">
    <div class="federation-insignia"></div>
    <h1>STARFLEET COMMAND</h1>
    <p>United Federation of Planets - Exploration and Discovery</p>
  </header>

  <!-- Main Console Area -->
  <main class="console-grid">
    <!-- Navigation Console -->
    <div class="console-card navigation">
      <div class="lcars-panel">
        <div class="lcars-block cyan"></div>
        <div class="lcars-block orange"></div>
        <div class="lcars-block yellow"></div>
      </div>
      <h2><span class="icon">⬢</span> Navigation</h2>
      <p>Set course for new destinations across the galaxy.</p>
      <button class="console-button engage" onclick={engage}>Engage</button>
    </div>

    <!-- Tactical Console -->
    <div class="console-card tactical">
      <div class="lcars-panel">
        <div class="lcars-block cyan"></div>
        <div class="lcars-block orange"></div>
        <div class="lcars-block yellow"></div>
      </div>
      <h2><span class="icon">⚔️</span> Tactical</h2>
      <p>Monitor ship defenses and coordinate combat operations.</p>
      <button class="console-button shields">Activate Shields</button>
    </div>

    <!-- Engineering Console -->
    <div class="console-card engineering">
      <div class="lcars-panel">
        <div class="lcars-block cyan"></div>
        <div class="lcars-block orange"></div>
        <div class="lcars-block yellow"></div>
      </div>
      <h2><span class="icon">⚙️</span> Engineering</h2>
      <p>Manage warp core output and maintain ship systems.</p>
      <button class="console-button diagnostics">Check Diagnostics</button>
    </div>

    <!-- Science Console -->
    <div class="console-card science">
      <div class="lcars-panel">
        <div class="lcars-block cyan"></div>
        <div class="lcars-block orange"></div>
        <div class="lcars-block yellow"></div>
      </div>
      <h2><span class="icon">🔬</span> Science</h2>
      <p>Analyze anomalies and conduct research missions.</p>
      <button class="console-button scan">Scan Area</button>
    </div>
  </main>

  <!-- Footer with LCARS Design -->
  <footer class="lcars-footer">
    <p>&copy; 24th Century Starfleet Command</p>
    <audio id="engage-sound" src="engage.mp3"></audio>
    <audio id="shield-sound" src="shields.mp3"></audio>
    <audio id="diagnostics-sound" src="diagnostics.mp3"></audio>
    <audio id="scan-sound" src="scan.mp3"></audio>
  </footer>   



<style>
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* LCARS Header */
.lcars-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(to bottom, #000033, #000);
  border-bottom: 5px solid #00ffff;
  position: relative;
}

.federation-insignia {
  width: 100px;
  height: 100px;
  background: url('federation-logo.png') no-repeat center/contain;
  margin-bottom: 1rem;
}

.lcars-header h1 {
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
}

.lcars-header p {
  font-size: 1.2rem;
  color: #aaa;
}

/* Console Grid Layout */
.console-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  margin-inline: 1rem;
}

/* Console Card Styling */
.console-card {
  background: linear-gradient(to bottom, #111, #000);
  border: 5px solid #00ffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.console-card::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px dashed #00ffff;
  border-radius: 15px;
  z-index: -1;
}

.console-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 12px rgba(0, 255, 255, 0.4);
}

.console-card h2 {
  font-size: 1.8rem;
  color: #00ffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.console-card p {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.console-card .icon {
  font-size: 1.5rem;
}

/* LCARS Panel Styling */
.lcars-panel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.lcars-block {
  width: 30%;
  height: 20px;
  border-radius: 5px;
  animation: pulse 2s infinite alternate;
}

.lcars-block.cyan {
  background-color: #00ffff;
}

.lcars-block.orange {
  background-color: #ff9900;
}

.lcars-block.yellow {
  background-color: #ffff00;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Console Button Styling */
.console-button {
  background-color: #00ffff;
  color: #000;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-family: 'StarTrek Classic', sans-serif;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.console-button:hover {
  background-color: #00ccff;
}

/* LCARS Footer */
.lcars-footer {
  padding: 1rem;
  background: linear-gradient(to top, #000033, #000);
  border-top: 5px solid #00ffff;
  color: #aaa;
  font-size: 0.9rem;
  position: relative;
}

.lcars-footer::after {
  content: 'LCARS Interface v4.7';
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  font-size: 0.8rem;
  color: #00ffff;
}
</style>