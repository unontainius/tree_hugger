<script lang="ts">
	import MIcon from './common/MIcon.svelte';
	// Props
	let {
		show = false,
		accountId = '',
		accountName = '',
		currentWeek = 1,
		onClose = () => {},
		onApply = (data: any) => {}
	} = $props();

	console.log('BudgetAgent component initialized with show =', show);
	console.log('accountId =', accountId);
	console.log('accountName =', accountName);

	// Define types for our component
	type WeekDistribution = {
		week: number;
		dateRange: string;
		amount: number;
	};

	// State variables
	let amount = $state('');
	let dueDate = $state(new Date().toISOString().split('T')[0]);
	let frequency = $state('monthly');
	let startFromCurrentWeek = $state(true);
	let enableCatchup = $state(false);
	let weeklyDistribution = $state<WeekDistribution[]>([]);
	let errors = $state({ amount: '', dueDate: '' });
	let isValid = $derived(!errors.amount && !errors.dueDate);

	// Frequency options
	const frequencyOptions = [
		{ value: 'weekly', label: 'Weekly', divisor: 1 },
		{ value: 'fortnightly', label: 'Fortnightly (every 2 weeks)', divisor: 2 },
		{ value: 'monthly', label: 'Monthly (every 4 weeks)', divisor: 4.33 },
		{ value: 'quarterly', label: 'Quarterly (every 13 weeks)', divisor: 13 },
		{ value: 'annually', label: 'Annually (every 52 weeks)', divisor: 52 }
	];

	// Get the divisor for the selected frequency
	const getFrequencyDivisor = (): number => {
		const option = frequencyOptions.find((opt) => opt.value === frequency);
		return option ? option.divisor : 1;
	};

	// Calculate weekly distribution
	function calculateDistribution(): void {
		// Validate inputs
		validateInputs();
		if (!isValid) return;

		const numericAmount = parseFloat(amount);
		const divisor = getFrequencyDivisor();
		const weeklyAmount = numericAmount / divisor;

		// Determine start week
		const startWeek = startFromCurrentWeek ? currentWeek : 1;
		const weeksInYear = 52;
		const remainingWeeks = weeksInYear - startWeek + 1;

		// Initialize distribution array with zeros
		const distribution = Array(weeksInYear).fill(0);

		if (enableCatchup && startFromCurrentWeek) {
			// Calculate missed payments
			const missedWeeks = startWeek - 1;
			const missedAmount = weeklyAmount * missedWeeks;

			// Distribute missed amount across remaining weeks
			const catchupPerWeek = missedAmount / remainingWeeks;
			const adjustedWeeklyAmount = weeklyAmount + catchupPerWeek;

			// Fill in the distribution array
			for (let i = startWeek - 1; i < weeksInYear; i++) {
				distribution[i] = adjustedWeeklyAmount;
			}
		} else {
			// Standard distribution without catchup
			if (frequency === 'weekly') {
				// Simple weekly distribution
				for (let i = startWeek - 1; i < weeksInYear; i++) {
					distribution[i] = weeklyAmount;
				}
			} else {
				// For non-weekly frequencies, concentrate around due date
				const dueDateObj = new Date(dueDate);
				const dueWeek = getWeekNumber(dueDateObj);

				// Distribute based on frequency and due date
				distributeByFrequency(distribution, weeklyAmount, startWeek, dueWeek);
			}
		}

		// Format the distribution for display
		weeklyDistribution = distribution.map((amount, index) => ({
			week: index + 1,
			dateRange: getWeekDateRange(index + 1),
			amount: parseFloat(amount.toFixed(2))
		}));
	}

	// Distribute amounts based on frequency and due date
	function distributeByFrequency(
		distribution: number[],
		weeklyAmount: number,
		startWeek: number,
		dueWeek: number
	): void {
		const weeksInYear = 52;

		switch (frequency) {
			case 'fortnightly':
				// Every two weeks
				for (let i = startWeek - 1; i < weeksInYear; i += 2) {
					distribution[i] = weeklyAmount * 2;
				}
				break;

			case 'monthly':
				// Concentrate around weeks that align with the due date
				for (let i = 0; i < weeksInYear; i++) {
					if ((i + 1) % 4 === dueWeek % 4) {
						if (i + 1 >= startWeek) {
							distribution[i] = weeklyAmount * 4.33;
						}
					}
				}
				break;

			case 'quarterly':
				// Every 13 weeks
				for (let i = dueWeek - 1; i < weeksInYear; i += 13) {
					if (i + 1 >= startWeek) {
						distribution[i] = weeklyAmount * 13;
					}
				}
				break;

			case 'annually':
				// Once a year on the due week
				if (dueWeek >= startWeek) {
					distribution[dueWeek - 1] = weeklyAmount * 52;
				}
				break;
		}
	}

	// Get week number from date
	function getWeekNumber(date: Date): number {
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}

	// Get date range for a week
	function getWeekDateRange(weekNum: number): string {
		const year = new Date().getFullYear();
		const firstDayOfYear = new Date(year, 0, 1);
		const dayOffset = firstDayOfYear.getDay(); // 0 = Sunday, 1 = Monday, etc.

		// Calculate the date of the first day of the week
		const firstDayOfWeek = new Date(year, 0, (weekNum - 1) * 7 + 1 - dayOffset);

		// Calculate the date of the last day of the week
		const lastDayOfWeek = new Date(firstDayOfWeek);
		lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

		// Format dates as MM/DD
		const formatDate = (date: Date): string => {
			const month = date.getMonth() + 1;
			const day = date.getDate();
			return `${month}/${day}`;
		};

		return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
	}

	// Validate inputs
	function validateInputs(): void {
		// Reset errors
		errors = { amount: '', dueDate: '' };

		// Validate amount
		if (!amount) {
			errors.amount = 'Amount is required';
		} else if (isNaN(parseFloat(amount))) {
			errors.amount = 'Amount must be a number';
		}

		// Validate due date
		if (!dueDate) {
			errors.dueDate = 'Due date is required';
		} else {
			const dueDateObj = new Date(dueDate);
			const currentYear = new Date().getFullYear();
			if (dueDateObj.getFullYear() !== currentYear) {
				errors.dueDate = 'Due date must be in the current year';
			}
		}
	}

	// Handle form submission
	function handleSubmit(): void {
		calculateDistribution();
		if (isValid) {
			onApply({
				accountId,
				distribution: weeklyDistribution
			});
		}
	}

	// Handle cancel
	function handleCancel(): void {
		onClose();
	}

	console.log('Budget Agent open');
