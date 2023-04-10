<script lang="ts">
	import { onMount } from 'svelte';
	import { pendingBlock } from './layerApi';
	import { activeBlock } from './state';

	let firstParam: HTMLElement;

	onMount(() => {
		activeBlock.subscribe((s) => {
			if (firstParam && s == 'params' && $pendingBlock && Object.keys($pendingBlock).length) {
				firstParam.focus();
			}
		});
	});

	$: params = $pendingBlock ? $pendingBlock.params : [];

	$: selectedIndex = 0;

	const select = (idx: number) => {
		selectedIndex = idx;
		console.log(params[idx]);
	};
</script>

<div class="params_bar" class:visible={$activeBlock == 'params'}>
	{#each params as param, i}
		<div class="param_block">
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
				<input on:focus={() => select(i)} bind:value={param.value} tabindex={i + 1} />
			{/if}
		</div>
	{/each}
	<div>
		{params[selectedIndex]?.doc}
	</div>
</div>

<style>
	.param_block {
		position: relative;
		padding: 9px;
		display: flex;
	}

	.param_block input {
		width: 130px;
		height: 25px;
	}

	.param_block label {
		position: absolute;
		top: -7px;
		left: 9px;
		font-size: smaller;
	}

	.params_bar {
		background-color: var(--bg-100);
		padding: 15px;
		flex-wrap: wrap;
		border: solid 1px #ccc;
		border-radius: 7px;
		position: fixed;
		left: 270px;
		right: 15px;
		bottom: 40px;
		z-index: 10;
		display: none;
	}

	.visible {
		display: flex;
	}
</style>
