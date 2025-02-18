<script lang="ts">
	import RadioButtons from '$lib/components/common/RadioButtons.svelte';
	import SkillItem from '$lib/components/resume/SkillItem.svelte';
	import Window from '$lib/components/common/Window.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	
	let currentSkill = $state('VB.NET');
	let skillSortOptions = $state([
		{ label: 'Name', value: 'name' },
		{ label: 'Proficiency', value: 'percentage' },
		{ label: 'Category', value: 'category' }
	]);

	let showSvelteWindow = $state(false);
	let windowPosition = $state({ x: browser ? window.innerWidth / 2 - 200 : 0, y: browser ? window.innerHeight / 2 - 150 : 0 });

	let coreSkillsElement: HTMLElement;
	let coreSkillsVisible = $state(false);

	// const handleSkillChange = (value: string) => {
	// 	currentSkill = value;
	// };

	const skills = $state([
		{ name: 'VB.NET', icon: '/icons/skills/vb.svg', percentage: 99, category: 'Desktop' },
		{ name: 'C#.NET', icon: '/icons/skills/csharp.svg', percentage: 50, category: 'Desktop' },
		{ name: 'ASP.NET', icon: '/icons/skills/net.svg', percentage: 95, category: 'Desktop' },
		{ name: 'AWS', icon: '/icons/skills/aws.svg', percentage: 25, category: 'Web' },
		{ name: 'MySQL', icon: '/icons/skills/mysql.svg', percentage: 98, category: 'Database' },
		{ name: 'MariaDb', icon: '/icons/skills/mariadb.svg', percentage: 95, category: 'Database' },
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

	function handleShowWindow() {
		windowPosition = {
			x: Math.max(50, Math.min(window.innerWidth - 400, window.innerWidth / 2 - 200)),
			y: Math.max(50, Math.min(window.innerHeight - 300, window.innerHeight / 2 - 150))
		};
		showSvelteWindow = true;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Set visibility based on intersection state
				coreSkillsVisible = entries[0].isIntersecting;
			},
			{ 
				threshold: 0.2,
				rootMargin: '50px' // Trigger slightly before element comes into view
			}
		);

		observer.observe(coreSkillsElement);

		// Cleanup on component destroy
		return () => observer.disconnect();
	});
</script>

{#if showSvelteWindow}
	<Window 
		title="Skills" 
		onClose={() => (showSvelteWindow = false)} 
		showMinimize={true}
		showMaximize={true}
		showFooter={false}
		preset="medium"
	>
		<div class="window-content">
			<div style="padding: 2rem; color: white; text-align: center;">
				<p style="font-size: 1.2rem;">You found the Svelte secret!</p>
				<p style="font-size: 1.5rem;">Nice job!</p>
				<p style="font-size: 1.7rem; color: #00ff00;">It's a Draggbale, Sizable Window!</p>
			
			</div>
		</div>
	</Window>
{/if}

<div class="section-content skills-section">
	<h2>Skills & Expertise</h2>

	<div class="skills-grid">
		<div class="skill-category">
			<div class="skills-core" bind:this={coreSkillsElement}>
				<div class="sort-group">
					<h3>Core Skills</h3>
				</div>
				<div class="skill-bars">
					<div class="skill-bar">
						<span class="skill-name">Adaptability</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '100%' : '0%'}></div>
						</div>
					</div>
					<div class="skill-bar">
						<span class="skill-name">Leadership</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '85%' : '0%'}></div>
						</div>
					</div>
					<div class="skill-bar">
						<span class="skill-name">Communication</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '90%' : '0%'}></div>
						</div>
					</div>
					<div class="skill-bar">
						<span class="skill-name">Expertise</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '80%' : '0%'}></div>
						</div>
					</div>
					<div class="skill-bar">
						<span class="skill-name">Problem-solving</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '90%' : '0%'}></div>
						</div>
					</div>
					<div class="skill-bar">
						<span class="skill-name">Conflict-resolution</span>
						<div class="bar">
							<div class="fill" style:width={coreSkillsVisible ? '75%' : '0%'}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="skills-technical">
			<div class="sort-group">
				<h3>Technical Skills</h3>
				<RadioButtons
					options={skillSortOptions}
					currentValue={currentSkill}
					onChange={handleSkillSortChange}
				/>
			</div>
			<div class="tech-skills">
				{#each skills as { name, icon, percentage }}
					<SkillItem 
						{name} 
						{icon} 
						{percentage} 
						showWindow={name === 'Svelte' ? showSvelteWindow : false}
						onShowWindow={(show) => {
							if (name === 'Svelte') showSvelteWindow = show;
						}}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.section-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 4rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 90%;
		min-height: 100vh;
	}

	h2 {
		margin: 0 0 4rem 0;
		font-size: 3.5rem;
		font-weight: 300;
		text-align: center;
		color: #1a1a1a;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		position: relative;
	}

	h2::after {
		content: '';
		position: absolute;
		bottom: -1rem;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, #50dcff, #133b54);
	}

	h3 {
		color: white;
		margin: 0;
		padding: 1.2rem;
		font-size: 1.4rem;
		font-weight: 500;
		letter-spacing: 0.1em;
	}

	.skills-grid {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		width: 100%;
	}

	.skill-category {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
	}

	.skills-core {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.sort-group {
		display: flex;
		flex-wrap: wrap;
		background: linear-gradient(90deg, #133b54, #1a4c6b);
		justify-content: space-between;
		align-items: center;
		padding-right: 1rem;
	}

	.skill-bars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		padding: 2rem;
		background: rgba(130, 142, 155, 0.95);
		backdrop-filter: blur(10px);
	}

	.skill-bar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 0.5rem;
		transition: transform 0.3s ease;
	}

	.skill-bar:hover {
		transform: translateX(5px);
	}

	.skill-name {
		min-width: 140px;
		font-size: 1.1rem;
		font-weight: 500;
		color: #fff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.bar {
		flex: 1;
		background: rgba(81, 214, 255, 0.2);
		border-radius: 0.25rem;
		overflow: hidden;
		height: 0.75rem;
		position: relative;
		min-width: 150px;
	}

	.fill {
		height: 100%;
		background: linear-gradient(90deg, #04455f, #0a6491);
		transition: width 1s ease-out;
		width: 0%;  /* Start at 0 */
	}

	.skills-technical {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
	}

	.tech-skills {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		padding: 2rem;
		background: rgba(130, 142, 155, 0.95);
		backdrop-filter: blur(10px);
	}

	.window-content {
		background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
		color: white;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 0 0 0.5rem 0.5rem;
		padding: 2rem;
		text-align: center;
	}

	@media (max-width: 1024px) {
		.section-content {
			padding: 3rem 1rem;
		}

		.skill-bars {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 2.5rem;
		}

		.skill-bars {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 1rem;
		}

		.skill-bar {
			display: grid;
			grid-template-rows: auto auto;
			padding: 1rem;
			gap: 0.75rem;
		}

		.skill-name {
			width: 100%;
			text-align: left;
		}

		.bar {
			width: 100%;
			min-width: 0;
			height: 0.75rem;
		}

		.tech-skills {
			grid-template-columns: repeat(auto-fit, 1fr);
			gap: 1rem;
			padding: 1rem;
		}
	}

	@media (max-width: 480px) {
		.section-content {
			padding: 2rem 0.25rem;
		}
		.tech-skills {
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 1rem;
		}
	}
</style>
