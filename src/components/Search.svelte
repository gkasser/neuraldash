<script lang="ts">
	import { onMount } from 'svelte';
	import layers from '../layers.json';
	import { NavigationAPI } from './NavigationAPI';
	import { layerApi } from './layerApi';
	import { activeBlock } from './state';
	const all_keys = Object.keys(layers).map((key) => [key.toLowerCase(), key]);
	$: searchText = '';
	$: filtered = all_keys.filter(
		(entry) => !searchText || entry[0].indexOf(searchText.toLowerCase()) >= 0
	);
	$: selectedIndex = 0;

	let searchBar: HTMLInputElement;

	onMount(() => {
		activeBlock.subscribe((a) => {
			if (a == 'search') {
				searchBar.focus();
			}
		});
	});

	const addElement = (idx: number) => {
		selectedIndex = idx;
		if (filtered.length > selectedIndex) {
			const layerName = filtered[selectedIndex][1];
			layerApi.newLayer(layerName);
			NavigationAPI.Params();
		}
	};

	function onKeyUp(e: KeyboardEvent) {
		selectedIndex = Math.max(Math.min(selectedIndex, filtered.length), 0);

		switch (e.code) {
			case 'ArrowUp':
				selectedIndex--;
				break;

			case 'ArrowDown':
				selectedIndex++;
				break;

			case 'Enter':
				addElement(selectedIndex);
		}
		selectedIndex = Math.max(Math.min(selectedIndex, filtered.length), 0);
	}
</script>

<div class="panel" on:focus={() => NavigationAPI.Search()}>
	<input
		class="searchbar"
		bind:this={searchBar}
		bind:value={searchText}
		on:keyup={onKeyUp}
		on:click={() => NavigationAPI.Search()}
	/>
	<ul>
		{#each filtered as layer_key, i}
			<li class={i == selectedIndex ? 'selected' : ''} on:click={() => addElement(i)}>
				{layer_key[1]}
			</li>
		{/each}
	</ul>
</div>

<style>
	.searchbar {
		width: 180px;
	}
	.panel {
		position: fixed;
		top: 20px;
		left: 20px;
		width: 200px;
		background-color: var(--bg-100);
		padding: 15px;
		border-radius: 7px;
		border: solid 1px #ccc;
		z-index: 10;
	}

	ul {
		overflow-y: scroll;
		height: 80vh;
		font-size: small;
		list-style-type: none;
		padding: 0;
	}

	li {
		padding: 5px;
		border-radius: 3px;
	}

	li:hover {
		color: var(--bg-100);
		background-color: var(--primary-100);
	}

	li.selected {
		background-color: var(--primary-200);
		color: var(--bg-100);
	}
</style>
