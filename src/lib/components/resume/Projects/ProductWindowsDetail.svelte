<script lang="ts">
	import ImageGallery from '$lib/components/common/ImageGallery.svelte';
	import RadioButtons from '$lib/components/common/RadioButtons.svelte';

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

	let { project }: { project: ProjectRow } = $props();

	let showDetailsGrid = $state(true);
    let viewedFolder = $state('');
	function toggleDetailsGrid(value: string) {
		showDetailsGrid = value === 'details';
	}
</script>

<div class="window-content-container">
	<div class="window-content">
		<div class="sort-group">
			<RadioButtons
				options={[
					{ label: 'Details', value: 'details' },
					{ label: 'Images', value: 'images' }
				]}
				currentValue="details"
				onChange={toggleDetailsGrid}
			/>
            {`project/${project.project_name}`}
		</div>

		{#if showDetailsGrid}
			<div class="heading">
				<div class="header-section">
					<div class="header-section-item">
						<h2 class="title">Category:</h2>
						<p>{project?.category}</p>
					</div>
					<div class="header-section-item">
						<h2 class="title">Client:</h2>
						<p>{project?.client}</p>
					</div>
					<div class="header-section-item">
						<h2 class="title">Century:</h2>
						<p>{project?.century}</p>
					</div>
				</div>
			</div>

			<div class="card-row">
				<div class="card">
					<p class="date">Overview</p>
					<div class="card-text">
						{@html project?.overview}
					</div>
				</div>
				<div class="card">
					<p class="date">Technologies Provided</p>
					<div class="card-text">
						{@html project?.technologies}
					</div>
				</div>
				<div class="card">
					<p class="date">Solution</p>
					<div class="card-text">
						{@html project?.solution}
					</div>
				</div>
			</div>
		{:else}
            {#if project?.project_name}
			    <ImageGallery 
					bucketName="project"
					path={project.project_name.replace(/\s+/g, '-')}
					canAddNewImages={true}
					bind:viewedFolder={viewedFolder}
				/>
            {/if}
		{/if}
	</div>
</div>

<style>
	.sort-group {
		display: flex;
		flex-wrap: wrap;
		background: linear-gradient(90deg, #133b54, #1a4c6b);
		justify-content: space-between;
		align-items: center;
		padding-right: 1rem;
	}
	.window-content-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		height: 100%;
		background-color: #242424;
	}

	.window-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		height: 100%;
	}

	/* .window-content h1 {
		font-size: 1.5rem;
		color: yellow;
		margin: 0;
	} */
	.window-content h2 {
		font-size: 1.2rem;
		color: #fff;
		margin: 0;
	}
	.heading {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		width: 100%;
	}
	.header-section {
		display: flex;
		flex-direction: row;
		gap: 4rem;
		background: rgba(82, 82, 82, 0.15);
		border-radius: 1rem;
		padding: 1rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
		height: 100%;
		flex-wrap: wrap;
	}
	.header-section-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: transparent;
	}
	.header-section-item h2 {
		font-size: 1.4rem;
		font-weight: 500;
		color: #f3c702;
		margin: 0;
	}
	.card-row {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		padding: 0.5rem;
		background-color: transparent;
		flex-wrap: wrap;
	}
	.card {
		background: rgba(82, 82, 82, 0.15);
		border-radius: 1rem;
		padding: 1rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		overflow: hidden;
		max-width: 31%;
		min-width: 250px;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, #50dcff, #f302f3);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}

	.card:hover::before {
		opacity: 1;
	}

	.title {
		font-size: 6.4rem;
		font-weight: 500;
		color: yellow;
		margin-bottom: 0.5rem;
		letter-spacing: 0.05em;
	}

	.date {
		font-size: 1rem;
		color: #ff00f2;
		opacity: 0.9;
		margin-bottom: 1rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #ff00f2;
	}

	.card-text {
		color: #50dcff;
		line-height: 1.7;
		font-size: 1rem;
	}
	p {
		text-align: center;
		margin-block-start: 1rem;
	}
</style>
