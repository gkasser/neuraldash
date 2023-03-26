<script lang="ts">
	import layers from '../layers.json';
	const all_keys = Object.keys(layers).map((key) => [key.toLowerCase(), key]);
	$: searched = '';
	$: filtered = all_keys.filter(
		(entry) => !searched || entry[0].indexOf(searched.toLowerCase()) >= 0
	);
	$: selected_index = 0;

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
		}
		selected_index = Math.max(Math.min(selected_index, filtered.length), 0);
	}
</script>

<div class="panel">
	<input bind:value={searched} on:keydown={onKeyDown} />
	<ul>
		{#each filtered as layer_key, i}
			{#if i == selected_index}
				<li class="selected">
					{layer_key[1]}
				</li>
			{:else}
				<li>
					{layer_key[1]}
				</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.panel {
		width: 200px;
	}

	ul {
		overflow-y: scroll;
		max-height: 80vh;
	}

	.selected {
		background-color: var(--primary-200);
		color: var(--bg-100);
	}
</style>
