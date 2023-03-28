<script lang="ts">
	import { onMount } from 'svelte';
	import layers from '../layers.json';
	import { state, activeBlock, position } from './state';
	const all_keys = Object.keys(layers).map((key) => [key.toLowerCase(), key]);
	$: searchText = '';
	$: filtered = all_keys.filter(
		(entry) => !searchText || entry[0].indexOf(searchText.toLowerCase()) >= 0
	);
	$: selectedIndex = 0;

	let searchBar: HTMLInputElement;

	let desc = '';

	onMount(() => {
		activeBlock.subscribe((a) => {
			if (a.position == 'search') {
				searchBar.focus();
			}
			desc += a.position + '\n';
		});
	});

	const addElement = (idx: number) => {
		selectedIndex = idx;
		if (filtered.length > selectedIndex) {
			activeBlock.set({ position: 'params' });
			state.update((s) => {
				s.tree.inputs.push({
					type: filtered[selectedIndex][1],
					params: {},
					inputs: []
				});
				return s;
			});
		}
	};

	function onKeyUp(e: KeyboardEvent) {
		switch (e.code) {
			case 'ArrowUp':
				selectedIndex--;
				break;

			case 'ArrowDown':
				selectedIndex++;
				break;

			case 'Escape':
				activeBlock.set({ position: 'navigation' });
				break;

			case 'Enter':
				addElement(selectedIndex);
		}
		selectedIndex = Math.max(Math.min(selectedIndex, filtered.length), 0);
	}
</script>

<div class="panel" on:focus={() => activeBlock.set({ position: 'search' })}>
	{desc}
	<input
		class="searchbar"
		bind:this={searchBar}
		bind:value={searchText}
		on:keyup={onKeyUp}
		on:click={() => activeBlock.set({ position: 'search' })}
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
