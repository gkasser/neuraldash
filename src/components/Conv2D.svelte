<script>
	import NextBlock from './NextBlock.svelte';
</script>

<div class="conv2d">
	<NextBlock />
</div>
<slot />

<style>
	.conv2d {
		background-color: var(--accent-100);
		width: 50px;
		height: 100px;
		margin: 20px;
	}
</style>
