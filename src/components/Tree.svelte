<script lang="ts">
	// import Conv2D from './Conv2D.svelte';
	// import Input from './Input.svelte';
	import Layer from './Layer.svelte';
	import type { Block } from './state';

	export let tree: Block;

	const registry = {
		// Input: Input,
		// Conv2D: Conv2D,
		default: Layer
	};

	const getComponent = (type: string) => {
		if (type in registry) {
			return registry[type];
		}
		return registry.default;
	};
</script>

<div class="tree">
	<svelte:component this={getComponent(tree['type'])} type={tree['type']}>
		{#each tree['inputs'] as child}
			<svelte:self tree={child} />
		{/each}
	</svelte:component>
</div>

<style>
	.tree {
		flex-grow: 1;
	}
</style>
