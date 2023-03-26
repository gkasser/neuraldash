<script lang="ts">
	import Conv2D from './Conv2D.svelte';
	import Input from './Input.svelte';
	import type { Block } from './state';

	export let tree: Block;

	const registry = {
		input: Input,
		conv2d: Conv2D
	};
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
