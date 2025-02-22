<script lang="ts">
	import MIcon from "$lib/components/common/MIcon.svelte";


</script>

<div class="content">
	<div class="row ">
		<div class="header ">
			<MIcon name="info" size="64px" color="black"/>
			<div class="header-text">
				<h1> About</h1>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-start">
			<div class="quote">
				&#x201F;My intention is to keep developing this site with more and more features as I think
				of them, or as the users, you, suggest them to me.&#x201D;
			</div>

			<div class="other-end">
				&#x201F;I'd like to add the ability to add pictures and stories to individuals. A quick
				"show me birthdays" or "show me anniversaries" could be a nice features too.&#x201D;
			</div>
			<div class="footer">
				<div class="signed">Marcus 😉</div>
			</div>
		</div>
	</div>
</div>

<style>

	/* Alternative simpler version */

	h1 {
		font-size: 4rem;
		font-weight: 600;
		color: rgb(255, 255, 255);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.945);
	}

	.quote {
		font-size: 1.5rem;
		font-weight: 300;
		color: rgba(17, 17, 17, 0.801);
		max-width: 50ch;
		border-radius: 8px;
		border-left: 8px solid rgba(3, 140, 253, 0.623);
		padding: 1rem;
		margin: 2rem;
		margin-block-end: 0.5rem;
	}
	.other-end {
		font-size: 1.5rem;
		font-weight: 300;
		color: rgba(17, 17, 17, 0.801);
		max-width: 50ch;
		border-radius: 8px;
		border-left: 0;
		border-right: 8px solid rgba(3, 140, 253, 0.623);
		padding: 1rem;
		margin: 2rem;
		margin-block:0.5rem;
	}
	.content {
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-block-start: 4rem;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		width: 100vw;
		padding: 0;
		margin-block-start: 4rem;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	.col-start {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		gap: 1.5rem;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}
	.signed {
		color: rgba(255, 255, 255, 0.608);
		max-width: 50ch;
		width: 150px;
		text-align: center;
		background-color: rgba(27, 27, 27, 0.911);
		border-radius: 8px;
		padding: 0.5rem;
		justify-self: flex-end;
		margin: 1rem;
		margin-inline-end:3rem;
	}
	@media (max-width: 768px) {
		.content {
			margin-block-start: 2rem;
			height: 100%;
		}
	}
</style>
