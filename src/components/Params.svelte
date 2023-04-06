<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { pendingBlock } from './layerApi';
	import { activeBlock, graphApi } from './state';

	let firstParam: HTMLElement;

	const addNewBlock = () => {
		const newBlock = get(pendingBlock);
		if (newBlock) {
			graphApi.addLayerAfterCurrent(newBlock);
			activeBlock.set({ position: 'search' });
		} else {
			console.error('No block to add');
		}
	};

	onMount(() => {
		activeBlock.subscribe((s) => {
			if (s.position == 'params' && $pendingBlock && Object.keys($pendingBlock).length) {
				firstParam.focus();
			}
		});
	});

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.code == 'Escape') {
			activeBlock.update(() => {
				return {
					position: 'search'
				};
			});
		} else if (e.code == 'Enter') {
			addNewBlock();
		}
	};

	$: params = $pendingBlock ? $pendingBlock.params : [];

	$: selectedIndex = 0;

	const select = (idx: number) => {
		selectedIndex = idx;
		console.log(params[idx]);
	};
</script>

<div class="params_bar" class:visible={$activeBlock.position == 'params'} on:keyup={onKeyUp}>
	{#each params as param, i}
		<label for={param.name}>{param.name}</label>
		{#if i == 0}
			<input
				on:focus={() => select(i)}
				bind:this={firstParam}
				bind:value={param.value}
				tabindex={i + 1}
				id={param.name}
			/>
		{:else}
			<input on:focus={() => select(i)} bind:value={$pendingBlock} tabindex={i + 1} />
		{/if}
	{/each}
	<div>
		{params[selectedIndex]?.doc}
	</div>
</div>

<style>
	.params_bar {
		background-color: var(--bg-100);
		padding: 15px;
		border: solid 1px #ccc;
		border-radius: 7px;
		position: fixed;
		left: 270px;
		right: 15px;
		bottom: 15px;
		z-index: 10;
		display: none;
	}

	.visible {
		display: block;
	}
</style>
