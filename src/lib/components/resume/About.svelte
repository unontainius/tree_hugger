<div id="section2" class="section snap-child">
	<div class="section-content about-section">
        <div class="info-row">
        <div class="about-container">
            <div class="about-text">
                <h1 class="about-title">{`<About Me />`}</h1>
					<div class="about-info-container clearfix">
						<p>
							During my 30+ years in the industry I've worn many caps. I started off as a Windows
							desktop application developer. Over time I've come to realise I was in fact an
							Analyst, Designer, Developer. Even so, the one thing that hasnt changed through the
							years is my love of creating something out of nothing. I get as much satisfaction out
							of that as the customer does.
						</p>
						<p>
							During my time as a "Developer," I actively engaged with clients to explore their
							ideas and gather requirements.
						</p>

						<div class="about-info-block">
							<div class="info-row">
								<div class="label">Birthday:</div>
								<div>8 August 1967</div>
							</div>
							<div class="info-row">
								<div class="label">Website:</div>
								<div>www.v-sys.co.nz</div>
							</div>
							<div class="info-row">
								<div class="label">Phone:</div>
								<div>+642 7221 2880</div>
							</div>
							<div class="info-row">
								<div class="label">City:</div>
								<div>Nelson, Zealand</div>
							</div>
							<div class="info-row">
								<div class="label">Age:</div>
								<div>Old enough</div>
							</div>
							<div class="info-row">
								<div class="label">Experience:</div>
								<div>30yrs</div>
							</div>
							<div class="info-row">
								<div class="label">Email:</div>
								<div>marcus@v-sys.co.nz</div>
							</div>
							<div class="info-row">
								<div class="label">Freelance:</div>
								<div>Available</div>
							</div>
						</div>

						<p>
							A process vital for creating tailored solutions. Creating a customer requirements
							document and high level technical specifications was crucial in estimating costs and
							securing client approval.
						</p>

						<p>
							Initially, my architectural designs were straightforward, often centered around
							desktop applications with local or networked server databases. &nbsp;As technology
							evolved, so did my approach. Today cloud-based databases are the norm, and as always
							in my field, I adapted my skills to match client preferences, offering either desktop
							or cloud-based solutions.
						</p>

						<p>
							My experience spans various industries, including fishing, forestry, vinticulture,
							heavy transport, local councils, and small to international businesses. This diverse
							exposure has enriched my knowledge base and improved my ability to deliver innovative
							solutions that align with client needs.
						</p>

						<p>
							I thrive on cultivating strong client relationships, understanding that their
							satisfaction is paramount to my success. After all, none of us would be anywhere
							without clients, and the happier the better.
						</p>
					</div>
				</div>
			</div>


				<div class="my-col">
					<div class="fact">
						<div class="fact-image-container">
							<img src="/icons/facts/clients.svg" alt="Happy Clients" class="fact-image" />
						</div>
						<div class="fact-number-container">
							<span class="fact-number">69</span>
							<span class="fact-label">Happy Clients</span>
						</div>
					</div>
					<div class="fact">
						<div class="fact-image-container">
							<img src="/icons/facts/projects.svg" alt="Projects" class="fact-image" />
						</div>
						<div class="fact-number-container">
							<span class="fact-number">90</span>
							<span class="fact-label">Projects</span>
						</div>
					</div>
					<div class="fact">
						<div class="fact-image-container">
							<img src="/icons/facts/hours.svg" alt="Hours" class="fact-image" />
						</div>
						<div class="fact-number-container">
							<span class="fact-number">29070</span>
							<span class="fact-label">Project Hours</span>
						</div>
					</div>
					<div class="fact">
						<div class="fact-image-container">
							<img src="/icons/facts/support.svg" alt="Support" class="fact-image" />
						</div>
						<div class="fact-number-container">
							<span class="fact-number">7650</span>
							<span class="fact-label">Support Hours</span>
						</div>
					</div>
				</div>

		</div>
	</div>
</div>

<style>
	.section {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh);
		width: 100%;
        background-color: #3f3f3f;
	}

	.section-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: black;
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		height: 100%;
	}

	.section-content h1 {
		margin: 0;
		font-size: 5rem;
		text-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 1);
	}
	.fact {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		min-width: 150px;
        width: 200px;
	}
	.fact-image-container {
		width: 100px;
		max-height: 100px;
	}
	.fact-image {
		object-fit: cover;
	}
	.fact-number-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.fact-number {
		font-size: 2rem;
		font-weight: bold;
		color: #013d55;
	}

	.fact-label {
		font-size: 0.9rem;
		color: #b6b6b6;
	}

	.about-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		height: 100%;
		overflow-y: auto;
        color: #fff;
	}

	.about-text {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		color: rgb(245, 6, 173);
	}

	.about-text p:hover {
		background: none;
	}

	.about-info-container {
		max-width: 80ch; /* Set a width for the container */
        min-width: 300px;
		margin: 0 auto; /* Center the container */
	}
	.clearfix::after {
		content: '';
		display: table;
		clear: both;
	}
	.about-info-container p {
		margin-block: 0.7rem;
        color: #77defd;
	}
	.about-info-block {
		float: left; /* Float the text block to the left */
		width: 270px; /* Width of the text block */
		background-color: #333333; /* Background color for visibility */
		padding: 1rem; /* Padding around the text */
		border-radius: 0.5rem;
		margin: 0 1.5rem 0.5rem 0; /* Space between text block and main text */
		color: rgba(236, 235, 234, 0.747);
        box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.5);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
        flex-wrap: wrap;
        gap: 2rem;
	}
    .my-col {
        display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
