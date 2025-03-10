<script lang="ts">
    import { onMount } from 'svelte'
        // Engineering crew data
    const crewMembers = [
        { name: "LT CMDR JIM WEES", position: "SHIFT SUPERVISOR", onDuty: "ON DUTY", location: "ENG-4156", button: "PERSONNEL" },
        { name: "LT WILBUR FINKS", position: "SAFETY OFFICER", onDuty: "ON DUTY", location: "ENG-4157", button: "SECURITY" },
        { name: "LT FERNANDO SEPULVEDA", position: "OPS ENGINEER", onDuty: "ON DUTY", location: "ENG-4158", button: "COMMS" },
        { name: "LT RICK D'ANGELO", position: "OPS ENGINEER", onDuty: "ON DUTY", location: "ENG-4159", button: "WEAPONRY" },
        { name: "LT DAN FOSTER JR", position: "WARP FIELD TECH", onDuty: "ON DUTY", location: "ENG-4160", button: "PROPULSION" },
        { name: "LT JOHN WESTERVELT", position: "AUXILIARY SYSTEMS TECH", onDuty: "ON DUTY", location: "ENG-4161", button: "NAVIGATION" }
    ];

    // Additional crew lists for each location
    const eng4156Crew = [
        { name: "PFC SARAH CHEN", position: "SYSTEMS MONITOR", onDuty: "ON DUTY", location: "ENG-4156", button: "DETAIL" },
        { name: "PFC MICHAEL RODRIGUEZ", position: "POWER SYSTEMS", onDuty: "ON DUTY", location: "ENG-4156", button: "DETAIL" },
        { name: "PFC JAMES WILSON", position: "DIAGNOSTIC TECH", onDuty: "ON DUTY", location: "ENG-4156", button: "DETAIL" },
        { name: "PFC EMILY PATEL", position: "MAINTENANCE", onDuty: "ON DUTY", location: "ENG-4156", button: "DETAIL" }
    ];

    const eng4157Crew = [
        { name: "PFC ROBERT JACKSON", position: "HAZARD CONTROL", onDuty: "ON DUTY", location: "ENG-4157", button: "DETAIL" },
        { name: "PFC LISA NGUYEN", position: "EMERGENCY SYSTEMS", onDuty: "ON DUTY", location: "ENG-4157", button: "DETAIL" },
        { name: "PFC DAVID THOMPSON", position: "CONTAINMENT SPECIALIST", onDuty: "ON DUTY", location: "ENG-4157", button: "DETAIL" },
        { name: "PFC OLIVIA MARTINEZ", position: "RADIATION MONITOR", onDuty: "ON DUTY", location: "ENG-4157", button: "DETAIL" }
    ];

    const eng4158Crew = [
        { name: "PFC THOMAS ANDERSON", position: "COMMS TECHNICIAN", onDuty: "ON DUTY", location: "ENG-4158", button: "DETAIL" },
        { name: "PFC JENNIFER WILLIAMS", position: "SIGNAL ANALYST", onDuty: "ON DUTY", location: "ENG-4158", button: "DETAIL" },
        { name: "PFC KEVIN BROWN", position: "ENCRYPTION SPECIALIST", onDuty: "ON DUTY", location: "ENG-4158", button: "DETAIL" },
        { name: "PFC AMANDA TAYLOR", position: "RELAY OPERATOR", onDuty: "ON DUTY", location: "ENG-4158", button: "DETAIL" }
    ];

    const eng4159Crew = [
        { name: "PFC CHRISTOPHER LEE", position: "WEAPONS CALIBRATION", onDuty: "ON DUTY", location: "ENG-4159", button: "DETAIL" },
        { name: "PFC STEPHANIE CLARK", position: "TARGETING SYSTEMS", onDuty: "ON DUTY", location: "ENG-4159", button: "DETAIL" },
        { name: "PFC DANIEL WALKER", position: "ORDNANCE SPECIALIST", onDuty: "ON DUTY", location: "ENG-4159", button: "DETAIL" },
        { name: "PFC NICOLE HARRIS", position: "DEFENSE SYSTEMS", onDuty: "ON DUTY", location: "ENG-4159", button: "DETAIL" }
    ];

    const eng4160Crew = [
        { name: "PFC BRANDON LEWIS", position: "WARP COIL SPECIALIST", onDuty: "ON DUTY", location: "ENG-4160", button: "DETAIL" },
        { name: "PFC RACHEL ROBINSON", position: "PLASMA CONDUIT TECH", onDuty: "ON DUTY", location: "ENG-4160", button: "DETAIL" },
        { name: "PFC JASON GARCIA", position: "DILITHIUM MONITOR", onDuty: "ON DUTY", location: "ENG-4160", button: "DETAIL" },
        { name: "PFC MEGAN MILLER", position: "IMPULSE DRIVE TECH", onDuty: "ON DUTY", location: "ENG-4160", button: "DETAIL" }
    ];

    const eng4161Crew = [
        { name: "PFC JUSTIN DAVIS", position: "STELLAR CARTOGRAPHY", onDuty: "ON DUTY", location: "ENG-4161", button: "DETAIL" },
        { name: "PFC KATHERINE MOORE", position: "SENSOR ARRAY TECH", onDuty: "ON DUTY", location: "ENG-4161", button: "DETAIL" },
        { name: "PFC RYAN JOHNSON", position: "NAVIGATION SYSTEMS", onDuty: "ON DUTY", location: "ENG-4161", button: "DETAIL" },
        { name: "PFC ELIZABETH WHITE", position: "HELM CONTROL TECH", onDuty: "ON DUTY", location: "ENG-4161", button: "DETAIL" }
    ];

    // Define the type for crew members
    type CrewMember = {
        name: string;
        position: string;
        onDuty: string;
        location: string;
        button: string;
    };

    // Define valid location keys
    type LocationKey = "ENG-4156" | "ENG-4157" | "ENG-4158" | "ENG-4159" | "ENG-4160" | "ENG-4161";

    // Combine all crews into a master list for reference with proper typing
    const allCrewMembers: Record<LocationKey, CrewMember[]> = {
        "ENG-4156": eng4156Crew,
        "ENG-4157": eng4157Crew,
        "ENG-4158": eng4158Crew,
        "ENG-4159": eng4159Crew,
        "ENG-4160": eng4160Crew,
        "ENG-4161": eng4161Crew
    };
    
    // Track selected row
    let selectedRow = 1;
    
    // Handle row selection
    function selectRow(index: number) {
        selectedRow = index;
    }
    
    // Add and remove the hide-navbar class to the document body
    onMount(() => {
        document.body.classList.add('hide-navbar');
        
        return () => {
            document.body.classList.remove('hide-navbar');
        };
    });
