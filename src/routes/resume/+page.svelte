<script lang="ts">
    import type { PageData } from './$types';
    import MIcon from '$lib/components/MIcon.svelte';

    let { data }: { data: PageData } = $props();
    let expandedSidebar = $state(true);

</script>

<div class="flex-row">
    <div class={`sidebar scroll-container ${expandedSidebar ? 'expanded' : 'collapsed'}`}>
        <button class="sidebar-toggle" onclick={() => expandedSidebar = !expandedSidebar}>
            <MIcon name={expandedSidebar ? "left" : "right"} size="1.5rem" color="white" />
        </button>
        <div class="sidebar-content">
            <a href="#section1">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Home">
                    <MIcon name="home" size="3rem" color="white" title="Home"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Eye Candy</span>
            </a>
            <a href="#section2">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="About">
                    <MIcon name="info" size="3rem" color="white" title="About"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>About</span>
            </a>
            <a href="#section3">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Experience">
                    <MIcon name="experience" size="3rem" color="white" title="Experience"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Experience</span>
            </a>
            <a href="#section4">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Education">
                    <MIcon name="education" size="3rem" color="white" title="Education"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Education</span>
            </a>
            <a href="#section5">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Skills">
                    <MIcon name="skills" size="3rem" color="white" title="Skills"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Skills</span>
            </a>
            <a href="#section6">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Projects">
                    <MIcon name="projects" size="3rem" color="white" title="Projects"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Projects</span>
            </a>
            <a href="#section7">
                <div class={`narrow ${expandedSidebar ? 'visible' : 'narrow'}`} title="Contact">
                    <MIcon name="contact" size="3rem" color="white" title="Contact"/>
                </div>
                <span class={`sidebar-text ${expandedSidebar ? 'visible' : 'hidden'}`}>Contact</span>
            </a>

        </div>       
    </div>
    <!-- CONTENT --------------------------------------------------------------------------------->
    <div class="content scroll-container snap-container">
        <div id="section1" class="section snap-child">
            <div class="section-overlay">
                <div id="section-content-1" class="section-content">
                    <h1>Home</h1>
                </div>
            </div>
        </div>
        <div id="section2" class="section snap-child">

                <div class="section-content">
                    About
During my 30+ years in the industry I've worn many caps. I started off as a Windows desktop application developer. At least that's what I thought my role was at the time. As the years have passed I've come to realise I was in fact a lot more than just a programmer all along.


Analyst, Designer, Developer & Project Manager.
The one thing that hasnt changed through the years is my love of creating something out of nothing. I get as much satisfaction out of that as the customer does.

Birthday:
8 August 1967
Website:
www.v-sys.co.nz
Phone:
+642 7221 2880
City:
Nelson, Zealand
Age:
Old enough
Experience:
30yrs
Email:
marcus@v-sys.co.nz
Freelance:
Available
Facts
During my time as a "Developer," I actively engaged with clients to explore their ideas and gather requirements, a process vital for creating tailored solutions. Creating a customer requirements document and high level technical specifications was crucial in estimating costs and securing client approval. Initially, my architectural designs were straightforward, often centered around desktop applications with local or networked server databases.

As technology evolved, so did my approach. Today, cloud-based databases are the norm, and as always in my field, I adapted my skiils to match client preferences, offering either desktop or cloud-based solutions. My experience spans various industries, including fishing, forestry, local councils, and small to international businesses. This diverse exposure has enriched my knowledge base and improved my ability to deliver innovative solutions that align with client needs. I thrive on cultivating strong client relationships, understanding that their satisfaction is paramount to our success.

After all, none of us would be anywhere without clients, and the happier the better.

69
Happy Clients

90
Projects

29070
Project Hours

