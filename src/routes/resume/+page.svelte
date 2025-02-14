<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
	import About from '$lib/components/resume/About.svelte';
	import Experience from '$lib/components/resume/Experience.svelte';
	import Skills from '$lib/components/resume/Skills.svelte';

	let expandedSidebar = $state(false);
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
		</div>
	</div>
	<!-- CONTENT --------------------------------------------------------------------------------->
	<div class="content scroll-container snap-container">
		<div id="section1" class="section snap-child">
			<div class="section-overlay">
				<div class="box">
					<b> </b>
					<b2></b2>
					<div id="section-content-1" class="section-content welcome-content">
						<h1>Welcome</h1>
						<p class="intro-text">
							Scroll down to explore my journey, or use the navigation menu to jump to specific
							sections.
						</p>
					</div>
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
			<MIcon name="projects" size="5.5rem" color="black" />
			<h2>Projects</h2>
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
		overflow-y: auto;
		padding: 0.5rem;
		z-index: 3;
		height: 100vh;
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
		opacity: 0.75;
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
		overflow: hidden;
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
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.9);
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
	}
	#section3 {
		--s: 185px; /* control the size*/
		--c1: #9bd9fd;
		--c2: #ffffff;

		--_g: #54b6f800 90deg, var(--c1) 0;
		background: conic-gradient(from 90deg at 2px 2px, var(--_g)),
			conic-gradient(from 90deg at 1px 1px, var(--_g)), var(--c2);
		background-size:
			var(--s) var(--s),
			calc(var(--s) / 5) calc(var(--s) / 5);
	}
	#section4 {
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

	.box b {
		display: block;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow:
			inset -5px -5px 5px rgba(0, 0, 0, 0.6),
			15px 15px 2px rgba(0, 0, 0, 0.04);
		background-image: url('/images/familytree.png');
		background-size: cover;
		background-position: center;
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
			moveX 12s linear 0s infinite alternate,
			moveY 13.4s linear 0s infinite alternate;
	}

	.box b2 {
		display: block;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow:
			inset -5px -5px 5px rgba(0, 0, 0, 0.6),
			15px 15px 2px rgba(0, 0, 0, 0.04);
		background-image: url('/images/familytree.png');
		background-size: cover;
		background-position: center;
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
			moveX 6s linear 0s infinite alternate,
			moveY 6.4s linear 0s infinite alternate;
	}

	@-webkit-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 170px);
		}
	}
	@-moz-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 170px);
		}
	}
	@-o-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 170px);
		}
	}
	@keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: calc(100vw - 170px);
		}
	}

	@-webkit-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 90px);
		}
	}
	@-moz-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 90px);
		}
	}
	@-o-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 90px);
		}
	}
	@keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: calc(100vh - 90px);
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
		.box b {
			width: 100px;
			height: 100px;
		}
		.box b2 {
			width: 100px;
			height: 100px;
		}
	}
</style>
