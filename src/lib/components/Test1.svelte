<script lang="ts">
	const { backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16) } = $props<{
		backgroundColor?: string;
	}>();
</script>

<div class="test-content" style="background-color: {backgroundColor}">
	<h3>Test Component</h3>
	<p>This is a test component with random background color.</p>
	<p>Background color: {backgroundColor}</p>
</div>

<style>
	.test-content {
		padding: 20px;
		height: 100%;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}
</style>
