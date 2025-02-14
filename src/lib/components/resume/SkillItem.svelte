<!-- src/lib/components/SkillItem.svelte -->
<script lang="ts">
	let {name, icon, percentage} = $props();
</script>
<div class="column item">
	<div class="row">
		<div class="column image">
			<img src={icon} alt={name}/>
		</div>
		<div class="row p2 transparent">
			<span>{name}</span>
			<span class="percentage">{percentage}%</span>
		</div>
		<div class="column percentage">
							
		</div>
		<div class="column">
			<div class="circle" style="--percentage: {percentage};">

			</div>
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
		margin:0;
		border-radius: 1rem;
		background: rgba(11, 43, 56, 0.05);
	}
	.p2 {
		padding-inline-start: 0.5rem;
		justify-content: space-between;
		background: transparent;
	}
	.column {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		margin:0;
	}
	.image {

		width: 60px;

		background: conic-gradient(
			#027eaf calc(var(--percentage) * 1%),
			#e0e0e0 0
		);
	}
	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 1rem;
	}
	.item {
		width: 240px;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 0.5rem 1rem;
		background: transparent;
		border-radius: 3rem;
		margin: 0.5rem;
		padding:0;
	}

	.circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: conic-gradient(
			#DDEDAA calc(var(--percentage) * 1%),
			#D7816A 0
		);
		position: relative;
		width: 40px;

	}

	.percentage {
		color: #021f2b ;
		font-size:1rem;
		font-weight: 800;
		margin-inline-start: 0.7rem;

	}
</style>