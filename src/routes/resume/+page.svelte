<script lang="ts">
	import { user, loginRequestedState } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import MIcon from '$lib/components/common/MIcon.svelte';
	import About from '$lib/components/resume/About.svelte';
	import Experience from '$lib/components/resume/Experience.svelte';
	import Skills from '$lib/components/resume/Skills.svelte';
	import Projects from '$lib/components/resume/Projects.svelte';
	import RotatingEarth from '$lib/components/RotatingEarth.svelte';
	import { onMount } from 'svelte';

	let expandedSidebar = $state(false);
	let showBackToTop = $state(false);

	onMount(() => {
		const handleScroll = () => {
			// Get the viewport height
			const viewportHeight = window.innerHeight;
			// Show button when scrolled more than viewport height
			showBackToTop = window.scrollY > viewportHeight / 2;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function handleLogout() {
		if ($user) {
			await authService.logout();
			loginRequestedState.set(false);
		}
	}

	function toggleLogin() {
		if ($user) {
			handleLogout();
		} else {
			loginRequestedState.set(true);
		}
	}

	function handleNavClick(event: MouseEvent) {
		event.preventDefault();  // Prevent default anchor behavior
		expandedSidebar = false;

		// Get the href from the clicked anchor
		const href = (event.currentTarget as HTMLAnchorElement).getAttribute('href');
		if (href && href.startsWith('#')) {
			const targetId = href.substring(1);
			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else if (href === '/') {
			// Handle home link normally
			window.location.href = href;
		}
	}
</script>

<div class="flex-col">
	<nav class="top-nav">
		<div class="nav-content">
			<div class="nav-item">
				<a href="/" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="home" size="2rem" color="white" />
					</div>
					<span class="nav-text">Home</span>
				</a>
			</div>
			<div class="nav-item">
				<a href="#section2" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="info" size="2rem" color="white" />
					</div>
					<span class="nav-text">About</span>
				</a>
			</div>
			<div class="nav-item">
				<a href="#section3" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="experience" size="2rem" color="white" />
					</div>
					<span class="nav-text">Skills & Expertise</span>
				</a>
			</div>
			<div class="nav-item">
				<a href="#section4" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="education" size="2rem" color="white" />
					</div>
					<span class="nav-text">Experience</span>
				</a>
			</div>
			<div class="nav-item">
				<a href="#section6" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="projects" size="2rem" color="white" />
					</div>
					<span class="nav-text">Projects</span>
				</a>
			</div>
			<div class="nav-item">
				<a href="#section7" onclick={handleNavClick}>
					<div class="icon-container">
						<MIcon name="contact" size="2rem" color="white" />
					</div>
					<span class="nav-text">Contact</span>
				</a>
			</div>
		</div>
	</nav>

	{#if showBackToTop}
		<button class="back-to-top" onclick={scrollToTop}>
			<MIcon name="top" size="24px" color="white" />
		</button>
	{/if}

	<div class="content scroll-container snap-container">
		<div id="section1" class="section snap-child">
			<div class="section-overlay">
				<div class="box">

					<div id="section-content-1" class="section-content welcome-content">
						<h1>Welcome</h1>
						<div class="tooltip">
							<p class="intro-text">
								Scroll down to explore my journey, or use the navigation menu to jump to specific
								sections.
							</p>
						</div>
					</div>
					<b4>
						<RotatingEarth />
					</b4>
				</div>
			</div>
		</div>

		<div id="section2" class="section snap-child">
			<About />
		</div>

		<div id="section3" class="section snap-child">
			<Skills />
		</div>

		<div id="section4" class="section snap-child">
			<Experience />
		</div>
		<div id="section6" class="section snap-child" title="Projects">
			<Projects />
		</div>
		<div id="section7" class="section snap-child" title="Contact">
			<MIcon name="contact" size="5.5rem" color="black" />
			<h2>Contact</h2>
		</div>
	</div>
</div>

<style>

	.top-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgb(1, 97, 134);
		z-index: 3;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.nav-item a {
		color: white;
		text-decoration: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.2s ease-in-out;
		white-space: nowrap;
	}

	.nav-text {
		color: rgba(255, 255, 255, 0.678);
	}

	@media (max-width: 768px) {
		.nav-content {
			justify-content: space-around;
			padding: 0.25rem;
			flex-wrap: wrap;
		}

		.nav-item a {
			flex-direction: column;
			align-items: center;
			padding: 0.5rem;
			gap: 0.1rem;
		}

		.icon-container {
			margin-bottom: 0.1rem;
		}

		.nav-text {
			font-size: 0.7rem;
		}

		.tooltip {
			width: 80%;
		}

		.intro-text {
			text-align: center;
			font-size: 1.5rem;
		}

		.box {
			width: 100%;
			height: 100vh;
		}

		.box b4 {
			width: 90px;
			height: 90px;
		}

		#section2 {
			padding: 0.25rem;
		}

		.back-to-top {
			bottom: 1rem;
			right: 1rem;
			width: 2.5rem;
			height: 2.5rem;
		}
	}

	.content {
		margin-top: 64px;
		flex: 1;
		overflow-y: auto;
	}

	.section-content h1 {
		margin: 0;
		font-size: 3rem;
		text-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 1);
		font-weight: 900;
		font-family: 'poppins', Courier, monospace;
		color: white;
	}

	.section {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh);
		width: 100%;
	}

	.section-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: black;
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		height: 100%;
	}

	.section-content h1 {
		margin: 0;
		font-size: 5rem;
		text-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 1);
	}

	:global(.wave-container) {
		display: none !important;
	}
	.section-overlay {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 100%;
		height: calc(100vh);
		background-image: url('/images/code.avif');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		background-attachment: fixed; /* This creates the parallax effect */
		background-color: rgba(255, 255, 255, 0.5);
		color: white;
		/* border-radius: 0.5rem; */
		margin: 0;
	}

	.intro-text {
		font-size: 2.5rem;
		color: rgb(244, 248, 1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		margin-top: 1rem;
	}

	#section2 {
		background-color: #3d3d3d;
		/* background-color:linear-gradient(to bottom, rgba(203, 238, 7, 0.507), rgba(22, 22, 22, 0.836)); */
	}
	#section3 {
	--s: 179px; /* control the size*/
	--c1: #b2b2b2;
	--c2: #ffffff;
	--c3: #d9d9d9;
	
	--_g: var(--c3) 0 120deg,#0000 0;
	background:
		conic-gradient(from -60deg at 50% calc(100%/3),var(--_g)),
		conic-gradient(from 120deg at 50% calc(200%/3),var(--_g)),
		conic-gradient(from  60deg at calc(200%/3),var(--c3) 60deg,var(--c2) 0 120deg,#0000 0),
		conic-gradient(from 180deg at calc(100%/3),var(--c1) 60deg,var(--_g)),
		linear-gradient(90deg,var(--c1)   calc(100%/6),var(--c2) 0 50%,
							var(--c1) 0 calc(500%/6),var(--c2) 0);
		background-size: calc(1.732*var(--s)) var(--s);
	}
	#section4 {
		background-color: #3d3d3d;
	}
	#section6 {
		background-color: #ececec;
	}

	#section7 {
		background-color: #3d3d3d;
	}

	.box {
		margin: 0 auto;
		width: 100vw;
		height: 100vh;
		position: relative;
		z-index: 800;
		border: 1px solid #111;
		overflow: hidden;
	}

	/* Earth */
	.box b4 {
		display: block;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow:
			inset -5px -5px 5px rgba(0, 0, 0, 0.6),
			15px 15px 2px rgba(0, 0, 0, 0.04);
		background-image: url('/images/planets/moon.jpg');
		background-size: cover;
		background-position: center;
		z-index: 1010;
		position: absolute;
		-webkit-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		-moz-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		-o-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		animation:
			moveX 9s linear 0s infinite alternate,
			moveY 9.4s linear 0s infinite alternate;

	}
	@-webkit-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 270px);
		}
	}
	@-moz-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 270px);
		}
	}
	@-o-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 270px);
		}
	}
	@keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 390px);
		}
	}

	@-webkit-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 290px);
		}
	}
	@-moz-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 290px);
		}
	}
	@-o-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 290px);
		}
	}
	@keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 320px);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {

		.box {
			width: 100%;
			height: 100vh;
		}
	
		.box b4 {
			width: 140px;
			height: 140px;
		}
		
	}