</script>

{#if show}
	<div class="form-container">
		<div class="form-group">
			<label for="amount">Amount</label>
			<input
				id="amount"
				type="number"
				bind:value={amount}
				placeholder="Enter payment amount"
				class={errors.amount ? 'error' : ''}
			/>
			{#if errors.amount}
				<p class="error-message">{errors.amount}</p>
			{/if}
		</div>

		<div class="form-group">
			<label for="dueDate">Date Due</label>
			<input
				id="dueDate"
				type="date"
				bind:value={dueDate}
				class={errors.dueDate ? 'error' : ''}
			/>
			{#if errors.dueDate}
				<p class="error-message">{errors.dueDate}</p>
			{/if}
		</div>

		<div class="form-group">
			<label for="frequency">Frequency</label>
			<select id="frequency" bind:value={frequency}>
				{#each frequencyOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>


	</div>
	<div class="row">
		<div class="form-group toggle">
			<label for="startFromCurrentWeek">
				<input id="startFromCurrentWeek" type="checkbox" bind:checked={startFromCurrentWeek} />
				<span>Start from Current Week (Week {currentWeek})</span>
			</label>
		</div>

		<div class="form-group toggle">
			<label for="enableCatchup">
				<input
					id="enableCatchup"
					type="checkbox"
					bind:checked={enableCatchup}
					disabled={!startFromCurrentWeek}
				/>
				<span>Enable Catch-up</span>
			</label>
			{#if !startFromCurrentWeek && enableCatchup}
				<p class="info-message">Catch-up is only available when starting from current week.</p>
			{/if}
		</div>
	</div>
		<div class="preview-section">
			<h3>Distribution Preview</h3>
			<div class="distribution-visualization">
			<div class="weeks-container">
				{#each weeklyDistribution as week}
					{@const isCurrentWeek = week.week === currentWeek}
					{@const hasAmount = week.amount > 0}
					<div
						class="week-bar {isCurrentWeek ? 'current-week' : ''} {hasAmount ? 'has-amount' : ''}"
						style="height: {hasAmount ? Math.min(100, Math.max(10, (week.amount / Math.max(...weeklyDistribution.map(w => w.amount))) * 100)) : 0}%"
						title="Week {week.week}: ${week.amount.toFixed(2)}"
					>
						{#if hasAmount && week.amount > Math.max(...weeklyDistribution.map((w) => w.amount)) * 0.3}
							<span class="amount-label">${week.amount.toFixed(2)}</span>
						{/if}
					</div>
				{/each}
			</div>
			<div class="week-labels">
				<span>Week 1</span>
				<span>Week 13</span>
				<span>Week 26</span>
				<span>Week 39</span>
				<span>Week 52</span>
			</div>
		</div>

		<div class="distribution-summary">
			<p>Total: ${weeklyDistribution.reduce((sum, week) => sum + week.amount, 0).toFixed(2)}</p>
			<p>Payments: {weeklyDistribution.filter((week) => week.amount > 0).length}</p>
		</div>
	</div>

	<div class="modal-footer">
		<button class="cancel-button" onclick={handleCancel}>Cancel</button>
		<button class="apply-button" onclick={handleSubmit} disabled={!isValid}>Apply</button>
	</div>
{/if}

<style>
	.form-container {
		padding: 1.5rem;
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
	}
	.row {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		padding-inline-start: 1.5rem;
	}
	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.toggle {
		flex-direction: row;
		align-items: center;
	}

	label {
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	input[type='number'],
	input[type='date'],
	select {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
	}

	input[type='checkbox'] {
		margin-right: 0.5rem;
	}

	input.error {
		border-color: #ef4444;
	}

	.error-message {
		color: #ef4444;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.info-message {
		color: #6b7280;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.preview-section {
		padding: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.preview-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: #1f2937;
	}

	.distribution-visualization {
		height: 120px;
		margin-bottom: 1.5rem;
	}

	.weeks-container {
		display: flex;
		height: 120px;
		align-items: flex-end;
		gap: 1px;
		margin-bottom: 0.5rem;
	}

	.week-bar {
		flex: 1;
		background-color: #e5e7eb;
		position: relative;
		transition: height 0.3s ease;
		min-height: 1px;
	}

	.week-bar.has-amount {
		background-color: #3b82f6;
	}

	.week-bar.current-week {
		background-color: #10b981;
	}

	.amount-label {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.75rem;
		white-space: nowrap;
		color: #1f2937;
	}

	.week-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.distribution-summary {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.cancel-button,
	.apply-button {
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.cancel-button {
		background-color: white;
		border: 1px solid #d1d5db;
		color: #374151;
	}

	.cancel-button:hover {
		background-color: #f9fafb;
	}

	.apply-button {
		background-color: #3b82f6;
		border: none;
		color: white;
	}

	.apply-button:hover {
		background-color: #2563eb;
	}

	.apply-button:disabled {
		background-color: #93c5fd;
		cursor: not-allowed;
	}
</style>
