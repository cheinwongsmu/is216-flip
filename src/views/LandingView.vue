<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* ── tsParticles config ── */
const particlesConfig = {
  background: {
    color: "transparent",
  },
  fpsLimit: 60,
  particles: {
    number: {
      value: 50,
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.2,
    },
    size: {
      value: { min: 1, max: 5 },
    },
    links: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: false,
      straight: false,
      outModes: "out",
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 100,
      },
    },
  },
}

/* ── Demo flip card ── */
const demoCards = { q: 'What does HTML stand for?', a: 'HyperText Markup Language' }
const isFlipped = ref(false)

/* ── Feature showcase ── */
const features = [
  {
    icon: '🃏', title: '3D Flip Cards',
    description: 'Smooth CSS 3D animations turn every answer reveal into a satisfying moment. Study feels less like work.',
    bullets: ['Real CSS rotateY flip effect', 'Click card to reveal answer', 'Shuffle order any time'],
  },
  {
    icon: '📊', title: 'Progress Tracking',
    description: "See exactly how far you've come. Every deck shows a live mastery percentage so you know where to focus.",
    bullets: ['Per-deck mastery percentage', 'Known vs. still-learning split', 'Visual progress bars throughout'],
  },
  {
    icon: '🗂️', title: 'Deck Library',
    description: 'Organise cards into unlimited decks by subject. Search and filter your whole library in real time.',
    bullets: ['HTML, CSS, JS, Vue & more', 'Real-time search + filter', 'Create unlimited decks'],
  },
]

const activeIndex = ref(0)
const isShowcasePaused = ref(false)
const cycleDuration = 5000
let showcaseTimer = null

function advanceShowcase() {
  if (!isShowcasePaused.value) activeIndex.value = (activeIndex.value + 1) % features.length
}
function pauseShowcase() { isShowcasePaused.value = true }
function resumeShowcase() { isShowcasePaused.value = false }

onMounted(() => {
  showcaseTimer = setInterval(advanceShowcase, cycleDuration)
})
onUnmounted(() => {
  clearInterval(showcaseTimer)
})
</script>

<template>
  <div class="page d-flex flex-column">
    <!-- tsParticles background -->
    <vue-particles id="tsparticles" :options="particlesConfig" class="particles-bg" />

    <!-- Top bar -->
    <header class="topbar d-flex justify-content-between align-items-center px-3 py-3">
      <div class="brand d-flex align-items-center gap-2">
        <img src="/logo.gif" alt="FLIP logo" class="brand-logo" />
        <span>FLIP</span>
      </div>
      <nav class="d-flex align-items-center gap-2">
        <router-link to="/login" class="btn-nav" data-testid="login-link">Log In</router-link>
        <router-link to="/register" class="btn-nav btn-nav-fill">Sign Up</router-link>
      </nav>
    </header>

    <!-- Main split layout -->
    <main class="main-content container-fluid flex-grow-1">
      <div class="h-100 px-0 row">
        <!-- LEFT: Hero -->
        <section
          class="col-12 col-lg-5 d-flex flex-column align-items-center align-items-lg-start justify-content-lg-center text-center text-lg-start px-3 px-sm-4 px-lg-5 py-4 py-lg-3 gap-3">
          <h1 data-testid="header-text" class="hero-title">
            Study smarter,<br />
            <span class="accent">one flip at a time.</span>
          </h1>

          <p class="hero-sub">
            Create flashcard decks, quiz yourself with smooth 3D flips entirely in your browser.
          </p>

          <div class="d-flex gap-3 align-items-center justify-content-center justify-content-lg-start mb-3">
            <router-link to="/register" class="cta-btn-primary">Sign Up</router-link>
            <router-link to="/login" class="cta-btn-ghost">Log In →</router-link>
          </div>

          <!-- Auto-flip demo card -->
          <div class="demo-scene" @mouseenter="isFlipped = true" @mouseleave="isFlipped = false">
            <div class="demo-inner" :class="{ flipped: isFlipped }">
              <div class="demo-face demo-front">
                <span class="face-label">Question</span>
                <p>{{ demoCards.q }}</p>
                <span class="flip-hint" v-if="!isFlipped">hover to reveal…</span>
              </div>
              <div class="demo-face demo-back">
                <span class="face-label">Answer</span>
                <p>{{ demoCards.a }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="border-top d-lg-none"></div>
        <!-- RIGHT: Feature showcase -->

        <section class="col-12 col-lg-7 d-flex flex-column position-relative px-3 px-sm-4 px-lg-5 py-4 py-lg-3"
          @mouseenter="pauseShowcase" @mouseleave="resumeShowcase">

          <!-- Spotlight -->
          <div class="d-flex flex-column justify-content-lg-center flex-lg-fill">
            <Transition mode="out-in">
              <div :key="activeIndex" class="d-flex flex-column gap-3 w-100">
                <div class="glow-icon-wrap">
                  <div class="glow-ring"></div>
                  <div class="glow-icon">{{ features[activeIndex].icon }}</div>
                </div>
                <h3 class="spotlight-title">{{ features[activeIndex].title }}</h3>
                <p class="spotlight-desc">{{ features[activeIndex].description }}</p>
                <ul class="bullet-card d-flex flex-column gap-2">
                  <li v-for="b in features[activeIndex].bullets" :key="b" class="d-flex align-items-center gap-2">
                    <span>✓</span>{{ b }}
                  </li>
                </ul>
              </div>
            </Transition>
            <!-- Timer bar -->
            <div class="timer-track mt-4">
              <div :key="activeIndex" class="timer-fill" :class="{ paused: isShowcasePaused }"
                :style="{ animationDuration: cycleDuration + 'ms' }"></div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Mobile-only footer -->
    <footer class="mobile-footer d-lg-none text-center">
      FLIP — Flashcard Learning Interactive Platform · Built with Vue 3
    </footer>
  </div>
</template>

<style scoped>
.page {
  background: #070C18;
  color: #F1F5F9;
  height: 100dvh;
  overflow-y: auto;
}

/* ── tsParticles layer ── */
.particles-bg {
  position: fixed;
}

/* ── Topbar ── */
.topbar {
  height: 60px;
  position: relative;
  border-bottom: 1px solid #32353d;
  background: #070C18;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #F1F5F9;
}

.brand-logo {
  width: 40px;
  height: 40px;
}

.btn-nav {
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
}

.btn-nav:hover {
  color: #F1F5F9;
  background: #f1f5f90f;
}

.btn-nav-fill {
  background: #2563EB;
  color: #fff;
  font-weight: 500;
}

.btn-nav-fill:hover {
  background: #1D4ED8;
}

/* ── Main content ── */
.main-content {
  position: relative;
}

/* ── Hero section ── */
.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.5;
  margin: 0;
  color: #F1F5F9;
}

