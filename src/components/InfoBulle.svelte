<script lang="ts">
	import { activeBlock, type panels } from './state';

	const getDoc = (p: panels) => {
		const text = {
			search:
				'Use <Enter> to add this kind of layer after the active one. <Esc> to go back to navigation. <Up> and <Down> to select in the list.',
			params:
				'Use <Tab> to navigate through parameters. <Enter> to validate current parameters. <Esc> to go back to search.',
			navigation:
				'Use <Enter> to add a node after this one. Arrow keys to navigate. <Del> to remove. <E> to edit this node.'
		}[p];

		return text;
	};

	$: currentText = getDoc($activeBlock);
	activeBlock.subscribe((position) => {
		currentText = getDoc(position);
	});
</script>

<div class="info_bulle">
	<p>{currentText}</p>
</div>

<style>
	.info_bulle {
		position: fixed;
		bottom: 5px;
		font-size: small;
	}

	.key {
		border: 2px solid;
		box-shadow: 2px 2px;
		font-size: 0.85em;
		line-height: 0.85em;
		display: inline-block;
		font-weight: 600;
		letter-spacing: 0.05em;
		padding: 3px 5px;
		white-space: nowrap;
	}
</style>
