<script lang="ts">
	import { onMount } from 'svelte';
	import { activeBlock } from './state';

	export let params: Array<any>;
	let firstParam: HTMLElement;

	const addNewBlock = () => {
		activeBlock.set('search');
	};

	onMount(() => {
		activeBlock.subscribe((s) => {
			if (s == 'params') {
				firstParam.focus();
				params[0] = 'FUCKING FIOCUSDS';
			}
		});
	});

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.code == 'Escape') {
			activeBlock.set('search');
		} else if (e.code == 'Enter') {
			addNewBlock();
		}
	};
</script>

<div class="params_bar" on:keyup={onKeyUp}>
	<!-- close -->
	{#each params as param, i}
		<label for={param}>{param}</label>
		{#if i == 0}
			<input bind:this={firstParam} bind:value={params[i]} tabindex={i + 1} id={param} />
		{:else}
			<input bind:value={params[i]} tabindex={i + 1} id={param} />
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
	}
</style>
