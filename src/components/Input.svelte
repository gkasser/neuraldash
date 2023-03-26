<script>
	import NextBlock from './NextBlock.svelte';
</script>

<div class="triangle">
	<NextBlock />
</div>
<slot />

<style>
	.triangle {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 78px 67px 0 67px;
		border-color: #007bff transparent transparent transparent;
	}
</style>
