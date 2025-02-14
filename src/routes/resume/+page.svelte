<script lang="ts">
	import MIcon from '$lib/components/MIcon.svelte';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import About from '$lib/components/resume/About.svelte';
	import SkillItem from '$lib/components/resume/SkillItem.svelte';

	let expandedSidebar = $state(false);
	let currentSkill = $state('VB.NET');
	let skillSortOptions = $state([
		{ label: 'Name', value: 'name' },
		{ label: 'Proficiency', value: 'percentage' },
		{ label: 'Category', value: 'category' },
	]);

	const handleSkillChange = (value: string) => {
		currentSkill = value;
	};

	const skills = $state([
		{ name: 'VB.NET', icon: '/icons/skills/vb.svg', percentage: 99, category: 'Desktop' },
		{ name: 'C#.NET', icon: '/icons/skills/csharp.svg', percentage: 50, category: 'Desktop' },
		{ name: 'ASP.NET', icon: '/icons/skills/net.svg', percentage: 95, category: 'Desktop' },
		{ name: 'AWS', icon: '/icons/skills/aws.svg', percentage: 25, category: 'Web' },
		{ name: 'MySQL', icon: '/icons/skills/mysql.svg', percentage: 98, category: 'Database' },
		{ name: 'MariaDb', icon: '/icons/skills/mariadb.svg', percentage: 95, category: 'Database'	 },
		{ name: 'MongoDb', icon: '/icons/skills/mongo.svg', percentage: 80, category: 'Database' },
		{ name: 'MS Access', icon: '/icons/skills/msaccess.svg', percentage: 99, category: 'Desktop' },
		{ name: 'MS Office', icon: '/icons/skills/office.svg', percentage: 98, category: 'Desktop' },
		{ name: 'B4A', icon: '/icons/skills/b4a.svg', percentage: 85, category: 'Mobile' },
		{ name: 'HTML', icon: '/icons/skills/html.svg', percentage: 90, category: 'Web' },
		{ name: 'CSS', icon: '/icons/skills/css.svg', percentage: 78, category: 'Web' },
		{ name: 'JavaScript', icon: '/icons/skills/js.svg', percentage: 60, category: 'Web' },
		{ name: 'Node.js', icon: '/icons/skills/node.svg', percentage: 45, category: 'Web' },
		{ name: 'Next.js', icon: '/icons/skills/nextjs.svg', percentage: 45, category: 'Web' },
		{ name: 'AI', icon: '/icons/skills/ai.svg', percentage: 20, category: 'Technical' },
		{ name: 'Svelte', icon: '/icons/skills/svelte.svg', percentage: 85, category: 'Web' },
		{ name: 'Future', icon: '/icons/skills/future.svg', percentage: 2, category: 'Technical' }
	]);

	const handleSkillSortChange = (value: string) => {
		skills.sort((a, b) => {
			if (value === 'name') {
				return a.name.localeCompare(b.name);
			} else if (value === 'percentage') {
				return b.percentage - a.percentage;
			} else if (value === 'category') {
				return a.category.localeCompare(b.category);
			} else {
				return 0;
			}
		});
	};
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
					<MIcon name="experience" size="3rem" color="white"/>
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Skills & Expertise</span>
			</a>
			<a href="#section4">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Education">
					<MIcon name="education" size="3rem" color="white" />
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Experience</span>
			</a>

			<a href="#section6">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Projects">
					<MIcon name="projects" size="3rem" color="white"/>
				</div>
				<span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Projects</span>
			</a>
			<a href="#section7">
				<div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Contact">
					<MIcon name="contact" size="3rem" color="white"/>
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
					<b>

					</b>
					<b2></b2>
					<div id="section-content-1" class="section-content welcome-content">
						<h1>Welcome</h1>
						<p class="intro-text">Scroll down to explore my journey, or use the navigation menu to jump to specific sections.</p>
					</div>
				</div>
			</div>
		</div>
		<About />		
		<div id="section3" class="section snap-child">
			<div class="section-content skills-section">

					<h2>Skills & Expertise</h2>

				<div class="skills-grid">
					<div class="skill-category">
						<div class="skills-core">
							<div class="sort-group">
								<h3>Core Skills</h3>
							</div>
							<div class="skill-bars">
								<div class="skill-bar">
									<span class="skill-name">Adaptability</span>
									<div class="bar"><div class="fill" style="width: 100%"></div></div>
								</div>
								<div class="skill-bar">
									<span class="skill-name">Leadership</span>
									<div class="bar"><div class="fill" style="width: 85%"></div></div>
								</div>
								<div class="skill-bar">
									<span class="skill-name">Communication</span>
									<div class="bar"><div class="fill" style="width: 90%"></div></div>
								</div>
								<div class="skill-bar">
									<span class="skill-name">Expertise</span>
									<div class="bar"><div class="fill" style="width: 80%"></div></div>
								</div>
								<div class="skill-bar">
									<span class="skill-name">Problem-solving</span>
									<div class="bar"><div class="fill" style="width: 90%"></div></div>
								</div>
								<div class="skill-bar">
									<span class="skill-name">Conflict-resolution</span>
									<div class="bar"><div class="fill" style="width: 75%"></div></div>
								</div>
							</div>
						</div>
					</div>
					<div class="skills-technical">
						<div class="sort-group">
							<h3>Technical Skills</h3>
							<RadioButtons options={skillSortOptions} currentValue={currentSkill} onChange={handleSkillSortChange} />
						</div>
						<div class="tech-skills">
							{#each skills as { name, icon, percentage }}
								<SkillItem {name} {icon} {percentage} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="section4" class="section snap-child">
			<div class="section-content experience-section">
				<h2>Experience</h2>
				<div class="experience-content">
					<div class="experience-intro">
						<div class="image-container">
							<img src="/images/marcus.jpg" alt="Marcus" class="experience-image">
						</div>
						<div class="text-container">
							<p>With a solid background in Information Technology, I excel at gathering
							and shaping information into innovative solutions. Driven by a passion for delivering
							exceptional products, I am dedicated to driving success and making a positive impact in any
							organisation I collaborate with.</p>
						</div>
						<div class="text-container">
							<p>I am a dynamic and results-driven person who consistently exhibits a professional and
							approachable demeanor. I attribute my proven track record of exceeding goals and delivering
							exceptional results to my ability to build exceptional teams and leverage their individual
							strengths effectively.</p>
						</div>
					</div>

					<div class="experience-timeline">
						<div class="experience-item">
							<h3>Freelancer</h3>
							<p class="experience-date">2024 - present</p>
							<p class="experience-description">
								Project Management, Requirements Gathering, Design, General development consulting.
							</p>
						</div>
						<div class="experience-item">
							<h3>Systems and IT Development Manager</h3>
							<p class="experience-date">2010 - 2024</p>
							<p class="experience-description">
								Leading development teams and managing IT infrastructure while delivering innovative solutions.
							</p>
						</div>

						<div class="experience-item">
							<h3>Education</h3>
							<p class="experience-date">1991 - 1993</p>
							<p class="experience-description">
								National Diploma in Business Computing<br/>
								Nelson Institute of Technology, Nelson, NZ
							</p>
							<br>
							<p>Completed a three-year intensive program with specialisation in Software Development.
							During the third year, worked on modernising community organisations' paper-based systems
							to a computer system.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="section6" class="section snap-child" title="Projects" >
			<MIcon name="projects" size="5.5rem" color="black"/>
			<h2>Projects</h2>
		</div>
		<div id="section7" class="section snap-child" title="Contact" >
			<MIcon name="contact" size="5.5rem" color="black"/>
			<h2>Contact</h2>
		</div>
	</div>
</div>

<style>
	.experience-intro {

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}	
	.experience-intro .experience-image {
		width: 300px;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
	.experience-intro .text-container {
		max-width: 70ch;
		min-width: 300px;
		flex: 2;
		padding-inline: 1rem;
	}
	.experience-intro .image-container {
		flex: 1;
		justify-content: center;
		align-items: center;
		min-width: 300px;

	}
	.section-content h1 {
		margin: 0;
		font-size: 3rem;
		color: white;
	}	
	.section-content h2 {
		margin: 0;

		font-size: 2.5rem;
		color: #013d55;
		font-weight: 600;

	}
	.section-content h3 {
		margin: 0;
		font-size: 1.25rem;
		color: #013d55;
		margin-block-end: 1.5rem;
		border-bottom: 2px solid #c8c9c9;
		font-weight: 600;
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
		font-size:5rem;
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

	.experience-section {
		color: #333;
	}

	.experience-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

	.experience-intro {
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.experience-timeline {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.experience-item {
		padding: 1rem;
		background: rgba(1, 61, 85, 0.05);
		border-radius: 0.5rem;
		height: 100%;
		min-width: 220px;
	}

	.experience-date {
		color: #666;
		font-style: italic;
		margin: 0.5rem 0;
	}

	.experience-description {
		line-height: 1.6;
	}

	.sort-group {
		display: flex;
		background-color: #133b54;
		margin:0;
		padding:0;
		width:100%;
		border-top-left-radius: 1.5rem;
		border-top-right-radius: 1.5rem;
	}
	.sort-group h3 {
		color:white;
		margin:0;
		padding-inline:1rem;
		padding-block:1.2rem;
		border:none;
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



	.skill-bars {
		display: flex;
		flex-direction: row;
		justify-content: center;
		column-gap: 4rem;
		row-gap: 1rem;
		width: 100%;
		padding: 1rem;
		flex-wrap: wrap;
		border-bottom-left-radius: 1.5rem;
		border-bottom-right-radius: 1.5rem;
		border-bottom: 1px solid rgba(1, 61, 85, 0.1);
		background-color: #8291a1;
		color:rgb(238, 236, 236);
	}

	.skill-bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		min-width: 47%;
	}

	.skill-name {
		min-width: 140px;

	}

	#section3 {

		--s: 185px; /* control the size*/
		--c1: #c1c6c9;
		--c2: #ffffff;
		
		--_g: #0000 90deg,var(--c1) 0;
		background: 
			conic-gradient(from 90deg at 2px 2px,var(--_g)),
			conic-gradient(from 90deg at 1px 1px,var(--_g)),
			var(--c2);
		background-size: var(--s) var(--s), calc(var(--s)/5) calc(var(--s)/5);

	}
	#section4 {
		background-color: #133b548c;
		color:rgb(238, 236, 236);
	}
	.bar {
		flex: 3;
		background-color: rgb(81, 214, 255);
		border-radius: 0.25rem;
		overflow: hidden;
		height: 1rem; /* Ensure the bar has a height */
		min-width: 140px;

	}

	.fill {
		height: 100%;
		background-color: #04455f;
	}
	.skills-core {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-block: 1rem;

	}
	.skills-technical {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		width: 100%;
		margin-block-start: 2rem;
	}
	.tech-skills {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		row-gap: 2rem;
		width: 100%;
		border-left: 1px solid rgba(1, 61, 85, 0.1);
		border-right: 1px solid rgba(1, 61, 85, 0.1);
		border-bottom: 1px solid rgba(1, 61, 85, 0.1);
		margin-block-start: 0;
		color:rgb(238, 238, 238);
		padding-block: 2rem;
		border-bottom-left-radius: 1.5rem;
		border-bottom-right-radius: 1.5rem;
		background-color: #8291a1;
	}

	.box{

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
		box-shadow: inset -5px -5px 5px rgba(0,0,0,.6), 15px 15px 2px rgba(0,0,0,.04);
		background-image: url('/images/familytree.png');
		background-size: cover;
		background-position: center;
		position: absolute;
		-webkit-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		-moz-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		-o-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		animation: moveX 12s linear 0s infinite alternate, moveY 13.4s linear 0s infinite alternate;
	}

	.box b2 {
		display: block;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow: inset -5px -5px 5px rgba(0,0,0,.6), 15px 15px 2px rgba(0,0,0,.04);
		background-image: url('/images/familytree.png');
		background-size: cover;
		background-position: center;
		position: absolute;
		-webkit-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		-moz-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		-o-animation: moveX 2s linear 0s infinite alternate, moveY 3.4s linear 0s infinite alternate;
		animation: moveX 6s linear 0s infinite alternate, moveY 6.4s linear 0s infinite alternate;
	}

	@-webkit-keyframes moveX {
		from { left: 0; } to { left: calc(100vw - 170px); }
	}
	@-moz-keyframes moveX {
		from { left: 0; } to { left: calc(100vw - 170px); }
	}
	@-o-keyframes moveX {
		from { left: 0; } to { left: calc(100vw - 170px); }
	}
	@keyframes moveX {
		from { left: 0; } to { left: calc(100vw - 170px); }
	}

	@-webkit-keyframes moveY {
		from { top: 0; } to { top: calc(100vh - 90px); }
	}
	@-moz-keyframes moveY {
		from { top: 0; } to { top: calc(100vh - 90px); }
	}
	@-o-keyframes moveY {
		from { top: 0; } to { top: calc(100vh - 90px); }
	}
	@keyframes moveY {
		from { top: 0; } to { top: calc(100vh - 90px); }
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
			display:none;
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
