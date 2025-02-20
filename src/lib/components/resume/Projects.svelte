<script lang="ts">
	import FlipCard from '$lib/components/common/FlipCard.svelte';
	import ProjectBackPageTemplate from '$lib/components/resume/Projects/ProjectBackPageTemplate.svelte';
	import Window from '../common/Window.svelte';
	import { onMount } from 'svelte';
	import supabase from '$lib/supabaseClient';
	import { user } from '$lib/stores/authStore';
    import type { User } from '$lib/services/authService';
	import ProductWindowsDetail from './Projects/ProductWindowsDetail.svelte';
	import { RemovePublicDomain } from '$lib/services/StorageBucketService';


	interface ProjectRow {
		id: number;
		created_at: string;
		category: string;
		client: string;
		century: string;
		technologies: string;
		overview: string;
		solution: string;
		project_name: string;
		img_url: string;
	}

	let showMoreDetail = $state(false);
	let projects = $state<ProjectRow[]>([]);
	let selectedProject = $state<ProjectRow | null>(null);

	function showMoreDetailHandler(project: ProjectRow) {
		selectedProject = project;
		showMoreDetail = true;
	}

	onMount(async () => {
		const { data, error } = await supabase.from('project').select('*');
		if (error) {
			console.error(error);
		} else {
			projects = data;
		}
	});

</script>

<div class="page-container">
	{#if $user && ($user.email === 'unobtainius@gmail.com' || $user.email === 'marcus@v-sys.co.nz')}
		<div class="admin-link">
			<a href="./admin/projects">Maintain Projects</a>
	    </div>
	{/if}
	<h2>Projects</h2>
	<div class="page-content">
		<div class="items-container">
			{#each projects as project (project.id)}

				{#snippet frontPage()}
					<div class="front-page">
						{#if project?.img_url}
							<img src={project.img_url} alt={RemovePublicDomain(project.img_url)} />
						{/if}
					</div>
				{/snippet}

				{#snippet backPage()}
					<ProjectBackPageTemplate {project} showMore={() => showMoreDetailHandler(project)} />
				{/snippet}

				<div class="item">
					<div class="project-name">{project.project_name}</div>
					<FlipCard {frontPage} {backPage} />
				</div>
				
			{/each}
		</div>
	</div>
</div>

{#if showMoreDetail}
	<Window
		title="Project information"
		onClose={() => (showMoreDetail = false)}
		showMinimize={false}
		showMaximize={true}
		showClose={true}
		showFooter={false}
		preset="large"
	>
		{#if selectedProject}
			<ProductWindowsDetail project={selectedProject} />
		{/if}
	</Window>
{/if}

<style>
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
	.admin-link {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 1rem;
		gap: 3rem;
	}
	.items-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.item {
		width: 300px;
		height: 300px;
		background-color: transparent;
		text-align: center;
		/* border-radius: 1rem;
		border: 1px solid #dcdddd; */
	}
	.page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;


	}
    .page-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		background-color: transparent;
		padding: 2rem;

		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 3rem;
	}
	.project-name {
		font-size: 1.5rem;
		font-weight: 500;
		color: #bf0af7;
		min-width: 100px;
		background-color: transparent;


	}


	.front-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: transparent;

	}
    .front-page img {
		margin-block-start: 1rem;
        height: 225px;
        object-fit: cover;
        border-radius: 1rem;
    }
	a {
		position: relative;
		top: 0;
		right: 0;
		color: #fff;
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: 500;
		text-transform: uppercase;
		background-color: dodgerblue;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

</style>
