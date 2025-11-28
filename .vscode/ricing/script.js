document.addEventListener('DOMContentLoaded', () => {
	let commandDialog = null;
	let styleObserver = null;

	// Observe the whole document once for the quick-input-widget to appear
	const rootObserver = new MutationObserver(() => {
		if (!commandDialog) {
			commandDialog = document.querySelector('.quick-input-widget');

			if (commandDialog) {
				attachStyleObserver(commandDialog);
				rootObserver.disconnect(); // stop observing the whole DOM
			}
		}
	});

	rootObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});

	/** Watches the .quick-input-widget for display changes */
	function attachStyleObserver(el) {
		styleObserver = new MutationObserver(() => {
			const isHidden = el.style.display === 'none';
			if (isHidden) handleEscape();
			else runMyScript();
		});

		styleObserver.observe(el, {
			attributes: true,
			attributeFilter: ['style'],
		});
	}

	// Key binding: Cmd/Ctrl+P opens menu, Esc closes it
	document.addEventListener(
		'keydown',
		(event) => {
			const key = event.key.toLowerCase();

			// Cmd/Ctrl + P → run script
			if ((event.metaKey || event.ctrlKey) && key === 'p') {
				event.preventDefault();
				// Slight delay because VSCode injects dialog a few ms later
				setTimeout(runMyScript, 30);
				return;
			}

			// Escape → remove blur
			if (key === 'escape' || key === 'esc') {
				event.preventDefault();
				handleEscape();
			}
		},
		true
	);

	/** Creates the blur overlay */
	function runMyScript() {
		const target = document.querySelector('.monaco-workbench');
		if (!target) return;

		// prevent duplicate overlays
		let blur = document.getElementById('command-blur');
		if (blur) return;

		blur = document.createElement('div');
		blur.id = 'command-blur';

		blur.addEventListener('click', () => blur.remove());
		target.appendChild(blur);
	}

	/** Removes blur overlay */
	function handleEscape() {
		const blur = document.getElementById('command-blur');
		if (blur) blur.remove();
	}
});