.accent {
  color: #60a5f4;
}

.hero-sub {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #d7e6f4;
  margin-bottom: 1.2em;
  max-width: 380px;
  width: 100%;
}

.cta-btn-primary {
  background: #2563EB;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  font-weight: 500;
}

.cta-btn-primary:hover {
  background: #1D4ED8;
  color: #fff;
}

.cta-btn-ghost {
  color: #e2e8f0ba;
  text-decoration: none;
  font-weight: 500;
}

.cta-btn-ghost:hover {
  color: #F1F5F9;
}

/* ── Demo card ── */
.demo-scene {
  width: 100%;
  max-width: 300px;
  height: 120px;
}

.demo-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s;
}

.demo-inner.flipped {
  transform: rotateY(180deg);
}

.demo-face {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  text-align: center;
  padding: 1.25rem 1.25rem;
  backface-visibility: hidden;
}

.demo-front {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.demo-back {
  background: #1e40af;
  color: #fff;
  transform: rotateY(180deg);
}

.face-label {
  font-size: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.5;
}

.flip-hint {
  font-size: 0.5rem;
  opacity: 0.3;
  font-style: italic;
}

/* ── Showcase section ── */
/* Glowing icon */
.glow-icon-wrap {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid #1383f4;
  animation: ringPulse 2.8s ease-in-out infinite;
}

@keyframes ringPulse {

  0%,
  100% {
    opacity: 0.55;
    transform: scale(1);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.06);
  }
}

.glow-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #1384f43a;
  border: 1px solid #1383f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.spotlight-title {
  font-weight: 500;
  margin: 0;
  color: #F1F5F9;
}

.spotlight-desc {
  color: #e3ecf998;
}

/* Bullet card — clean glass style, no loud borders */
.bullet-card {
  padding: 1rem 1rem;
  background: #f4f7ff1e;
  border: 1px solid #f4f7ff1e;
  border-left: 2px solid #1383f4;
  border-radius: 10px;

}

.bullet-card li {
  font-size: 0.8rem;
  color: #e5eefba8;
}

/* ── Timer bar ── */
.timer-track {
  height: 3px;
  background: #fdfcfc0f;
  border-radius: 100px;
}

.timer-fill {
  height: 100%;
  background: #1383f4;
  border-radius: 100px;
  animation: timerFill linear forwards;
}

.timer-fill.paused {
  animation-play-state: paused;
}

@keyframes timerFill {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

/* ── Mobile footer ── */
.mobile-footer {
  padding: 1.25rem;
  font-size: 0.5rem;
  color: #f7f9fc4b;
}
</style>