</script>
<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&display=swap">
</svelte:head>

<div class="fullscreen-page">
    <div class="top-container">
        <div class="top-container-inner">
            <div class="top-left-block">

                <div class="block top-left-top">
                    <h1>11-4077</h1>
                </div>
                <div class="block top-left-bottom">
                    <h1>2422870</h1>
                </div>
                <div class="block top-left-bottom-left">

                </div>
            </div>
            <div class="top-right-inner">
                <div class="top-right-top-left">
                </div>
                <div class="top-right-top">
                    <div class="top-right-header">
                        <h2>ENGINEERING DIVISION DUTY ROSTER</h2>

                        <table class="lcars-table">
                            <thead>
                                <tr class="lcars-table-header">
                                    <th class="lcars-column blank"></th>
                                    <th class="lcars-column name">NAME</th>
                                    <th class="lcars-column position">POSITION</th>
                                    <th class="lcars-column status">STATUS</th>
                                    <th class="lcars-column location">LOCATION</th>
                                    <th class="lcars-column blank2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each crewMembers as crew, i}
                                    <tr 
                                        class="lcars-row" 
                                        class:blue-bg={i % 3 === 0} 
                                        class:lime-bg={i % 3 === 1} 
                                        class:orange-bg={i % 3 === 2}
                                        class:selected={selectedRow === i}
                                        on:click={() => selectRow(i)}
                                    >
                                        <td class="lcars-column">
                                            <div class="lcars-row-left {i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'lime' : 'orange'}"></div>
                                        </td>
                                        <td class="lcars-column name">{crew.name}</td>
                                        <td class="lcars-column position">{crew.position}</td>
                                        <td class="lcars-column status">{crew.onDuty}</td>
                                        <td class="lcars-column location">{crew.location}</td>
                                        <td class="lcars-column">
                                            <div class="lcars-button-right {i === 0 ? 'orange' : i === 1 ? 'blue' : i === 2 ? 'lime' : i === 3 ? 'orange' : i === 4 ? 'blue' : i === 5 ? 'lime' : 'orange'}">
                                                {crew.button}
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="top-right-bottom-left">
                </div>
                <div class="top-right-bottom-segments">
                    <div class="stub blue-stub">
                    </div>
                    <div class="stub orange-stub">
                    </div>
                    <div class="stub lime-stub-top">
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Bottom Container -->
    <div class="bottom-container">
        {#if selectedRow >= 0}
            <div class="detail-container">
                <div class="bottom-container-inner">
                    <div class="bottom-left-block">
                        <div class="block bottom-left-top">
                            <h1>11-4077</h1>
                        </div>
                        <div class="block bottom-left-bottom">
                            <h1>2422870</h1>
                        </div>
                        <div class="block bottom-left-bottom-exit">
                            <a href="/"><h1>EXIT</h1></a>
                        </div>
                        <div class="block bottom-left-bottom-left">
        
                        </div>
                    </div>
                    <div class="bottom-right-inner">
                        <div class="bottom-right-top">
                            <div class="bottom-right-header">
                            </div>
 
                        </div>
                        <div class="bottom-right-top-right">
                            <div class="bottom-right-bottom-segments">
                                <div class="stub gray-stub">
                                </div>
                                <div class="stub orange-stub">
                                </div>
                                <div class="stub lime-stub-bottom">
                                </div>
                            </div>
                        </div>
                        <div class="bottom-right-top-left">
                        </div>

                        <div class="bottom-right-bottom-right">
                            
                            <table class="lcars-table detail-table">
                                <thead>
                                    <tr class="lcars-table-header">
                                        <th class="lcars-column blank"></th>
                                        <th class="lcars-column name">NAME</th>
                                        <th class="lcars-column position">POSITION</th>
                                        <th class="lcars-column status">STATUS</th>
                                        <th class="lcars-column location">LOCATION</th>
                                        <th class="lcars-column blank2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each allCrewMembers[crewMembers[selectedRow].location as LocationKey] as detailCrew, i}
                                        <tr 
                                            class="lcars-row" 
                                            class:blue-bg={i % 3 === 0} 
                                            class:lime-bg={i % 3 === 1} 
                                            class:orange-bg={i % 3 === 2}
                                        >
                                            <td class="lcars-column">
                                                <div class="lcars-row-left {i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'lime' : 'orange'}"></div>
                                            </td>
                                            <td class="lcars-column name">{detailCrew.name}</td>
                                            <td class="lcars-column position">{detailCrew.position}</td>
                                            <td class="lcars-column status">{detailCrew.onDuty}</td>
                                            <td class="lcars-column location">{detailCrew.location}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                            <div class="bottom-right-header">
                                <h2>{crewMembers[selectedRow].button} PERSONNEL DETAIL - {crewMembers[selectedRow].location}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>         

</div>

<style>
    /* LCARS Color Variables */
    :root {
        --lcars-orange: #FF9C00;
        --lcars-blue:rgb(101, 178, 255);
        --lcars-lime: #e0ff99;
        --lcars-red: #FF6666;
        --lcars-yellow: #FFFF00;
        --lcars-blue-bg: rgba(153, 153, 255, 0.1);
        --lcars-lime-bg: rgba(153, 255, 153, 0.1);
        --lcars-orange-bg: rgba(255, 156, 0, 0.1);
        --lcars-black: #000;
        --lcars-white: #fff;
        --lcars-gray: #979797;
        --lcars-light-gray: #afaeae;
        --lcars-dark-gray: #111;
        --lcars-light-blue: #9999FF;
        --lcars-light-lime: #99FF99;
        --lcars-light-orange: #FF9C00;
        --lcars-selected: rgba(255, 255, 255, 0.2);
    }
    .lcars-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-bottom: 10px;
    }
    .lcars-table tr {
        cursor: pointer;
    }
    .lcars-table tr.selected {
        background-color: var(--lcars-selected) !important;
    }
    .lcars-table tbody tr {
        margin-bottom: 8px;
        display: table-row;
        height: 50px; /* Increased height */
    }
    .lcars-table tbody tr:not(:last-child) {
        margin-bottom: 8px;
    }
    .detail-container {
        padding: 0;
        color: var(--lcars-white);
        width: 100%;
    }

    .detail-table {
        margin-top: 10px;
    }
    .lcars-button-right {
        height: 40px;
        width: 180px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--lcars-black);
        font-weight: 700;
    }
    .lcars-button-right.blue {
        background-color: var(--lcars-blue);
    }
    .lcars-button-right.lime {
        background-color: var(--lcars-lime);
    }
    .lcars-button-right.orange {
        background-color: var(--lcars-orange);
    }
    .top-right-header {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        margin-block-end: 1rem;
    }
    .top-right-header h2 {
        font-size: 2rem;
        font-weight: 700;
        text-align: right;
        padding-inline-end: 1rem;
        color: var(--lcars-yellow);
    }
    .stub {
        width: 100%;
        height: 100%;
    }
    .lime-stub-top {
        background-color: var(--lcars-lime);
        border-top-right-radius: 2rem;
    }
    .lime-stub-bottom {
        background-color: var(--lcars-lime);
        border-bottom-right-radius: 2rem;
    }
    .orange-stub {
        background-color: var(--lcars-orange);
    }
    .gray-stub {
        background-color: var(--lcars-gray);
    }
    .blue-stub {
        background-color: var(--lcars-blue);
    }
    .top-right-bottom-segments {
        display: grid;
        grid-template-columns: 3fr 1fr 6fr;
        grid-template-rows: 1fr;
        border: 1px solid var(--lcars-black);
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);

    }
    .top-right-bottom-left {
        border-right: 8px solid var(--lcars-black);
    }   
    .top-right-top-left  {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);
        border-bottom-left-radius: 2rem;
    }
    .top-right-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);
        color: var(--lcars-white);
  
    }
    .top-right-inner {
        display: grid;
        grid-template-columns: 1fr 20fr;
        grid-template-rows: 20fr 1fr;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-blue);
    }
    .top-left-bottom {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-blue);
        border-bottom-left-radius: 3rem;
        border-top: 8px solid var(--lcars-black);
    }
    .top-left-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-lime);
        
    }
    .top-left-block {
        display:grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 6fr;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);
        color: var(--lcars-black);
        margin:0;
        padding:0;  
        
    }
    .top-left-block h1 {
        font-size: 1.0rem;
        font-weight: 700;
        text-align: right;
        padding-inline-end: 1rem;
    }
    .top-container-inner {
        display: grid;
        grid-template-columns: 2fr 12fr;
        grid-template-rows: 1fr;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        border-bottom-left-radius: 4rem;

    }
    .top-container {
        flex: 1;
        background-color: var(--lcars-lime);
        z-index: 100;
        border-bottom-left-radius: 4rem;
        border: 4px solid var(--lcars-black);
    }
    /* Bottom Container */
    .bottom-container {
        flex: 1;
        background-color: var(--lcars-black);
        z-index: 100;
        border-top-left-radius: 4rem;
        border: 4px solid var(--lcars-black);
        width: 100%;
    }
    .stub {
        width: 100%;
        height: 100%;
    }
    .orange-stub {
        background-color: var(--lcars-orange);
        border-left: 8px solid var(--lcars-black);
        border-right: 8px solid var(--lcars-black);
    }
    
    .bottom-right-bottom-segments {
        display: grid;
        grid-template-columns: 3fr 1fr 6fr;
        grid-template-rows: 1fr;
        border-inline-start: 8px solid var(--lcars-black);
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);

    }
    /* .bottom-right-bottom-left {
        border-right: 8px solid var(--lcars-black);
    }  */
    .bottom-right-bottom-right {
        background-color: var(--lcars-black);
        width: 100%;
        padding-right: 0;
    }
    .bottom-right-top-left  {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);
        border-top-left-radius: 2rem;
    }
    .bottom-right-header {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        width: 100%;
        height: 100%;

    }
    .bottom-right-header h2 {
        font-size: 2rem;
        font-weight: 700;
        text-align: right;
        padding-inline-end: 1rem;
        color: var(--lcars-blue);

    }
    .bottom-right-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-gray);
        color: var(--lcars-white);
  
    }
    .bottom-right-inner {
        display: grid;
        grid-template-columns: 1fr 23fr;
        grid-template-rows: 1fr 17fr;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-gray);
    }
    .bottom-left-bottom {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-lime);

        border-top: 8px solid var(--lcars-black);
    }
    .bottom-left-top {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-gray);
        border-top-left-radius: 3rem;
    }
    .bottom-left-block {
        display:grid;
        grid-template-columns: 1fr;
        grid-template-rows: 6fr 2fr 2fr;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-black);
        color: var(--lcars-black);
        margin:0;
        padding:0;  
        
    }
    .bottom-left-block h1 {
        font-size: 1.0rem;
        font-weight: 700;
        text-align: right;
        padding-inline-end: 1rem;
    }
    .bottom-left-bottom-exit {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: right;
        width: 100%;
        height: 100%;
        background-color: var(--lcars-red);
        border-top-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
        border-top: 8px solid var(--lcars-black);
    }
    .bottom-container-inner {
        display: grid;
        grid-template-columns: 2fr 12fr;
        grid-template-rows: 1fr;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 4rem;
    }
     /* Table Headers */
     .lcars-table-header {
        color: var(--lcars-orange);
        font-weight: 700;
        border-bottom: 1px solid var(--lcars-gray);
        padding-bottom: 5px;
        text-align: left;
    }
    
    /* Crew Rows */
    .lcars-row {
        height: 40px;
        border-radius: 5px;
        font-size: 1.2rem;
        color: var(--lcars-light-blue);
    }
    
    .lcars-row-left {
        width: 60px;
        height: 40px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin: 5px 0; /* Add vertical margin */
    }
    .lcars-row-left.blue {
        background-color: var(--lcars-blue);
    }
    .lcars-row-left.lime {
        background-color: var(--lcars-lime);
    }
    .lcars-row-left.orange {
        background-color: var(--lcars-orange);
    }
    
    .lcars-column {
        padding: 0 10px;
        vertical-align: middle; /* Center content vertically */
    }
    .lcars-column.blank {
        width: 60px;
    }
    .lcars-column.blank2 {
        width: 180px;
    }
    .lcars-column.name {
        width: 25%;
    }
    .lcars-column.position {
        width: 30%;
    }
    
    .lcars-column.status {
        width: 15%;
    }
    
    .lcars-column.location {
        width: 15%;
    }
    
    /* Hide navbar when this page is active */
    :global(body.hide-navbar nav),
    :global(body.hide-navbar header) {
        display: none !important;
    }
    
    :global(body.hide-navbar) {
        overflow: hidden;
        margin: 0;
        padding: 0;
        background-color: #000;
    }
    .fullscreen-page {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 4fr;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index:100;
        padding: 2rem;
        font-family: 'Antonio', sans-serif;
        box-sizing: border-box;
        background-color: var(--lcars-black);
    }
    
    /* Add box-sizing to all elements to ensure consistent sizing */
    * {
        box-sizing: border-box;
    }
</style>