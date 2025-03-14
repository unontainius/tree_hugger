<script>
  import { showLoading, hideLoading } from '$lib/stores/loadingStore';
  import { executeWithLoading } from '$lib/utils/loadingUtils';
  
  // Example function that simulates a long-running operation
  async function simulateOperation() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Operation completed successfully!');
      }, 2000);
    });
  }
  
  // Example of using the loading state directly
  async function handleDirectLoading() {
    try {
      showLoading('Performing operation directly...');
      const result = await simulateOperation();
      alert(result);
    } finally {
      hideLoading();
    }
  }
  
  // Example of using the executeWithLoading utility
  async function handleUtilityLoading() {
    const result = await executeWithLoading(
      () => simulateOperation(),
      'Performing operation with utility...'
    );
    alert(result);
  }

  function handleStopLoading() {
    hideLoading();
  }
</script>

<div class="example-container">
  <h2>Global Loading State Examples</h2>
  
  <div class="buttons">
    <button onclick={handleDirectLoading}>
      Show Loading Directly
    </button>
    
    <button onclick={handleUtilityLoading}>
      Show Loading with Utility
    </button>

    <button onclick={handleStopLoading}>
      Close
    </button>
  </div>
  
  <div class="explanation">
    <h3>How to use the global loading state:</h3>
    
    <p>
      <strong>Method 1:</strong> Use the showLoading and hideLoading functions directly in a try/finally block.
    </p>
    
    <p>
      <strong>Method 2:</strong> Use the executeWithLoading utility function to wrap your async code.
    </p>
    
    <p>
      Click the buttons above to see the loading indicator in action!
    </p>
  </div>
</div>

<style>
  .example-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-top: 0;
    color: #2563eb;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #1d4ed8;
  }
  
  .explanation {
    background-color: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.25rem;
    border-left: 4px solid #2563eb;
  }
  
  h3 {
    margin-top: 0;
    color: #1e40af;
  }
  
  strong {
    color: #3b82f6;
  }
</style> 