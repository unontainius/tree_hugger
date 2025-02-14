<!-- src/lib/components/SkillItem.svelte -->
<script lang="ts">
	let { name, icon, percentage } = $props();
</script>

<div class="column item">
	<div class="row">
		<div class="column">
			<img src={icon} alt={name} />
		</div>
		<div class="column text">
			<span>{name}</span>
			<span class="percentage">{percentage}%</span>
		</div>
		<div class="column">
			<div class="circle" style="--percentage: {percentage};"></div>
		</div>
	</div>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		min-width: 110px;
		max-height: 40px;
		margin: 0;
		border-radius: 1rem;
	}
	.column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0;
	}
	.column img {
		width: 60px;
	}

	.item {
		width: 200px;
		display: flex;
		justify-content: space-between;
		align-items: space-between;
		padding: 0.5rem 1rem;
		background: transparent;
		border-radius: 3rem;
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
		border: 1px solid #c5c5c5;
		margin: 0.5rem;
		padding: 0.5rem;
		padding-inline-start: 0;
	}
	.text {
		padding-inline: 0.5rem;
		text-shadow: 0 0 10px #000000;
		width: 100px;
	}
	.circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: conic-gradient(#012f3d calc(var(--percentage) * 1%), rgb(123, 237, 252) 0);
		position: relative;
		width: 40px;
	}

	.percentage {
		color: #021f2b;
		font-size: 1rem;
		font-weight: 800;
		margin-inline-start: 0.7rem;
		text-shadow: none;
	}
</style>
