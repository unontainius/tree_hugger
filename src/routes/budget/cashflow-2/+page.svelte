<script lang="ts">
	import MIcon from '$lib/components/common/MIcon.svelte';
	import cashflowService, {
		type BudgetGroup,
		type BudgetAccount,
		type CashflowEntry
	} from '$lib/services/cashflowService';
	import GroupModal from '$lib/components/GroupModal.svelte';
	import AccountModal from '$lib/components/AccountModal.svelte';
	import { invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';
	import supabase from '$lib/supabaseClient';
	import CookieConsent from '$lib/components/common/CookieConsent.svelte';
	import { showLoading, hideLoading, withLoading } from '$lib/stores/loadingStore';
	import BudgetAgent from '$lib/components/BudgetAgent.svelte';
	import budgetAgentService from '$lib/services/budgetAgentService';

	// Define types for our data structures
	interface SampleEntry {
		week: number;
		value: number;
	}

	interface TableRow {
		group: string;
		account: string;
		key: string;
		data: (CashflowEntry | SampleEntry)[];
		account_id: string;
	}

	interface GroupedRow {
		name: string;
		rows: TableRow[];
	}

	// Define the data structure from +page.server.js
	const pageData = $props();

	// Create state variables properly with runes
	let useSampleData = $state(false); // Default to server data
	let loading = $state(false); // Keep this for backward compatibility but use global loading for UI
	let loadingMessage = $state('Loading data...'); // Message to display during loading
	let clientAuthenticated = $state(false); // Track client-side authentication
	let authChecking = $state(true); // Track if we're checking authentication
	const serverDataAvailable = $derived(
		pageData.data?.groups?.length > 0 &&
			pageData.data?.rows?.length > 0 &&
			pageData.data?.groupedRows?.length > 0
	);
	const authRequired = $derived(pageData.data?.authRequired === true && !clientAuthenticated);

	// Check authentication status on load
	if (browser) {
		checkAuthStatus();
	}

	// Debug the data structure
	if (browser) {
		// Check client-side authentication status
		supabase.auth.getSession().then((response) => {
			if (response?.data?.session?.user) {
				// Store auth token in cookie for server-side access
				if (response.data.session) {
					const expiresAt =
						response.data.session.expires_at || Math.floor(Date.now() / 1000) + 43200;
					const expires = new Date(expiresAt * 1000);
					const value = JSON.stringify({
						access_token: response.data.session.access_token,
						refresh_token: response.data.session.refresh_token
					});

					// Set the cookie with the auth token
					document.cookie = `supabase-auth-token=${encodeURIComponent(value)};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
				}
			}
		});
	}

	// The data is now directly in pageData.data
	const serverData = pageData.data;

	// Create sample data for testing
	const sampleGroups: any[] = [
		{
			id: 'sample-group-1',
			name: 'Housing',
			type: 'expense',
			accounts: [
				{ id: 'sample-acct-1', name: 'Rent', group_id: 'sample-group-1' },
				{ id: 'sample-acct-2', name: 'Utilities', group_id: 'sample-group-1' }
			]
		},
		{
			id: 'sample-group-2',
			name: 'Transportation',
			type: 'expense',
			accounts: [
				{ id: 'sample-acct-3', name: 'Car Payment', group_id: 'sample-group-2' },
				{ id: 'sample-acct-4', name: 'Gas', group_id: 'sample-group-2' }
			]
		},
		{
			id: 'sample-group-3',
			name: 'Income',
			type: 'income',
			accounts: [{ id: 'sample-acct-5', name: 'Salary', group_id: 'sample-group-3' }]
		}
	];

	const sampleRows: TableRow[] = [
		{
			group: 'sample-group-1',
			account: 'Rent',
			key: 'sample-group-1-rent',
			account_id: 'sample-acct-1',
			data: [
				{ week: 1, value: 1200 },
				{ week: 2, value: 1200 },
				{ week: 3, value: 1200 },
				{ week: 4, value: 1200 }
			]
		},
		{
			group: '    ',
			account: 'Utilities',
			key: 'sample-group-1-utilities',
			account_id: 'sample-acct-2',
			data: [
				{ week: 1, value: 150 },
				{ week: 2, value: 160 },
				{ week: 3, value: 145 },
				{ week: 4, value: 155 }
			]
		},
		{
			group: 'sample-group-2',
			account: 'Car Payment',
			key: 'sample-group-2-car',
			account_id: 'sample-acct-3',
			data: [
				{ week: 1, value: 300 },
				{ week: 2, value: 300 },
				{ week: 3, value: 300 },
				{ week: 4, value: 300 }
			]
		},
		{
			group: 'sample-group-2',
			account: 'Gas',
			key: 'sample-group-2-gas',
			account_id: 'sample-acct-4',
			data: [
				{ week: 1, value: 50 },
				{ week: 2, value: 60 },
				{ week: 3, value: 55 },
				{ week: 4, value: 45 }
			]
		},
		{
			group: 'sample-group-3',
			account: 'Salary',
			key: 'sample-group-3-salary',
			account_id: 'sample-acct-5',
			data: [
				{ week: 1, value: 2000 },
				{ week: 2, value: 2000 },
				{ week: 3, value: 2000 },
				{ week: 4, value: 2000 }
			]
		}
	];

	// Create sample grouped rows
	const sampleGroupedRows: GroupedRow[] = sampleGroups.map((group) => {
		const groupRows = sampleRows.filter((row) => row.group === group.name);
		return {
			name: group.name,
			rows: groupRows
		};
	});

	// Use derived state to determine which data to use
	const groups = $derived(
		useSampleData ? sampleGroups : serverDataAvailable ? serverData.groups : []
	);

	// Fix the rows derived state with proper typing
	const rows = $derived(
		(() => {
			// Get the base rows
			const baseRows = useSampleData ? sampleRows : serverDataAvailable ? serverData.rows : [];

			// Sort the rows by group and then by account
			return [...baseRows].sort((a, b) => {
				// First sort by group
				const groupComparison = a.group.localeCompare(b.group);
				if (groupComparison !== 0) {
					return groupComparison;
				}

				// If groups are the same, sort by account
				return a.account.localeCompare(b.account);
			});
		})()
	);

	// Fix the groupedRows derived state with proper typing
	const groupedRows = $derived(
		(() => {
			// Create a map to group rows by group name
			const groupMap = new Map<string, TableRow[]>();

			// Group rows by group name
			for (const row of rows) {
				if (!groupMap.has(row.group)) {
					groupMap.set(row.group, []);
				}

				const groupRows = groupMap.get(row.group);
				if (groupRows) {
					groupRows.push(row);
				}
			}

			// Convert the map to an array of grouped rows
			const result: GroupedRow[] = [];

			// Sort the group names
			const sortedGroupNames = [...groupMap.keys()].sort();

			// Create grouped rows in sorted order
			for (const groupName of sortedGroupNames) {
				const groupRows = groupMap.get(groupName);

				// Sort the rows within each group by account name
				if (groupRows) {
					groupRows.sort((a, b) => a.account.localeCompare(b.account));
				}

				result.push({
					name: groupName,
					rows: groupRows || []
				});
			}

			return result;
		})()
	);

	const error = $derived(useSampleData ? '' : serverData?.error || '');
	const dataSource = $derived(
		useSampleData
			? 'Sample Data'
			: serverDataAvailable
				? 'Server Data'
				: 'Sample Data (Server data unavailable)'
	);

	// Create an array of week numbers - increase to 52 for full year display
	const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

	// Function to get the current week number (1-52)
	function getCurrentWeekNumber(): number {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 1);
		const diff = now.getTime() - start.getTime();
		const oneWeek = 604800000; // milliseconds in a week
		const weekNumber = Math.ceil(diff / oneWeek);
		return Math.min(Math.max(1, weekNumber), 52); // Ensure it's between 1 and 52
	}

	// Store the current week number
	const currentWeek = $state(getCurrentWeekNumber());

	// Add a function to format the week headers with month information
	function formatWeekHeader(weekNum: number): { month: string; week: string } {
		// Assuming weeks start from January 1st
		const startDate = new Date(new Date().getFullYear(), 0, 1);
		// Add (weekNum - 1) * 7 days to get to the start of the week
		const weekStart = new Date(startDate);
		weekStart.setDate(startDate.getDate() + (weekNum - 1) * 7);

		// Get the end of the week (7 days later)
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);

		// Format the month(s)
		const startMonth = weekStart.toLocaleString('en-US', { month: 'short' });
		const endMonth = weekEnd.toLocaleString('en-US', { month: 'short' });

		// If the week spans two months, show both
		const monthDisplay = startMonth === endMonth ? startMonth : `${startMonth}-${endMonth}`;

		return {
			month: monthDisplay,
			week: `week ${weekNum}`
		};
	}

	// State for group modal
	let showGroupModal = $state(false);
	let selectedGroup: BudgetGroup | null = $state(null);

	// State for inline group editing
	let editingGroupInline = $state<string | null>(null);
	let inlineGroupName = $state('');

	// State for inline account editing
	let editingAccountInline = $state<string | null>(null);
	let inlineAccountName = $state('');

	// State for account modal
	let showAccountModal = $state(false);
	let editMode = $state(false);
	let accountToEdit: { id: string; name: string; group_id: string } | null = $state(null);

	// State for account menu popup
	let activeAccountMenu = $state<string | null>(null);
	let menuPosition = $state({ x: 0, y: 0 });

	// State for group menu popup
	let activeGroupMenu = $state<string | null>(null);
	let groupMenuPosition = $state({ x: 0, y: 0 });

	// Reference to the cashflow grid element
	let cashflowGridRef: HTMLElement | null = $state(null);

	let work = $state('');

	// Add a state variable to track which cell is being updated
	let updatingCell = $state({ accountId: '', week: 0 });

	// Add state for Budget Agent
	let showBudgetAgent = $state(false);
	let selectedAccountForBudget = $state<{ id: string; name: string; group: string } | null>(null);

	// Add a new state variable for the test modal
	let showTestModal = $state(false);

	async function processRowUpdate(
		group: string,
		account: string,
		week: number,
		accountId: string,
		e: any
	) {
		if (!e || !e.target) return;
		const value = e.target.value;
		if (value === '') return; // Allow clearing the field

		const numericValue = parseFloat(value);
		if (isNaN(numericValue)) {
			work = `Invalid value for ${group}-${account} week ${week}: ${value}`;
			return;
		}

		// Save the current account ID for scrolling back to it after reload
		saveLastUsedAccount(accountId);

		// Set the updating cell to show visual indicator
		updatingCell = { accountId, week };

		try {
			// Check authentication status first
			const { data: userData } = await supabase.auth.getUser();
			if (!userData?.user?.id) {
				const errorMsg = `Cannot update: User not authenticated`;
				console.error(errorMsg);
				work = errorMsg;
				hideLoading();
				return;
			}

			// Update the entry in Supabase
			const success = await cashflowService.updateCashflowEntry(accountId, week, numericValue);

			if (success) {
				const successMsg = `Updated ${group}-${account} week ${week}: ${numericValue}`;

				// Update the data to show the updated value

				// Update the local data to reflect the change without a page reload
				const rowToUpdate = rows.find((r) => r.account_id === accountId);
				if (rowToUpdate) {
					const entryToUpdate = rowToUpdate.data.find((d: any) => d.week === week);
					if (entryToUpdate) {
						entryToUpdate.value = numericValue;
					} else {
						rowToUpdate.data.push({ week, value: numericValue });
					}
				}
			} else {
				const errorMsg = `Failed to update ${group}-${account} week ${week}`;
				console.error(errorMsg);
				work = errorMsg;
			}
		} catch (error) {
			const errorMsg = `Error updating ${group}-${account} week ${week}: ${error instanceof Error ? error.message : 'Unknown error'}`;
			console.error('Error updating entry:', error);
			work = errorMsg;
		} finally {
			// Clear the updating cell indicator
			updatingCell = { accountId: '', week: 0 };
		}
	}

	// Function to calculate the total value for a row
	function calculateRowTotal(row: TableRow): string {
		if (!row.data || row.data.length === 0) return '0.00';
		const total = row.data.reduce(
			(sum: number, entry: CashflowEntry | SampleEntry) => sum + parseFloat(entry.value.toString()),
			0
		);
		// Format with thousands separators and two decimal places using browser's locale
		return total.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}

	function handleAddGroup() {
		// Show modal for creating a new group
		selectedGroup = null;
		showGroupModal = true;
	}

	async function handleGroupCreated(event: CustomEvent<BudgetGroup>) {
		// Instead of refetching data, just invalidate and let SvelteKit handle it
		await invalidateAll();
	}

	async function handleGroupUpdated(event: CustomEvent<BudgetGroup>) {
		// Instead of refetching data, just invalidate and let SvelteKit handle it
		await invalidateAll();
	}

	function handleAddRow() {
		// Redirect to add row functionality
		handleAddGroup(); // For now, just show the add group modal
	}

	// Add a handler function for adding accounts
	function handleAddAccount() {
		// Show the account modal in add mode
		editMode = false;
		accountToEdit = null;
		showAccountModal = true;
	}

	// Handle accounts created event
	async function handleAccountsCreated(event: CustomEvent<{ name: string; group_id: string }[]>) {
		try {
			// Call service to create accounts
			for (const account of event.detail) {
				await cashflowService.createAccount(account.name, account.group_id);
			}

			// Refresh data
			await invalidateAll();

			// Show success message
			work = `Created ${event.detail.length} account(s)`;
		} catch (error) {
			console.error('Error creating accounts:', error);
			work = 'Failed to create accounts';
		}
	}

	// Handle account updated event
	async function handleAccountUpdated(
		event: CustomEvent<{ id: string; name: string; group_id: string }>
	) {
		try {
			// Call service to update the account
			const success = await cashflowService.updateAccount(
				event.detail.id,
				event.detail.name,
				event.detail.group_id
			);

			if (success) {
				// Refresh data
				await invalidateAll();

				// Show success message
				work = `Updated account: ${event.detail.name}`;
			} else {
				work = `Failed to update account: ${event.detail.name}`;
			}
		} catch (error) {
			console.error('Error updating account:', error);
			work = 'Failed to update account';
		}
	}

	// Function to save inline group edit
	async function saveInlineGroupEdit(originalName: string) {
		if (!inlineGroupName.trim()) {
			work = 'Group name cannot be empty';
			editingGroupInline = null;
			return;
		}

		try {
			// Find the group object
			const groupToUpdate = groups.find((g: any) => g.name === originalName);

			if (groupToUpdate) {
				// Update the group name
				const updatedGroup = await cashflowService.updateGroup(groupToUpdate.id, inlineGroupName);

				if (updatedGroup) {
					work = `Updated group name to: ${inlineGroupName}`;
					// Refresh data
					await invalidateAll();
				} else {
					work = `Failed to update group name`;
				}
			} else {
				work = `Could not find group: ${originalName}`;
			}
		} catch (error) {
			console.error('Error updating group name:', error);
			work = `Error updating group name: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			// Clear editing state
			editingGroupInline = null;
		}
	}

	async function checkAuthStatus() {
		authChecking = true;
		try {
			const response = await supabase.auth.getUser();
			clientAuthenticated = !!response?.data?.user?.id;

			if (clientAuthenticated) {
				// If client is authenticated, ensure the token is in the cookie
				const {
					data: { session }
				} = await supabase.auth.getSession();
				if (session) {
					const expiresAt = session.expires_at || Math.floor(Date.now() / 1000) + 43200;
					const expires = new Date(expiresAt * 1000);
					const value = JSON.stringify({
						access_token: session.access_token,
						refresh_token: session.refresh_token
					});

					// Set the cookie with the auth token
					document.cookie = `supabase-auth-token=${encodeURIComponent(value)};path=/;expires=${expires.toUTCString()};SameSite=Lax`;

					// If server requires auth but we're authenticated, refresh the data
					if (authRequired) {
						await invalidateAll();
					}
				}
			}

			return clientAuthenticated;
		} catch (error) {
			console.error('Client: Error checking auth status:', error);
			return false;
		} finally {
			authChecking = false;
			hideLoading();
		}
	}

	// Add a function to initialize data if none exists
	async function initializeDataIfNeeded() {
		try {
			// Use the global loading indicator instead
			return await withLoading(async () => {
				work = 'Initializing database with sample data...';

				// Call the service to initialize data
				const success = await cashflowService.populateSampleData();

				if (success) {
					work = 'Sample data created successfully. Refreshing...';
					// Refresh the data from the server
					await invalidateAll();
					// Set a timeout to check if data was loaded
					setTimeout(async () => {
						if (!serverDataAvailable) {
							await invalidateAll();
						}
						work = 'Data initialization complete';
					}, 1000);
					return true;
				} else {
					work = 'Failed to create sample data. Using client-side sample data instead.';
					// Fall back to sample data if initialization fails
					useSampleData = true;
					return false;
				}
			}, 'Initializing database with sample data...');
		} catch (error) {
			console.error('Error initializing data:', error);
			work = 'Error initializing data. Using client-side sample data instead.';
			// Fall back to sample data if initialization fails
			useSampleData = true;
			hideLoading(); // Ensure loading is hidden in case of error
			return false;
		}
	}

	// Check if we need to initialize data when the component loads
	$effect(() => {
		if (browser && !serverDataAvailable && !useSampleData && !authRequired) {
			initializeDataIfNeeded();
		}
	});

	// Function to toggle the account menu
	function toggleAccountMenu(accountId: string, event: MouseEvent) {
		event.stopPropagation();

		if (activeAccountMenu === accountId) {
			// Close the menu if it's already open
			activeAccountMenu = null;
		} else {
			// Open the menu and position it
			activeAccountMenu = accountId;
			const button = event.currentTarget as HTMLElement;
			const rect = button.getBoundingClientRect();
			// ensure the menu is always shown within the viewport
			const menuHeight = 220;
			let menuTop = rect.top;
			if (window.innerHeight - menuHeight < rect.top) {
				menuTop = window.innerHeight - menuHeight;
			}
			menuPosition = {
				x: rect.right,
				y: menuTop
			};
			console.log(`vh ${window.innerHeight}`);
			console.log(`top ${rect.top.toFixed(0)}`);
			console.log(`height ${menuHeight}`);
			console.log(`used ${menuTop.toFixed(0)}`);
		}
	}

	// Function to handle account delete from menu
	async function handleAccountDelete(account: TableRow) {
		activeAccountMenu = null; // Close the menu

		if (confirm(`Are you sure you want to delete the account "${account.account}"?`)) {
			try {
				// Save the current account ID before deleting
				// We'll use the previous account in the list as our reference point
				const currentIndex = rows.findIndex((r) => r.account_id === account.account_id);
				const previousAccount =
					currentIndex > 0
						? rows[currentIndex - 1].account_id
						: rows.length > 1
							? rows[1].account_id
							: null;

				if (previousAccount) {
					saveLastUsedAccount(previousAccount);
				}

				const success = await cashflowService.deleteAccount(account.account_id);
				if (success) {
					work = `Deleted account: ${account.account}`;
					// Note: reloadPageWithState will reset loading state
					reloadPageWithState();
				} else {
					work = `Failed to delete account: ${account.account}`;
				}
			} catch (error) {
				console.error('Error deleting account:', error);
				work = `Error deleting account: ${error instanceof Error ? error.message : 'Unknown error'}`;
			}
		}
	}

	// Function to handle creating recurrence from menu
	function handleCreateRecurrence(account: TableRow) {
		activeAccountMenu = null; // Close the menu
	}

	// Function to handle clearing row from menu
	async function handleClearRow(account: TableRow) {
		activeAccountMenu = null; // Close the menu

		if (confirm(`Are you sure you want to clear all values for "${account.account}"?`)) {
			try {
				// Save the current account ID for scrolling back to it after reload
				saveLastUsedAccount(account.account_id);

				// Show loading indicator while clearing values
				showLoading(`Clearing values for ${account.account}...`);

				// Use the new efficient method to clear all values at once
				const success = await cashflowService.clearAccountValues(account.account_id);

				if (success) {
					// Reload the page immediately
					window.location.reload();
				}
			} catch (error) {
				console.error('Error clearing row:', error);
			}
		}
	}

	// Function to close the menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (activeAccountMenu !== null) {
			const target = event.target as HTMLElement;
			if (!target.closest('.account-menu-popup') && !target.closest('.account-menu-btn')) {
				activeAccountMenu = null;
			}
		}

		if (activeGroupMenu !== null) {
			const target = event.target as HTMLElement;
			if (!target.closest('.group-menu-popup') && !target.closest('.group-menu-btn')) {
				activeGroupMenu = null;
			}
		}

		// Close inline editing when clicking outside
		if (editingAccountInline !== null) {
			const target = event.target as HTMLElement;
			if (!target.closest('.account-edit-form')) {
				editingAccountInline = null;
			}
		}

		if (editingGroupInline !== null) {
			const target = event.target as HTMLElement;
			if (!target.closest('.group-edit-form')) {
				editingGroupInline = null;
			}
		}
		if (showBudgetAgent) {
			showBudgetAgent = false;
		}
	}

	// Add event listener for clicks outside the menu
	if (browser) {
		document.addEventListener('click', handleClickOutside);
	}

	// Function to scroll the grid to show the current week in the 2nd or 3rd position
	// and scroll to the last used account if available
	function scrollToCurrentWeek() {
		if (browser && cashflowGridRef) {
			// Wait for the DOM to be fully rendered
			setTimeout(() => {
				// First, handle horizontal scrolling to the current week
				if (currentWeek > 1) {
					// Calculate the width of the first two columns (group and account)
					const groupHeader = document.querySelector('.group-header');
					const accountHeader = document.querySelector('.account-header');
					const columnWidth = document.querySelector('.column-header-cell')?.clientWidth || 90;

					if (groupHeader && accountHeader) {
						// Calculate the scroll position to show the current week in the 3rd position
						// We subtract 1 from currentWeek because weeks are 1-indexed but we want the 0-indexed position
						const scrollPosition = (currentWeek - 3) * columnWidth;

						// Ensure we don't scroll to a negative position
						if (cashflowGridRef) {
							cashflowGridRef.scrollLeft = Math.max(0, scrollPosition);
						}
					}
				}

				// Now, handle vertical scrolling to the last used account
				const lastAccountId = loadLastUsedAccount();
				if (lastAccountId) {
					// Find the row with this account ID
					const accountRow = document.querySelector(`[data-account-id="${lastAccountId}"]`);
					if (accountRow) {
						// Scroll the row into view
						accountRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
				}
			}, 300); // Small delay to ensure the grid is rendered
		}
	}

	// Call the scroll function when the component is mounted or when loading completes
	$effect(() => {
		if (browser && !loading && groups?.length > 0 && cashflowGridRef) {
			// Add a slightly longer delay to ensure everything is rendered
			setTimeout(scrollToCurrentWeek, 300);
		}
	});

	// Function to toggle the group menu
	function toggleGroupMenu(groupName: string, event: MouseEvent) {
		event.stopPropagation();

		if (activeGroupMenu === groupName) {
			// Close the menu if it's already open
			activeGroupMenu = null;
		} else {
			// Open the menu and position it
			activeGroupMenu = groupName;
			const button = event.currentTarget as HTMLElement;
			const rect = button.getBoundingClientRect();
			const menuHeight = 140;
			let menuTop = event.clientY;
			if (window.innerHeight - menuHeight < menuTop) {
				menuTop = window.innerHeight - menuHeight;
			}
			groupMenuPosition = {
				x: rect.right,
				y: menuTop
			};
			console.log(`vh ${window.innerHeight}`);
			console.log(`top ${rect.top.toFixed(0)}`);
			console.log(`height ${menuHeight}`);
			console.log(`used ${menuTop.toFixed(0)}`);
		}
	}

	// Function to handle group delete from menu
	async function handleGroupDeleteFromMenu(group: any) {
		activeGroupMenu = null; // Close the menu

		if (
			confirm(`Are you sure you want to delete the group "${group.name}" and all its accounts?`)
		) {
			try {
				// Find the actual group object
				const actualGroup = groups.find((g: any) => g.name === group.name);
				if (actualGroup) {
					const success = await cashflowService.deleteGroup(actualGroup.id);
					if (success) {
						work = `Deleted group: ${group.name}`;
						// Note: reloadPageWithState will reset loading state
						reloadPageWithState();
					} else {
						work = `Failed to delete group: ${group.name}`;
					}
				} else {
					work = `Could not find group: ${group.name}`;
				}
			} catch (error) {
				console.error('Error deleting group:', error);
				work = `Error deleting group: ${error instanceof Error ? error.message : 'Unknown error'}`;
			}
		}
	}

	// Add functions to save and load scroll position
	function saveLastUsedAccount(accountId: string) {
		if (browser) {
			try {
				localStorage.setItem('cashflow_last_account_id', accountId);
			} catch (error) {
				console.error('Error saving to localStorage:', error);
			}
		}
	}

	function loadLastUsedAccount(): string | null {
		if (browser) {
			try {
				return localStorage.getItem('cashflow_last_account_id');
			} catch (error) {
				console.error('Error loading from localStorage:', error);
				return null;
			}
		}
		return null;
	}

	// Function to reload page while preserving state
	function reloadPageWithState() {
		showLoading('Reloading page...');
		if (browser) {
			loading = false;
			window.location.reload();
		}
	}

	// Function to save inline account edit
	async function saveInlineAccountEdit(accountId: string, originalName: string, groupId: string) {
		if (!inlineAccountName.trim()) {
			work = 'Account name cannot be empty';
			editingAccountInline = null;
			return;
		}

		try {
			// Update the account name
			const success = await cashflowService.updateAccount(accountId, inlineAccountName, groupId);

			if (success) {
				work = `Updated account name to: ${inlineAccountName}`;

				// Update the local data to reflect the change without a page reload
				const rowToUpdate = rows.find((r) => r.account_id === accountId);
				if (rowToUpdate) {
					rowToUpdate.account = inlineAccountName;
				}
			} else {
				work = `Failed to update account name`;
			}
		} catch (error) {
			console.error('Error updating account name:', error);
			work = `Error updating account name: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			// Clear editing state
			editingAccountInline = null;
		}
	}

	// Function to open the Budget Agent for an account
	function openBudgetAgent(account: TableRow) {
		console.log('openBudgetAgent called with account:', account);
		selectedAccountForBudget = {
			id: account.account_id,
			name: account.account,
			group: account.group
		};
		console.log('selectedAccountForBudget set to:', selectedAccountForBudget);
		console.log('Open Budget Agent');
		showBudgetAgent = true;
		showTestModal = true; // Also show the test modal
		console.log('showBudgetAgent set to:', showBudgetAgent);
		console.log('showTestModal set to:', showTestModal);
	}

	// Handle the apply event from the Budget Agent
	async function handleBudgetApply(event: CustomEvent) {
		const { accountId, distribution } = event.detail;

		try {
			// Show loading indicator
			showLoading(`Applying budget distribution for ${selectedAccountForBudget?.name}...`);

			// Apply the distribution using the service
			const success = await budgetAgentService.applyBudgetDistribution(accountId, distribution);

			if (success) {
				work = `Successfully applied budget distribution for ${selectedAccountForBudget?.name}`;

				// Save the current account ID for scrolling back to it after reload
				saveLastUsedAccount(accountId);

				// Reload the page to show the updated values
				reloadPageWithState();
			} else {
				work = `Failed to apply budget distribution for ${selectedAccountForBudget?.name}`;
			}
		} catch (error) {
			console.error('Error applying budget distribution:', error);
			work = `Error applying budget distribution: ${error instanceof Error ? error.message : 'Unknown error'}`;
			hideLoading(); // Ensure loading is hidden in case of error
		}
	}

	// Handle the cancel event from the Budget Agent
	function handleBudgetCancel() {
		showBudgetAgent = false;
		showTestModal = false; // Also hide the test modal
	}

	// Simple function to close the test modal
	function closeTestModal() {
		showTestModal = false;
	}
</script>

<!-- Improve the loading indicator -->
{#if authChecking}
	<div class="auth-checking">
		<h3>Checking Authentication Status...</h3>
		<p>Please wait while we verify your authentication status.</p>
	</div>
{:else if authRequired}
	<div class="auth-required">
		<h3>Authentication Required</h3>
		<p>{pageData.data?.error || 'You must be logged in to view this page.'}</p>
		<p>
			Client authentication status: {clientAuthenticated ? 'Authenticated' : 'Not authenticated'}
		</p>
		<div class="auth-actions">
			<button class="auth-button" onclick={checkAuthStatus}>Check Auth Status</button>
			<button
				class="auth-button"
				onclick={() => window.location.reload()}
				aria-label="Refresh data by reloading the page"
				title="Refresh data by reloading the page (faster than internal refresh)"
				>Refresh Page</button
			>
		</div>
	</div>
{:else if !groups?.length}
	<div class="notice-message">
		<h3>No data available</h3>
		<p>{pageData.data?.error || 'No data found.'}</p>
		<p>
			Client authentication status: {clientAuthenticated ? 'Authenticated' : 'Not authenticated'}
		</p>

		<p>It's possible that:</p>
		<ul>
			<li>Your database connection is not configured properly</li>
			<li>The data initialization process failed</li>
			<li>Your database tables are empty</li>
		</ul>
		<p>Try creating some groups and accounts using the buttons below or initialize sample data.</p>

		<div class="controls">
			<button
				class="init-data-btn"
				onclick={initializeDataIfNeeded}
				aria-label="Initialize sample data"
			>
				<MIcon name="database" color="white" size="16px" />
				<span>Initialize Sample Data</span>
			</button>
			<button
				class="clear-data-btn"
				onclick={reloadPageWithState}
				aria-label="Clear data and refresh"
			>
				<MIcon name="delete" color="white" size="16px" />
				<span>Clear & Refresh</span>
			</button>
			<div class="spacer"></div>
			<button class="add-row-btn" onclick={handleAddGroup} aria-label="Add new group">
				<MIcon name="add" color="white" size="16px" />
				<span>Add Group</span>
			</button>
		</div>
	</div>
{:else}
	<div class="add-row">
		<div class="controls">
			<button
				class="refresh-btn"
				onclick={reloadPageWithState}
				aria-label="Refresh data by reloading the page"
				title="Refresh data by reloading the page (faster than internal refresh)"
			>
				<MIcon name="refresh" color="white" size="16px" />
				<span>Refresh Page</span>
			</button>
			<div class="spacer"></div>
			{#if error}
				<div class="error" role="alert">{error}</div>
			{/if}
			<button
				class="this-week-btn"
				onclick={scrollToCurrentWeek}
				aria-label="Scroll to current week"
				title="Scroll to current week"
			>
				<MIcon name="right" color="white" size="16px" />
				<span>This Week</span>
				<MIcon name="left" color="white" size="16px" />
			</button>
		</div>
	</div>

	<div class="cashflow-grid" bind:this={cashflowGridRef}>
		<table>
			<thead>
				<tr>
					<th class="group-header">
						<div class="group-header-content">
							<span>Group</span>
							<button class="add-group-btn" onclick={handleAddGroup} aria-label="Add new group">
								<MIcon name="add" color="lightblue" size="24px" />
							</button>
						</div>
					</th>
					<th class="account-header">
						<div class="account-header-content">
							<span>Account</span>
							<button class="add-group-btn" onclick={handleAddAccount} aria-label="Add new account">
								<MIcon name="add" color="lightblue" size="24px" />
							</button>
						</div>
					</th>
					{#each weeks as week}
						{@const headerInfo = formatWeekHeader(week)}
						<th class="column-header-cell {week === currentWeek ? 'current-week' : ''}">
							<div class="week-header">
								<div class="month-label">{headerInfo.month}</div>
								<div class="week-label">{headerInfo.week}</div>
							</div>
						</th>
					{/each}
					<th class="total-header">Total</th>
				</tr>
			</thead>
			<tbody>
				<!-- Debug info -->
				{#if groupedRows.length === 0}
					<tr>
						<td colspan={weeks.length + 3} style="text-align: center; padding: 1rem;">
							No data available. GroupedRows is empty.
						</td>
					</tr>
				{:else}
					<!-- Render the actual data -->
					{#each groupedRows as group}
						{#if group && group.rows}
							{#each group.rows as row, rowIndex}
								<tr
									class="cashflow-row {rowIndex === group.rows.length - 1 ? 'last-in-group' : ''}"
									data-account-id={row.account_id}
								>
									{#if rowIndex === 0}
										<td class="group-cell" rowspan={group.rows.length}>
											{#if editingGroupInline === group.name}
												<div class="group-edit-form">
													<input
														type="text"
														class="group-edit-input"
														bind:value={inlineGroupName}
														placeholder="Group name"
														aria-label="Edit group name"
														onkeydown={(e) => {
															if (e.key === 'Enter') {
																e.preventDefault();
																saveInlineGroupEdit(group.name);
															} else if (e.key === 'Escape') {
																e.preventDefault();
																editingGroupInline = null;
															}
														}}
													/>
													<div class="group-edit-actions">
														<button
															class="save-btn"
															onclick={() => saveInlineGroupEdit(group.name)}
															aria-label="Save group name"
															title="Save"
														>
															<MIcon name="save" color="white" size="16px" />
														</button>
														<button
															class="cancel-btn"
															onclick={() => (editingGroupInline = null)}
															aria-label="Cancel editing"
															title="Cancel"
														>
															<MIcon name="cancel" color="white" size="16px" />
														</button>
													</div>
												</div>
											{:else}
												<div class="group-content">
													<div
														class="row-header-cell"
														aria-label={`Group ${group.name}`}
														title={`${group.name} group`}
													>
														{group.name}
														<button
															class="menu-btn"
															tabindex="0"
															aria-label={`Menu for group ${group.name}`}
															title={`Open menu for ${group.name}`}
															onclick={(e) => toggleGroupMenu(group.name, e)}
														>
															<MIcon name="menu-dots" color="white" size="24px" />
														</button>
													</div>
												</div>
											{/if}
										</td>
									{/if}
									<td class="account-cell">
										{#if editingAccountInline === row.account_id}
											<div class="account-edit-form">
												<input
													type="text"
													class="account-edit-input"
													bind:value={inlineAccountName}
													placeholder="Account name"
													aria-label="Edit account name"
													onkeydown={(e) => {
														if (e.key === 'Enter') {
															e.preventDefault();
															saveInlineAccountEdit(row.account_id, row.account, row.group);
														} else if (e.key === 'Escape') {
															e.preventDefault();
															editingAccountInline = null;
														}
													}}
												/>
												<div class="account-edit-actions">
													<button
														class="save-btn"
														onclick={() =>
															saveInlineAccountEdit(row.account_id, row.account, row.group)}
														aria-label="Save account name"
														title="Save"
													>
														<MIcon name="save" color="white" size="24px" />
													</button>
													<button
														class="cancel-btn"
														onclick={() => (editingAccountInline = null)}
														aria-label="Cancel editing"
														title="Cancel"
													>
														<MIcon name="cancel" color="white" size="16px" />
													</button>
												</div>
											</div>
										{:else}
											<div
												class="row-header-cell"
												aria-label={`${row.account} account`}
												title={`${row.account} account`}
											>
												<span>{row.account}</span>
												<button
													class="menu-btn"
													tabindex="0"
													aria-label={`Menu for the ${row.account} account`}
													title={`Open menu for ${row.account}`}
													onclick={(e) => toggleAccountMenu(row.account_id, e)}
												>
													<MIcon name="menu-dots" color="white" size="32px" />
												</button>
											</div>
										{/if}
									</td>
									{#each weeks as week}
										<td class="cell {week === currentWeek ? 'current-week' : ''}">
											<input
												type="number"
												class="amount-cell {updatingCell.accountId === row.account_id &&
												updatingCell.week === week
													? 'updating'
													: ''}"
												value={row.data.find(
													(d: { week: number; value: number }) => d.week === week
												)?.value || 0}
												onblur={(e) =>
													processRowUpdate(row.group, row.account, week, row.account_id, e)}
												onkeydown={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault();
														processRowUpdate(row.group, row.account, week, row.account_id, e);
														(e.target as HTMLInputElement).blur();
													} else if (e.key === 'ArrowUp') {
														// Prevent default behavior (increment value)
														e.preventDefault();

														// Find the current cell's position
														const currentCell = e.target as HTMLElement;
														const currentRow = currentCell.closest('tr');

														// Find the previous row
														const previousRow = currentRow?.previousElementSibling;
														if (previousRow) {
															// Find the input in the same column position
															const inputs = previousRow.querySelectorAll('input.amount-cell');
															const columnIndex = Array.from(
																currentRow.querySelectorAll('input.amount-cell')
															).indexOf(currentCell as HTMLInputElement);

															if (inputs && inputs[columnIndex]) {
																// Focus on the input in the previous row
																(inputs[columnIndex] as HTMLInputElement).focus();
															}
														}
													} else if (e.key === 'ArrowDown') {
														// Prevent default behavior (decrement value)
														e.preventDefault();

														// Find the current cell's position
														const currentCell = e.target as HTMLElement;
														const currentRow = currentCell.closest('tr');

														// Find the next row
														const nextRow = currentRow?.nextElementSibling;
														if (nextRow) {
															// Find the input in the same column position
															const inputs = nextRow.querySelectorAll('input.amount-cell');
															const columnIndex = Array.from(
																currentRow.querySelectorAll('input.amount-cell')
															).indexOf(currentCell as HTMLInputElement);

															if (inputs && inputs[columnIndex]) {
																// Focus on the input in the next row
																(inputs[columnIndex] as HTMLInputElement).focus();
															}
														}
													}
												}}
												aria-label={`${row.account} week ${week} value`}
												title="Press Enter to save changes, Up/Down arrows to navigate between rows"
											/>
										</td>
									{/each}
									<td class="total-cell">{calculateRowTotal(row)}</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan={weeks.length + 3} style="text-align: center; padding: 1rem;">
									Group has no rows: {group?.name || 'Unknown group'}
								</td>
							</tr>
						{/if}
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<!-- Add the AccountModal component -->
<AccountModal
	show={showAccountModal}
	{groups}
	{editMode}
	{accountToEdit}
	on:accountsCreated={handleAccountsCreated}
	on:accountUpdated={handleAccountUpdated}
	on:close={() => (showAccountModal = false)}
/>

<!-- Add the GroupModal component -->
<GroupModal
	bind:show={showGroupModal}
	bind:group={selectedGroup}
	accountExample="Mortgage"
	onGroupCreated={handleGroupCreated}
	onGroupUpdated={handleGroupUpdated}
	onClose={() => (showGroupModal = false)}
/>
<!-- Add the popup menu for account actions -->
{#if activeAccountMenu !== null}
	<div class="account-menu-popup" style="top: {menuPosition.y}px; left: {menuPosition.x}px;">
		{#each rows.filter((r) => r.account_id === activeAccountMenu) as row}
			<div class="menu-header">{row.account}</div>
			<button
				class="menu-item"
				onclick={() => {
					// Set the editing state directly
					const accountId = row.account_id;
					const accountName = row.account;

					// Close the menu first
					activeAccountMenu = null;

					// Set the editing state with a small delay to ensure the menu is closed
					setTimeout(() => {
						editingAccountInline = accountId;
						inlineAccountName = accountName;
					}, 10);
				}}
			>
				<MIcon name="edit" color="#4b5563" size="16px" />
				<span>Edit</span>
			</button>
			<button class="menu-item" onclick={() => openBudgetAgent(row)}>
				<MIcon name="repeat" color="#4b5563" size="16px" />
				<span>Create Recurrence</span>
			</button>
			<button class="menu-item" onclick={() => handleClearRow(row)}>
				<MIcon name="zero" color="#4b5563" size="16px" />
				<span>Clear Row</span>
			</button>
			<div class="menu-separator"></div>
			<button class="menu-item delete" onclick={() => handleAccountDelete(row)}>
				<MIcon name="delete" color="#ef4444" size="16px" />
				<span>Delete</span>
			</button>
		{/each}
	</div>
{/if}

<!-- Add the popup menu for group actions -->
{#if activeGroupMenu !== null}
	<div
		class="group-menu-popup"
		style="top: {groupMenuPosition.y}px; left: {groupMenuPosition.x}px;"
	>
		{#each groupedRows.filter((g) => g.name === activeGroupMenu) as group}
			<div class="menu-header">{group.name}</div>
			<button
				class="menu-item"
				onclick={() => {
					// Set the editing state directly
					const groupName = group.name;

					// Close the menu first
					activeGroupMenu = null;

					// Set the editing state with a small delay to ensure the menu is closed
					setTimeout(() => {
						editingGroupInline = groupName;
						inlineGroupName = groupName;
					}, 10);
				}}
			>
				<MIcon name="edit" color="#4b5563" size="16px" />
				<span>Edit</span>
			</button>
			<div class="menu-separator"></div>
			<button class="menu-item delete" onclick={() => handleGroupDeleteFromMenu(group)}>
				<MIcon name="delete" color="#ef4444" size="16px" />
				<span>Delete</span>
			</button>
		{/each}
	</div>
{/if}

<!-- Render the BudgetAgent directly without Portal -->
{#if showBudgetAgent && selectedAccountForBudget}
	<BudgetAgent
		show={showBudgetAgent}
		accountId={selectedAccountForBudget.id}
		accountName={selectedAccountForBudget.name}
		{currentWeek}
		onApply={handleBudgetApply}
		onClose={handleBudgetCancel}
	/>
{/if}

<!-- Replace the test modal with one that includes the Budget Agent's form -->
{#if showTestModal}
	<div
		style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;"
	>
		<div
			style="background-color: white; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column;"
		>
			<div
				style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb;"
			>
				<h2 style="margin: 0; font-size: 1.5rem; color: #1f2937;">Budget Agent</h2>
				<button
					style="background: none; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #6b7280; padding:2px; margin:0; display: flex; align-items: center; justify-content: center;"
					onclick={closeTestModal}
				>
					<MIcon name="close" size="24px" color="red" />
				</button>
			</div>

			<div
				style="padding: 1rem 1.5rem; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;"
			>
				<h3 style="margin: 0; font-size: 1.25rem; color: #1f2937;">
					Account: {selectedAccountForBudget?.name}
				</h3>
			</div>

			<!-- Include the Budget Agent form here -->
			<BudgetAgent
				show={true}
				accountId={selectedAccountForBudget?.id || ''}
				accountName={selectedAccountForBudget?.name || ''}
				{currentWeek}
				onApply={handleBudgetApply}
				onClose={closeTestModal}
			/>
		</div>
	</div>
{/if}

<CookieConsent />

<style>
	.cashflow-grid {
		overflow: auto;
		height: calc(100dvh - 9rem);
		width: 96%;
		margin: 0 auto;
		border: 1px solid #a7a6a6;
		position: relative;
		background-color: transparent;
		contain: strict;
		border-radius: 10px;
	}

	.error {
		color: red;
		font-weight: bold;
	}

	/* ===== TABLE STRUCTURE ===== */
	table {
		border-collapse: collapse;
		width: max-content;
		position: relative;
		table-layout: fixed;
		contain: none;
		border-spacing: 0;
		box-sizing: border-box;
		/* Table will be wider than viewport with 52 weeks */
		min-width: 100%;
	}

	/* Force all cells to have exact same dimensions and border color */
	td,
	th {
		height: 47px;
		box-sizing: border-box;
		vertical-align: middle;
		border-color: #a7a6a6;
	}

	/* Keep table headers aligned */
	thead tr {
		height: 47px;
		background: rgb(228, 227, 227);
	}

	/* All headers need consistent height */
	th {
		background: rgb(228, 227, 227);
		font-weight: bold;
		height: 47px;
		box-sizing: border-box;
	}
	.add-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 90%;
		margin: 0 auto;
		height: 47px;
		/* border-bottom: 1px solid #a7a6a6; */
	}
	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.spacer {
		flex-grow: 1;
	}

	.add-row-btn,
	.refresh-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		margin: 0.5rem;
		cursor: pointer;
		color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 0.3rem 0.75rem;
	}

	.add-row-btn {
		background-color: #5d7599;
	}

	.refresh-btn {
		background-color: #4a9d5d;
	}

	.this-week-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		margin: 0.5rem;
		cursor: pointer;
		color: white;
		border: none;
		border-radius: 0.25rem;
		background-color: #6366f1; /* Purple color */
	}

	.this-week-btn:hover {
		background-color: #4f46e5; /* Darker purple on hover */
	}

	/* ===== HEADER STYLES ===== */
	/* Group header - only adjust padding and height */
	.group-header {
		position: sticky;
		left: 0;
		top: 0;
		z-index: 60;
		width: 181px;
		min-width: 181px;
		max-width: 181px;
		text-align: center;
		background-color: #123652;
		border-right: 1px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
		padding: 0;
		font-weight: bold;
		color: white;
	}

	/* Account header */
	.account-header {
		position: sticky;
		left: 180px;
		top: 0;
		z-index: 50;
		width: 221px;
		min-width: 221px;
		max-width: 221px;
		text-align: center;
		background: rgb(228, 227, 227);
		border-right: 2px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
		padding: 0;
		font-weight: bold;
		background-color: #496d89;
		color: white;
	}

	/* Week column headers */
	.column-header-cell {
		position: sticky;
		top: 0;
		width: 90px;
		min-width: 90px;
		max-width: 90px;
		padding: 0;
		text-align: center;
		background: #ebecec;
		border-right: 1px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
		z-index: 40;
	}

	.week-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.month-label {
		font-size: 0.8rem;
		color: #4b5563;
		margin-bottom: 2px;
	}

	.week-label {
		font-size: 0.8rem;
	}

	/* Total header */
	.total-header {
		position: sticky;
		top: 0;
		right: 0;
		width: 90px;
		min-width: 90px;
		max-width: 90px;
		padding: 0.75rem;
		text-align: right;
		background: rgb(228, 227, 227);
		border-left: 2px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
		z-index: 50;
	}

	/* ===== GROUP AND ACCOUNT CELLS ===== */
	.group-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
	}

	/* Group cells */
	.group-cell {
		position: sticky !important;
		left: 0 !important;
		width: 181px;
		min-width: 181px;
		max-width: 181px;
		padding: 0;
		z-index: 20;
		background-color: #123652;
		border-right: 1px solid #3a6188;
		border-bottom: 1px solid #a7a6a6;
		color: white;
		height: 60px !important;
	}

	/* Styling group button to match screenshot better */
	.row-header-cell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: none;
		border-radius: 2rem;
		color: white;
		text-align: center;
		cursor: pointer;
		font-weight: 500;
		border: 1px solid #d1d5db;
		background: #00000038;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		width: 100%;
		min-width: 0;
		height: 32px;
		padding: 0;
		margin-inline: 1rem;
		padding-inline-start: 1rem;
	}

	/* Apply a specific fix for rowspan border misalignment */
	[rowspan] {
		position: sticky !important;
		z-index: 1;
		contain: none;
	}

	/* Account cells */
	.account-cell {
		box-sizing: border-box;
		position: sticky !important;
		left: 180px !important;
		width: 221px;
		min-width: 221px;
		max-width: 221px;
		background: #496d89;
		border-right: 2px solid #3ea0fc;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		height: 60px !important;
		overflow: visible;
	}

	.menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 100%;
		cursor: pointer;
		flex-shrink: 1;
		z-index: 5;
		padding: 2px;
		padding-inline: 8px;
		border-radius: 2rem;
		border-left: none;
		background-color: transparent;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		box-shadow: none;
		margin: 0;
	}

	/* Make the delete button for the group cell stand out more */
	.group-cell {
		color: rgba(255, 255, 255, 0.8);
	}

	/* Data cells */
	.cell {
		width: 90px;
		min-width: 90px;
		max-width: 90px;
		padding: 0;
		background: white;
		border-right: 1px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
	}

	/* Total column cells */
	.total-cell {
		position: sticky;
		right: 0;
		width: 90px;
		min-width: 90px;
		max-width: 90px;
		padding: 0.75rem;
		text-align: right;
		background: rgb(228, 227, 227);
		z-index: 20;
		border-left: 2px solid #a7a6a6;
		border-bottom: 1px solid #a7a6a6;
	}

	/* ===== INPUT STYLES ===== */
	.amount-cell {
		width: 100%;
		height: 100%;
		padding: 0.75rem;
		box-sizing: border-box;
	}

	input {
		width: 100%;
		border: none;
		margin: 0;
		padding: 0;
		text-align: right;
		font-family: monospace;
		/* Hide spinner controls */
		appearance: textfield;
		-moz-appearance: textfield;
		box-sizing: border-box;
	}

	/* Hide spinner for Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input:focus {
		outline: 2px solid #3b82f6;
		outline-offset: -2px;
		border-radius: 4px;
	}

	/* Make sure all borders are consistent and eliminate gaps */
	.cell,
	.group-cell,
	.total-cell {
		border-bottom: 1px solid #a7a6a6;
		overflow: hidden;
	}

	/* Additional fix for .cashflow-row to ensure consistent height */
	.cashflow-row {
		border-bottom: 1px solid #a7a6a6;
		height: 47px;
		overflow: hidden;
		background-color: transparent;
	}

	/* Ensure table cells don't have unexpected spacing */
	table,
	tr,
	td,
	th {
		box-sizing: border-box;
		border-spacing: 0;
	}
	.add-group-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		border-radius: 50%;
		background-color: #3a6188;
	}

	/* Add styling for the notice message */
	.notice-message {
		width: 90%;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #4b5563;
	}

	.notice-message h3 {
		color: #1f2937;
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.notice-message ul {
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.notice-message li {
		margin-bottom: 0.5rem;
	}

	/* Style for the header content wrapper */
	.account-header-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin: auto;
		gap: 2rem;
	}
	.group-header-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin: auto;
		gap: 2rem;
	}

	/* Add styles for the toggle button and controls */
	.controls {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
	}

	.error {
		color: #e53e3e;
		padding: 8px;
		background-color: #fff5f5;
		border-radius: 4px;
		border-left: 4px solid #e53e3e;
	}

	.auth-required {
		width: 90%;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #4b5563;
		text-align: center;
	}

	.auth-required h3 {
		color: #1f2937;
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.auth-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.auth-button {
		padding: 0.5rem 1rem;
		background-color: #3b82f6;
		color: white;
		border-radius: 0.25rem;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.auth-button:hover {
		background-color: #2563eb;
	}

	.auth-checking {
		width: 90%;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #4b5563;
		text-align: center;
	}

	.auth-checking h3 {
		color: #1f2937;
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.init-data-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		margin: 0.5rem;
		cursor: pointer;
		color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 0.3rem 0.75rem;
		background-color: #6366f1;
	}

	.init-data-btn:hover {
		background-color: #4f46e5;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.clear-data-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		margin: 0.5rem;
		cursor: pointer;
		color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 0.3rem 0.75rem;
		background-color: #ef4444;
	}

	.clear-data-btn:hover {
		background-color: #dc2626;
	}

	/* Add a style for the updating cell */
	.updating {
		background-color: #f0f9ff;
		outline: 2px solid #3b82f6;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.8;
		}
	}

	/* Styles for inline group editing */
	.group-edit-form {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0px;
		padding: 5px;
		width: 100%;
		height: 42px;
	}

	.group-edit-input {
		background-color: white;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		padding: 6px 8px;
		width: 100%;
		height: 32px;
		text-align: left;
	}

	.group-edit-actions {
		display: flex;
		gap: 0;
		justify-content: center;
	}

	.save-btn,
	.cancel-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		margin: 0;
	}

	.save-btn {
		border-radius: 0;
		background-color: #10b981;
	}

	.cancel-btn {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		background-color: #ef4444;
	}

	/* Styles for the account menu popup */
	.account-menu-popup,
	.group-menu-popup {
		position: fixed;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		min-width: 200px;
		z-index: 1000;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid #999999;
	}

	.menu-header {
		padding: 10px 16px;
		font-weight: 600;
		color: #ebecec;
		background-color: #383838;
		border-bottom: 1px solid #e5e7eb;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0.5rem 1rem;
		background: none;
		border: none;
		width: calc(100% - 2rem);
		text-align: left;
		cursor: pointer;
		color: #4b5563;
		transition: background-color 0.2s;
		box-shadow: none;
		margin: 0;
		margin-inline: 1rem;
	}

	.menu-item:hover {
		background-color: #f3f4f6;
	}

	.menu-item.delete {
		color: #ef4444;
	}

	.menu-item.delete:hover {
		background-color: #fee2e2;
	}

	.menu-separator {
		height: 1px;
		background-color: #e5e7eb;
		margin: 4px 0;
	}

	/* Highlight the current week */
	.current-week {
		background-color: #ccf5ff !important; /* Light red background */
	}

	/* Make the current week header stand out */
	th.current-week {
		background-color: #66cfff !important; /* Darker red for the header */
	}

	/* Ensure the input in current week cells inherits the background */
	.current-week input {
		background-color: #ccf5ff !important;
	}

	/* Styles for inline account editing */
	.account-edit-form {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0;
		padding: 5px;
		width: 100%;
		height: 100%;
		background-color: #496d89; /* Match the account cell background */
	}

	.account-edit-input {
		background-color: white;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 6px 8px;
		width: 100%;
		height: 32px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		text-align: left;
		flex: 1;
	}

	.account-edit-actions {
		display: flex;
		gap: 0;
		justify-content: center;
	}
</style>