.tooltip {
  color: #fff;
  font-size: 18px;
  max-width: 78ch;
  text-align: center;
  z-index: 2000;
}
.tooltip {
	/* tail dimension */
	--b: 3em;   /* base */
	--h: 1.8em; /* height */
	--t: .6;    /* thickness (from 0 to 1) */

	--p: 50%;  /* main position (0%:top 100%:bottom) */
	--r: 1.2em; /* the radius */


	padding: 1em;
	border-radius: var(--r)/min(var(--r),var(--p) - (1 - var(--t))*var(--b)/2) var(--r) var(--r) min(var(--r),100% - var(--p) - (1 - var(--t))*var(--b)/2);
	background: #eb6841; /* the main color */
	position: relative;
}
.tooltip:before {
	content: "";
	position: absolute;
	right: 100%;
	top: clamp(-1*var(--t)*var(--b),var(--p) - (var(--t) + 1)*var(--b)/2,100% - var(--b));
	width: var(--h);
	height: var(--b);
	background: inherit;
	border-bottom-left-radius: 100%;
	mask: radial-gradient(105% calc(var(--t)*100%) at 100% 0,#0000 99%,#000 101%);
	-webkit-mask: radial-gradient(105% calc(var(--t)*100%) at 100% 0,#0000 99%,#000 101%);
}


@media (max-width: 768px) {
	.tooltip {
		width: 80%;

	}
	.intro-text {
		text-align: center;
		font-size: 1.5rem;

	}
	.box b4 {
		width: 90px;
		height: 90px;
	}
	#section2  {
		padding:0.25rem;
	}

}

@media (max-width: 768px) {
	.nav-content {
		flex-wrap: wrap;
	}
}

.back-to-top {
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	background-color: rgb(1, 97, 134);
	color: white;
	border: none;
	border-radius: 50%;
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	transition: all 0.2s ease-in-out;
	z-index: 9999;
	padding: 0;
}

.back-to-top:hover {
	transform: translateY(-2px);
	background-color: rgb(2, 116, 160);
}

@media (max-width: 768px) {
	.back-to-top {
		bottom: 1rem;
		right: 1rem;
	}

}
</style>
