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

	$: keys = $pendingBlock ? $pendingBlock.params.map((p) => p.name) : [];
	$: res =
		$pendingBlock && $pendingBlock.params
			? $pendingBlock.params.map((k) => {
					return {
						[k.name]: {
							doc: k.doc,
							value: k.value,
							type: k.type
						}
					};
			  })
			: [];
</script>

<div class="params_bar" class:visible={$activeBlock.position == 'params'} on:keyup={onKeyUp}>
	{#each keys as key, i}
		<label for={key}>{key}</label>
		{#if i == 0}
			<input bind:this={firstParam} bind:value={res[key]} tabindex={i + 1} id={key} />
		{:else}
			<input bind:value={res[key]} tabindex={i + 1} id={key} />
		{/if}
	{/each}
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
