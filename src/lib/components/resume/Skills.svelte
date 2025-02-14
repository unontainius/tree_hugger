<script lang="ts">
	import RadioButtons from '$lib/components/common/RadioButtons.svelte';
	import SkillItem from '$lib/components/resume/SkillItem.svelte';

	let currentSkill = $state('VB.NET');
	let skillSortOptions = $state([
		{ label: 'Name', value: 'name' },
		{ label: 'Proficiency', value: 'percentage' },
		{ label: 'Category', value: 'category' }
	]);

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
</script>

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
				<RadioButtons
					options={skillSortOptions}
					currentValue={currentSkill}
					onChange={handleSkillSortChange}
				/>
			</div>
			<div class="tech-skills">
				{#each skills as { name, icon, percentage }}
					<SkillItem {name} {icon} {percentage} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	h2 {
		color: #1a1a1a;
		font-size: 3rem;
		font-weight: 600;
		text-align: center;
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
	.skills-grid {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 2rem;
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
		background-color: #828e9b;
		color: rgb(238, 236, 236);
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
		padding-block-start: 1rem;
	}
	.skills-technical {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		width: 100%;
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
		color: rgb(238, 238, 238);
		padding-block: 2rem;
		border-bottom-left-radius: 1.5rem;
		border-bottom-right-radius: 1.5rem;
		background-color: #828e9b;
	}
	.sort-group {
		display: flex;
		background-color: #133b54;
		margin: 0;
		padding: 0;
		width: 100%;
		border-top-left-radius: 1.5rem;
		border-top-right-radius: 1.5rem;
	}
	.sort-group h3 {
		color: white;
		margin: 0;
		padding-inline: 1rem;
		padding-block: 1.2rem;
		border: none;
	}
</style>
