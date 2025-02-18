<script lang="ts">
	import { user, loginRequestedState } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import MIcon from '$lib/components/common/MIcon.svelte';
	import About from '$lib/components/resume/About.svelte';
	import Experience from '$lib/components/resume/Experience.svelte';
	import Skills from '$lib/components/resume/Skills.svelte';
	import Projects from '$lib/components/resume/Projects.svelte';
	import RotatingEarth from '$lib/components/RotatingEarth.svelte';

	let expandedSidebar = $state(false);


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
</script>

<div class="flex-row">
	<div class={`sidebar scroll-container ${expandedSidebar ? 'expanded' : 'collapsed'}`}>
		<button class="sidebar-toggle" onclick={() => (expandedSidebar = !expandedSidebar)}>
			<MIcon name={expandedSidebar ? 'left' : 'right'} size="1.5rem" color="white" />
		</button>
		<div class="sidebar-content">
			<a href="/">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Home">
					<MIcon name="home" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Home</span>
			</a>
			<a href="#section1">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Home">
					<MIcon name="top" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Top</span>
			</a>
			<a href="#section2">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="About">
					<MIcon name="info" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>About</span>
			</a>
			<a href="#section3">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Experience">
					<MIcon name="experience" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}
					>Skills & Expertise</span
				>
			</a>
			<a href="#section4">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Education">
					<MIcon name="education" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Experience</span>
			</a>

			<a href="#section6">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Projects">
					<MIcon name="projects" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Projects</span>
			</a>
			<a href="#section7">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Contact">
					<MIcon name="contact" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Contact</span>
			</a>

			<div class="sidebar-spacer"></div>

			<button class="sidebar-link" onclick={toggleLogin}>
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Login/Logout">
					{#if $user}
						<MIcon name="logout" size="3rem" color="white" />
					{:else}
						<MIcon name="login" size="3rem" color="white" />
					{/if}
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>
					{#if $user}
						Logout
					{:else}
						Login
					{/if}
				</span>
			</button>


		</div>

	</div>
	<!-- CONTENT --------------------------------------------------------------------------------->
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

	.section-content h1 {
		margin: 0;
		font-size: 3rem;
		text-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 1);
		font-weight: 900;
		font-family: 'poppins', Courier, monospace;
		color: white;
	}
	.hidden {
		display: none;
	}

	.flex-row {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding-inline: 0.5rem;
	}

	.sidebar {
		background-color: rgb(1, 97, 134);
		width: 200px;
		flex: none;
		padding: 0.5rem;
		z-index: 3;
		transition: width 0.2s ease-in-out;
	}
	.sidebar.collapsed {
		width: 64px;
		min-width: 64px;
	}
	.sidebar button {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0;
		margin: 0;
		width: 48px;
		height: 48px;
		box-shadow: none;
	}
	.sidebar a {
		color: white;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-block: 0.5rem;
		transition: all 0.2s ease-in-out;
	}

	.sidebar a:hover {
		background-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-5px);
	}

	.content {
		background-color: rgb(236, 237, 238);
		flex: 1;
		height: calc(100vh);
		overflow-y: auto;
		scroll-behavior: smooth;
		scroll-snap-type: y mandatory;
		padding: 0;
		margin: 0;
		margin-left: 0.25rem;

		position: relative;
		z-index: 2;
		isolation: isolate;
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

	.red {
		background-color: #f00;
		color: #000;
	}
	.green {
		background-color: #0f0;
		color: #000;
	}
	.blue {
		background-color: #00f;
		color: #000;
	}
	.dark {
		background-color: #000;
		color: #fff;
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

	.sidebar-toggle {
		width: 48px;
		height: 48px;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 0.25rem;
		color: white;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.sidebar-content {
		display: flex;
		flex-direction: column;
		min-height: calc(100vh - 4rem); /* Account for padding and toggle button */
	}

	.sidebar.collapsed .sidebar-content {
		display: flex;
	}

	.sidebar-text {
		transition: opacity 0.2s ease-in-out;
		opacity: 0.9;
	}

	.sidebar.collapsed .sidebar-text {
		opacity: 0;
		width: 0;
		overflow: hidden;
	}

	.narrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		min-width: 48px;
		flex-shrink: 0;
	}

	.sidebar.collapsed .narrow {
		width: 48px;
		height: 48px;
	}

	.sidebar a {
		color: white;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
		padding-left: 0;
		border-radius: 0.5rem;
		margin-block: 0.5rem;
		transition: all 0.2s ease-in-out;
	}

	.sidebar.collapsed a {
		justify-content: center;
		margin-block: 1rem;
		padding: 0.5rem;
	}

	.intro-text {
		font-size: 2.5rem;
		color: rgb(244, 248, 1);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		margin-top: 1rem;
	}

	.label {
		font-weight: bold;
	}

	.stats-container {
		width: 100%;
		padding-top: 2rem;
		border-top: 1px solid rgba(1, 61, 85, 0.1);
	}

	.quick-facts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		text-align: center;
		justify-content: space-around;
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
		.personal-info {
			width: 100%;
			position: static;
			float: none;
			margin: 1rem 0;
			min-width: 100%;
		}

		.info-row-container {
			gap: 1rem;
		}
		.sidebar.collapsed {
			display: none;
		}
		.info-col {
			width: 100%;
		}
		.box {
			width: 100%;
			height: 100vh;
		}
	
		.box b4 {
			width: 140px;
			height: 140px;
		}
		
	}

	/* HTML: <div class="tooltip">This is the same as #7 but with another shape for the tail </div> */
.tooltip {
  color: #fff;
  font-size: 18px;
  max-width: 78ch;
  text-align: center;
  z-index: 100;
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

.sidebar-footer {
	margin-top: auto;
	padding: 1rem;
}

.sidebar-link {
	color: white;
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.5rem;
	border-radius: 0.5rem;
	transition: all 0.2s ease-in-out;
	background: transparent;
	border: none;
	width: 100%;
	cursor: pointer;
}

.sidebar-link:hover {
	background-color: rgba(255, 255, 255, 0.1);
	transform: translateY(-5px);
}

.sidebar-spacer {
	margin-top: auto;
	min-height: 0.5rem; /* Smaller spacing */
}

</style>