7650
Hours of Support
                </div>
        </div>
        <div id="section3" class="section snap-child">
            Skills
            In our ever-evolving field, it's acknowledged that change is the only constant. It can be a humbling experience to accept that you may no longer be the rock star developer. With new languages, frameworks, and even project management methodologies continuously emerging, adapting becomes a necessity. Transitioning into a managerial role has underscored the significance of nurturing fresh talent and steering them towards the team's overall success.
            
            Adaptability100%
            Leadership85%
            Communication90%
            Expertise80%
            Problem-solving90%
            Conflict-resolution75%
            VB.NET
            99%
            
            C#.NET
            50%
            
            ASP.NET
            95%
            
            AWS
            25%
            
            MySQL
            98%
            
            MariaDb
            95%
            
            MongoDb
            80%
            
            MS Access
            99%
            
            MS Office
            98%
            
            B4A
            85%
            
            HTML
            90%
            
            CSS
            78%
            
            JavaScript
            60%
            
            Node.js
            45%
            
            Next.js
            45%
            
            AI
            20%
            
            Future
            0%  
        </div>
        <div id="section4" class="section snap-child">
            Resume
            I am a dynamic and results-driven person who consistently exhibits a professional and approachable demeanor. I attribute my proven track record of exceeding goals and delivering exceptional results to my ability to build exceptional teams and leverage their individual strengths effectively. With a solid background in Information Technology, I excel at gathering and shaping information into innovative solutions. Driven by a passion for delivering exceptional products, I am dedicated to driving success and making a positive impact in any organisation I collaborate with.
            
            Summary
            Mark E Gardner
            Innovative and deadline-driven team leader with 30+ years of experience designing and developing user-centered information collection, management, and reporting systems from initial concept to a final, polished deliverable.
            
            Nelson, New Zealand
            (6427) 2212-880
            marcus@v-sys.co.nz
            Education
            National Diploma in Business Computing
            1991 - 1993
            Nelson Institute of Technology, Nelson, NZ
            
            I completed a three-year intensive program with two specialised streams: Hardware and Software. My focus was on Software, where my fascination with the field began. During the third year, a significant portion of the program involved sourcing a community-based opportunity to modernise an organisation's paper-based systems to computer systems. This process entailed extensive time dedicated to gathering requirements, designing a new system that added value for their customers, and ultimately building and implementing the system for daily use. Following some training on system usage, the organisation provided feedback on the entire experience to the Polytechnic.
            
            Professional Experience
            Systems and IT Developement Manager
            2010 - Present
            Accredited Technology (ATEC) Ltd, Nelson, NZ
            
            Lead in the design, development, and implementation of New software projects.
            Delegate tasks to the 3 members of the development team and provide counsel on all aspects of the project.
            Supervise the assessment of all development in order to ensure quality and accuracy against requirements
            Manage up to 4 projects at a given time while under pressure
            Oversee the efficient use of production project budgets ranging from $2,000 - $225,000
            Sole trader
            1994 - 2010
            Visionary Systems, Nelson, NZ
            
            Developed numerous small business applications for local businesses.
            Recommended and consulted with clients on the most appropriate solution for them
            Project estimation and quoting
        </div>
        <div id="section5" class="section snap-child">
                <MIcon name="skills" size="5.5rem" color="white" title="Skills"/>
        </div>
        <div id="section6" class="section snap-child">
                <MIcon name="projects" size="5.5rem" color="black" title="Projects"/>
        </div>
        <div id="section7" class="section snap-child">
                <MIcon name="contact" size="5.5rem" color="black" title="Contact"/>
        </div>
    </div>

</div>

<style>
    .hidden {
        display: none;
    }

    .flex-row {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding-inline: 0.5rem;
    }

    .sidebar {
        background-color: rgb(1, 97, 134);
        width: 200px;
        flex: none;
        overflow-y: auto;
        padding: 0.5rem;
        margin-right: 0.25rem;
        margin-top: 0.5rem;
        border-radius: 0.5rem;
        z-index: 3;
        height: calc(100vh - 1rem);
        transition: width 0.2s ease-in-out;
    }
    .sidebar.collapsed {
        width: 64px;
        min-width: 64px;
    }
    .sidebar button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 48px;
        height: 48px;
        box-shadow: none;
    }
    .sidebar a {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-block: 0.5rem;
        transition: all 0.2s ease-in-out;
    }

    .sidebar a:hover {
        background-color: rgba(255,255,255,0.1);
        transform: translateX(5px);
    }

    .content {
        background-color: rgb(236, 237, 238);
        flex: 1;
        height: calc(100vh);
        overflow-y: auto;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        padding: 0;
        margin: 0;
        margin-left: 0.25rem;

        position: relative;
        z-index: 2;
        isolation: isolate;
    }
    .section {
        position: relative;
        min-height: calc(100vh);
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0;
        margin: 0;
        /* margin-block: 0.25rem; */
        /* border-radius: 0.5rem; */
        scroll-snap-align: start;
        scroll-snap-stop: always;
        background: transparent;
        width: 100%;
        color: black;
    }
    #section1 {color: white;}
    .section-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: black;
    }
    #section-content-1 {
        color: white;
    }
    .section-content h1 {
        margin: 0;
        font-size: 2rem;
    }

    .red {
        background-color: #f00;
        color: #000;
    }
    .green {
        background-color: #0f0;
        color: #000;
    }
    .blue {
        background-color: #00f;
        color: #000;
    }
    .dark {
        background-color: #000;
        color: #fff;
    }
    :global(.wave-container) {
        display: none !important;
    }
    .section-overlay {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        height: calc(100vh);
        background-image: url('/images/leaves.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;  /* This creates the parallax effect */
 
        color: white;
        /* border-radius: 0.5rem; */
        margin: 0;
    }

    .sidebar-toggle {
        width: 48px;
        height: 48px;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 0.25rem;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .sidebar.collapsed .sidebar-content {
        display: flex;
    }

    .sidebar-text {
        transition: opacity 0.2s ease-in-out;
        opacity: .9;
    }

    .sidebar.collapsed .sidebar-text {
        opacity: 0;
        width: 0;
        overflow: hidden;
    }

    .narrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        min-width: 48px;
        flex-shrink: 0;
    }

    .sidebar.collapsed .narrow {
        width: 48px;
        height: 48px;
    }

    .sidebar a {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1rem;
        padding-left: 0;
        border-radius: 0.5rem;
        margin-block: 0.5rem;
        transition: all 0.2s ease-in-out;
    }

    .sidebar.collapsed a {
        justify-content: center;
        margin-block: 1rem;
        padding: 0.5rem;
    }

</style>
