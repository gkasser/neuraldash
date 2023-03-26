<script lang="ts">
	import layers from '../layers.json';
	import { state } from './state';
	const all_keys = Object.keys(layers).map((key) => [key.toLowerCase(), key]);
	$: searched = '';
	$: filtered = all_keys.filter(
		(entry) => !searched || entry[0].indexOf(searched.toLowerCase()) >= 0
	);
	$: selected_index = 0;

	const addElement = (idx) => {
		selected_index = idx;
		state.update((s) => {
			s.tree.children.push({
				type: 'conv2d',
				params: {},
				children: []
			});
			return s;
		});
	};

	function onKeyDown(e) {
		switch (e.keyCode) {
			// up = 38
			case 38:
				selected_index--;
				break;
			// down = 40
			case 40:
				selected_index++;
				break;

			case 13:
				addElement(selected_index);
		}
		selected_index = Math.max(Math.min(selected_index, filtered.length), 0);
	}
</script>

<div class="panel">
	<input class="searchbar" bind:value={searched} on:keydown={onKeyDown} />
	<ul>
		{#each filtered as layer_key, i}
			<li class={i == selected_index ? 'selected' : ''} on:click={() => addElement(i)}>
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
