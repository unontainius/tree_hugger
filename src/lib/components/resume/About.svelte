<div class="section-content about-section">
	<div class="info-row">
		<div class="about-container">
			<div class="about-text">
				<h1 class="about-title">{`<About Me />`}</h1>
				<div class="about-info-container clearfix">
					<p>
						During my 30+ years in the industry I've worn many caps. I started off as a Windows
						desktop application developer. Over time I've come to realise I was in fact an Analyst,
						Designer, Developer. Even so, the one thing that hasnt changed through the years is my
						love of creating something out of nothing. I get as much satisfaction out of that as the
						customer does.
					</p>
					<p>
						During my time as a "Developer," I actively engaged with clients to explore their ideas
						and gather requirements.
					</p>

					<div class="about-info-block">
						<div class="info-row">
							<div class="label">🎁</div>
							<div class="info-text">August 1967</div>
						</div>
						<div class="info-row">
							<div class="label">🌐</div>
							<a href="https://www.v-sys.co.nz" target="_blank">
								<div class="info-text">www.v-sys.co.nz</div>
							</a>
						</div>
						<div class="info-row">
							<div class="label">@</div>
							<div class="info-text">marcus@v-sys.co.nz</div>
						</div>
						<div class="info-row">
							<div class="label">📱</div>
							<a href="tel:+64272212880" target="_blank">
								<div class="info-text">+642 7221 2880</div>
							</a>
						</div>
						<div class="info-row">
							<div class="label">⛪</div>
							<div class="info-text">Nelson, Zealand</div>
						</div>
						<div class="info-row">
							<div class="label">💫</div>
							<div class="info-text">30yrs</div>
						</div>

						<div class="info-row">
							<div class="label">⚒️</div>
							<div class="info-text">Available</div>
						</div>
					</div>

					<p>
						A process vital for creating tailored solutions. Creating a customer requirements
						document and high level technical specifications was crucial in estimating costs and
						securing client approval.
					</p>

					<p>
						Initially, my architectural designs were straightforward, often centered around desktop
						applications with local or networked server databases. &nbsp;As technology evolved, so
						did my approach. Today cloud-based databases are the norm, and as always in my field, I
						adapted my skills to match client preferences, offering either desktop or cloud-based
						solutions.
					</p>

					<p>
						My experience spans various industries, including fishing, forestry, vinticulture, heavy
						transport, local councils, and small to international businesses. This diverse exposure
						has enriched my knowledge base and improved my ability to deliver innovative solutions
						that align with client needs.
					</p>

					<p>
						I thrive on cultivating strong client relationships, understanding that their
						satisfaction is paramount to my success. After all, none of us would be anywhere without
						clients, and the happier the better.
					</p>
				</div>
			</div>
		</div>

		<div class="side-content">
			<div class="profile-image-container">
				<img src="/images/marcus.jpg" alt="Marcus" class="profile-image" />
			</div>
			<div class="my-col">
				<div class="fact">
					<div class="fact-image-container">
						<img src="/icons/facts/clients.svg" alt="Happy Clients"  />
					</div>
					<div class="fact-number-container">
						<span class="fact-number">69</span>
						<span class="fact-label">Happy Clients</span>
					</div>
				</div>
				<div class="fact">
					<div class="fact-image-container">
						<img src="/icons/facts/project.svg" alt="Projects" class="fact-image" />
					</div>
					<div class="fact-number-container">
						<span class="fact-number">90</span>
						<span class="fact-label">Projects Completed</span>
					</div>
				</div>
				<div class="fact">
					<div class="fact-image-container">
						<img src="/icons/facts/hours.svg" alt="Hours"  />
					</div>
					<div class="fact-number-container">
						<span class="fact-number">29,070</span>
						<span class="fact-label">Project Hours</span>
					</div>
				</div>
				<div class="fact">
					<div class="fact-image-container">
						<img src="/icons/facts/support.svg" alt="Support"  />
					</div>
					<div class="fact-number-container">
						<span class="fact-number">7,650</span>
						<span class="fact-label">Support Hours</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.section-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 4rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
		width: 90%;
		min-height: 100vh;
		color: #fff;
	}

	.about-title {
		margin: 0 0 3rem 0;
		font-size: 3.5rem;
		font-weight: 300;
		text-align: center;
		color: #f5f5f5;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		position: relative;
	}

	.about-title::after {
		content: '';
		position: absolute;
		bottom: -1rem;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, #77defd, #f506ad);
	}

	.info-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 3rem;
		width: 100%;
		align-items: start;
	}

	.about-container {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		padding: 2rem;
		backdrop-filter: blur(10px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	}

	.about-text {
		color: #f506ad;
	}

	.about-info-container {
		max-width: 75ch;
		margin: 0 auto;
	}

	.about-info-container p {
		margin: 1.5rem 0;
		color: #77defd;
		line-height: 1.8;
		font-size: 1.1rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.about-info-block {
		background: rgba(255, 255, 255, 0.05);
		padding: 1.5rem;
		border-radius: 1rem;
		margin: 2rem 1.5rem 2rem 0;
		color: #ecebea;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.05);
		float: left;
		width: 300px;
	}

	.about-info-block .info-row {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0.8rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.about-info-block .info-row:last-child {
		border-bottom: none;
	}

	.label {
		font-size: 1.5rem;
		font-weight: 500;
		color: #77defd;
		width: 20px;
		margin-right: 0;
	}

	.info-text {
		flex: 1;
		font-size: 1.25rem;
		font-weight: 100;
		color: #a4e7fc;
	}
	.my-col {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.fact {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.fact:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	}

	.fact-image-container {
		width: 60px;
		height: 60px;
		border-radius: 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fact-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.fact-number-container {
		flex: 1;
		text-align: left;
	}

	.fact-number {
		display: block;
		font-size: 2.2rem;
		font-weight: 600;
		color: #4cc7f8;
		line-height: 1.2;
		margin-bottom: 0.3rem;
	}

	.fact-label {
		font-size: 0.9rem;
		color: #b6b6b6;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}


	.side-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.profile-image-container {
		position: relative;
		width: 100%;
		/* Calculate width based on 2 fact cards (200px each) plus gap (1.5rem = 24px) */
		max-width: calc(400px + 1.5rem);
		aspect-ratio: 1;
		margin: 0 auto;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
	}

	.profile-image-container::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(45deg, rgba(119, 222, 253, 0.1), rgba(245, 6, 173, 0.1));
		border-radius: inherit;
	}

	.profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
		transition: transform 0.3s ease;
	}

	.profile-image-container:hover .profile-image {
		transform: scale(1.05);
	}

	@media (max-width: 1200px) {
		/* Adjust for smaller screens - two fact cards at 180px each */
		.profile-image-container {
			max-width: calc(360px + 1.5rem);
		}
	}

	@media (max-width: 768px) {
		/* On mobile, match single fact card width */
		.profile-image-container {
			max-width: calc(180px + 1.5rem);
		}
		.about-container {
			padding: 1rem;
		}
	}

	
	@media (max-width: 1200px) {
		.info-row {
			grid-template-columns: 1fr;
		}

		.my-col {
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.section-content {
			padding: 2rem 0.25rem;
		}

		.about-title {
			font-size: 2.0rem;
		}

		.about-info-block {
			width: 300px;
			margin: 1.5rem 0;
			margin-inline-end: 1rem;
		}

		.fact {
			padding: 1rem;
		}

		.fact-number {
			font-size: 1.8rem;
		}
	}
</style>
