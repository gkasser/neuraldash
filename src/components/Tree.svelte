<script lang="ts">
	import { json } from '@sveltejs/kit';
	import Conv2D from './Conv2D.svelte';
	import Input from './Input.svelte';

	export let tree;

	const registry = {
		input: Input,
		conv2d: Conv2D
	};
	console.log(tree);
</script>

<div class="tree">
	<svelte:component this={registry[tree['type']]}>
		{#each tree['children'] as child}
			<svelte:self tree={child} />
		{/each}
	</svelte:component>
</div>

<style>
	.tree {
		flex-grow: 1;
	}
</style>
